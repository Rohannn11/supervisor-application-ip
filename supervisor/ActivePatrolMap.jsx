import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePatrol } from '../src/context/PatrolContext';
import GPSStatusBar from '../src/components/GPSStatusBar';
import { Colors } from '../src/theme/colors';

// Ray-casting to test if a point is inside a polygon
function pointInPolygon(point, polygon) {
  if (!polygon || polygon.length < 3) return true;
  let inside = false;
  const { latitude: y, longitude: x } = point;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const { latitude: yi, longitude: xi } = polygon[i];
    const { latitude: yj, longitude: xj } = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// 'draw' = tap to build boundary polygon
// 'spot' = tap inside boundary to add patrol spots
const MODES = { DRAW: 'draw', SPOT: 'spot' };

export default function ActivePatrolMap() {
  const navigation = useNavigation();
  const { geofencePolygon, setGeofencePolygon, patrolSpots, addSpot, isSessionLocked, lockSession } = usePatrol();

  const [location, setLocation] = useState(null);
  const [initialLoc, setInitialLoc] = useState(null);
  const [mode, setMode] = useState(MODES.DRAW);

  useEffect(() => {
    let sub;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to use patrol mapping.');
        return;
      }
      const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = { latitude: cur.coords.latitude, longitude: cur.coords.longitude };
      setInitialLoc(coords);
      setLocation(coords);

      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 2 },
        (loc) => {
          const c = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setLocation(c);
          if (isSessionLocked && geofencePolygon.length >= 3) {
            if (!pointInPolygon(c, geofencePolygon)) {
              Alert.alert('Geofence Warning', 'You are OUTSIDE the designated patrol boundary!');
            }
          }
        }
      );
    })();
    return () => { if (sub) sub.remove(); };
  }, []);

  const handleMapPress = (e) => {
    if (isSessionLocked) return;
    const coord = e.nativeEvent.coordinate;

    if (mode === MODES.DRAW) {
      setGeofencePolygon([...geofencePolygon, coord]);
    } else {
      // SPOT mode: only allow if inside the drawn polygon
      if (geofencePolygon.length >= 3 && !pointInPolygon(coord, geofencePolygon)) {
        Alert.alert('Outside Boundary', 'Patrol spots must be placed inside the geofence boundary.');
        return;
      }
      addSpot(coord);
    }
  };

  const handleLock = () => {
    if (geofencePolygon.length < 3) {
      Alert.alert('Incomplete', 'Please tap at least 3 points to define the patrol boundary first.');
      return;
    }
    Alert.alert(
      'Lock Session',
      `Lock this patrol session with ${geofencePolygon.length} boundary points and ${patrolSpots.length} patrol spots?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Lock', style: 'destructive', onPress: () => lockSession() },
      ]
    );
  };

  const modeLabel = mode === MODES.DRAW ? 'DRAW BOUNDARY' : 'PLACE SPOTS';
  const modeIcon = mode === MODES.DRAW ? 'edit' : 'add-location';

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
              latitudeDelta: 0.004,
              longitudeDelta: 0.004,
            }}
            onPress={handleMapPress}
          >
            {/* Boundary polygon */}
            {geofencePolygon.length > 0 && (
              <Polygon
                coordinates={geofencePolygon}
                fillColor="rgba(0,100,255,0.12)"
                strokeColor={Colors.primary}
                strokeWidth={2}
              />
            )}

            {/* Boundary vertex markers (draw mode, unlocked) */}
            {!isSessionLocked && mode === MODES.DRAW && geofencePolygon.map((pt, i) => (
              <Marker key={`boundary-${i}`} coordinate={pt} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.boundaryDot} />
              </Marker>
            ))}

            {/* Patrol spots */}
            {patrolSpots.map((spot, i) => (
              <Marker
                key={`spot-${spot.id}`}
                coordinate={spot.coordinate}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={[styles.spotMarker, spot.checklistDone && styles.spotMarkerDone]}>
                  <Text style={styles.spotMarkerText}>{i + 1}</Text>
                </View>
              </Marker>
            ))}

            {/* Live user location */}
            {location && (
              <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.userDotOuter}>
                  <View style={styles.userDot} />
                </View>
              </Marker>
            )}
          </MapView>
        )}

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patrol Monitor</Text>
          <TouchableOpacity
            style={styles.sosBtn}
            onPress={() => navigation.navigate('EmergencySOSActive')}
          >
            <MaterialIcons name="emergency" size={14} color={Colors.textWhite} />
            <Text style={styles.sosBtnText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Mode toggle + controls — hidden when locked */}
        {!isSessionLocked ? (
          <View style={styles.controlPanel}>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeBtn, mode === MODES.DRAW && styles.modeBtnActive]}
                onPress={() => setMode(MODES.DRAW)}
              >
                <MaterialIcons name="edit" size={16} color={mode === MODES.DRAW ? Colors.textWhite : Colors.textSecondary} />
                <Text style={[styles.modeBtnText, mode === MODES.DRAW && styles.modeBtnTextActive]}>Boundary</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, mode === MODES.SPOT && styles.modeBtnActive]}
                onPress={() => setMode(MODES.SPOT)}
              >
                <MaterialIcons name="add-location" size={16} color={mode === MODES.SPOT ? Colors.textWhite : Colors.textSecondary} />
                <Text style={[styles.modeBtnText, mode === MODES.SPOT && styles.modeBtnTextActive]}>Spots</Text>
              </TouchableOpacity>
            </View>

            {/* Hint */}
            <Text style={styles.hint}>
              {mode === MODES.DRAW
                ? `Tap to add boundary points (${geofencePolygon.length} placed)`
                : `Tap inside boundary to add spots (${patrolSpots.length} placed)`}
            </Text>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  if (mode === MODES.DRAW) setGeofencePolygon([]);
                  else Alert.alert('Note', 'Clear boundary (Draw mode) to reset spots.');
                }}
              >
                <MaterialIcons name="undo" size={16} color={Colors.danger} />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.lockBtn} onPress={handleLock}>
                <MaterialIcons name="lock" size={16} color={Colors.textWhite} />
                <Text style={styles.lockBtnText}>Lock Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.lockedBanner}>
            <MaterialIcons name="lock" size={16} color={Colors.success} />
            <Text style={styles.lockedText}>
              Session locked · {patrolSpots.length} spots · {geofencePolygon.length} boundary pts
            </Text>
          </View>
        )}

        {/* Bottom info card */}
        <View style={styles.bottomCard}>
          <View style={styles.cardHandle} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="place" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{patrolSpots.length}</Text>
              <Text style={styles.statLabel}>Spots</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.statValue}>{patrolSpots.filter(s => s.checklistDone).length}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.checklistCTA}
              onPress={() => navigation.navigate('ChecklistTab')}
            >
              <MaterialIcons name="checklist" size={20} color={Colors.textWhite} />
              <Text style={styles.checklistCTAText}>Open Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a2e' },
  mapContainer: { flex: 1, position: 'relative' },
  header: {
    position: 'absolute', top: 12, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  circleBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  headerTitle: {
    fontSize: 17, fontWeight: '800', color: Colors.textPrimary,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, elevation: 4, overflow: 'hidden',
  },
  sosBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.danger, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, elevation: 4,
  },
  sosBtnText: { color: Colors.textWhite, fontSize: 13, fontWeight: '900' },
  controlPanel: {
    position: 'absolute', top: 72, left: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 16, padding: 12, elevation: 6,
  },
  modeToggle: {
    flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 10,
    padding: 3, marginBottom: 8,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8, borderRadius: 8,
  },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  modeBtnTextActive: { color: Colors.textWhite },
  hint: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  actionRow: { flexDirection: 'row', gap: 8 },
  clearBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.danger, borderRadius: 10, paddingVertical: 8,
  },
  clearBtnText: { fontSize: 13, fontWeight: '700', color: Colors.danger },
  lockBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 8,
  },
  lockBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textWhite },
  lockedBanner: {
    position: 'absolute', top: 72, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: Colors.success, elevation: 4,
  },
  lockedText: { fontSize: 13, fontWeight: '600', color: Colors.success },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, elevation: 10,
  },
  cardHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.borderMuted, alignSelf: 'center', marginBottom: 14,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.borderLight },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  checklistCTA: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, marginLeft: 12,
  },
  checklistCTAText: { color: Colors.textWhite, fontSize: 14, fontWeight: '700' },
  boundaryDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.textWhite,
  },
  spotMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.warning || '#f97316',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.textWhite, elevation: 4,
  },
  spotMarkerDone: { backgroundColor: Colors.success },
  spotMarkerText: { color: Colors.textWhite, fontWeight: '900', fontSize: 14 },
  userDotOuter: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,100,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  userDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.textWhite,
  },
});
