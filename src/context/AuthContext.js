import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../config/firebase';
import { signInWithPhoneNumber, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get extended profile from Firestore
        try {
          const profileRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(profileRef);
          if (snap.exists()) {
            setUser({ uid: firebaseUser.uid, phone: firebaseUser.phoneNumber, ...snap.data() });
          } else {
            // Create a default profile on first login
            const defaultProfile = {
              uid: firebaseUser.uid,
              phone: firebaseUser.phoneNumber,
              name: 'Supervisor',
              role: 'Supervisor',
              site: 'Tech Park',
              shift: '08:00 AM - 04:00 PM',
              createdAt: serverTimestamp(),
            };
            await setDoc(profileRef, defaultProfile);
            setUser(defaultProfile);
          }
        } catch (e) {
          // Firestore offline fallback
          setUser({
            uid: firebaseUser.uid,
            phone: firebaseUser.phoneNumber,
            name: 'Supervisor',
            role: 'Supervisor',
            site: 'Tech Park',
            shift: '08:00 AM - 04:00 PM',
          });
        }
      } else {
        // No Firebase session — check legacy mock session in storage
        const stored = await AsyncStorage.getItem('user_session');
        setUser(stored ? JSON.parse(stored) : null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Step 1: Send OTP to phone number via Firebase
  const sendOTP = useCallback(async (phoneNumber, recaptchaVerifier) => {
    setIsLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('[Firebase] sendOTP error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  // Step 2: Confirm OTP code
  const confirmOTP = useCallback(async (otpCode) => {
    if (!confirmationResult) return { success: false, error: 'No pending OTP session.' };
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      // onAuthStateChanged will fire and set user automatically
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('[Firebase] confirmOTP error:', error);
      setIsLoading(false);
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
  }, [confirmationResult]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
    } catch (e) {
      console.error('[Firebase] logout error:', e);
    }
    await AsyncStorage.removeItem('user_session');
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isLoggedIn: !!user,
      sendOTP,
      confirmOTP,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
