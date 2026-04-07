import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../src/theme/colors';

export default function ReportSubmissionSuccess() {
  const navigation = useNavigation();
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Countdown + auto-redirect
    const timer = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.navigate('SupervisorDashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submission</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        {/* Success Circle */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.innerCircle}>
            <Animated.View style={{ opacity: checkAnim }}>
              <MaterialIcons name="check" size={52} color={Colors.success} />
            </Animated.View>
          </View>
        </Animated.View>

        <Text style={styles.title}>Report Sent!</Text>
        <Text style={styles.subtitle}>Your report has been successfully{'\n'}sent to your supervisor.</Text>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('SupervisorDashboard')}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* System Note */}
      <View style={styles.bottomSection}>
        <View style={styles.systemNote}>
          <Text style={styles.systemLabel}>System</Text>
          <View style={styles.systemCard}>
            <MaterialIcons name="verified" size={20} color={Colors.success} />
            <Text style={styles.systemText}>Auto-routed to Supervisor & Area Manager</Text>
          </View>
        </View>

        {/* Redirect Progress */}
        <View style={styles.redirectRow}>
          <Text style={styles.redirectText}>Redirecting to My Reports...</Text>
          <Text style={styles.redirectTime}>{redirectCountdown}s</Text>
        </View>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0fdf4' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  successCircle: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 4, borderColor: Colors.success,
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
    backgroundColor: '#dcfce7',
  },
  innerCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#bbf7d0', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 32, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: {
    fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
  homeBtn: {
    width: '100%', height: 56, backgroundColor: Colors.success, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  homeBtnText: { color: Colors.textWhite, fontSize: 16, fontWeight: '800' },
  bottomSection: { padding: 20, paddingBottom: 36 },
  systemNote: { marginBottom: 20 },
  systemLabel: { fontSize: 12, fontWeight: '700', color: Colors.success, marginBottom: 6 },
  systemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  systemText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  redirectRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  redirectText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  redirectTime: { fontSize: 13, color: Colors.textSecondary, fontWeight: '700' },
  progressBarBg: {
    height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', backgroundColor: Colors.success, borderRadius: 3,
  },
});
