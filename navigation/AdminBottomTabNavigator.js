import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ManageEventsScreen from '../screens/ManageEventsScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Settings } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AdminBottomTabNavigator() {

  return (

    <Tab.Navigator

      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor: '#8B7CF6',
        tabBarInactiveTintColor: '#999',

        tabBarStyle: {
          height: 65,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
        },

        tabBarIcon: ({ color, size }) => {

          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'grid';
          }

          else if (route.name === 'Events') {
            iconName = 'calendar';
          }

          else if (route.name === 'Reports') {
            iconName = 'bar-chart';
          }

          else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

      })}

    >

      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
      />

      <Tab.Screen
        name="Events"
        component={ManageEventsScreen}
      />

      <Tab.Screen
        name="Reports"
        component={ReportScreen}
      />

      <Tab.Screen
        name = "Settings"
        component = {SettingsScreen}
      />

    </Tab.Navigator>

  );

}