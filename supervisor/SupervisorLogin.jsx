import React, { useState, useRef, useCallback } from 'react';
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

// Backend URL – same as the rest of the app
const API_BASE = 'http://192.168.1.6:3000';

export default function SupervisorLogin() {
  const { sendOTP, confirmOTP, isLoading } = useAuth();
  const { language, setLanguage, languages } = useAppContext();

  const [employeeId, setEmployeeId] = useState('');
  const [resolvedPhone, setResolvedPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');   // single string, max 6 chars
  const [otpError, setOtpError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const hiddenInputRef = useRef(null);
  const recaptchaVerifier = useRef(null);

  // ── Step 1: resolve employee ID → phone number from backend ──────────────
  const handleSendOTP = useCallback(async () => {
    const trimmed = employeeId.trim().toUpperCase();
    if (!trimmed) {
      Alert.alert('Required', 'Please enter your Employee ID.');
      return;
    }
    setIsSending(true);
    try {
      // Ask backend for the phone number linked to this employee ID
      let phone = null;
      try {
        const res = await fetch(`${API_BASE}/api/auth/resolve-employee`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId: trimmed }),
        });
        const data = await res.json();
        if (res.ok && data.phone) {
          phone = data.phone; // e.g. "+919876543210"
        }
      } catch (netErr) {
        console.warn('[Login] Backend unavailable, using hardcoded test map for POC.');
      }

      // ── POC FALLBACK: if backend is down, use test numbers ───────────────
      if (!phone) {
        const testMap = { 'RJ123': '+919999999999' }; // matches Firebase test number
        phone = testMap[trimmed] || null;
      }

      if (!phone) {
        Alert.alert('Not Found', `Employee ID "${trimmed}" is not registered. Please contact your admin.`);
        setIsSending(false);
        return;
      }

      setResolvedPhone(phone);
      const result = await sendOTP(phone, recaptchaVerifier.current);
      if (result.success) {
        setOtpValue('');
        setOtpError('');
        setShowOTP(true);
      } else {
        Alert.alert('OTP Failed', result.error || 'Could not send OTP. Try again.');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
      setIsSending(false);
    }
  }, [employeeId, sendOTP]);

  // ── OTP input: single hidden TextInput drives 6 display boxes ───────────
  const handleOtpChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
    setOtpValue(clean);
    setOtpError('');
  };

  const focusHidden = () => hiddenInputRef.current?.focus();

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter all 6 digits.');
      return;
    }
    const result = await confirmOTP(otpValue);
    if (!result.success) {
      setOtpError(result.error || 'Invalid OTP. Try again.');
    }
  };

  const handleResend = async () => {
    setShowOTP(false);
    setOtpValue('');
    setOtpError('');
    await handleSendOTP();
  };

  // ── OTP display boxes ────────────────────────────────────────────────────
  const OtpBoxes = () => (
    <TouchableOpacity style={styles.otpRow} onPress={focusHidden} activeOpacity={1}>
      {Array.from({ length: 6 }).map((_, i) => {
        const char = otpValue[i] || '';
        const isCurrent = i === otpValue.length && otpValue.length < 6;
        return (
          <View
            key={i}
            style={[
              styles.otpBox,
              char ? styles.otpBoxFilled : null,
              isCurrent ? styles.otpBoxActive : null,
              otpError ? styles.otpBoxError : null,
            ]}
          >
            <Text style={styles.otpBoxText}>{char}</Text>
            {isCurrent && <View style={styles.otpCursor} />}
          </View>
        );
      })}
      {/* Hidden input that captures all keystrokes */}
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        value={otpValue}
        onChangeText={handleOtpChange}
        keyboardType="number-pad"
        maxLength={6}
        caretHidden
        autoFocus={false}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Firebase reCAPTCHA – required for Phone Auth */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />

      {/* Header */}
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

          {/* Brand */}
          <View style={styles.brandSection}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="admin-panel-settings" size={40} color={Colors.textWhite} />
            </View>
            <Text style={styles.title}>PatrolGuard</Text>
            <Text style={styles.subtitle}>Authorized Access Only</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionLabel}>EMPLOYEE ID</Text>
            <View style={styles.inputGroup}>
              <MaterialIcons name="badge" size={22} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. RJ123"
                placeholderTextColor={Colors.textMuted}
                value={employeeId}
                onChangeText={t => setEmployeeId(t.replace(/[^a-zA-Z0-9]/g, ''))}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleSendOTP}
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
                Enter your Employee ID. An OTP will be sent to your registered mobile number.
              </Text>
            </View>
          </View>

          {/* Language selector */}
          <View style={styles.languageSection}>
            <Text style={styles.languageTitle}>SELECT LANGUAGE</Text>
            <View style={styles.languageOptions}>
              {languages.map(lang => {
                const isActive = language === lang.code;
                return (
                  <TouchableOpacity key={lang.code} style={styles.languageOption} onPress={() => setLanguage(lang.code)}>
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

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerBadge}>
          <MaterialIcons name="verified-user" size={14} color={Colors.textSecondary} />
          <Text style={styles.footerTextBold}>SECURED BY FIREBASE</Text>
        </View>
        <Text style={styles.footerText}>© 2024 PatrolGuard Systems</Text>
      </View>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOTP}
        transparent
        animationType="slide"
        onShow={() => setTimeout(() => hiddenInputRef.current?.focus(), 350)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowOTP(false)}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <MaterialIcons name="sms" size={48} color={Colors.primary} />
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              6-digit code sent to{'\n'}{resolvedPhone}
            </Text>

            <OtpBoxes />

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
    fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1.5, marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 12, height: 56, paddingHorizontal: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 18, color: Colors.textPrimary, letterSpacing: 2 },
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
  langCircle: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.borderMuted,
    justifyContent: 'center', alignItems: 'center', opacity: 0.6,
  },
  langCircleActive: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', opacity: 1,
  },
  langCode: { fontWeight: 'bold', color: Colors.textSecondary },
  langCodeActive: { fontWeight: 'bold', color: Colors.primary },
  langName: { fontSize: 10, fontWeight: 'bold', color: Colors.textSecondary, marginTop: 4, opacity: 0.6 },
  langNameActive: { fontSize: 10, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
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
  modalSubtitle: {
    fontSize: 14, color: Colors.textSecondary, textAlign: 'center',
    marginTop: 8, marginBottom: 24, lineHeight: 22,
  },
  // OTP boxes (driven by single hidden input)
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  otpBox: {
    width: 46, height: 56, borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  otpBoxActive: { borderColor: Colors.primary, borderWidth: 2.5 },
  otpBoxError: { borderColor: Colors.danger },
  otpBoxText: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  otpCursor: {
    position: 'absolute', bottom: 10, width: 2, height: 22,
    backgroundColor: Colors.primary, borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute', opacity: 0, width: 1, height: 1,
  },
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
