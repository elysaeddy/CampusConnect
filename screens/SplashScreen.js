import React, { useEffect } from 'react';
import {View, StyleSheet, Image} from 'react-native';

import { ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  return (

    <View style={styles.container}>

      <Image
        source={require('../assets/icon-removebg-preview.png')}
        style={styles.logo}
      />


      <ActivityIndicator
        size="large"
        color="#8B7CF6"
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 700,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 9,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B7CF6',
  },


  tagline: {
    fontSize: 18,
    color: '#2D2D2D',
    marginTop: 10,
    marginBottom: 80,
  },

});