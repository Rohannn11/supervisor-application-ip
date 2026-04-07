import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GPSStatusBar from '../src/components/GPSStatusBar';
import { Colors } from '../src/theme/colors';

export default function ActivePatrolMap() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <GPSStatusBar />

      <View style={styles.mapContainer}>
        {/* Mock Map Background */}
        <View style={styles.mapBg}>
          {/* Boundary Rectangle */}
          <View style={styles.boundaryBox}>
            <Text style={styles.boundaryLabel}>BOUNDARY LIMIT</Text>

            {/* Checkpoint: Main Gate */}
            <View style={[styles.checkpoint, { top: 30, left: 20 }]}>
              <View style={styles.checkpointDone}>
                <MaterialIcons name="check" size={16} color={Colors.textWhite} />
              </View>
              <Text style={styles.checkpointLabel}>Main Gate</Text>
            </View>

            {/* Checkpoint: Parking B */}
            <View style={[styles.checkpoint, { top: 80, right: 20 }]}>
              <View style={styles.checkpointDone}>
                <MaterialIcons name="check" size={16} color={Colors.textWhite} />
              </View>
              <Text style={styles.checkpointLabel}>Parking B</Text>
            </View>

            {/* Current Location */}
            <View style={[styles.currentLocation, { top: '45%', left: '40%' }]}>
              <View style={styles.locationPulse} />
              <View style={styles.locationDot} />
              <View style={styles.locationArrow}>
                <MaterialIcons name="navigation" size={24} color={Colors.textLight} />
              </View>
            </View>

            {/* Target Checkpoint */}
            <View style={[styles.checkpoint, { bottom: 40, left: '35%' }]}>
              <View style={styles.checkpointTarget}>
                <MaterialIcons name="location-on" size={24} color={Colors.textWhite} />
              </View>
              <Text style={[styles.checkpointLabel, { color: Colors.danger }]}>Generator Room</Text>
              <View style={styles.targetBadge}>
                <Text style={styles.targetBadgeText}>Target</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Header Overlay */}
        <View style={styles.mapOverlayHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayCircleBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Patrol Monitor</Text>

          <TouchableOpacity
            style={styles.sosHeaderBtn}
            onPress={() => navigation.navigate('EmergencySOSActive')}
          >
            <MaterialIcons name="emergency" size={16} color={Colors.textWhite} />
            <Text style={styles.sosHeaderText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlBtn}>
            <MaterialIcons name="layers" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <MaterialIcons name="my-location" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Open Checklist Card */}
        <View style={styles.checklistPrompt}>
          <View style={styles.checklistPromptIcon}>
            <MaterialIcons name="checklist" size={28} color={Colors.primary} />
          </View>
          <TouchableOpacity
            style={styles.checklistPromptContent}
            onPress={() => navigation.navigate('CheckpointScanScreen')}
          >
            <Text style={styles.checklistPromptTitle}>Open Checklist</Text>
            <Text style={styles.checklistPromptSub}>3 tasks pending nearby</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.cardHandle} />
          <View style={styles.targetInfoRow}>
            <View style={styles.targetImgPlaceholder}>
              <MaterialIcons name="warehouse" size={28} color={Colors.textSecondary} />
            </View>
            <View style={styles.targetInfoText}>
              <Text style={styles.targetName}>Generator Room <Text style={styles.targetDot}>●</Text></Text>
              <View style={styles.targetMeta}>
                <View style={styles.metaPill}>
                  <MaterialIcons name="navigation" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>45m</Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: Colors.dangerLight }]}>
                  <Text style={[styles.metaText, { color: Colors.danger }]}>Priority High</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={() => navigation.navigate('CheckpointScanScreen')}
            >
              <MaterialIcons name="send" size={22} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.textPrimary },
  mapContainer: { flex: 1, position: 'relative' },
  mapBg: {
    flex: 1, backgroundColor: '#e8e4d8',
    // Gradient-like feel for map
  },
  boundaryBox: {
    position: 'absolute', top: 100, left: 30, right: 30, bottom: 180,
    borderWidth: 2, borderColor: Colors.danger, borderStyle: 'dashed',
    borderRadius: 8, padding: 12,
  },
  boundaryLabel: {
    fontSize: 11, fontWeight: '800', color: Colors.danger, letterSpacing: 1,
  },
  checkpoint: { position: 'absolute', alignItems: 'center' },
  checkpointDone: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  checkpointTarget: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.danger,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
    borderWidth: 3, borderColor: Colors.textWhite,
  },
  checkpointLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textPrimary, marginTop: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  targetBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
    marginTop: 2,
  },
  targetBadgeText: { color: Colors.textWhite, fontSize: 9, fontWeight: '800' },
  currentLocation: { position: 'absolute', alignItems: 'center' },
  locationPulse: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0, 46, 133, 0.15)',
  },
  locationDot: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.primary,
    borderWidth: 3, borderColor: Colors.textWhite, elevation: 4, marginTop: 12,
  },
  locationArrow: { marginTop: -28 },
  mapOverlayHeader: {
    position: 'absolute', top: 12, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  overlayCircleBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  headerTitle: {
    fontSize: 18, fontWeight: '800', color: Colors.textPrimary,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    elevation: 4, overflow: 'hidden',
  },
  sosHeaderBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.danger, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, elevation: 4,
  },
  sosHeaderText: { color: Colors.textWhite, fontSize: 13, fontWeight: '900' },
  mapControls: {
    position: 'absolute', right: 16, top: 80, gap: 8,
  },
  controlBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  checklistPrompt: {
    position: 'absolute', bottom: 160, left: '15%', right: '15%',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10,
  },
  checklistPromptIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  checklistPromptContent: { flex: 1 },
  checklistPromptTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  checklistPromptSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, elevation: 10,
  },
  cardHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.borderMuted, alignSelf: 'center', marginBottom: 16 },
  targetInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  targetImgPlaceholder: {
    width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  targetInfoText: { flex: 1 },
  targetName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  targetDot: { color: Colors.danger, fontSize: 10 },
  targetMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  metaText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  navigateBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
});
