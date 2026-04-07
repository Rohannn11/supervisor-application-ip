import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function OfficerDashboard() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={24} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Amit Kumar</Text>
            <Text style={styles.headerSubtitle}>North Gate | Shift A</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <MaterialIcons name="notifications" size={24} color="#002e85" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <View style={styles.statusOnline}>
              <View style={styles.dot} />
              <Text style={styles.statusOnlineText}>On Duty</Text>
            </View>
          </View>
          <Text style={styles.statusTime}>Shift Ends in 4 hrs 20 mins</Text>
          <TouchableOpacity style={styles.breakBtn}>
            <MaterialIcons name="coffee" size={18} color="#0f1623" />
            <Text style={styles.breakBtnText}>Request Break</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Tasks (3)</Text>
        <TouchableOpacity 
          style={styles.taskCard}
          onPress={() => navigation.navigate('AssignedPatrolTasks')}
        >
          <View style={styles.taskIconHighlight}>
            <MaterialIcons name="assignment" size={24} color="#002e85" />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>Perimeter Check - Sector 4</Text>
            <Text style={styles.taskDesc}>Due in 30 mins</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.taskCard}
          onPress={() => navigation.navigate('AssignedPatrolTasks')}
        >
          <View style={styles.taskIcon}>
            <MaterialIcons name="assignment" size={24} color="#525c7f" />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>Visitor Log Validation</Text>
            <Text style={styles.taskDesc}>Ongoing</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
        </TouchableOpacity>

        <View style={styles.quickGrid}>
          <TouchableOpacity 
            style={styles.quickBtn}
            onPress={() => navigation.navigate('ReportOccurrences')}
          >
            <MaterialIcons name="report" size={32} color="#002e85" />
            <Text style={styles.quickBtnText}>Report{"\n"}Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickBtn}
            onPress={() => navigation.navigate('PatrolHistory')}
          >
            <MaterialIcons name="history" size={32} color="#002e85" />
            <Text style={styles.quickBtnText}>My{"\n"}History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn}>
            <MaterialIcons name="map" size={32} color="#002e85" />
            <Text style={styles.quickBtnText}>Site{"\n"}Map</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <TouchableOpacity 
        style={styles.sosBanner}
        onPress={() => navigation.navigate('EmergencySOSActive')}
      >
        <MaterialIcons name="emergency" size={28} color="#ffffff" />
        <Text style={styles.sosBannerText}>SLIDE TO SOS</Text>
        <MaterialIcons name="keyboard-double-arrow-right" size={28} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#ffffff',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#002e85', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623' },
  headerSubtitle: { fontSize: 12, color: '#444652' },
  bellBtn: { position: 'relative', padding: 8, backgroundColor: '#f5f6f8', borderRadius: 20 },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ba1a1a' },
  container: { padding: 16 },
  statusCard: {
    backgroundColor: '#002e85', borderRadius: 16, padding: 20, marginBottom: 24,
    elevation: 4, shadowColor: '#002e85', shadowOpacity: 0.3, shadowRadius: 8
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { color: '#b4c5ff', fontSize: 14, fontWeight: '500' },
  statusOnline: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80' },
  statusOnlineText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  statusTime: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginTop: 12, marginBottom: 16 },
  breakBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff', paddingVertical: 12, borderRadius: 12 },
  breakBtnText: { color: '#0f1623', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623', marginBottom: 16 },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',
    padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1
  },
  taskIconHighlight: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  taskIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#e3e2ea', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f1623' },
  taskDesc: { fontSize: 12, color: '#444652', marginTop: 4 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 80 },
  quickBtn: {
    flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 20, marginHorizontal: 4, borderRadius: 12, elevation: 1
  },
  quickBtnText: { fontSize: 12, fontWeight: 'bold', color: '#0f1623', textAlign: 'center', marginTop: 8 },
  sosBanner: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    backgroundColor: '#ba1a1a', borderRadius: 100, padding: 16,
    flexDirection: 'row', alignItems: 'center', elevation: 8
  },
  sosBannerText: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 2, flex: 1, textAlign: 'center' }
});
