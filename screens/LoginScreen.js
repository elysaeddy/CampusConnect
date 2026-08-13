import React, { useState } from 'react';
import {View, Text, Alert, TouchableOpacity, StyleSheet} from 'react-native';

import {signInWithEmailAndPassword} from 'firebase/auth';

import {auth} from '../firebase/firebaseConfig';

import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';

export default function LoginScreen({
  navigation,
}) {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

    const handleLogin = async () => {
    
      try {
    
        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
    
        if (
          userCredential.user.email ==
          'admin@adminraub.com'
        ) {
    
          navigation.replace('Admin');
    
        } else {
    
          navigation.replace('Back');
    
        }

        Alert.alert(
          'Success',
          'Login successful!'
        );
    
      } catch (error) {
    
        Alert.alert(
          'Login Failed',
          error.message
        );
    
        console.log(error);
    
      }
    
    };

  return (

    <View style={globalStyles.container}>

      <Text style={styles.title}>
        Welcome
      </Text>

      <InputField
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType = "email-address"
        autoCapitalize = "none"
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
          navigation.navigate(
            'Register'
          )
        }
      >

        <Text style={styles.registerText}>
          Don't have an account? Register
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({
  
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 200,
    marginBottom: 40,
    textAlign: 'center'
  },
  
  subtitle: {
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 30,
  },

  registerText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: '600',
  },

});