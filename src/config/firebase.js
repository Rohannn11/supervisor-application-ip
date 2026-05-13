import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Real Firebase config – patrol-incident-application
const firebaseConfig = {
  apiKey: "AIzaSyAG-_19EvvuiRcK3x1MLQRkyCiOkURkHTc",
  authDomain: "patrol-incident-application.firebaseapp.com",
  projectId: "patrol-incident-application",
  storageBucket: "patrol-incident-application.firebasestorage.app",
  messagingSenderId: "225044323271",
  appId: "1:225044323271:web:233bda4f33be6a269257e2",
  measurementId: "G-7ZHDFT5K0W",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Auth with React Native AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore – for user profiles, patrol sessions, spot configs
export const db = getFirestore(app);

// Storage – for evidence photos
export const storage = getStorage(app);
