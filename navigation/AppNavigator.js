import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator }
from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import AdminLoginScreen from '../screens/AdminLoginScreen';

import EventDetailsScreen from '../screens/EventDetailsScreen';
import AddEventScreen from '../screens/AddEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import ManageEventsScreen from '../screens/ManageEventsScreen';
import SettingsScreen from '../screens/SettingsScreen';

import ParticipantScreen from '../screens/ParticipantScreen';
import ParticipantDetailsScreen from '../screens/ParticipantDetailsScreen';

import ReportScreen from '../screens/ReportScreen';

import BottomTabNavigator from './BottomTabNavigator';
import AdminBottomTabNavigator from './AdminBottomTabNavigator';
import { StackScreen } from 'react-native-screens';
import UpdateSemesterScreen from '../screens/UpdateSemesterScreen';
import UpcomingEventsScreen from '../screens/UpcomingEventsScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminEventDetailsScreen from '../screens/AdminEventDetailsScreen';
import AllEventsScreen from '../screens/AllEventsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  return (

    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Splash"
      >

        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Student */}

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name = "Homescreen"
          component={HomeScreen}
        />

        <Stack.Screen
          name = "Notification"
          component={NotificationScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name = "MyEvents"
          component={MyEventsScreen}
        />

        <Stack.Screen
          name = "Profile"
          component={ProfileScreen}
        />

        <Stack.Screen
          name = "UpdateSemester"
          component = {UpdateSemesterScreen}
        />

        <Stack.Screen
          name="Back"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Admin */}

        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name="Admin"
          component={AdminBottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name = "AllEvents"
          component = {AllEventsScreen}
          options = {{title: 'All Event'}}
        />

        <Stack.Screen
          name="AddEvent"
          component={AddEventScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
        name = "ManageEvents"
        component = {ManageEventsScreen}
        options={{ title: '' }}
        />

        <Stack.Screen
          name="EditEvent"
          component={EditEventScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name = "UpcomingEvents"
          component = {UpcomingEventsScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name = "Settings"
          component={SettingsScreen}
        />

        <Stack.Screen
          name="Participants"
          component={ParticipantScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name="ParticipantDetails"
          component={ParticipantDetailsScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
          name = "AdminEventDetails"
          component = {AdminEventDetailsScreen}
          options={{ title: '' }}
        />

        <Stack.Screen
        name = "Report"
        component={ReportScreen}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}