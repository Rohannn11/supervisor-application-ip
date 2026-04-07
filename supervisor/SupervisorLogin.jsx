import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SupervisorLogin() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#002e85" />
          <Text style={styles.headerTitle}>PatrolGuard</Text>
        </View>
        <Text style={styles.headerRight}>EN/HI</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="admin-panel-settings" size={40} color="#ffffff" />
          </View>
          <Text style={styles.title}>Supervisor Portal</Text>
          <Text style={styles.subtitle}>Vigilant access for secure operations</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Identity Details</Text>
            <View style={styles.inputGroup}>
              <MaterialIcons name="badge" size={24} color="#444652" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Employee ID or Mobile"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.livenessButton}>
            <MaterialIcons name="photo-camera" size={32} color="#002e85" />
            <Text style={styles.livenessTitle}>Snap Live Photo</Text>
            <Text style={styles.livenessSubtitle}>Liveness check required</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('SupervisorDashboard')}
          >
            <Text style={styles.loginButtonText}>Continue with OTP</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.voiceHint}>
            <MaterialIcons name="mic" size={24} color="#002e85" />
            <Text style={styles.voiceHintText}>Tap to speak instructions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>SELECT LANGUAGE</Text>
          <View style={styles.languageOptions}>
            <View style={styles.languageOption}>
              <View style={[styles.langCircle, styles.langCircleActive]}>
                <Text style={styles.langCodeActive}>EN</Text>
              </View>
              <Text style={styles.langNameActive}>English</Text>
            </View>
            <View style={styles.languageOption}>
              <View style={styles.langCircle}>
                <Text style={styles.langCode}>HI</Text>
              </View>
              <Text style={styles.langName}>हिन्दी</Text>
            </View>
            <View style={styles.languageOption}>
              <View style={styles.langCircle}>
                <Text style={styles.langCode}>MR</Text>
              </View>
              <Text style={styles.langName}>मराठी</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerBadge}>
          <MaterialIcons name="verified-user" size={14} color="#444652" />
          <Text style={styles.footerTextBold}>SECURED BY SENTINEL OS</Text>
        </View>
        <Text style={styles.footerText}>© 2024 PatrolGuard Systems</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002e85',
    marginLeft: 8,
  },
  headerRight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002e85',
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#002e85',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#002e85',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f1623',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#444652',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444652',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0f1623',
  },
  livenessButton: {
    width: '100%',
    height: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  livenessTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002e85',
    marginTop: 8,
  },
  livenessSubtitle: {
    fontSize: 12,
    color: '#444652',
    marginTop: 4,
  },
  loginButton: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#002e85',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#002e85',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    backgroundColor: '#e8e7ef',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  voiceHintText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f1623',
  },
  languageSection: {
    marginTop: 48,
    alignItems: 'center',
  },
  languageTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(68, 70, 82, 0.6)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 24,
  },
  languageOption: {
    alignItems: 'center',
    gap: 4,
  },
  langCircleActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#002e85',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  langCodeActive: {
    fontWeight: 'bold',
    color: '#002e85',
  },
  langCode: {
    fontWeight: 'bold',
    color: '#444652',
  },
  langNameActive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#002e85',
    marginTop: 4,
  },
  langName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444652',
    marginTop: 4,
    opacity: 0.6,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.4,
  },
  footerTextBold: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#444652',
  },
  footerText: {
    fontSize: 10,
    color: '#444652',
    opacity: 0.4,
  }
});
