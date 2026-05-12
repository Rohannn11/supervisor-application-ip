import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { useAppContext } from '../src/context/AppContext';
import { Colors } from '../src/theme/colors';

export default function SupervisorLogin() {
  const { login, isLoading } = useAuth();
  const { language, setLanguage, languages } = useAppContext();
  const [employeeId, setEmployeeId] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required for liveness check');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
      setPhotoTaken(true);
    }
  };

  const handleContinueWithOTP = () => {
    if (!employeeId.trim()) {
      alert("Please enter Employee ID or Mobile number");
      return;
    }
    setShowOTP(true);
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    await login(employeeId, fullOtp);
  };

  const handleEmployeeIdChange = (text) => {
    // Strip special characters
    setEmployeeId(text.replace(/[^a-zA-Z0-9]/g, ''));
  };

  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    if (cleanValue && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>PatrolGuard</Text>
        </View>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => {
            const idx = languages.findIndex(l => l.code === language);
            setLanguage(languages[(idx + 1) % languages.length].code);
          }}
        >
          <Text style={styles.langBtnText}>EN/HI/MR</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="admin-panel-settings" size={40} color={Colors.textWhite} />
          </View>
          <Text style={styles.title}>PatrolGuard</Text>
          <Text style={styles.subtitle}>Authorized Access Only</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Identity Details</Text>
            <View style={styles.inputGroup}>
              <MaterialIcons name="badge" size={24} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Employee ID or Mobile (Alphanumeric)"
                placeholderTextColor={Colors.textMuted}
                value={employeeId}
                onChangeText={handleEmployeeIdChange}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.livenessButton, photoTaken && styles.livenessButtonDone]}
            onPress={takeSelfie}
          >
            {!photoTaken && (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>REQUIRED</Text>
              </View>
            )}
            {photoTaken ? (
              <>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 8 }} />
                ) : (
                  <MaterialIcons name="check-circle" size={40} color={Colors.success} />
                )}
                <Text style={[styles.livenessTitle, { color: Colors.success }]}>Photo Captured</Text>
                <Text style={styles.livenessSubtitle}>Tap to retake</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="photo-camera" size={36} color={Colors.primary} />
                <Text style={styles.livenessTitle}>Snap Live Photo</Text>
                <Text style={styles.livenessSubtitle}>Liveness check required for security protocols</Text>
              </>
            )}
          </TouchableOpacity>

          {photoTaken ? (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                if (!employeeId.trim()) {
                  alert("Please enter Employee ID or Mobile number");
                  return;
                }
                login(employeeId, '');
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Authenticate with Photo</Text>
                  <MaterialIcons name="verified-user" size={20} color={Colors.textWhite} />
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.primary }]}
              onPress={handleContinueWithOTP}
            >
              <Text style={[styles.loginButtonText, { color: Colors.primary }]}>Login via OTP</Text>
              <MaterialIcons name="sms" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.voiceHint}>
            <MaterialIcons name="mic" size={24} color={Colors.primary} />
            <Text style={styles.voiceHintText}>Tap to speak instructions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>SELECT LANGUAGE</Text>
          <View style={styles.languageOptions}>
            {languages.map(lang => {
              const isActive = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageOption}
                  onPress={() => setLanguage(lang.code)}
                >
                  <View style={[styles.langCircle, isActive && styles.langCircleActive]}>
                    <Text style={[styles.langCode, isActive && styles.langCodeActive]}>{lang.code}</Text>
                  </View>
                  <Text style={[styles.langName, isActive && styles.langNameActive]}>{lang.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <View style={styles.footerBadge}>
          <MaterialIcons name="verified-user" size={14} color={Colors.textSecondary} />
          <Text style={styles.footerTextBold}>SECURED BY SENTINEL OS</Text>
        </View>
        <Text style={styles.footerText}>© 2024 PatrolGuard Systems</Text>
      </View>

      {/* OTP Modal */}
      <Modal visible={showOTP} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowOTP(false)}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <MaterialIcons name="sms" size={48} color={Colors.primary} />
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>A 6-digit code has been sent to your registered mobile number</Text>

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>Verify & Login</Text>
                  <MaterialIcons name="login" size={20} color={Colors.textWhite} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginLeft: 8 },
  langBtn: {
    borderWidth: 2, borderColor: Colors.borderMuted, borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  langBtnText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
  container: { padding: 24, alignItems: 'center' },
  brandSection: { alignItems: 'center', marginBottom: 36, marginTop: 16 },
  iconContainer: {
    width: 80, height: 80, backgroundColor: Colors.primary, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    elevation: 8, shadowColor: Colors.primary, shadowOpacity: 0.2, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  formContainer: {
    width: '100%', backgroundColor: Colors.surface, padding: 24, borderRadius: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  inputWrapper: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8, paddingHorizontal: 4 },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 12, height: 56, paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 16, color: Colors.textPrimary },
  livenessButton: {
    width: '100%', height: 160, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    backgroundColor: Colors.surface, position: 'relative',
  },
  livenessButtonDone: { borderColor: Colors.success, borderStyle: 'solid', backgroundColor: '#f0fdf4' },
  requiredBadge: {
    position: 'absolute', top: 8, right: 8, backgroundColor: Colors.danger,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  requiredText: { color: Colors.textWhite, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  livenessTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginTop: 8 },
  livenessSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, textAlign: 'center', paddingHorizontal: 16 },
  loginButton: {
    flexDirection: 'row', height: 56, backgroundColor: Colors.primary, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16,
    elevation: 4, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
  voiceHint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    paddingVertical: 12, backgroundColor: '#e8e7ef', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  voiceHintText: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  languageSection: { marginTop: 40, alignItems: 'center' },
  languageTitle: { fontSize: 12, fontWeight: 'bold', color: 'rgba(68, 70, 82, 0.6)', letterSpacing: 2, marginBottom: 16 },
  languageOptions: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
  languageOption: { alignItems: 'center', gap: 4 },
  langCircleActive: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  langCircle: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.borderMuted,
    justifyContent: 'center', alignItems: 'center', opacity: 0.6,
  },
  langCodeActive: { fontWeight: 'bold', color: Colors.primary },
  langCode: { fontWeight: 'bold', color: Colors.textSecondary },
  langNameActive: { fontSize: 10, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  langName: { fontSize: 10, fontWeight: 'bold', color: Colors.textSecondary, marginTop: 4, opacity: 0.6 },
  footer: { padding: 24, alignItems: 'center', gap: 4 },
  footerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.4 },
  footerTextBold: { fontSize: 10, fontWeight: '600', letterSpacing: 1, color: Colors.textSecondary },
  footerText: { fontSize: 10, color: Colors.textSecondary, opacity: 0.4 },
  // OTP Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 32, alignItems: 'center',
  },
  modalClose: { position: 'absolute', top: 16, right: 16, padding: 8 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginTop: 16 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpInput: {
    width: 48, height: 56, borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
    textAlign: 'center', fontSize: 24, fontWeight: '700', color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  otpInputFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  verifyButton: {
    flexDirection: 'row', width: '100%', height: 56, backgroundColor: Colors.primary,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 4, marginBottom: 16,
  },
  verifyButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
  resendBtn: { paddingVertical: 12 },
  resendText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
});
