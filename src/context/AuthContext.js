import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user session on mount
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user_session');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load session', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = useCallback(async (employeeId, otp) => {
    setIsLoading(true);
    // Mock authentication – simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userData = {
      id: employeeId || 'EMP-1042',
      name: 'Rohan',
      role: 'Supervisor',
      site: 'Tech Park - Main Gate',
      shift: '08:00 AM - 04:00 PM',
      avatar: null,
    };
    
    try {
      await AsyncStorage.setItem('user_session', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save session', e);
    }

    setUser(userData);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('user_session');
    } catch (e) {
      console.error('Failed to clear session', e);
    }
    setUser(null);
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
