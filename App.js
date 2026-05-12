import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { Colors } from './src/theme/colors';

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  
  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    (async () => {
      // Request all permissions upfront
      await Location.requestForegroundPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} backgroundColor={Colors.surface} />
          <RootNavigator />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
