import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'हिन्दी' },
  { code: 'MR', label: 'मराठी' },
  { code: 'GU', label: 'ગુજરાતી' },
  { code: 'PA', label: 'ਪੰਜਾਬੀ' },
];

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('EN');
  const [gpsStatus, setGpsStatus] = useState('disconnected');
  const [isPatrolActive, setIsPatrolActive] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  const setIsDarkMode = useCallback(async (val) => {
    setIsDarkModeState(val);
    try { await AsyncStorage.setItem('isDarkMode', JSON.stringify(val)); } catch (_) {}
  }, []);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const requestLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        setGpsStatus('disconnected');
        return null;
      }

      setGpsStatus('connected');
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      return location.coords;
    } catch (error) {
      setLocationError(error.message);
      setGpsStatus('disconnected');
      return null;
    }
  }, []);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedPatrol = await AsyncStorage.getItem('isPatrolActive');
        if (savedPatrol !== null) setIsPatrolActive(JSON.parse(savedPatrol));
        const savedDark = await AsyncStorage.getItem('isDarkMode');
        if (savedDark !== null) setIsDarkModeState(JSON.parse(savedDark));
      } catch (e) {
        console.error('Failed to load app state', e);
      }
    };
    loadState();
  }, []);

  const startPatrol = useCallback(async () => {
    setIsPatrolActive(true);
    try {
      await AsyncStorage.setItem('isPatrolActive', JSON.stringify(true));
    } catch (e) {
      console.error('Failed to save patrol state', e);
    }
    requestLocation();
  }, [requestLocation]);

  const endPatrol = useCallback(async () => {
    setIsPatrolActive(false);
    try {
      await AsyncStorage.setItem('isPatrolActive', JSON.stringify(false));
    } catch (e) {
      console.error('Failed to save patrol state', e);
    }
  }, []);
  
  const toggleSOS = useCallback(() => {
    setSosActive(prev => {
      const newState = !prev;
      if (newState) requestLocation(); // Fetch location on SOS trigger
      return newState;
    });
  }, [requestLocation]);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        notifications,
        setNotifications,
        locationTracking,
        setLocationTracking,
        language,
        setLanguage,
        languages: LANGUAGES,
        gpsStatus,
        setGpsStatus,
        isPatrolActive,
        startPatrol,
        endPatrol,
        sosActive,
        toggleSOS,
        setSosActive,
        currentLocation,
        locationError,
        requestLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
