import React from 'react';
import {
  TextInput,
  StyleSheet
} from 'react-native';

export default function InputField({

  placeholder,
  value,
  onChangeText,
  secureTextEntry

}) {

  return (

    <TextInput

      style={styles.input}

      placeholder={placeholder}

      value={value}

      onChangeText={onChangeText}

      secureTextEntry={secureTextEntry}

    />

  );

}

const styles = StyleSheet.create({

  input: {
    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    paddingHorizontal: 15,

    height: 55,

    marginBottom: 15,

    borderWidth: 1,

    borderColor: '#E5E5E5',
  },

});