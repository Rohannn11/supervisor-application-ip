import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../src/theme/colors';

const EMERGENCY_TYPES = [
  { id: 'medical', icon: 'medical-services', label: 'Medical' },
  { id: 'fire', icon: 'local-fire-department', label: 'Fire' },
  { id: 'theft', icon: 'security', label: 'Theft' },
  { id: 'assault', icon: 'warning', label: 'Assault' },
];

export default function EmergencySOSActive() {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [cancelling, setCancelling] = useState(false);
  const pulseAnim1 = useRef(new Animated.Value(0.6)).current;
  const pulseAnim2 = useRef(new Animated.Value(0.8)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    // Pulse animation
    const pulse1 = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim1, { toValue: 0.6, duration: 1200, useNativeDriver: true }),
      ])
    );
    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim2, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse1.start();
    pulse2.start();

    // Countdown timer
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      pulse1.stop();
      pulse2.stop();
      clearInterval(timerRef.current);
    };
  }, []);

  const handleCancelSOS = () => {
    setCancelling(true);
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Transmitting Signal Banner */}
        <View style={styles.transmitBanner}>
          <Text style={styles.transmitText}>TRANSMITTING SIGNAL</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>SOS ACTIVATED</Text>
        <Text style={styles.subtitle}>Help is coming</Text>

        {/* GPS Coordinates */}
        <View style={styles.coordsRow}>
          <MaterialIcons name="my-location" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.coordsText}>Lat: 40.7128° N, Lon: 74.0060° W</Text>
        </View>
        <Text style={styles.coordsSub}>Precision: 3.4m • Altitude: 12ft</Text>

        {/* Pulsing Circle */}
        <View style={styles.pulseContainer}>
          <Animated.View style={[styles.pulseRing1, { opacity: pulseAnim1, transform: [{ scale: pulseAnim1 }] }]} />
          <Animated.View style={[styles.pulseRing2, { opacity: pulseAnim2, transform: [{ scale: pulseAnim2 }] }]} />
          <View style={styles.alertIconWrapper}>
            <View style={styles.diamondIcon}>
              <MaterialIcons name="error" size={36} color={Colors.danger} />
            </View>
          </View>
        </View>

        {/* Emergency Type */}
        <Text style={styles.typeTitle}>IDENTIFY EMERGENCY TYPE</Text>
        <View style={styles.typeGrid}>
          {EMERGENCY_TYPES.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeBtn, selectedType === type.id && styles.typeBtnActive]}
              onPress={() => setSelectedType(type.id)}
            >
              <MaterialIcons name={type.icon} size={28} color={Colors.textWhite} />
              <Text style={styles.typeBtnText}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownText}>{countdown}s</Text>
          </View>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleCancelSOS}
          activeOpacity={0.7}
        >
          <MaterialIcons name="cancel" size={22} color={Colors.danger} />
          <Text style={styles.cancelBtnText}>HOLD TO CANCEL SOS</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          Police and emergency responders have{'\n'}been notified of your location.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#b91c1c' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  transmitBanner: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 24, marginBottom: 20,
  },
  transmitText: { color: Colors.textWhite, fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: 36, fontWeight: '900', color: Colors.textWhite, letterSpacing: 2, textAlign: 'center' },
  subtitle: { fontSize: 22, color: 'rgba(255,255,255,0.8)', fontWeight: '400', marginTop: 4, textAlign: 'center' },
  coordsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  coordsText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' },
  coordsSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  pulseContainer: {
    width: 180, height: 180, justifyContent: 'center', alignItems: 'center', marginVertical: 20,
  },
  pulseRing1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  pulseRing2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  alertIconWrapper: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.textWhite,
    justifyContent: 'center', alignItems: 'center',
  },
  diamondIcon: {
    transform: [{ rotate: '0deg' }],
  },
  typeTitle: {
    fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 2,
    marginBottom: 14,
  },
  typeGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 16,
    borderRadius: 12, borderWidth: 1.5, borderColor: 'transparent',
  },
  typeBtnActive: { borderColor: Colors.textWhite, backgroundColor: 'rgba(255,255,255,0.25)' },
  typeBtnText: { color: Colors.textWhite, fontSize: 11, fontWeight: '700' },
  countdownContainer: { marginBottom: 16 },
  countdownCircle: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  countdownText: { color: Colors.textWhite, fontSize: 22, fontWeight: '900' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    width: '100%', paddingVertical: 18, borderRadius: 16,
    backgroundColor: Colors.textWhite, marginBottom: 16,
  },
  cancelBtnText: { color: Colors.danger, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  footerText: {
    color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center', lineHeight: 20,
    marginTop: 'auto', marginBottom: 24,
  },
});
