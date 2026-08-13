import React, { useState } from 'react';
import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import { Dropdown } from 'react-native-element-dropdown';
import {auth, db} from '../firebase/firebaseConfig';

import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';

export default function RegisterScreen({
  navigation,
}) {

  const [name, setName] = 
    useState('');

  const [studentId, setStudentId] =
    useState('');

  const [email, setEmail] = 
    useState("");

  const [course, setCourse] =
    useState('');

  const [semester, setSemester] =
    useState('');

  const courseData = [
    { label: 'CS110', value: 'CS110' },
    { label: 'CS111', value: 'CS111' },
    { label: 'BA111', value: 'BA111' },
    { label: 'BA119', value: 'BA119' },
    { label: 'AM110', value: 'AM110' },
  ];

  const semesterData = [
    { label: 'Semester 1', value: '1' },
    { label: 'Semester 2', value: '2' },
    { label: 'Semester 3', value: '3' },
    { label: 'Semester 4', value: '4' },
    { label: 'Semester 5', value: '5' },
  ];

  const [password, setPassword] =
    useState('');

  const [confirmPassword,
    setConfirmPassword] =
    useState('');

  const handleRegister =
    async () => {

      if (
        !name ||
        !studentId ||
        !email ||
        !course ||
        !semester ||
        !password ||
        !confirmPassword
      ) {

        Alert.alert(
          'Error',
          'Please fill in all fields.'
        );

        return;

      }

      if (
        password !== confirmPassword
      ) {

        Alert.alert(
          'Error',
          'Passwords do not match.'
        );

        return;

      }

      try {

        console.log("Creating user...");

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        console.log("User created:", userCredential.user.uid);

        console.log("Saving to Firestore...");

        await setDoc(

          doc(
            db,
            'students',
            userCredential.user.uid
          ),

          {

            uid: userCredential.user.uid,
            name,
            studentId,
            email,
            course,
            semester,

          }

        );

        console.log("Saved successfully!");

        Alert.alert(
          'Success',
          'Account created successfully.'
        );

        navigation.replace(
          'Login'
        );

      } catch (error) {

          console.log(
            'REGISTER ERROR:',
            error.code
          );

        Alert.alert(
          'Registration Failed',
          error.message
        );

      }

    };

  return (

    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
    >

      <Text style={globalStyles.title}>
        Create Account
      </Text>
      
      <InputField
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <InputField
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
      />

      <InputField
        placeholder="Email Address"
        value = {email}
        onChangeText={setEmail}
        keyboardType = "email-address"
        autoCapitalize = "none"
      />

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={courseData}
        labelField="label"
        valueField="value"
        placeholder="Select Course"
        value={course}
        onChange={item => {
          setCourse(item.value);
        }}
      />

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={semesterData}
        labelField="label"
        valueField="value"
        placeholder="Select Semester"
        value={semester}
        onChange={item => {
          setSemester(item.value);
        }}
      />

      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <InputField
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <CustomButton
        title="Register"
        onPress={handleRegister}
      />

      <CustomButton
        title="Back to Login"
        onPress={() =>
          navigation.goBack()
        }
      />

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  subtitle: {

    textAlign: 'center',

    color: COLORS.text,

    marginBottom: 25,

  },

  dropdown: {

    backgroundColor: COLORS.white,
  
    borderRadius: 15,
  
    paddingHorizontal: 15,
  
    height: 55,
  
    marginBottom: 15,
  
    borderWidth: 1,
  
    borderColor: '#E5E5E5',
  
  },
  
  placeholderStyle: {
  
    color: '#999',
  
  },
  
  selectedTextStyle: {
  
    color: COLORS.text,
  
  },

});