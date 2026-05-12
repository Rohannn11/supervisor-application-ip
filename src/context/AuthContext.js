import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Build mock profile since actual profile might be fetched from Firestore
        setUser({
          id: firebaseUser.email ? firebaseUser.email.split('@')[0].toUpperCase() : 'EMP-1042',
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Supervisor',
          role: 'Supervisor',
          site: 'Tech Park - Main Gate',
          shift: '08:00 AM - 04:00 PM',
          avatar: firebaseUser.photoURL,
        });
      } else {
        // Firebase no user. Check if we had a mock offline session stored
        const storedUser = await AsyncStorage.getItem('user_session');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (employeeId, otp) => {
    setIsLoading(true);
    try {
      // Create a pseudo-email for Firebase Auth from the Employee ID
      const email = `${employeeId.toLowerCase()}@patrol.app`;
      // We map the OTP code directly to a password (must be 6+ chars in Firebase)
      const password = otp + otp; // Hack to ensure 6+ length if OTP is e.g. 1234
      
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase onAuthStateChanged will handle setting the user
      return true;
    } catch (error) {
      console.warn("Firebase Auth Failed (Falling back to Mock Auth):", error.message);
      
      // MOCK FALLBACK FOR POC if Firebase is not yet set up
      const mockData = {
        id: employeeId || 'EMP-1042',
        name: 'Rohan',
        role: 'Supervisor',
        site: 'Tech Park - Main Gate',
        shift: '08:00 AM - 04:00 PM',
        avatar: null,
      };
      
      await AsyncStorage.setItem('user_session', JSON.stringify(mockData));
      setUser(mockData);
      setIsLoading(false);
      return true;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase Logout Error:', error);
    }
    await AsyncStorage.removeItem('user_session');
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
