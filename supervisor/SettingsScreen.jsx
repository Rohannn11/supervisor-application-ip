import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../src/context/AppContext';
import { useTheme } from '../src/theme/useTheme';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { isDarkMode, setIsDarkMode, notifications, setNotifications, locationTracking, setLocationTracking } = useAppContext();
  const C = useTheme();

  const styles = makeStyles(C);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="dark-mode" size={24} color={C.textSecondary} style={styles.icon} />
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingSub}>Switch to dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: C.borderLight, true: C.primaryLight }}
              thumbColor={isDarkMode ? C.primary : C.border}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications-active" size={24} color={C.textSecondary} style={styles.icon} />
              <View>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingSub}>Receive alerts and updates</Text>
              </View>
            </View>
            <Switch
              value={!!notifications}
              onValueChange={val => setNotifications?.(val)}
              trackColor={{ false: C.borderLight, true: C.primaryLight }}
              thumbColor={notifications ? C.primary : C.border}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="location-on" size={24} color={C.textSecondary} style={styles.icon} />
              <View>
                <Text style={styles.settingLabel}>Location Tracking</Text>
                <Text style={styles.settingSub}>Required for patrol verification</Text>
              </View>
            </View>
            <Switch
              value={!!locationTracking}
              onValueChange={val => setLocationTracking?.(val)}
              trackColor={{ false: C.borderLight, true: C.primaryLight }}
              thumbColor={locationTracking ? C.primary : C.border}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="camera-alt" size={24} color={C.textSecondary} style={styles.icon} />
              <Text style={styles.settingLabel}>Camera Access</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="info-outline" size={24} color={C.textSecondary} style={styles.icon} />
              <Text style={styles.settingLabel}>App Version 1.0.0-POC</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56, backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  container: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: C.textMuted, marginBottom: 8, marginTop: 16, textTransform: 'uppercase' },
  card: { backgroundColor: C.surface, borderRadius: 16, overflow: 'hidden', elevation: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { marginRight: 16 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: C.textPrimary },
  settingSub: { fontSize: 13, color: C.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: C.borderLight, marginLeft: 56 },
});
