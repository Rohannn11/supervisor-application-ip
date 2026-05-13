import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import TasksStack from './TasksStack';
import ChecklistStack from './ChecklistStack';
import ReportsStack from './ReportsStack';
import ProfileScreen from '../../supervisor/ProfileScreen';
import SOSFloatingButton from '../components/SOSFloatingButton.jsx';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, color, size }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

export default function MainTabNavigator() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textLight,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="TasksTab"
          component={TasksStack}
          options={{
            tabBarLabel: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="assignment" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ChecklistTab"
          component={ChecklistStack}
          options={{
            tabBarLabel: 'Checklist',
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="checklist" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ReportsTab"
          component={ReportsStack}
          options={{
            tabBarLabel: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="assessment" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
      <SOSFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabItem: {
    minHeight: 48,
    paddingVertical: 4,
  },
});
