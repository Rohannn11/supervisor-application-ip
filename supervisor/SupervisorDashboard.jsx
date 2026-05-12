import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../src/context/AuthContext';
import { useAppContext } from '../src/context/AppContext';
import LanguageSwitcher from '../src/components/LanguageSwitcher';
import { Colors } from '../src/theme/colors';

export default function SupervisorDashboard() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isPatrolActive, startPatrol, gpsStatus } = useAppContext();

  const handleStartPatrol = () => {
    startPatrol();
    navigation.navigate('ActivePatrolMap');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSmall}>
            <MaterialIcons name="person" size={20} color={Colors.textWhite} />
          </View>
          <View>
            <Text style={styles.welcomeLabel}>WELCOME</Text>
            <Text style={styles.headerTitle}>नमस्ते, {user?.name || 'Rohan'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <LanguageSwitcher compact />
          <TouchableOpacity style={styles.bellBtn}>
            <MaterialIcons name="notifications" size={24} color={Colors.textLight} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* GPS Status */}
        <View style={[styles.gpsPill, gpsStatus === 'disconnected' && { backgroundColor: Colors.dangerLight }]}>
          <MaterialIcons 
            name={gpsStatus === 'connected' ? "check-circle" : "error"} 
            size={18} 
            color={gpsStatus === 'connected' ? Colors.success : Colors.danger} 
          />
          <Text style={[styles.gpsPillText, gpsStatus === 'disconnected' && { color: Colors.danger }]}>
            {gpsStatus === 'connected' ? 'Online • GPS Active' : 'Offline • GPS Inactive'}
          </Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' }}
            style={styles.heroMapBg}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroLabel}>ASSIGNED SITE</Text>
            <Text style={styles.heroTitle}>{user?.site || 'Tech Park - Main Gate'}</Text>
          </View>
          <View style={styles.heroInfoRow}>
            <View style={styles.heroInfoPill}>
              <MaterialIcons name="schedule" size={16} color={Colors.primaryAccent} />
              <Text style={styles.heroInfoText}>{user?.shift || '08:00 AM - 04:00 PM'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startPatrolBtn} onPress={handleStartPatrol}>
            <MaterialIcons name="play-circle-filled" size={22} color={Colors.textWhite} />
            <Text style={styles.startPatrolText}>START PATROL</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('ChecklistTab')}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: Colors.primaryLight }]}>
              <MaterialIcons name="checklist" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.quickCardTitle}>Patrol Checklist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('ChecklistTab', { screen: 'ReportOccurrences' })}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#fff3e0' }]}>
              <MaterialIcons name="campaign" size={28} color="#e65100" />
            </View>
            <Text style={styles.quickCardTitle}>Add Occurrence</Text>
          </TouchableOpacity>
        </View>

        {/* My Reports */}
        <TouchableOpacity
          style={styles.reportsCard}
          onPress={() => navigation.navigate('ReportsTab')}
        >
          <View style={[styles.quickIconWrap, { backgroundColor: '#e3f2fd' }]}>
            <MaterialIcons name="description" size={28} color={Colors.primary} />
          </View>
          <View style={styles.reportsTextGroup}>
            <Text style={styles.reportsTitle}>My Reports</Text>
            <Text style={styles.reportsSubtitle}>View past submissions</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.borderMuted} />
        </TouchableOpacity>

        {/* Real-Time Tracking */}
        <TouchableOpacity
          style={styles.trackingCard}
          onPress={() => navigation.navigate('ActivePatrolMap')}
        >
          <View style={styles.trackingLeft}>
            <View style={styles.trackingIconWrap}>
              <MaterialIcons name="my-location" size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.trackingTitle}>Real-Time Tracking</Text>
              <Text style={styles.trackingSubtitle}>Live positions & routes</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.borderMuted} />
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('ChecklistTab')}
          >
            <View style={[styles.statIconWrap, { backgroundColor: Colors.primarySurface }]}>
              <MaterialIcons name="fact-check" size={24} color={Colors.primaryMuted} />
            </View>
            <Text style={styles.statLabel}>Pending Checklists</Text>
            <Text style={styles.statValue}>04</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('ReportsTab')}
          >
            <View style={[styles.statIconWrap, { backgroundColor: Colors.dangerLight }]}>
              <MaterialIcons name="assessment" size={24} color={Colors.dangerDark} />
            </View>
            <Text style={styles.statLabel}>Incident Reports</Text>
            <Text style={[styles.statValue, { color: Colors.danger }]}>02</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarSmall: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  welcomeLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellBtn: { position: 'relative', padding: 6 },
  notifDot: {
    position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  container: { padding: 16 },
  gpsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#dcfce7', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    marginBottom: 16,
  },
  gpsPillText: { fontSize: 14, fontWeight: '600', color: Colors.success },
  heroCard: {
    backgroundColor: Colors.primary, borderRadius: 16, overflow: 'hidden',
    marginBottom: 24, elevation: 6, shadowColor: Colors.primary,
    shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  heroMapBg: { width: '100%', height: 140, opacity: 0.6 },
  heroOverlay: {
    paddingHorizontal: 20, paddingTop: 16,
  },
  heroLabel: { color: Colors.primaryText, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  heroTitle: { color: Colors.textWhite, fontSize: 22, fontWeight: '900', marginTop: 4 },
  heroInfoRow: { paddingHorizontal: 20, marginTop: 12 },
  heroInfoPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  heroInfoText: { color: Colors.primaryAccent, fontSize: 14, fontWeight: '500' },
  startPatrolBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.success, marginHorizontal: 20, marginTop: 16, marginBottom: 20,
    paddingVertical: 14, borderRadius: 12,
  },
  startPatrolText: {
    color: Colors.textWhite, fontSize: 16, fontWeight: '900', letterSpacing: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  quickGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  quickCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', elevation: 2,
  },
  quickIconWrap: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  quickCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  reportsCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, marginBottom: 16, elevation: 2,
  },
  reportsTextGroup: { flex: 1 },
  reportsTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  reportsSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  trackingCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: 12, padding: 18, marginBottom: 16,
    borderBottomWidth: 4, borderBottomColor: Colors.primary, elevation: 2,
  },
  trackingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  trackingIconWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  trackingTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  trackingSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 18, elevation: 2,
  },
  statIconWrap: {
    width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  statLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  statValue: { fontSize: 28, fontWeight: '900', color: Colors.primary, marginTop: 4 },
});
