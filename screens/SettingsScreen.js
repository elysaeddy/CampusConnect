import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, StyleSheet } from "react-native";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {signOut} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase/firebaseConfig";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import globalStyles from "../styles/globalStyles";

export default function SettingsScreen( {navigation}) {

  const [limit, setLimit] = useState("");

  useEffect(() => {
    fetchLimit();
  }, []);

  const fetchLimit = async () => {

    try {

      const snap = await getDoc(
        doc(db, "settings", "eventLimit")
      );

      if (snap.exists()) {
        setLimit(snap.data().limit.toString());
      }

    } catch (error) {
      console.log(error);
    }

  };

  const handleSave = async () => {

    if (!limit) {
      Alert.alert("Error", "Please enter a limit.");
      return;
    }

    try {

      await updateDoc(
        doc(db, "settings", "eventLimit"),
        {
          limit: Number(limit),
        }
      );

      Alert.alert(
        "Success",
        "Maximum event limit updated."
      );

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Failed to update."
      );

    }

  };

  const handleLogout =
      async () => {
  
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
  
            {
              text: 'Logout',
  
              onPress: async () => {
  
                try {
  
                  await signOut(auth);
  
                  await AsyncStorage.removeItem('userType');
  
                  navigation.replace('Login');
  
                } catch (error) {
  
                  console.log(error);
  
                }
  
              },
            },
          ]
        );
  
      };

  return (

    <ScrollView style={globalStyles.container}>

      <Text style={globalStyles.title}>
        Settings
      </Text>

      <View style = {styles.card}>

        <Text style = {styles.settingTitle}>Maximum Events Per Semester</Text>

      <InputField
        placeholder="Enter maximum limit"
        value={limit}
        onChangeText={setLimit}
        keyboardType="numeric"
      />

      <CustomButton
        title="Save Changes"
        onPress={handleSave}
      />

      </View>

      <View style = {styles.card}>

        <Text style = {styles.settingTitle}>
          Account
        </Text>

        <CustomButton
        title="Logout"
        onPress={handleLogout}
        />

      </View>

  </ScrollView>

 )};

 const styles = StyleSheet.create({

  card:{
    backgroundColor:"#FFFFFF",
    padding:20,
    borderRadius:18,
    marginBottom:40,
    elevation:5,
  },

  label:{
    fontSize:16,
    fontWeight:"700",
    marginBottom:12,
  },
    
  settingTitle:{
    fontSize:22,
    fontWeight:"700",
    marginTop:10,
    marginBottom: 10,
  },
    
  settingDescription:{
    color:"#666",
    marginVertical:12,
    lineHeight:22,
  },

 })
