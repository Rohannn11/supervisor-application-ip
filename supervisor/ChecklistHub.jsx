import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePatrol } from '../src/context/PatrolContext';
import { Colors } from '../src/theme/colors';

export default function ChecklistHub() {
  const navigation = useNavigation();
  const { patrolSpots, isSessionLocked, resetSession } = usePatrol();
  const doneCount = patrolSpots.filter(s => s.checklistDone).length;
  const allDone = patrolSpots.length > 0 && doneCount === patrolSpots.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Patrol Checklist</Text>
          <Text style={styles.headerSub}>
            {patrolSpots.length > 0
              ? `${patrolSpots.filter(s => s.checklistDone).length} / ${patrolSpots.length} spots complete`
              : 'No patrol spots defined yet'}
          </Text>
        </View>
        <View style={[styles.statusBadge, isSessionLocked ? styles.badgeLocked : styles.badgeOpen]}>
          <MaterialIcons
            name={isSessionLocked ? 'lock' : 'lock-open'}
            size={14}
            color={Colors.textWhite}
          />
          <Text style={styles.badgeText}>{isSessionLocked ? 'LOCKED' : 'SETUP'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {patrolSpots.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="map" size={64} color={Colors.borderMuted} />
            <Text style={styles.emptyTitle}>No Spots Configured</Text>
            <Text style={styles.emptySubtitle}>
              Go to the Home tab, open Patrol Monitor, draw your patrol boundary,
              then tap inside the fence to add patrol spots.
            </Text>
            <TouchableOpacity
              style={styles.goToMapBtn}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <MaterialIcons name="explore" size={20} color={Colors.textWhite} />
              <Text style={styles.goToMapText}>Open Patrol Map</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>YOUR PATROL SPOTS</Text>
            {patrolSpots.map((spot, index) => (
              <TouchableOpacity
                key={spot.id}
                style={[styles.spotCard, spot.checklistDone && styles.spotCardDone]}
                onPress={() => {
                  if (spot.checklistDone) return; // already done
                  navigation.navigate('SpotQRScan', {
                    spotId: spot.id,
                    spotName: spot.name,
                    spotIndex: index,
                  });
                }}
                activeOpacity={spot.checklistDone ? 1 : 0.8}
              >
                <View style={[styles.spotIndex, spot.checklistDone && styles.spotIndexDone]}>
                  {spot.checklistDone ? (
                    <MaterialIcons name="check" size={20} color={Colors.textWhite} />
                  ) : (
                    <Text style={styles.spotIndexText}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.spotInfo}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotCoords}>
                    {spot.coordinate.latitude.toFixed(5)}, {spot.coordinate.longitude.toFixed(5)}
                  </Text>
                </View>
                <View style={[styles.statusPill, spot.checklistDone ? styles.pillDone : styles.pillPending]}>
                  <Text style={[styles.pillText, spot.checklistDone ? styles.pillTextDone : styles.pillTextPending]}>
                    {spot.checklistDone ? 'Complete' : 'Pending'}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={spot.checklistDone ? Colors.success : Colors.primary}
                />
              </TouchableOpacity>
            ))}

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{patrolSpots.length}</Text>
                  <Text style={styles.summaryLabel}>Total Spots</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: Colors.success }]}>
                    {patrolSpots.filter(s => s.checklistDone).length}
                  </Text>
                  <Text style={styles.summaryLabel}>Complete</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: Colors.danger }]}>
                    {patrolSpots.filter(s => !s.checklistDone).length}
                  </Text>
                  <Text style={styles.summaryLabel}>Pending</Text>
                </View>
              </View>
            </View>
            {/* End Patrol CTA when all spots done */}
            {allDone && (
              <TouchableOpacity
                style={styles.endPatrolBtn}
                onPress={() => {
                  Alert.alert(
                    'End Patrol',
                    'All spots have been inspected. End the patrol session?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'End Patrol',
                        style: 'destructive',
                        onPress: async () => {
                          await resetSession();
                          navigation.navigate('HomeTab', { screen: 'SupervisorDashboard' });
                        },
                      },
                    ]
                  );
                }}
              >
                <MaterialIcons name="flag" size={22} color={Colors.textWhite} />
                <Text style={styles.endPatrolText}>End Patrol Session</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  badgeLocked: { backgroundColor: Colors.success },
  badgeOpen: { backgroundColor: Colors.textLight },
  badgeText: { color: Colors.textWhite, fontSize: 11, fontWeight: '800' },
  container: { padding: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: {
    fontSize: 14, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginTop: 10, marginBottom: 28,
  },
  goToMapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 14, elevation: 4,
  },
  goToMapText: { color: Colors.textWhite, fontWeight: '700', fontSize: 15 },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: Colors.textSecondary,
    letterSpacing: 1.5, marginBottom: 12,
  },
  spotCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12,
    elevation: 2, borderWidth: 1, borderColor: Colors.borderLight,
  },
  spotCardDone: { borderColor: Colors.success, backgroundColor: '#f0fdf4' },
  spotIndex: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  spotIndexDone: { backgroundColor: Colors.success },
  spotIndexText: { color: Colors.textWhite, fontSize: 16, fontWeight: '900' },
  spotInfo: { flex: 1 },
  spotName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  spotCoords: { fontSize: 11, color: Colors.textMuted, marginTop: 2, fontFamily: 'monospace' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillPending: { backgroundColor: Colors.primaryLight },
  pillDone: { backgroundColor: '#dcfce7' },
  pillText: { fontSize: 11, fontWeight: '700' },
  pillTextPending: { color: Colors.primary },
  pillTextDone: { color: Colors.success },
  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginTop: 8,
    elevation: 2,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  summaryLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  endPatrolBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.success, borderRadius: 14, paddingVertical: 18,
    marginTop: 8, elevation: 4,
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  endPatrolText: { color: Colors.textWhite, fontSize: 16, fontWeight: '800' },
});
