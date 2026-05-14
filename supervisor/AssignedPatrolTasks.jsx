import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GPSStatusBar from '../src/components/GPSStatusBar';
import { Colors } from '../src/theme/colors';

const TASKS = [];

export default function AssignedPatrolTasks() {
  const navigation = useNavigation();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-progress':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#f97316' }]}>
            <MaterialIcons name="chat-bubble" size={12} color={Colors.textWhite} />
            <Text style={styles.statusBadgeText}>IN PROGRESS</Text>
          </View>
        );
      case 'upcoming':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#3b82f6' }]}>
            <MaterialIcons name="schedule" size={12} color={Colors.textWhite} />
            <Text style={styles.statusBadgeText}>UPCOMING</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <MaterialIcons name="translate" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Patrol Tasks</Text>
            <Text style={styles.headerSub}>Field Officer: {'\u0930\u094B\u0939\u0928'}</Text>
          </View>
        </View>
        <View style={styles.gpsBadge}>
          <View style={styles.gpsDot} />
          <Text style={styles.gpsText}>GPS ON</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
          </View>
        </View>

        {TASKS.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-available" size={64} color={Colors.border} />
            <Text style={styles.emptyStateTitle}>No Upcoming Patrols</Text>
            <Text style={styles.emptyStateSub}>You're all caught up for today!</Text>
          </View>
        ) : (
          TASKS.map(task => (
            <View key={task.id} style={styles.taskCard}>
              {/* Site Image */}
              <View style={styles.taskImageContainer}>
                <Image source={{ uri: task.image }} style={styles.taskImage} resizeMode="cover" />
                {getStatusBadge(task.status)}
              </View>

              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={16} color={Colors.primary} />
                  <Text style={styles.locationText}>{task.location}</Text>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoLabel}>Time Slot</Text>
                    <Text style={styles.infoValue}>{task.timeSlot}</Text>
                  </View>
                  <View style={styles.infoPill}>
                    <Text style={styles.infoLabel}>Checkpoints</Text>
                    <View style={styles.checkpointCount}>
                      <MaterialIcons name="flag" size={14} color={Colors.primary} />
                      <Text style={styles.infoValue}>{task.checkpoints.done} / {task.checkpoints.total}</Text>
                    </View>
                  </View>
                </View>

                {task.status === 'in-progress' ? (
                  <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={() => navigation.navigate('PatrolChecklist')}
                  >
                    <MaterialIcons name="explore" size={20} color={Colors.textWhite} />
                    <Text style={styles.continueBtnText}>Continue Patrol</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.lockedArea}>
                    <MaterialIcons name="lock" size={16} color={Colors.textMuted} />
                    <Text style={styles.lockedText}>Unlocks at scheduled time</Text>
                  </View>
                )}
              </View>
            </View>
          ))
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
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  gpsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#dcfce7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  gpsText: { fontSize: 12, fontWeight: '700', color: Colors.success },
  container: { padding: 16 },
  scheduleHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  scheduleTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  datePill: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12,
  },
  dateText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  taskCard: {
    backgroundColor: Colors.surface, borderRadius: 20, marginBottom: 20,
    elevation: 3, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10,
  },
  taskImageContainer: { position: 'relative', height: 160, backgroundColor: '#d1d5db' },
  taskImage: {
    width: '100%', height: '100%',
  },
  statusBadge: {
    position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  statusBadgeText: { color: Colors.textWhite, fontSize: 11, fontWeight: '800' },
  taskContent: { padding: 18 },
  taskTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  locationText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoPill: {
    flex: 1, backgroundColor: Colors.background, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  infoLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  checkpointCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
  },
  continueBtnText: { color: Colors.textWhite, fontSize: 16, fontWeight: '700' },
  lockedArea: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  lockedText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16 },
  emptyStateSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
});
