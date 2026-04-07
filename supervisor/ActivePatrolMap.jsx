import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ActivePatrolMap() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mapContainer}>
        {/* Placeholder for real MapView */}
        <Image 
          source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=14&size=800x800&maptype=roadmap&markers=color:blue%7Clabel:S%7C28.6139,77.2090&markers=color:red%7Clabel:G%7C28.6100,77.2100&key=PLACEHOLDER' }}
          style={styles.mapMap}
        />
        
        <View style={styles.mapOverlayHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayCircleBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#0f1623" />
          </TouchableOpacity>
          <View style={styles.statusPill}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Live Tracking Active</Text>
          </View>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.cardHandle} />
          <Text style={styles.cardTitle}>Active Personnel (2)</Text>
          
          <View style={styles.personRow}>
            <View style={styles.personIcon}>
              <MaterialIcons name="person" size={20} color="#002e85" />
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>Suresh K.</Text>
              <Text style={styles.personLocation}>North Gate • Moving</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialIcons name="call" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.personRow}>
            <View style={styles.personIcon}>
              <MaterialIcons name="person" size={20} color="#002e85" />
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>Ramesh V.</Text>
              <Text style={styles.personLocation}>Sector 4 Block A • Stationary</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialIcons name="call" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.sosButton}
            onPress={() => navigation.navigate('EmergencySOSActive')}
          >
            <MaterialIcons name="emergency" size={20} color="#ffffff" />
            <Text style={styles.sosText}>TRIGGER SOS ALARM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f1623' },
  mapContainer: { flex: 1, position: 'relative' },
  mapMap: { width: '100%', height: '100%', opacity: 0.8 },
  mapOverlayHeader: {
    position: 'absolute', top: 16, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  overlayCircleBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center', elevation: 4
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 24, elevation: 4
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#0f1623' },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, elevation: 10
  },
  cardHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', alignSelf: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623', marginBottom: 16 },
  personRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6f8',
    padding: 12, borderRadius: 12, marginBottom: 12
  },
  personIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e7ff',
    alignItems: 'center', justifyContent: 'center', marginRight: 12
  },
  personInfo: { flex: 1 },
  personName: { fontSize: 14, fontWeight: 'bold', color: '#0f1623' },
  personLocation: { fontSize: 12, color: '#444652', marginTop: 2 },
  actionBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#002e85',
    alignItems: 'center', justifyContent: 'center'
  },
  sosButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#ba1a1a', paddingVertical: 16, borderRadius: 12, marginTop: 8
  },
  sosText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 }
});
