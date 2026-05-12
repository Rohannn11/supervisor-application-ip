import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GPSStatusBar from '../src/components/GPSStatusBar';
import { Colors } from '../src/theme/colors';

export default function ActivePatrolMap() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [initialLoc, setInitialLoc] = useState(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);

  const CHECKPOINTS = [
    // We will dynamically adjust checkpoints based on siteCenter later, 
    // but for UI mock purposes we'll render some mock checkpoints relative to the center.
  ];

  // Ray-casting algorithm to check if point is inside polygon
  const isPointInPolygon = (point, vs) => {
    if (!vs || vs.length < 3) return true; // Not enough points to form a geofence
    let x = point.longitude, y = point.latitude;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].longitude, yi = vs[i].latitude;
      let xj = vs[j].longitude, yj = vs[j].latitude;
      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Mock checkpoints (we use initialLoc just to render some mocks nearby)
  const getMockCheckpoints = (center) => {
    if (!center) return [];
    return [
      { id: 1, title: 'Main Gate', coordinate: { latitude: center.latitude + 0.0005, longitude: center.longitude + 0.0005 }, done: true },
      { id: 2, title: 'Parking B', coordinate: { latitude: center.latitude - 0.0004, longitude: center.longitude - 0.0003 }, done: true },
      { id: 3, title: 'Generator Room', coordinate: { latitude: center.latitude - 0.0006, longitude: center.longitude + 0.0002 }, done: false, target: true },
    ];
  };

  useEffect(() => {
    let sub;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to use patrol mapping.');
        return;
      }

      let currentLoc = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
      };
      
      // Set initial location map center once
      setInitialLoc(userCoords);
      setLocation(userCoords);
      setIsInsideGeofence(true);

      sub = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 1,
      }, (newLoc) => {
         const newCoords = {
           latitude: newLoc.coords.latitude,
           longitude: newLoc.coords.longitude
         };
         setLocation(newCoords);

         // If geofence is locked, verify if user is inside polygon
         if (isLocked && polygonPoints.length >= 3) {
           const inside = isPointInPolygon(newCoords, polygonPoints);
           setIsInsideGeofence(inside);
           if (!inside) {
             Alert.alert("Geofence Warning", "You are OUTSIDE the designated patrol boundary.");
           }
         }
      });
    })();
    return () => { if(sub) sub.remove(); };
  }, [isLocked, polygonPoints]);

  const checkpointsToRender = getMockCheckpoints(initialLoc);

  const handleMapPress = (e) => {
    if (!isLocked) {
      setPolygonPoints([...polygonPoints, e.nativeEvent.coordinate]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GPSStatusBar />

      <View style={styles.mapContainer}>
        {initialLoc && (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: initialLoc.latitude,
              longitude: initialLoc.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
            showsUserLocation={false}
            onPress={handleMapPress}
          >
            {/* Geofence Polygon */}
            {polygonPoints.length > 0 && (
              <Polygon
                coordinates={polygonPoints}
                fillColor="rgba(0, 150, 255, 0.2)"
                strokeColor={Colors.primary}
                strokeWidth={2}
              />
            )}
            
            {/* Polygon Boundary Markers */}
            {!isLocked && polygonPoints.map((pt, i) => (
              <Marker key={`pt-${i}`} coordinate={pt}>
                <View style={styles.polygonDot} />
              </Marker>
            ))}

            {/* Simulated Live User Location */}
            {location && (
              <Marker coordinate={location}>
                <View style={styles.currentLocation}>
                  <View style={styles.locationPulse} />
                  <View style={styles.locationDot} />
                </View>
              </Marker>
            )}

            {/* Checkpoints */}
            {checkpointsToRender.map((cp) => (
              <Marker key={cp.id} coordinate={cp.coordinate}>
                <View style={styles.checkpoint}>
                  {cp.done ? (
                    <View style={styles.checkpointDone}>
                      <MaterialIcons name="check" size={16} color={Colors.textWhite} />
                    </View>
                  ) : cp.target ? (
                    <View style={styles.checkpointTarget}>
                      <MaterialIcons name="location-on" size={24} color={Colors.textWhite} />
                    </View>
                  ) : (
                    <View style={[styles.checkpointDone, { backgroundColor: Colors.borderMuted }]}>
                      <MaterialIcons name="location-on" size={16} color={Colors.textWhite} />
                    </View>
                  )}
                  <Text style={[styles.checkpointLabel, cp.target && { color: Colors.danger }]}>{cp.title}</Text>
                  {cp.target && (
                    <View style={styles.targetBadge}>
                      <Text style={styles.targetBadgeText}>Target</Text>
                    </View>
                  )}
                </View>
              </Marker>
            ))}
          </MapView>
        )}

        {/* Header Overlay */}
        <View style={styles.mapOverlayHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayCircleBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Patrol Monitor</Text>

          <TouchableOpacity
            style={styles.sosHeaderBtn}
            onPress={() => navigation.navigate('EmergencySOSActive')}
          >
            <MaterialIcons name="emergency" size={16} color={Colors.textWhite} />
            <Text style={styles.sosHeaderText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {!isLocked && (
          <View style={styles.lockContainer}>
            <Text style={styles.lockHint}>Tap map to draw boundary polygon</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity 
                style={[styles.lockBtn, {backgroundColor: Colors.danger}]} 
                onPress={() => setPolygonPoints([])}
              >
                <MaterialIcons name="undo" size={20} color={Colors.textWhite} />
                <Text style={styles.lockBtnText}>CLEAR</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.lockBtn} 
                onPress={() => {
                  if (polygonPoints.length < 3) {
                    Alert.alert("Invalid", "Please tap at least 3 points to form a boundary.");
                    return;
                  }
                  Alert.alert("Locked", "Patrol boundary locked for this session.");
                  setIsLocked(true);
                }}
              >
                <MaterialIcons name="lock" size={20} color={Colors.textWhite} />
                <Text style={styles.lockBtnText}>LOCK BOUNDARY</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlBtn}>
            <MaterialIcons name="layers" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <MaterialIcons name="my-location" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Open Checklist Card */}
        <View style={styles.checklistPrompt}>
          <View style={styles.checklistPromptIcon}>
            <MaterialIcons name="checklist" size={28} color={Colors.primary} />
          </View>
          <TouchableOpacity
            style={styles.checklistPromptContent}
            onPress={() => navigation.navigate('CheckpointScanScreen')}
          >
            <Text style={styles.checklistPromptTitle}>Open Checklist</Text>
            <Text style={styles.checklistPromptSub}>3 tasks pending nearby</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.cardHandle} />
          <View style={styles.targetInfoRow}>
            <View style={styles.targetImgPlaceholder}>
              <MaterialIcons name="warehouse" size={28} color={Colors.textSecondary} />
            </View>
            <View style={styles.targetInfoText}>
              <Text style={styles.targetName}>Generator Room <Text style={styles.targetDot}>●</Text></Text>
              <View style={styles.targetMeta}>
                <View style={styles.metaPill}>
                  <MaterialIcons name="navigation" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>45m</Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: Colors.dangerLight }]}>
                  <Text style={[styles.metaText, { color: Colors.danger }]}>Priority High</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={() => navigation.navigate('CheckpointScanScreen')}
            >
              <MaterialIcons name="send" size={22} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.textPrimary },
  mapContainer: { flex: 1, position: 'relative' },
  mapBg: { flex: 1, backgroundColor: 'transparent' },
  checkpoint: { position: 'absolute', alignItems: 'center' },
  checkpointDone: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  checkpointTarget: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.danger,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
    borderWidth: 3, borderColor: Colors.textWhite,
  },
  checkpointLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textPrimary, marginTop: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  targetBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
    marginTop: 2,
  },
  targetBadgeText: { color: Colors.textWhite, fontSize: 9, fontWeight: '800' },
  currentLocation: { position: 'absolute', alignItems: 'center' },
  locationPulse: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0, 46, 133, 0.15)',
  },
  locationDot: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.primary,
    borderWidth: 3, borderColor: Colors.textWhite, elevation: 4,
  },
  polygonDot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary,
    borderWidth: 2, borderColor: Colors.textWhite,
  },
  mapOverlayHeader: {
    position: 'absolute', top: 12, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  overlayCircleBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  headerTitle: {
    fontSize: 18, fontWeight: '800', color: Colors.textPrimary,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    elevation: 4, overflow: 'hidden',
  },
  sosHeaderBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.danger, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, elevation: 4,
  },
  sosHeaderText: { color: Colors.textWhite, fontSize: 13, fontWeight: '900' },
  mapControls: {
    position: 'absolute', right: 16, top: 80, gap: 8,
  },
  controlBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  checklistPrompt: {
    position: 'absolute', bottom: 160, left: '15%', right: '15%',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10,
  },
  checklistPromptIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  checklistPromptContent: { flex: 1 },
  checklistPromptTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  checklistPromptSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  lockContainer: {
    position: 'absolute', top: 80, left: 0, right: 0, alignItems: 'center',
  },
  lockHint: {
    backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8,
  },
  lockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, elevation: 4,
  },
  lockBtnText: { color: Colors.textWhite, fontWeight: 'bold' },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, elevation: 10,
  },
  cardHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.borderMuted, alignSelf: 'center', marginBottom: 16 },
  targetInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  targetImgPlaceholder: {
    width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  targetInfoText: { flex: 1 },
  targetName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  targetDot: { color: Colors.danger, fontSize: 10 },
  targetMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  metaText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  navigateBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
});
