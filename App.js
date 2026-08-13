import React from 'react';
import { useEffect } from 'react';
import { registerForPushNotifications } from './services/notificationService';
import AppNavigator from './navigation/AppNavigator';

export default function App() {

  useEffect (() => {
    registerForPushNotifications();
  }, []);

  return <AppNavigator />;

}