import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { signInWithPhoneNumber, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase Auth is successful.
        // We no longer use Firestore for the user profile.
        // In a full implementation, you would fetch the user profile from your MySQL backend here:
        // const token = await firebaseUser.getIdToken();
        // const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
        // const profile = await res.json();
        
        // For the POC, we construct a default profile object natively.
        const userProfile = {
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          name: 'Supervisor',
          role: 'Supervisor',
          site: 'Tech Park',
          shift: '08:00 AM - 04:00 PM',
        };
        setUser(userProfile);
      } else {
        // No Firebase session — check legacy mock session in storage
        const stored = await AsyncStorage.getItem('user_session');
        setUser(stored ? JSON.parse(stored) : null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Step 1: Real Firebase Phone Auth with POC Fallback
  const sendOTP = useCallback(async (phoneNumber, recaptchaVerifier) => {
    setIsLoading(true);

    const enterMockMode = () => {
      console.log('[Auth] Entering Mock Mode (Fallback/Test Number)');
      setConfirmationResult({
        mock: true,
        phoneNumber,
        confirm: async (code) => {
          if (code === '123456') {
            return { 
              user: { 
                uid: 'MOCK_' + Date.now(), 
                phoneNumber,
                isMock: true 
              } 
            };
          }
          throw { code: 'auth/invalid-verification-code', message: 'Invalid OTP code.' };
        }
      });
      setIsLoading(false);
      return { success: true };
    };

    // Fast-track bypass for the test number to avoid any delay
    if (phoneNumber.includes('9999999999')) {
      return enterMockMode();
    }

    try {
      // 1. Try real Firebase Auth first, with a 5-second timeout to prevent infinite buffering
      console.log(`[Auth] Attempting real Firebase OTP for ${phoneNumber}`);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 5000);
      });

      const confirmation = await Promise.race([
        signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier),
        timeoutPromise
      ]);

      setConfirmationResult(confirmation);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.warn('[Auth] Real Firebase OTP failed or timed out:', error.code || error.message);
      
      // 2. POC FALLBACK: If timeout or any error occurs, proceed to the next pipeline (mock mode)
      return enterMockMode();
    }
  }, []);

  // Step 2: Confirm OTP code (works for both Real and Mock)
  const confirmOTP = useCallback(async (otpCode) => {
    if (!confirmationResult) return { success: false, error: 'No pending OTP session.' };
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const firebaseUser = result.user;

      const userProfile = {
        uid: firebaseUser.uid,
        phone: firebaseUser.phoneNumber || confirmationResult.phoneNumber,
        name: 'Supervisor',
        role: 'Supervisor',
        site: 'Tech Park',
        shift: '08:00 AM - 04:00 PM',
      };
      
      await AsyncStorage.setItem('user_session', JSON.stringify(userProfile));
      setUser(userProfile);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Confirmation error:', error);
      setIsLoading(false);
      const msg = error.code === 'auth/invalid-verification-code' 
        ? 'Invalid OTP. Please try again.' 
        : error.message;
      return { success: false, error: msg };
    }
  }, [confirmationResult]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await auth.signOut(); // Just in case a real session exists
    } catch (e) {
      // ignore
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
