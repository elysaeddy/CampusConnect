import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import CustomButton from '../components/CustomButton';
import COLORS from '../styles/colors';

export default function RoleSelectionScreen({
  navigation,
}) {

  return (

    <View style={styles.container}>

      <Image
        source={require('../assets/icon-removebg-preview.png')}
        style={styles.logo}
        //resizeMode="contain"
      />

      <View style={styles.buttonContainer}>

        <CustomButton
          title="Student"
          onPress={() =>
            navigation.navigate(
              'Login'
            )
          }
        />

        <CustomButton
          title="Admin"
          onPress={() =>
            navigation.navigate(
              'AdminLogin'
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
  },
  
  logo: {
    width: 200,
    height: 200,
    //resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 160,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 40,
  },

  buttonContainer: {
    width: '50%',
    marginTop: 20,
  },

});