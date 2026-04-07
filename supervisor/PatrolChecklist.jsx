import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PatrolChecklist() {
  const navigation = useNavigation();
  const [checks, setChecks] = useState([
    { id: 1, title: 'Main Gate Secure', status: 'checked' },
    { id: 2, title: 'CCTV Cameras Functional', status: 'checked' },
    { id: 3, title: 'Perimeter Wall Intact', status: 'unchecked' },
    { id: 4, title: 'Fire Extinguishers Present', status: 'unchecked' },
  ]);

  const toggleCheck = (id) => {
    setChecks(checks.map(c => c.id === id ? { ...c, status: c.status === 'checked' ? 'unchecked' : 'checked' } : c));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#002e85" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patrol Checklist</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReportOccurrences')}>
          <MaterialIcons name="add-alert" size={24} color="#ba1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoCard}>
          <MaterialIcons name="fact-check" size={32} color="#002e85" />
          <Text style={styles.infoCardTitle}>Site Inspection</Text>
          <Text style={styles.infoCardDesc}>Complete all checks before marking shift as verified.</Text>
        </View>

        <View style={styles.checklistContainer}>
          {checks.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.checkItem, item.status === 'checked' && styles.checkItemDone]}
              onPress={() => toggleCheck(item.id)}
            >
              <View style={styles.checkLeft}>
                <View style={[styles.checkBox, item.status === 'checked' && styles.checkBoxActive]}>
                  {item.status === 'checked' && <MaterialIcons name="check" size={16} color="#ffffff" />}
                </View>
                <Text style={[styles.checkTitle, item.status === 'checked' && styles.checkTitleDone]}>
                  {item.title}
                </Text>
              </View>
              {item.status === 'unchecked' && <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate('ReportSubmissionSuccess')}
        >
          <Text style={styles.submitButtonText}>Submit Verification</Text>
        </TouchableOpacity>
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
  infoCard: {
    backgroundColor: '#e0e7ff', borderRadius: 12, padding: 20, marginBottom: 24,
    alignItems: 'center'
  },
  infoCardTitle: { fontSize: 18, fontWeight: 'bold', color: '#002e85', marginTop: 8 },
  infoCardDesc: { fontSize: 14, color: '#444652', textAlign: 'center', marginTop: 4 },
  checklistContainer: { backgroundColor: '#ffffff', borderRadius: 12, elevation: 2, padding: 8, marginBottom: 24 },
  checkItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f1f0f8'
  },
  checkItemDone: { backgroundColor: '#f1f0f8', borderRadius: 8 },
  checkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkBox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#cbd5e1',
    alignItems: 'center', justifyContent: 'center'
  },
  checkBoxActive: { backgroundColor: '#002e85', borderColor: '#002e85' },
  checkTitle: { fontSize: 16, color: '#0f1623', fontWeight: '500' },
  checkTitleDone: { color: '#444652', textDecorationLine: 'line-through' },
  submitButton: {
    backgroundColor: '#002e85', borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', elevation: 4
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
