import React, { useState } from 'react';

import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';

export default function AdminLoginScreen({
  navigation,
}) {

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const handleLogin = async () => {

    if (
      username.trim() === 'ADMIN' &&
      password === 'adminRaub'
    ) {

      await AsyncStorage.setItem(
        'userType',
        'admin'
      );

      Alert.alert(
        'Success',
        'Admin Login Successful'
      );

      navigation.replace(
        'AdminTabs'
      );

    } else {

      Alert.alert(
        'Login Failed',
        'Invalid Username or Password'
      );

    }

  };

  return (

    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>
        Admin Login
      </Text>

      <Text style={styles.subtitle}>
        CampusConnect Management Portal
      </Text>

      <InputField
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton
        title="Login"
        onPress={handleLogin}
      />

      <TouchableOpacity
        onPress={() =>
          navigation.goBack()
        }
      >

        <Text style={styles.backText}>
          Back to Role Selection
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  subtitle: {

    textAlign: 'center',

    color: COLORS.text,

    marginBottom: 30,

  },

  backText: {

    textAlign: 'center',

    marginTop: 20,

    color: COLORS.primary,

    fontWeight: '600',

  },

});
/*const userCredential =
  await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

if (
  userCredential.user.email ===
  'admin@adminRaub.com'
) {

  navigation.replace(
    'AdminTabs'
  );

} else {

  Alert.alert(
    'Access Denied',
    'This account is not an administrator.'
  );

    await auth.signOut();

}*/