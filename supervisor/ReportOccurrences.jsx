import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../src/theme/colors';

export default function ReportOccurrences() {
  const navigation = useNavigation();
  const [occurrences, setOccurrences] = useState([
    { id: 1042, time: '10:45 AM', description: '', evidence: [] },
    { id: 1043, time: '11:12 AM', description: 'Broken fence near the north gate. Requires immediate maintenance.', evidence: ['photo1', 'video1'] },
  ]);

  const addOccurrence = () => {
    const newId = Math.max(...occurrences.map(o => o.id)) + 1;
    setOccurrences([
      ...occurrences,
      {
        id: newId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: '',
        evidence: [],
      },
    ]);
  };

  const updateDescription = (id, text) => {
    setOccurrences(occurrences.map(o => o.id === id ? { ...o, description: text } : o));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sequential Reporting</Text>
        <TouchableOpacity style={styles.sosHeaderBtn}>
          <MaterialIcons name="emergency" size={14} color={Colors.textWhite} />
          <Text style={styles.sosHeaderText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Site Info */}
        <View style={styles.siteInfo}>
          <Text style={styles.siteTitle}>Patrol Checkpoints</Text>
          <Text style={styles.siteSub}>Reviewing occurrences for Sector 4, Bangalore North.</Text>
        </View>

        {/* Occurrences */}
        {occurrences.map((occurrence, index) => (
          <View key={occurrence.id} style={styles.occurrenceCard}>
            <View style={styles.occurrenceHeader}>
              <View style={styles.occurrenceBadge}>
                <Text style={styles.occurrenceBadgeText}>Occurrence {index + 1}</Text>
              </View>
              <View style={styles.occurrenceIdRow}>
                <MaterialIcons name="tag" size={14} color={Colors.textMuted} />
                <Text style={styles.occurrenceId}>#{occurrence.id}</Text>
              </View>
            </View>
            <Text style={styles.loggedTime}>Logged at: {occurrence.time}</Text>

            {/* Description */}
            <View style={styles.descSection}>
              <View style={styles.descHeader}>
                <MaterialIcons name="description" size={16} color={Colors.primary} />
                <Text style={styles.descLabel}>Describe what you see</Text>
              </View>
              <View style={styles.descInputWrap}>
                <TextInput
                  style={styles.descInput}
                  placeholder="Type here or tap mic to record..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  value={occurrence.description}
                  onChangeText={(text) => updateDescription(occurrence.id, text)}
                />
                <TouchableOpacity style={styles.micFloating}>
                  <MaterialIcons name="mic" size={22} color={Colors.textWhite} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Evidence */}
            <View style={styles.evidenceSection}>
              <View style={styles.descHeader}>
                <MaterialIcons name="image" size={16} color={Colors.primary} />
                <Text style={styles.descLabel}>
                  {occurrence.evidence.length > 0
                    ? `Evidence Attached (${occurrence.evidence.length})`
                    : 'Add Evidence (Photo/Video)'}
                </Text>
              </View>

              {occurrence.evidence.length > 0 ? (
                <View style={styles.evidenceGrid}>
                  {occurrence.evidence.map((ev, i) => (
                    <View key={i} style={styles.evidenceThumb}>
                      <MaterialIcons name={ev.includes('video') ? 'videocam' : 'image'} size={24} color={Colors.textMuted} />
                      <TouchableOpacity style={styles.removeEvidence}>
                        <MaterialIcons name="close" size={14} color={Colors.textWhite} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addMoreEvidence}>
                    <MaterialIcons name="add-a-photo" size={20} color={Colors.textMuted} />
                    <Text style={styles.addMoreText}>Add More</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mediaRow}>
                  <TouchableOpacity style={styles.mediaBtn}>
                    <View style={[styles.mediaBtnIcon, { backgroundColor: '#dbeafe' }]}>
                      <MaterialIcons name="photo-camera" size={24} color={Colors.primary} />
                    </View>
                    <Text style={styles.mediaBtnText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.mediaBtn}>
                    <View style={[styles.mediaBtnIcon, { backgroundColor: '#dbeafe' }]}>
                      <MaterialIcons name="videocam" size={24} color={Colors.primary} />
                    </View>
                    <Text style={styles.mediaBtnText}>Record Video</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Add New Occurrence */}
        <TouchableOpacity style={styles.addOccurrenceBtn} onPress={addOccurrence}>
          <MaterialIcons name="add" size={22} color={Colors.textWhite} />
          <Text style={styles.addOccurrenceText}>Add New Occurrence</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => navigation.navigate('ReportSubmissionSuccess')}
        >
          <Text style={styles.submitBtnText}>Submit All Occurrences</Text>
          <MaterialIcons name="check-circle" size={20} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
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
  sosHeaderBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.danger, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
  },
  sosHeaderText: { color: Colors.textWhite, fontSize: 11, fontWeight: '900' },
  container: { padding: 16 },
  siteInfo: { marginBottom: 20 },
  siteTitle: { fontSize: 24, fontWeight: '900', color: Colors.primary },
  siteSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  occurrenceCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, marginBottom: 16,
    elevation: 2, borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  occurrenceHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  occurrenceBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8,
  },
  occurrenceBadgeText: { color: Colors.textWhite, fontSize: 12, fontWeight: '800' },
  occurrenceIdRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  occurrenceId: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  loggedTime: { fontSize: 12, color: Colors.textMuted, marginBottom: 16 },
  descSection: { marginBottom: 16 },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  descLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  descInputWrap: { position: 'relative' },
  descInput: {
    backgroundColor: Colors.background, borderRadius: 12, padding: 14, paddingRight: 50,
    fontSize: 14, color: Colors.textPrimary, minHeight: 100, textAlignVertical: 'top',
    borderWidth: 1, borderColor: Colors.border,
  },
  micFloating: {
    position: 'absolute', bottom: 12, right: 12,
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  evidenceSection: {},
  evidenceGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  evidenceThumb: {
    width: 80, height: 80, borderRadius: 12, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
    borderWidth: 1, borderColor: Colors.border,
  },
  removeEvidence: {
    position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center',
  },
  addMoreEvidence: {
    width: 80, height: 80, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.borderMuted,
  },
  addMoreText: { fontSize: 9, color: Colors.textMuted, fontWeight: '600', marginTop: 4 },
  mediaRow: { flexDirection: 'row', gap: 12 },
  mediaBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18,
    backgroundColor: Colors.background, borderRadius: 14, borderWidth: 2,
    borderStyle: 'dashed', borderColor: Colors.border, gap: 8,
  },
  mediaBtnIcon: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  mediaBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  addOccurrenceBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.success, borderRadius: 14, paddingVertical: 16, elevation: 3,
  },
  addOccurrenceText: { color: Colors.textWhite, fontSize: 16, fontWeight: '700' },
  footer: {
    padding: 16, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 56,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2,
  },
  submitBtnText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
});
