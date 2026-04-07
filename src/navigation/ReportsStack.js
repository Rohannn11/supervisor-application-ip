import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatrolHistory from '../../supervisor/PatrolHistory';

const Stack = createNativeStackNavigator();

export default function ReportsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatrolHistory" component={PatrolHistory} />
    </Stack.Navigator>
  );
}
