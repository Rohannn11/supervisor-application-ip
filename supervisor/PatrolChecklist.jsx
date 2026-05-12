import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../src/theme/colors';
import { useAuth } from '../src/context/AuthContext';
import { ActivityIndicator, Alert } from 'react-native';

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
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState(
    CHECKLIST_ITEMS.map(item => ({ ...item, status: null, remark: '', uploadUri: null }))
  );

  const completedCount = items.filter(i => i.status !== null).length;
  const totalCount = items.length;
  const progress = completedCount / totalCount;

  const updateStatus = (id, status) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status, remark: status === 'no' ? item.remark : '' } : item
    ));
  };

  const updateRemark = (id, remark) => {
    setItems(items.map(item => item.id === id ? { ...item, remark } : item));
  };

  const handlePickImage = async (id) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setItems(items.map(item => 
        item.id === id ? { ...item, uploadUri: result.assets[0].uri } : item
      ));
    }
  };

  const handleSubmit = async () => {
    // Only send the ones that are answered
    const answeredItems = items.filter(i => i.status !== null);
    if (answeredItems.length === 0) {
      Alert.alert("Incomplete", "Please answer at least one checklist item before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Updated to use the correct local IP for physical Android testing
      const API_URL = 'http://192.168.1.6:3000/api/patrol/submit';
      
      const payload = {
        shiftId: user?.shift || 'SH-1024',
        checklistResponses: answeredItems.map(i => ({
          id: i.id,
          title: i.question,
          status: i.status,
          remarks: i.remark,
          photoUri: i.uploadUri
        })),
        location: null // Could add GPS here
      };

      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      navigation.navigate('ReportSubmissionSuccess');
    } catch (e) {
      console.warn("API Error (continuing for POC):", e);
      // Fallback for POC offline/network testing
      navigation.navigate('ReportSubmissionSuccess');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patrol Checklist</Text>
        <TouchableOpacity>
          <MaterialIcons name="translate" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressCount}>
          <Text style={styles.progressCountBold}>{completedCount}</Text> / {totalCount}
        </Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.checkItem}>
            <View style={styles.checkHeader}>
              <View style={styles.checkNumber}>
                <Text style={styles.checkNumberText}>{item.id}</Text>
              </View>
              <Text style={styles.checkQuestion}>{item.question}</Text>
            </View>

            <View style={styles.triStateRow}>
              <TouchableOpacity
                style={[styles.triBtn, item.status === 'yes' && styles.triBtnYes]}
                onPress={() => updateStatus(item.id, 'yes')}
              >
                <MaterialIcons
                  name="check-circle"
                  size={22}
                  color={item.status === 'yes' ? Colors.textWhite : Colors.textMuted}
                />
                <Text style={[styles.triBtnText, item.status === 'yes' && styles.triBtnTextActive]}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.triBtn, item.status === 'no' && styles.triBtnNo]}
                onPress={() => updateStatus(item.id, 'no')}
              >
                <MaterialIcons
                  name="cancel"
                  size={22}
                  color={item.status === 'no' ? Colors.textWhite : Colors.textMuted}
                />
                <Text style={[styles.triBtnText, item.status === 'no' && styles.triBtnTextActive]}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.triBtn, item.status === 'na' && styles.triBtnNA]}
                onPress={() => updateStatus(item.id, 'na')}
              >
                <MaterialIcons
                  name="do-not-disturb"
                  size={22}
                  color={item.status === 'na' ? Colors.textWhite : Colors.textMuted}
                />
                <Text style={[styles.triBtnText, item.status === 'na' && styles.triBtnTextActive]}>N/A</Text>
              </TouchableOpacity>
            </View>

            {/* Conditional Remark for "No" */}
            {item.status === 'no' && (
              <View style={styles.remarkSection}>
                <Text style={styles.remarkLabel}>Observation Remark</Text>
                <View style={styles.remarkInputWrap}>
                  <TextInput
                    style={styles.remarkInput}
                    placeholder="Please enter details..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    value={item.remark}
                    onChangeText={(text) => updateRemark(item.id, text)}
                  />
                  <TouchableOpacity style={styles.micBtn}>
                    <MaterialIcons name="mic" size={22} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
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

        {/* Incidents Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="warning" size={18} color={Colors.danger} />
            <Text style={[styles.sectionHeaderText, { color: Colors.danger }]}>Incidents</Text>
          </View>
          <TouchableOpacity
            style={styles.addMediaBox}
            onPress={() => navigation.navigate('ReportOccurrences')}
          >
            <MaterialIcons name="add-a-photo" size={28} color={Colors.danger} />
            <Text style={styles.addMediaTitle}>Add Incident Photo/Video</Text>
            <Text style={styles.addMediaSub}>Tap to upload multiple</Text>
          </TouchableOpacity>
        </View>

        {/* Observations Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="visibility" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeaderText}>Observations</Text>
          </View>
          <View style={styles.obsRow}>
            <TouchableOpacity style={styles.addNewBox}>
              <MaterialIcons name="add" size={24} color={Colors.primary} />
              <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.draftBtn}>
            <MaterialIcons name="save" size={18} color={Colors.primary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn}>
            <MaterialIcons name="close" size={18} color={Colors.danger} />
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.textWhite} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>

        {/* Swipe to Confirm */}
        <View style={styles.swipeBar}>
          <View style={styles.swipeHandle}>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.textWhite} />
          </View>
          <Text style={styles.swipeText}>SWIPE TO CONFIRM  »</Text>
        </View>

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
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
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
  remarkInputWrap: { position: 'relative' },
  remarkInput: {
    backgroundColor: Colors.background, borderRadius: 10, padding: 12, paddingRight: 44,
    fontSize: 14, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top',
    borderWidth: 1, borderColor: Colors.border,
  },
  micBtn: { position: 'absolute', bottom: 10, right: 10 },
  uploadRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  uploadBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  previewImage: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  sectionCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, marginBottom: 12,
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionHeaderText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  addMediaBox: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.dangerLight,
    backgroundColor: '#fff5f5', borderRadius: 12, padding: 20, alignItems: 'center', gap: 6,
  },
  addMediaTitle: { fontSize: 14, fontWeight: '700', color: Colors.danger },
  addMediaSub: { fontSize: 12, color: Colors.textMuted },
  obsRow: { flexDirection: 'row', gap: 12 },
  addNewBox: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border,
    borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center',
    width: 80,
  },
  addNewText: { fontSize: 10, fontWeight: '600', color: Colors.primary, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  draftBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 2, borderColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
  },
  draftBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  cancelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 2, borderColor: Colors.dangerLight, borderRadius: 12, paddingVertical: 14,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: Colors.danger },
  submitButton: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', elevation: 4, marginBottom: 16,
  },
  submitButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
  swipeBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#dcfce7', borderRadius: 40, padding: 6, paddingRight: 24,
  },
  swipeHandle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  swipeText: { fontSize: 14, fontWeight: '800', color: Colors.success, letterSpacing: 1 },
});
