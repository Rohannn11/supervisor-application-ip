import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SupervisorDashboard from '../../supervisor/SupervisorDashboard';
import ActivePatrolMap from '../../supervisor/ActivePatrolMap';
import EmergencySOSActive from '../../supervisor/EmergencySOSActive';
import OfficerDashboard from '../../supervisor/OfficerDashboard';
import CheckpointScanScreen from '../../supervisor/CheckpointScanScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupervisorDashboard" component={SupervisorDashboard} />
      <Stack.Screen name="ActivePatrolMap" component={ActivePatrolMap} />
      <Stack.Screen name="OfficerDashboard" component={OfficerDashboard} />
      <Stack.Screen name="EmergencySOSActive" component={EmergencySOSActive} />
      <Stack.Screen name="CheckpointScanScreen" component={CheckpointScanScreen} />
    </Stack.Navigator>
  );
}
