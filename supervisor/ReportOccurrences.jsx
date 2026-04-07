import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ReportOccurrences() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="close" size={24} color="#0f1623" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Occurrence</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.typeSelector}>
          <Text style={styles.label}>Select Incident Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <TouchableOpacity style={styles.chipActive}>
              <Text style={styles.chipTextActive}>Trespassing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Vandalism</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Theft Attempt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Other</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="Provide detailed information about the event..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Attach Evidence Photo</Text>
          <TouchableOpacity style={styles.photoBox}>
            <MaterialIcons name="add-a-photo" size={32} color="#002e85" />
            <Text style={styles.photoText}>Tap to open camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationInput}>
            <MaterialIcons name="my-location" size={20} color="#002e85" />
            <Text style={styles.locationVal}>Tech Park - Sector 4 (Detected)</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => navigation.navigate('ReportSubmissionSuccess')}
        >
          <Text style={styles.submitBtnText}>Submit Report</Text>
          <MaterialIcons name="check-circle" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
  label: { fontSize: 14, fontWeight: 'bold', color: '#444652', marginBottom: 8 },
  typeSelector: { marginBottom: 24 },
  chipRow: { gap: 8, paddingRight: 16 },
  chipActive: { backgroundColor: '#002e85', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  chip: { backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  chipTextActive: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  chipText: { color: '#444652', fontWeight: 'bold', fontSize: 14 },
  inputGroup: { marginBottom: 24 },
  textArea: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16, fontSize: 16,
    color: '#0f1623', minHeight: 120, borderWidth: 1, borderColor: '#e2e8f0'
  },
  photoBox: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#cbd5e1',
    backgroundColor: '#eff6ff', borderRadius: 12, height: 120,
    justifyContent: 'center', alignItems: 'center', gap: 8
  },
  photoText: { fontSize: 14, fontWeight: '500', color: '#002e85' },
  locationInput: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0'
  },
  locationVal: { fontSize: 14, color: '#0f1623', fontWeight: '500' },
  footer: { padding: 16, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  submitBtn: {
    backgroundColor: '#002e85', borderRadius: 12, height: 56,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2
  },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
