import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EmergencySOSActive() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.pulseContainer}>
          <View style={styles.pulseRing1} />
          <View style={styles.pulseRing2} />
          <View style={styles.alertIconWrapper}>
            <MaterialIcons name="emergency" size={64} color="#ba1a1a" />
          </View>
        </View>

        <Text style={styles.title}>EMERGENCY ALERT</Text>
        <Text style={styles.subtitle}>SOS Triggered by Guard: Suresh K.</Text>

        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={24} color="#ba1a1a" />
            <Text style={styles.locationText}>North Gate Entrance</Text>
          </View>
          <View style={styles.mapSnippet}>
            {/* Mock map outline or image */}
            <View style={styles.mapOverlay} />
            <MaterialIcons name="my-location" size={24} color="#002e85" />
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtnWhite}>
            <MaterialIcons name="call" size={24} color="#002e85" />
            <Text style={styles.actionBtnTextBlue}>Call Guard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnWhite}>
            <MaterialIcons name="local-police" size={24} color="#002e85" />
            <Text style={styles.actionBtnTextBlue}>Dispatch Team</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.resolveBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.resolveBtnText}>MARK AS RESOLVED</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#93000a' },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 40 },
  backBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  pulseContainer: {
    width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 32
  },
  pulseRing1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.2)'
  },
  pulseRing2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.4)'
  },
  alertIconWrapper: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center'
  },
  title: { fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: 2, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#ffdad6', fontWeight: '500', marginBottom: 40, textAlign: 'center' },
  locationCard: {
    width: '100%', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 4
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  locationText: { fontSize: 18, fontWeight: 'bold', color: '#0f1623' },
  mapSnippet: {
    height: 120, backgroundColor: '#e2e8f0', borderRadius: 12, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center'
  },
  mapOverlay: { position: 'absolute', top:0, left:0, bottom:0, right:0, backgroundColor: 'rgba(0,0,0,0.05)' },
  actionGrid: { flexDirection: 'row', gap: 16, width: '100%', marginBottom: 32 },
  actionBtnWhite: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 2
  },
  actionBtnTextBlue: { color: '#002e85', fontSize: 14, fontWeight: 'bold' },
  resolveBtn: {
    width: '100%', paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: '#ffdad6',
    alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 20
  },
  resolveBtnText: { color: '#ffdad6', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});
