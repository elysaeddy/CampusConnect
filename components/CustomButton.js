import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  color,
}) {

  return (

    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color || '#8B7CF6'},
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled = {disabled}
    >

      <Text style={styles.buttonText}>
        {title}
      </Text>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 8,
  },

  disabledButton: {
    backgroundColor: '#C9BFFF',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});