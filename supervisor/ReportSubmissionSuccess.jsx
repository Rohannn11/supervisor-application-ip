import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ReportSubmissionSuccess() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="done" size={64} color="#ffffff" />
        </View>
        
        <Text style={styles.title}>Submitted</Text>
        <Text style={styles.subtitle}>Your report has been successfully recorded in the centralized log.</Text>
        
        <View style={styles.detailsBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Reference ID</Text>
            <Text style={styles.value}>#INC-8493</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.valueValid}>Logged</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.doneBtn}
          onPress={() => navigation.navigate('SupervisorDashboard')}
        >
          <Text style={styles.doneBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconContainer: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#22c55e',
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
    elevation: 8, shadowColor: '#22c55e', shadowRadius: 10, shadowOpacity: 0.4
  },
  title: { fontSize: 32, fontWeight: '900', color: '#0f1623', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#444652', textAlign: 'center', marginBottom: 40, paddingHorizontal: 16 },
  detailsBox: {
    width: '100%', backgroundColor: '#ffffff', borderRadius: 16, padding: 20,
    elevation: 2, borderWidth: 1, borderColor: '#e2e8f0'
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 14, color: '#444652', fontWeight: '500' },
  value: { fontSize: 14, color: '#0f1623', fontWeight: 'bold' },
  valueValid: { fontSize: 14, color: '#22c55e', fontWeight: 'bold' },
  footer: { padding: 24, paddingBottom: 40 },
  doneBtn: {
    width: '100%', height: 56, backgroundColor: '#002e85', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center'
  },
  doneBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
