import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Colors } from '../src/theme/colors';
import { usePatrol } from '../src/context/PatrolContext';

export default function ReportOccurrences() {
  const navigation = useNavigation();
  const route = useRoute();
  const { spotId, spotName, globalOccurrenceStart = 1 } = route.params || {};
  const { markSpotDone } = usePatrol();

  // Occurrences start at globalOccurrenceStart for this spot
  const [occurrences, setOccurrences] = useState([
    {
      localIndex: 1,
      globalIndex: globalOccurrenceStart,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: '',
      evidence: [],
    },
  ]);

  const addOccurrence = () => {
    const nextLocal = occurrences.length + 1;
    const nextGlobal = globalOccurrenceStart + occurrences.length;
    setOccurrences(prev => [
      ...prev,
      {
        localIndex: nextLocal,
        globalIndex: nextGlobal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: '',
        evidence: [],
      },
    ]);
  };

  const updateDescription = (localIndex, text) => {
    setOccurrences(prev => prev.map(o => o.localIndex === localIndex ? { ...o, description: text } : o));
  };

  const handleAddMedia = async (localIndex, useCamera = false) => {
    try {
      const permRes = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permRes.status !== 'granted') {
        Alert.alert('Permission Required', `Please allow ${useCamera ? 'camera' : 'media library'} access.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images', 'videos'], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 0.8 });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        let finalUri = asset.uri;
        if (asset.type === 'image') {
          const m = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1080 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          finalUri = m.uri;
        }
        setOccurrences(prev => prev.map(o =>
          o.localIndex === localIndex ? { ...o, evidence: [...o.evidence, finalUri] } : o
        ));
      }
    } catch (e) {
      console.error('Media error:', e);
    }
  };

  const removeEvidence = (localIndex, evIdx) => {
    setOccurrences(prev => prev.map(o => {
      if (o.localIndex !== localIndex) return o;
      const ev = [...o.evidence];
      ev.splice(evIdx, 1);
      return { ...o, evidence: ev };
    }));
  };

  const handleSubmit = () => {
    const invalid = occurrences.find(o => !o.description.trim() && o.evidence.length === 0);
    if (invalid) {
      Alert.alert(
        'Incomplete',
        `Occurrence ${invalid.globalIndex} needs either a description or at least one photo.`
      );
      return;
    }
    // Mark spot done and go back to ChecklistHub
    if (spotId) markSpotDone(spotId);
    navigation.navigate('ChecklistHub');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Occurrences</Text>
          {spotName ? <Text style={styles.headerSub}>{spotName}</Text> : null}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.siteInfo}>
            <Text style={styles.siteTitle}>Occurrence Report</Text>
            <Text style={styles.siteSub}>
              Document anything unusual observed at {spotName || 'this spot'}.
            </Text>
          </View>

          {occurrences.map((occ) => (
            <View key={occ.localIndex} style={styles.occurrenceCard}>
              <View style={styles.occurrenceHeader}>
                <View style={styles.occurrenceBadge}>
                  <Text style={styles.occurrenceBadgeText}>Occurrence {occ.globalIndex}</Text>
                </View>
                <Text style={styles.loggedTime}>at {occ.time}</Text>
              </View>

              {/* Description */}
              <View style={styles.descSection}>
                <View style={styles.descHeader}>
                  <MaterialIcons name="description" size={16} color={Colors.primary} />
                  <Text style={styles.descLabel}>Describe what you observed</Text>
                </View>
                <View style={styles.descInputWrap}>
                  <TextInput
                    style={styles.descInput}
                    placeholder="Type here..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    value={occ.description}
                    onChangeText={(t) => updateDescription(occ.localIndex, t)}
                  />
                </View>
              </View>

              {/* Evidence */}
              <View style={styles.evidenceSection}>
                <View style={styles.descHeader}>
                  <MaterialIcons name="image" size={16} color={Colors.primary} />
                  <Text style={styles.descLabel}>
                    {occ.evidence.length > 0
                      ? `Evidence Attached (${occ.evidence.length})`
                      : 'Add Evidence'}
                  </Text>
                </View>

                {occ.evidence.length > 0 ? (
                  <View style={styles.evidenceGrid}>
                    {occ.evidence.map((ev, i) => (
                      <View key={i} style={styles.evidenceThumb}>
                        <Image source={{ uri: ev }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                        <TouchableOpacity style={styles.removeEvidence} onPress={() => removeEvidence(occ.localIndex, i)}>
                          <MaterialIcons name="close" size={14} color={Colors.textWhite} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity style={styles.addMoreEvidence} onPress={() => handleAddMedia(occ.localIndex, false)}>
                      <MaterialIcons name="add-a-photo" size={20} color={Colors.textMuted} />
                      <Text style={styles.addMoreText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.mediaRow}>
                    <TouchableOpacity style={styles.mediaBtn} onPress={() => handleAddMedia(occ.localIndex, true)}>
                      <View style={styles.mediaBtnIcon}>
                        <MaterialIcons name="photo-camera" size={24} color={Colors.primary} />
                      </View>
                      <Text style={styles.mediaBtnText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaBtn} onPress={() => handleAddMedia(occ.localIndex, false)}>
                      <View style={styles.mediaBtnIcon}>
                        <MaterialIcons name="image" size={24} color={Colors.primary} />
                      </View>
                      <Text style={styles.mediaBtnText}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addOccurrenceBtn} onPress={addOccurrence}>
            <MaterialIcons name="add" size={22} color={Colors.textWhite} />
            <Text style={styles.addOccurrenceText}>Add Another Occurrence</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Spot Report</Text>
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
  headerSub: { fontSize: 12, color: Colors.textSecondary },
  backBtn: { padding: 4 },
  container: { padding: 16 },
  siteInfo: { marginBottom: 20 },
  siteTitle: { fontSize: 22, fontWeight: '900', color: Colors.primary },
  siteSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  occurrenceCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, marginBottom: 16,
    elevation: 2, borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  occurrenceHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  occurrenceBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8,
  },
  occurrenceBadgeText: { color: Colors.textWhite, fontSize: 12, fontWeight: '800' },
  loggedTime: { fontSize: 12, color: Colors.textMuted },
  descSection: { marginBottom: 16 },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  descLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  descInputWrap: {},
  descInput: {
    backgroundColor: Colors.background, borderRadius: 12, padding: 14,
    fontSize: 14, color: Colors.textPrimary, minHeight: 90, textAlignVertical: 'top',
    borderWidth: 1, borderColor: Colors.border,
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
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbeafe',
    alignItems: 'center', justifyContent: 'center',
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
