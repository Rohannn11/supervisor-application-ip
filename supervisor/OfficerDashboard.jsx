import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../src/context/AppContext';
import GPSStatusBar from '../src/components/GPSStatusBar';
import { Colors } from '../src/theme/colors';

export default function OfficerDashboard() {
  const navigation = useNavigation();
  const { endPatrol } = useAppContext();
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Slide to SOS gesture responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx < 250) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 150) {
          // Trigger SOS
          Animated.timing(slideAnim, {
            toValue: 250,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            navigation.navigate('EmergencySOSActive');
            // reset after nav
            setTimeout(() => slideAnim.setValue(0), 500);
          });
        } else {
          // Reset
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleEndPatrol = () => {
    Alert.alert(
      "End Patrol",
      "Are you sure you want to end the current patrol shift?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "End Shift", 
          style: "destructive",
          onPress: () => {
            endPatrol();
            navigation.navigate('SupervisorDashboard');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GPSStatusBar />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Patrol</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Status Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrap}>
              <MaterialIcons name="person" size={32} color={Colors.primary} />
              <View style={styles.onlinePing} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Shift: Night Patrol</Text>
              <Text style={styles.profileId}>Sector 4 Warehouse</Text>
            </View>
            <View style={styles.hoursPill}>
              <Text style={styles.hoursText}>02:45</Text>
              <Text style={styles.hoursLabel}>hrs active</Text>
            </View>
          </View>
        </View>

        {/* SOS Slider */}
        <View style={styles.sosContainer}>
          <View style={styles.sosTrack}>
            <Text style={styles.sosTrackText}>SLIDE TO SOS  »»</Text>
            <Animated.View
              style={[styles.sosThumb, { transform: [{ translateX: slideAnim }] }]}
              {...panResponder.panHandlers}
            >
              <MaterialIcons name="local-police" size={28} color={Colors.textWhite} />
            </Animated.View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Patrol Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.gridItem}
            onPress={() => navigation.navigate('CheckpointScanScreen')}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#e0e7ff' }]}>
              <MaterialIcons name="qr-code-scanner" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.gridText}>Scan{'\n'}Checkpoint</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem}
            onPress={() => navigation.navigate('ChecklistTab')}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#fef3c7' }]}>
              <MaterialIcons name="assignment" size={28} color="#b45309" />
            </View>
            <Text style={styles.gridText}>Patrol{'\n'}Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem}
            onPress={() => navigation.navigate('ChecklistTab', { screen: 'ReportOccurrences' })}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#ffe4e6' }]}>
              <MaterialIcons name="campaign" size={28} color="#e11d48" />
            </View>
            <Text style={styles.gridText}>Report{'\n'}Incident</Text>
          </TouchableOpacity>
        </View>

        {/* Current Tasks List */}
        <View style={styles.taskListHeader}>
          <Text style={styles.sectionTitle}>Current Objectives</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskIconDone}>
            <MaterialIcons name="check" size={16} color={Colors.textWhite} />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskNameCompleted}>Main Gate Inspection</Text>
            <Text style={styles.taskTime}>Completed at 01:15 AM</Text>
          </View>
        </View>

        <View style={[styles.taskCard, styles.taskCardActive]}>
          <View style={styles.taskIconPending}>
            <MaterialIcons name="radio-button-unchecked" size={20} color={Colors.primary} />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskName}>Generator Room Check</Text>
            <Text style={styles.taskPriority}>High Priority • Pending</Text>
          </View>
          <TouchableOpacity 
            style={styles.goBtn}
            onPress={() => navigation.navigate('CheckpointScanScreen')}
          >
            <Text style={styles.goBtnText}>GO</Text>
          </TouchableOpacity>
        </View>

        {/* End Shift */}
        <TouchableOpacity style={styles.endBtn} onPress={handleEndPatrol}>
          <MaterialIcons name="stop-circle" size={20} color={Colors.danger} />
          <Text style={styles.endBtnText}>END PATROL SHIFT</Text>
        </TouchableOpacity>

      </ScrollView>
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
  container: { padding: 16 },
  profileCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  onlinePing: {
    position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.surface,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  profileId: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  hoursPill: { alignItems: 'center', backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  hoursText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  hoursLabel: { fontSize: 10, color: Colors.textMuted },
  sosContainer: { marginBottom: 24 },
  sosTrack: {
    height: 64, backgroundColor: Colors.dangerLight, borderRadius: 32,
    justifyContent: 'center', position: 'relative', overflow: 'hidden',
  },
  sosTrackText: {
    textAlign: 'center', fontSize: 16, fontWeight: '900', color: Colors.danger, letterSpacing: 2,
    opacity: 0.7,
  },
  sosThumb: {
    position: 'absolute', left: 4, width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  gridItem: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    alignItems: 'center', elevation: 1,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  gridText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', lineHeight: 16 },
  taskListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface,
    padding: 16, borderRadius: 12, marginBottom: 12, opacity: 0.7,
  },
  taskCardActive: {
    opacity: 1, elevation: 2, borderWidth: 1, borderColor: Colors.primaryLight,
  },
  taskIconDone: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  taskIconPending: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  taskInfo: { flex: 1 },
  taskNameCompleted: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary, textDecorationLine: 'line-through' },
  taskName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  taskTime: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  taskPriority: { fontSize: 12, color: Colors.danger, marginTop: 4, fontWeight: '600' },
  goBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  goBtnText: { color: Colors.textWhite, fontSize: 12, fontWeight: '800' },
  endBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 20, paddingVertical: 16, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.dangerLight, backgroundColor: '#fff5f5',
  },
  endBtnText: { color: Colors.danger, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
});
