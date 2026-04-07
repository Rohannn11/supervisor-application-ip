import React, { createContext, useContext, useState, useCallback } from 'react';

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
  const [gpsStatus, setGpsStatus] = useState('connected'); // 'connected' | 'disconnected'
  const [isPatrolActive, setIsPatrolActive] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const startPatrol = useCallback(() => setIsPatrolActive(true), []);
  const endPatrol = useCallback(() => setIsPatrolActive(false), []);
  const toggleSOS = useCallback(() => setSosActive(prev => !prev), []);

  return (
    <AppContext.Provider
      value={{
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
