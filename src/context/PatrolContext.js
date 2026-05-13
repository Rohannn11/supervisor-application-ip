import React, { createContext, useContext, useState } from 'react';

const PatrolContext = createContext(null);

export function PatrolProvider({ children }) {
  // Polygon boundary drawn on map
  const [geofencePolygon, setGeofencePolygon] = useState([]);
  // Patrol spots placed inside the fence
  const [patrolSpots, setPatrolSpots] = useState([]);
  // Whether the session is locked
  const [isSessionLocked, setIsSessionLocked] = useState(false);

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

  const resetSession = () => {
    setGeofencePolygon([]);
    setPatrolSpots([]);
    setIsSessionLocked(false);
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
