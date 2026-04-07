import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SupervisorLogin from '../../supervisor/SupervisorLogin';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupervisorLogin" component={SupervisorLogin} />
    </Stack.Navigator>
  );
}
