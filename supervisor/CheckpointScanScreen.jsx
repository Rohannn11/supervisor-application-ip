import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GPSStatusBar from '../src/components/GPSStatusBar';
import { Colors } from '../src/theme/colors';

export default function CheckpointScanScreen() {
  const navigation = useNavigation();
  const [lastScanned, setLastScanned] = useState(null);
  const [scanMode, setScanMode] = useState(null); // 'nfc' | 'qr' | 'gps'

  const handleScan = (mode) => {
    setScanMode(mode);
    // Mock scanning — simulate a checkpoint tag
    setTimeout(() => {
      setLastScanned({
        id: 'CP-' + Math.floor(Math.random() * 9000 + 1000),
        name: mode === 'nfc' ? 'Main Gate NFC Tag' : mode === 'qr' ? 'Parking B QR Code' : 'Generator Room GPS',
        time: new Date().toLocaleTimeString(),
        method: mode.toUpperCase(),
      });
      setScanMode(null);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GPSStatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkpoint Tagging</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.container}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialIcons name="info" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>Tag checkpoints using NFC, QR Code, or GPS to verify your location at each patrol point.</Text>
        </View>

        {/* Scan Buttons */}
        <Text style={styles.sectionTitle}>Choose Scan Method</Text>

        <View style={styles.scanGrid}>
          <TouchableOpacity
            style={[styles.scanCard, scanMode === 'nfc' && styles.scanCardActive]}
            onPress={() => handleScan('nfc')}
            disabled={!!scanMode}
          >
            <View style={[styles.scanIconWrapper, { backgroundColor: '#dbeafe' }]}>
              <MaterialIcons name="nfc" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.scanTitle}>Scan NFC</Text>
            <Text style={styles.scanDesc}>Hold phone near tag</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.scanCard, scanMode === 'qr' && styles.scanCardActive]}
            onPress={() => handleScan('qr')}
            disabled={!!scanMode}
          >
            <View style={[styles.scanIconWrapper, { backgroundColor: '#fef3c7' }]}>
              <MaterialIcons name="qr-code-scanner" size={36} color="#92400e" />
            </View>
            <Text style={styles.scanTitle}>Scan QR</Text>
            <Text style={styles.scanDesc}>Point camera at code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.gpsCard, scanMode === 'gps' && styles.scanCardActive]}
          onPress={() => handleScan('gps')}
          disabled={!!scanMode}
        >
          <View style={[styles.scanIconWrapper, { backgroundColor: '#dcfce7' }]}>
            <MaterialIcons name="my-location" size={36} color={Colors.success} />
          </View>
          <View style={styles.gpsTextGroup}>
            <Text style={styles.scanTitle}>GPS Auto-Tag</Text>
            <Text style={styles.scanDesc}>Automatically tag based on your GPS location</Text>
          </View>
        </TouchableOpacity>

        {/* Scanning Indicator */}
        {scanMode && (
          <View style={styles.scanningIndicator}>
            <MaterialIcons name="sensors" size={28} color={Colors.primary} />
            <Text style={styles.scanningText}>Scanning {scanMode.toUpperCase()}...</Text>
          </View>
        )}

        {/* Last Scanned */}
        {lastScanned && (
          <View style={styles.lastScanned}>
            <View style={styles.lastScannedHeader}>
              <MaterialIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.lastScannedTitle}>Last Scanned Checkpoint</Text>
            </View>
            <View style={styles.lastScannedBody}>
              <View style={styles.lastRow}>
                <Text style={styles.lastLabel}>Checkpoint</Text>
                <Text style={styles.lastValue}>{lastScanned.name}</Text>
              </View>
              <View style={styles.lastRow}>
                <Text style={styles.lastLabel}>ID</Text>
                <Text style={styles.lastValue}>{lastScanned.id}</Text>
              </View>
              <View style={styles.lastRow}>
                <Text style={styles.lastLabel}>Method</Text>
                <Text style={styles.lastValue}>{lastScanned.method}</Text>
              </View>
              <View style={styles.lastRow}>
                <Text style={styles.lastLabel}>Time</Text>
                <Text style={styles.lastValue}>{lastScanned.time}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  backBtn: { padding: 4 },
  container: { flex: 1, padding: 16 },
  infoBanner: {
    flexDirection: 'row', gap: 10, backgroundColor: Colors.primaryLight, borderRadius: 12,
    padding: 14, marginBottom: 24, alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.primary, fontWeight: '500', lineHeight: 19 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  scanGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  scanCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', elevation: 2, borderWidth: 2, borderColor: 'transparent',
  },
  scanCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  scanIconWrapper: {
    width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  scanTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  scanDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },
  gpsCard: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', elevation: 2, marginBottom: 24, gap: 16,
    borderWidth: 2, borderColor: 'transparent',
  },
  gpsTextGroup: { flex: 1 },
  scanningIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 16, marginBottom: 16,
  },
  scanningText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  lastScanned: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    elevation: 2, borderLeftWidth: 4, borderLeftColor: Colors.success,
  },
  lastScannedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  lastScannedTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  lastScannedBody: { gap: 8 },
  lastRow: { flexDirection: 'row', justifyContent: 'space-between' },
  lastLabel: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  lastValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
});
