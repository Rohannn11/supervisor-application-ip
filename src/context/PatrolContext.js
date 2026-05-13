import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatrolContext = createContext(null);
const SESSION_STORAGE_KEY = '@patrol_live_session';

export function PatrolProvider({ children }) {
  // Polygon boundary drawn on map
  const [geofencePolygon, setGeofencePolygon] = useState([]);
  // Patrol spots placed inside the fence
  const [patrolSpots, setPatrolSpots] = useState([]);
  // Whether the session is locked
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load session from AsyncStorage on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.geofencePolygon) setGeofencePolygon(parsed.geofencePolygon);
          if (parsed.patrolSpots) setPatrolSpots(parsed.patrolSpots);
          if (parsed.isSessionLocked) setIsSessionLocked(parsed.isSessionLocked);
        }
      } catch (e) {
        console.error('Failed to load patrol session', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSession();
  }, []);

  // Save session to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    const saveSession = async () => {
      try {
        const sessionData = JSON.stringify({
          geofencePolygon,
          patrolSpots,
          isSessionLocked,
        });
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, sessionData);
      } catch (e) {
        console.error('Failed to save patrol session', e);
      }
    };
    saveSession();
  }, [geofencePolygon, patrolSpots, isSessionLocked, isLoaded]);

  const addSpot = (coordinate) => {
    const id = Date.now();
    const name = `Spot ${patrolSpots.length + 1}`;
    setPatrolSpots(prev => [...prev, { id, name, coordinate, checklistDone: false }]);
  };

  const markSpotDone = (spotId) => {
    setPatrolSpots(prev =>
      prev.map(s => s.id === spotId ? { ...s, checklistDone: true } : s)
    );
  };

  const lockSession = () => setIsSessionLocked(true);

  const resetSession = async () => {
    setGeofencePolygon([]);
    setPatrolSpots([]);
    setIsSessionLocked(false);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <PatrolContext.Provider value={{
      geofencePolygon, setGeofencePolygon,
      patrolSpots, addSpot, markSpotDone,
      isSessionLocked, lockSession, resetSession,
    }}>
      {children}
    </PatrolContext.Provider>
  );
}

export function usePatrol() {
  const ctx = useContext(PatrolContext);
  if (!ctx) throw new Error('usePatrol must be used within PatrolProvider');
  return ctx;
}
