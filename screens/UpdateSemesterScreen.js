import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import {doc, getDoc, updateDoc} from "firebase/firestore";

import {auth, db} from "../firebase/firebaseConfig";

import CustomButton from "../components/CustomButton";

import globalStyles from "../styles/globalStyles";
import COLORS from '../styles/colors';

export default function UpdateSemesterScreen() {

  const [semester, setSemester] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");

  const semesterNumber = parseInt (
    currentSemester.replace ("Semester ", "")
  );

  const semesterData = [{
    label: `Semester ${semesterNumber + 1}`,
    value: `Semester ${semesterNumber + 1}`
  }];

  useEffect (() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {

    const snap = await getDoc (
        doc(db, "students", auth.currentUser.uid)
    );

    if (snap.exists()) {
        setCurrentSemester (snap.data().semester);
    }

  };

  const getCurrentIntake = () => {
    const month = new Date().getMonth() +1;
    const year = new Date().getFullYear();
    if (month >= 4 && month <= 9) {
      return `${year}-Apr`;
    }
    return `${year}-Oct`;
  };

  const handleUpdate = async () => {

    const studentRef = doc(
      db,
      "students",
      auth.currentUser.uid
    );

    const studentSnap = await getDoc(studentRef);

    const student = studentSnap.data();

    const currentIntake = getCurrentIntake();
    
    if (student.lastUpdatedIntake === currentIntake) {
      Alert.alert (
        "Update Not Allowed",
        "You have already updated your semester for this intake."
      );
      return;
    }

    if (semester === currentSemester) {
      Alert.alert (
          "No Changes",
          "Please choose a new semester."
      );

      return;

    }

    try {

      await updateDoc(studentRef, {

        semester,

        lastUpdatedIntake: getCurrentIntake(),

      });

      Alert.alert(
        "Success",
        "Semester updated successfully."
      );

      setSemester("");
      setCurrentSemester (semester);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Failed to update semester."
      );

    }

  };

  return (

    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>
        Update Semester
      </Text>

      <Text style={globalStyles.subtitle}>
        You may only update your semester once every intake.
      </Text>

      <Text style = {styles.label}>Current Semester</Text>

      <View style = {styles.currentSemesterBox}>
        <Text style = {styles.currentSemesterText}>{currentSemester}</Text>
      </View>

      <Text style = {styles.label}>Select New semester</Text>

      <Dropdown
        style = {styles.dropdown}
        data = {semesterData}
        labelField="label"
        valueField="value"
        placeholder= {`Current: ${currentSemester}`}
        value = {semester}
        onChange={item => {
            setSemester(item.value);
        }}
        placeholderStyle = {styles.placeholderStyle}
        selectedTextStyle = {styles.selectedTextStyle}
      />

      <CustomButton
        title="Update Semester"
        onPress={handleUpdate}
        disabled = {!semester}
      />

    </View>

  );

}

const styles = StyleSheet.create({

label:{
    fontWeight:"700",
    marginBottom:8,
    marginTop:15,
},

currentSemesterBox:{
    backgroundColor:"#F5F5F5",
    padding:16,
    borderRadius:15,
    marginBottom:15,
},

currentSemesterText:{
    fontSize:18,
    fontWeight:"bold",
    color:COLORS.primary,
},

dropdown:{
    backgroundColor:"#FFFFFF",
    borderRadius:15,
    paddingHorizontal:15,
    height:55,
    borderWidth:1,
    borderColor:"#E5E5E5",
    marginBottom: 50,
},

placeholderStyle:{
    color:"#999",
},

selectedTextStyle:{
    color:"#333",
},

});