import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, CameraView } from 'expo-camera';
import { Colors } from '../src/theme/colors';

export default function SpotQRScanScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { spotId, spotName, spotIndex } = route.params || {};

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Pulse animation for scan frame
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleScan = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setScanning(false);
    // Notify higher authorities (log locally for POC)
    console.log(`[QR SCAN] Spot: ${spotName} | QR Data: ${data}`);
    Alert.alert(
      '✅ Patrol Started',
      `QR verified for "${spotName}".\nPatrol notification sent to command center.`,
      [
        {
          text: 'Begin Checklist',
          onPress: () => navigation.navigate('PatrolChecklist', { spotId, spotName, spotIndex }),
        },
      ],
      { cancelable: false }
    );
  };

  // Demo mode – simulate a scan without needing a real QR
  const handleDemoScan = () => {
    setScanning(true);
    setTimeout(() => {
      handleScan({ type: 'DEMO', data: `SPOT-${spotId}-DEMO` });
    }, 800);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />
        <Text style={styles.permText}>Requesting camera permission…</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <MaterialIcons name="camera-off" size={64} color={Colors.textMuted} />
          <Text style={styles.permText}>Camera access denied.</Text>
          <Text style={styles.permSub}>Please allow camera access in Settings to scan QR codes.</Text>
          <TouchableOpacity style={styles.demoBtn} onPress={handleDemoScan}>
            <MaterialIcons name="play-circle-filled" size={20} color={Colors.textWhite} />
            <Text style={styles.demoBtnText}>Use Demo Mode</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#000' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Scan to Start Patrol</Text>
          <Text style={styles.headerSub}>{spotName}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Camera / QR Scanner */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />

        {/* Overlay with scan window */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <Animated.View style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              {scanning && (
                <ActivityIndicator size="large" color={Colors.textWhite} style={styles.scanSpinner} />
              )}
            </Animated.View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.scanInstructions}>
              Point the camera at the spot's QR code to begin patrol
            </Text>
          </View>
        </View>
      </View>

      {/* Demo bypass */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={handleDemoScan}
          disabled={scanning || scanned}
        >
          {scanning ? (
            <ActivityIndicator color={Colors.textWhite} size="small" />
          ) : (
            <>
              <MaterialIcons name="qr-code-scanner" size={20} color={Colors.textWhite} />
              <Text style={styles.demoBtnText}>Scan Demo QR (POC Mode)</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          This scan notifies the command center that patrol has begun.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const FRAME_SIZE = 240;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56, backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textWhite, textAlign: 'center' },
  headerSub: { fontSize: 12, color: Colors.primaryAccent, textAlign: 'center', marginTop: 2 },
  scannerContainer: { flex: 1, position: 'relative' },
  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: 'column' },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  overlayMiddle: { flexDirection: 'row', height: FRAME_SIZE },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  scanFrame: {
    width: FRAME_SIZE, height: FRAME_SIZE, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  corner: {
    position: 'absolute', width: 28, height: 28,
    borderColor: Colors.textWhite, borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 8 },
  scanSpinner: { position: 'absolute' },
  overlayBottom: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', paddingTop: 20,
  },
  scanInstructions: {
    color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center',
    paddingHorizontal: 32, lineHeight: 22,
  },
  footer: {
    backgroundColor: '#111', padding: 20, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  demoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 14, width: '100%', justifyContent: 'center',
    elevation: 4,
  },
  demoBtnText: { color: Colors.textWhite, fontSize: 15, fontWeight: '700' },
  footerNote: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  permText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, textAlign: 'center' },
  permSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});
