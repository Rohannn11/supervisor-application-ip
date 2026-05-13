import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChecklistHub from '../../supervisor/ChecklistHub';
import PatrolChecklist from '../../supervisor/PatrolChecklist';
import ReportOccurrences from '../../supervisor/ReportOccurrences';
import ReportSubmissionSuccess from '../../supervisor/ReportSubmissionSuccess';

const Stack = createNativeStackNavigator();

export default function ChecklistStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Root: hub showing all patrol spots */}
      <Stack.Screen name="ChecklistHub" component={ChecklistHub} />
      {/* Each spot navigates here with route.params = { spotId, spotName } */}
      <Stack.Screen name="PatrolChecklist" component={PatrolChecklist} />
      <Stack.Screen name="ReportOccurrences" component={ReportOccurrences} />
      <Stack.Screen name="ReportSubmissionSuccess" component={ReportSubmissionSuccess} />
    </Stack.Navigator>
  );
}
