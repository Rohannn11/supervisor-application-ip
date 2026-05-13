import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Modal, ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useAuth } from '../src/context/AuthContext';
import { useAppContext } from '../src/context/AppContext';
import { app } from '../src/config/firebase';
import { Colors } from '../src/theme/colors';

export default function SupervisorLogin() {
  const { sendOTP, confirmOTP, isLoading } = useAuth();
  const { language, setLanguage, languages } = useAppContext();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const otpRefs = useRef([]);
  const recaptchaVerifier = useRef(null);

  const handlePhoneChange = (text) => {
    // Allow +, digits, spaces
    setPhoneNumber(text.replace(/[^+0-9 ]/g, ''));
  };

  const handleSendOTP = async () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed || trimmed.length < 10) {
      Alert.alert('Invalid', 'Please enter a valid phone number with country code (e.g. +91XXXXXXXXXX)');
      return;
    }
    setIsSending(true);
    const result = await sendOTP(trimmed, recaptchaVerifier.current);
    setIsSending(false);
    if (result.success) {
      setShowOTP(true);
    } else {
      Alert.alert('OTP Failed', result.error || 'Could not send OTP. Check the number and try again.');
    }
  };

  const handleOtpChange = (value, index) => {
    const clean = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);
    setOtpError('');
    if (clean && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Force first box focus when modal opens
  const handleModalOpen = () => {
    setTimeout(() => otpRefs.current[0]?.focus(), 300);
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits.');
      return;
    }
    const result = await confirmOTP(code);
    if (!result.success) {
      setOtpError(result.error || 'Invalid OTP. Try again.');
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setShowOTP(false);
    await handleSendOTP();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Firebase reCAPTCHA — required for Phone Auth on mobile */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />

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
            <Text style={styles.sectionLabel}>PHONE NUMBER</Text>
            <View style={styles.inputGroup}>
              <MaterialIcons name="phone" size={22} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor={Colors.textMuted}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, (isSending || isLoading) && { opacity: 0.7 }]}
              onPress={handleSendOTP}
              disabled={isSending || isLoading}
            >
              {isSending || isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Send OTP</Text>
                  <MaterialIcons name="sms" size={20} color={Colors.textWhite} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>via Firebase Phone Auth</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={16} color={Colors.primary} />
              <Text style={styles.infoText}>
                A one-time password will be sent to your registered mobile number via SMS.
              </Text>
            </View>
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
          <Text style={styles.footerTextBold}>SECURED BY FIREBASE</Text>
        </View>
        <Text style={styles.footerText}>© 2024 PatrolGuard Systems</Text>
      </View>

      {/* OTP Verification Modal */}
      <Modal visible={showOTP} transparent animationType="slide" onShow={handleModalOpen}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowOTP(false)}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <MaterialIcons name="sms" size={48} color={Colors.primary} />
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              6-digit code sent to {phoneNumber}
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                    otpError ? styles.otpInputError : null,
                  ]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  // Prevent tapping later boxes before filling earlier ones
                  editable={index === 0 || otp[index - 1] !== ''}
                />
              ))}
            </View>

            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>Verify & Login</Text>
                  <MaterialIcons name="login" size={20} color={Colors.textWhite} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
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
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1.5,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 12, height: 56, paddingHorizontal: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 18, color: Colors.textPrimary, letterSpacing: 1 },
  loginButton: {
    flexDirection: 'row', height: 56, backgroundColor: Colors.primary, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20,
    elevation: 4, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderLight },
  dividerText: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.primaryLight, padding: 12, borderRadius: 10,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.primary, lineHeight: 18 },
  languageSection: { marginTop: 40, alignItems: 'center' },
  languageTitle: { fontSize: 12, fontWeight: 'bold', color: 'rgba(68,70,82,0.6)', letterSpacing: 2, marginBottom: 16 },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 32, alignItems: 'center',
  },
  modalClose: { position: 'absolute', top: 16, right: 16, padding: 8 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginTop: 16 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  otpInput: {
    width: 48, height: 56, borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
    textAlign: 'center', fontSize: 24, fontWeight: '700', color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  otpInputFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  otpInputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  verifyButton: {
    flexDirection: 'row', width: '100%', height: 56, backgroundColor: Colors.primary,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 4, marginBottom: 12,
  },
  verifyButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: 'bold' },
  resendBtn: { paddingVertical: 12 },
  resendText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
});
