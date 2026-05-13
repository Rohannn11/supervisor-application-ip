import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../src/theme/colors';
import { useAuth } from '../src/context/AuthContext';
import { usePatrol } from '../src/context/PatrolContext';

const CHECKLIST_ITEMS = [
  { id: 1, question: 'Is the main gate secure and locked?' },
  { id: 2, question: 'Are all CCTV cameras functioning?' },
  { id: 3, question: 'Is the emergency number available?' },
  { id: 4, question: 'Is the fire extinguisher in working condition?' },
  { id: 5, question: 'Is the security guard present at the gate?' },
  { id: 6, question: 'Is the CCTV camera functioning?' },
  { id: 7, question: 'Are emergency exits clear and accessible?' },
  { id: 8, question: 'Is the visitor log being maintained?' },
  { id: 9, question: 'Are perimeter lights operational?' },
  { id: 10, question: 'Is the alarm system tested today?' },
  { id: 11, question: 'Are hazardous areas properly marked?' },
  { id: 12, question: 'Is the communication radio working?' },
];

export default function PatrolChecklist() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { patrolSpots } = usePatrol();

  const spotId = route.params?.spotId ?? null;
  const spotName = route.params?.spotName ?? 'General Patrol';
  const spotIndex = route.params?.spotIndex ?? 0; // 0-based

  // Global occurrence number starts at spotIndex+1
  // (Spot 1 → occurrence 1, Spot 2 → occurrence 2, etc.)
  const globalOccurrenceStart = spotIndex + 1;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState(
    CHECKLIST_ITEMS.map(item => ({ ...item, status: null, remark: '', uploadUri: null }))
  );

  const completedCount = items.filter(i => i.status !== null).length;
  const totalCount = items.length;
  const progress = completedCount / totalCount;

  const updateStatus = (id, status) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status, remark: status === 'no' ? item.remark : '' } : item
    ));
  };

  const updateRemark = (id, remark) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, remark } : item));
  };

  const handlePickImage = async (id) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission', 'Camera access is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled && result.assets?.length > 0) {
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, uploadUri: result.assets[0].uri } : item
      ));
    }
  };

  /**
   * UNIFIED SUBMIT:
   * 1. POSTs checklist responses to backend
   * 2. Navigates to ReportOccurrences with globalOccurrenceStart
   * ReportOccurrences will mark the spot done and return to ChecklistHub.
   */
  const handleSubmit = async () => {
    const answeredItems = items.filter(i => i.status !== null);
    if (answeredItems.length === 0) {
      Alert.alert('Incomplete', 'Please answer at least one checklist item before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        shiftId: user?.shift || 'SH-1024',
        spotId,
        spotName,
        checklistResponses: answeredItems.map(i => ({
          id: i.id, title: i.question, status: i.status,
          remarks: i.remark, photoUri: i.uploadUri,
        })),
        location: null,
      };
      await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/patrol/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_MOCK_TOKEN}` 
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn('API Error (continuing for POC):', e);
    } finally {
      setIsSubmitting(false);
      navigation.navigate('ReportOccurrences', {
        spotId,
        spotName,
        globalOccurrenceStart,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{spotName}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Checklist Progress</Text>
        <Text style={styles.progressCount}>
          <Text style={styles.progressCountBold}>{completedCount}</Text> / {totalCount}
        </Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          {items.map((item) => (
            <View key={item.id} style={styles.checkItem}>
              <View style={styles.checkHeader}>
                <View style={styles.checkNumber}>
                  <Text style={styles.checkNumberText}>{item.id}</Text>
                </View>
                <Text style={styles.checkQuestion}>{item.question}</Text>
              </View>

              <View style={styles.triStateRow}>
                {[
                  { value: 'yes', label: 'Yes', icon: 'check-circle', activeStyle: styles.triBtnYes },
                  { value: 'no', label: 'No', icon: 'cancel', activeStyle: styles.triBtnNo },
                  { value: 'na', label: 'N/A', icon: 'do-not-disturb', activeStyle: styles.triBtnNA },
                ].map(({ value, label, icon, activeStyle }) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.triBtn, item.status === value && activeStyle]}
                    onPress={() => updateStatus(item.id, value)}
                  >
                    <MaterialIcons
                      name={icon}
                      size={22}
                      color={item.status === value ? Colors.textWhite : Colors.textMuted}
                    />
                    <Text style={[styles.triBtnText, item.status === value && styles.triBtnTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {item.status === 'no' && (
                <View style={styles.remarkSection}>
                  <Text style={styles.remarkLabel}>Observation Remark</Text>
                  <TextInput
                    style={styles.remarkInput}
                    placeholder="Please enter details..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    value={item.remark}
                    onChangeText={(text) => updateRemark(item.id, text)}
                  />
                  <View style={styles.uploadRow}>
                    {item.uploadUri ? (
                      <Image source={{ uri: item.uploadUri }} style={styles.previewImage} />
                    ) : (
                      <TouchableOpacity style={styles.uploadBtn} onPress={() => handlePickImage(item.id)}>
                        <MaterialIcons name="photo-camera" size={16} color={Colors.primary} />
                        <Text style={styles.uploadBtnText}>Capture Evidence</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Single unified submit → goes to Occurrences screen */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.textWhite} />
            ) : (
              <>
                <MaterialIcons name="arrow-forward" size={20} color={Colors.textWhite} />
                <Text style={styles.submitButtonText}>Save & Add Occurrences</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.submitHint}>
            Saves checklist and lets you report any incidents at this spot.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, flex: 1, textAlign: 'center' },
  backBtn: { padding: 4 },
  progressContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12,
  },
  progressLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  progressCount: { fontSize: 14, color: Colors.textSecondary },
  progressCountBold: { fontWeight: '900', color: Colors.primary, fontSize: 18 },
  progressBarBg: {
    height: 6, backgroundColor: Colors.border, marginHorizontal: 16, marginTop: 6,
    marginBottom: 8, borderRadius: 3, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  container: { padding: 16 },
  checkItem: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, marginBottom: 12,
    elevation: 1, borderWidth: 1, borderColor: Colors.borderLight,
  },
  checkHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  checkNumber: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  checkNumberText: { color: Colors.textWhite, fontSize: 13, fontWeight: '800' },
  checkQuestion: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary, lineHeight: 21 },
  triStateRow: { flexDirection: 'row', gap: 10 },
  triBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 10, backgroundColor: Colors.background,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  triBtnYes: { backgroundColor: Colors.success, borderColor: Colors.success },
  triBtnNo: { backgroundColor: Colors.danger, borderColor: Colors.danger },
  triBtnNA: { backgroundColor: Colors.textLight, borderColor: Colors.textLight },
  triBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  triBtnTextActive: { color: Colors.textWhite },
  remarkSection: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  remarkLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  remarkInput: {
    backgroundColor: Colors.background, borderRadius: 10, padding: 12,
    fontSize: 14, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top',
    borderWidth: 1, borderColor: Colors.border,
  },
  uploadRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  uploadBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  previewImage: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  submitButton: {
    backgroundColor: Colors.primary, borderRadius: 14, height: 58,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 10, elevation: 5, marginBottom: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
  submitHint: {
    textAlign: 'center', fontSize: 12, color: Colors.textMuted, lineHeight: 18,
  },
});
