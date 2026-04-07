import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AssignedPatrolTasks() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#002e85" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assigned Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PatrolHistory')}>
          <MaterialIcons name="history" size={24} color="#002e85" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateLabel}>Today</Text>
        
        <View style={styles.taskCardHighlight}>
          <View style={styles.taskHeader}>
            <View style={styles.priorityHigh}>
              <Text style={styles.priorityHighText}>HIGH PRIORITY</Text>
            </View>
            <Text style={styles.timeText}>09:30 AM</Text>
          </View>
          <Text style={styles.taskTitle}>North Gate Delivery Check</Text>
          <Text style={styles.taskDesc}>Verify all incoming delivery trucks for manifest matching. Do not allow unregistered vehicles.</Text>
          
          <TouchableOpacity 
            style={styles.actionBtnHigh}
            onPress={() => navigation.navigate('PatrolChecklist')}
          >
            <Text style={styles.actionBtnHighText}>Start Task</Text>
            <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <View style={styles.priorityNormal}>
              <Text style={styles.priorityNormalText}>ROUTINE</Text>
            </View>
            <Text style={styles.timeText}>11:00 AM</Text>
          </View>
          <Text style={styles.taskTitle}>Cafeteria Floor Patrol</Text>
          <Text style={styles.taskDesc}>Ensure no unauthorized personnel are present during cleaning hours.</Text>
          
          <TouchableOpacity 
            style={styles.actionBtnNormal}
            onPress={() => navigation.navigate('PatrolChecklist')}
          >
            <Text style={styles.actionBtnNormalText}>Start Task</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dateLabel}>Upcoming</Text>

        <View style={styles.taskCardDisabled}>
          <View style={styles.taskHeader}>
            <View style={styles.priorityNormal}>
              <Text style={styles.priorityNormalText}>ROUTINE</Text>
            </View>
            <Text style={styles.timeText}>02:00 PM</Text>
          </View>
          <Text style={styles.taskTitle}>Perimeter Fence Inspection</Text>
          <Text style={styles.taskDesc}>Check the Western boundary wall for any tampering or damage to the wire fence.</Text>
          <View style={styles.lockedArea}>
            <MaterialIcons name="lock" size={16} color="#9ca3af" />
            <Text style={styles.lockedText}>Unlocks at 01:50 PM</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56, backgroundColor: '#ffffff',
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623' },
  backBtn: { padding: 4 },
  container: { padding: 16 },
  dateLabel: { fontSize: 14, fontWeight: 'bold', color: '#444652', marginBottom: 12, marginTop: 8 },
  taskCardHighlight: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#ba1a1a', elevation: 3
  },
  taskCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#002e85', elevation: 2
  },
  taskCardDisabled: {
    backgroundColor: '#f1f0f8', borderRadius: 16, padding: 20, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#cbd5e1'
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  priorityHigh: { backgroundColor: '#ffdad6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityHighText: { color: '#93000a', fontSize: 10, fontWeight: '900' },
  priorityNormal: { backgroundColor: '#e0e7ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityNormalText: { color: '#002e85', fontSize: 10, fontWeight: '900' },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#0f1623' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623', marginBottom: 6 },
  taskDesc: { fontSize: 14, color: '#444652', marginBottom: 16 },
  actionBtnHigh: {
    backgroundColor: '#002e85', borderRadius: 8, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8
  },
  actionBtnHighText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  actionBtnNormal: {
    backgroundColor: '#e0e7ff', borderRadius: 8, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center'
  },
  actionBtnNormalText: { color: '#002e85', fontSize: 14, fontWeight: 'bold' },
  lockedArea: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  lockedText: { fontSize: 12, color: '#9ca3af', fontWeight: '500' }
});
