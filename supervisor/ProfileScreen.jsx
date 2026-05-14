import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LanguageSwitcher from '../src/components/LanguageSwitcher';
import { useTheme } from '../src/theme/useTheme';
import { Colors } from '../src/theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const C = useTheme();
  const [metrics, setMetrics] = useState({ patrolsThisMonth: 0, checklistCompletion: 0, incidentsReported: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Metrics require real Firebase auth token — skip gracefully in POC
    setLoading(false);
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={48} color={Colors.textWhite} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Supervisor'}</Text>
          <Text style={styles.userRole}>{user?.role || 'Supervisor'}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online • GPS Active</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={22} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{user?.id || 'EMP-1042'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={22} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Assigned Site</Text>
              <Text style={styles.infoValue}>{user?.site || 'Tech Park - Main Gate'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={22} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Current Shift</Text>
              <Text style={styles.infoValue}>{user?.shift || '08:00 AM - 04:00 PM'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="phone-android" size={22} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Device IMEI</Text>
              <Text style={styles.infoValue}>XXXX-XXXX-XXXX-1234</Text>
            </View>
          </View>
        </View>

        {/* Shift Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shift Summary</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{metrics.patrolsThisMonth}</Text>
              <Text style={styles.statLabel}>Patrols{'\n'}This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: Colors.success }]}>{metrics.checklistCompletion}%</Text>
              <Text style={styles.statLabel}>Checklist{'\n'}Completion</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: Colors.danger }]}>{metrics.incidentsReported}</Text>
              <Text style={styles.statLabel}>Incidents{'\n'}Reported</Text>
            </View>
          </View>
        )}

        {/* Language */}
        <View style={styles.langSection}>
          <LanguageSwitcher />
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="help-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={22} color={Colors.borderMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="info-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.menuText}>App Version 1.0.0</Text>
          <MaterialIcons name="chevron-right" size={22} color={Colors.borderMuted} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <MaterialIcons name="logout" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.footerBadge}>
            <MaterialIcons name="verified-user" size={14} color={Colors.textSecondary} />
            <Text style={styles.footerTextBold}>SECURED BY SENTINEL OS</Text>
          </View>
          <Text style={styles.footerText}>© 2024 PatrolGuard Systems</Text>
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  settingsBtn: { padding: 4 },
  container: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    elevation: 6, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10,
  },
  userName: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary },
  userRole: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8,
    backgroundColor: '#dcfce7', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  statusText: { fontSize: 12, fontWeight: '600', color: Colors.success },
  infoCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 24,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  infoValue: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 16,
    alignItems: 'center', elevation: 1,
  },
  statValue: { fontSize: 28, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  langSection: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 8, marginBottom: 16, elevation: 1,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 8,
  },
  menuText: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 2, borderColor: Colors.dangerLight, borderRadius: 12,
    paddingVertical: 14, marginTop: 16, marginBottom: 24,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: Colors.danger },
  footer: { alignItems: 'center', gap: 4, paddingBottom: 16 },
  footerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.4 },
  footerTextBold: { fontSize: 10, fontWeight: '600', letterSpacing: 1, color: Colors.textSecondary },
  footerText: { fontSize: 10, color: Colors.textSecondary, opacity: 0.4 },
});
