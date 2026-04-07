import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (employeeId, otp) => {
    setIsLoading(true);
    // Mock authentication – simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: employeeId || 'EMP-1042',
      name: 'Rohan',
      role: 'Supervisor',
      site: 'Tech Park - Main Gate',
      shift: '08:00 AM - 04:00 PM',
      avatar: null,
    });
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
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
