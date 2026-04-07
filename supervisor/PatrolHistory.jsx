import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PatrolHistory() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#002e85" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patrol History & Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.filterSection}>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
            <Text style={styles.filterTextActive}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Incidents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Checklists</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.badgeWarning}>
              <MaterialIcons name="warning" size={14} color="#93000a" />
              <Text style={styles.badgeWarningText}>INCIDENT</Text>
            </View>
            <Text style={styles.reportTime}>Today, 10:45 AM</Text>
          </View>
          <Text style={styles.reportTitle}>Unauthorized Access Attempt</Text>
          <Text style={styles.reportDesc}>Individual attempted to enter North Gate without ID. Escorted off premises.</Text>
          <View style={styles.reportFooter}>
            <View style={styles.officerInfo}>
              <MaterialIcons name="person" size={16} color="#444652" />
              <Text style={styles.officerName}>Guard: Suresh K.</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewLink}>View Details</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.badgeSuccess}>
              <MaterialIcons name="fact-check" size={14} color="#002e85" />
              <Text style={styles.badgeSuccessText}>CHECKLIST</Text>
            </View>
            <Text style={styles.reportTime}>Today, 08:00 AM</Text>
          </View>
          <Text style={styles.reportTitle}>Morning Shift Perimeter Check</Text>
          <Text style={styles.reportDesc}>All 12 checkpoints verified successfully. No anomalies found.</Text>
          <View style={styles.reportFooter}>
            <View style={styles.officerInfo}>
              <MaterialIcons name="person" size={16} color="#444652" />
              <Text style={styles.officerName}>Guard: Ramesh V.</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewLink}>View Log</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.badgeSuccess}>
              <MaterialIcons name="fact-check" size={14} color="#002e85" />
              <Text style={styles.badgeSuccessText}>CHECKLIST</Text>
            </View>
            <Text style={styles.reportTime}>Yesterday, 08:00 PM</Text>
          </View>
          <Text style={styles.reportTitle}>Night Shift Handover Check</Text>
          <Text style={styles.reportDesc}>Keys transferred correctly. Security cameras operational.</Text>
          <View style={styles.reportFooter}>
            <View style={styles.officerInfo}>
              <MaterialIcons name="person" size={16} color="#444652" />
              <Text style={styles.officerName}>Guard: Amit S.</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewLink}>View Log</Text></TouchableOpacity>
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002e85' },
  backBtn: { padding: 4 },
  container: { padding: 16 },
  filterSection: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChipActive: { backgroundColor: '#002e85', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChip: { backgroundColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterTextActive: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  filterText: { color: '#444652', fontWeight: 'bold', fontSize: 12 },
  reportCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeWarning: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffdad6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeWarningText: { fontSize: 10, fontWeight: 'bold', color: '#93000a' },
  badgeSuccess: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e0e7ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeSuccessText: { fontSize: 10, fontWeight: 'bold', color: '#002e85' },
  reportTime: { fontSize: 12, color: '#444652', fontWeight: '500' },
  reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f1623', marginBottom: 6 },
  reportDesc: { fontSize: 14, color: '#444652', marginBottom: 16 },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f0f8', paddingTop: 12 },
  officerInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  officerName: { fontSize: 12, color: '#444652', fontWeight: '500' },
  viewLink: { fontSize: 12, fontWeight: 'bold', color: '#002e85' }
});
