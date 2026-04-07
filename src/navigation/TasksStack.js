import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignedPatrolTasks from '../../supervisor/AssignedPatrolTasks';
import PatrolChecklist from '../../supervisor/PatrolChecklist';
import ReportOccurrences from '../../supervisor/ReportOccurrences';
import ReportSubmissionSuccess from '../../supervisor/ReportSubmissionSuccess';

const Stack = createNativeStackNavigator();

export default function TasksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AssignedPatrolTasks" component={AssignedPatrolTasks} />
      <Stack.Screen name="PatrolChecklist" component={PatrolChecklist} />
      <Stack.Screen name="ReportOccurrences" component={ReportOccurrences} />
      <Stack.Screen name="ReportSubmissionSuccess" component={ReportSubmissionSuccess} />
    </Stack.Navigator>
  );
}
