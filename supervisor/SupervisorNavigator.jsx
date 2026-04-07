import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SupervisorLogin from './SupervisorLogin';
import SupervisorDashboard from './SupervisorDashboard';
import PatrolHistory from './PatrolHistory';
import AssignedPatrolTasks from './AssignedPatrolTasks';
import OfficerDashboard from './OfficerDashboard';
import EmergencySOSActive from './EmergencySOSActive';
import ActivePatrolMap from './ActivePatrolMap';
import PatrolChecklist from './PatrolChecklist';
import ReportOccurrences from './ReportOccurrences';
import ReportSubmissionSuccess from './ReportSubmissionSuccess';

const Stack = createNativeStackNavigator();

export default function SupervisorNavigator() {
  return (
    <Stack.Navigator initialRouteName="SupervisorLogin" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupervisorLogin" component={SupervisorLogin} />
      <Stack.Screen name="SupervisorDashboard" component={SupervisorDashboard} />
      <Stack.Screen name="PatrolHistory" component={PatrolHistory} />
      <Stack.Screen name="AssignedPatrolTasks" component={AssignedPatrolTasks} />
      <Stack.Screen name="OfficerDashboard" component={OfficerDashboard} />
      <Stack.Screen name="EmergencySOSActive" component={EmergencySOSActive} />
      <Stack.Screen name="ActivePatrolMap" component={ActivePatrolMap} />
      <Stack.Screen name="PatrolChecklist" component={PatrolChecklist} />
      <Stack.Screen name="ReportOccurrences" component={ReportOccurrences} />
      <Stack.Screen name="ReportSubmissionSuccess" component={ReportSubmissionSuccess} />
    </Stack.Navigator>
  );
}
