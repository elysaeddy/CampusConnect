import React, {useCallback, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text, Alert, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {doc, getDoc, collection, query, where, getDocs} from 'firebase/firestore';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, db} from '../firebase/firebaseConfig';
import CustomButton from '../components/CustomButton';
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
  
export default function ProfileScreen({
  navigation,
  }) {
  
    const [student, setStudent] =
      useState("");

    const [joinedCount, setJoinedCount] = 
      useState(0);

    const [eventLimit, setEventLimit] = 
      useState (0);
  
    const [loading, setLoading] =
      useState(true);
  
    useFocusEffect (
      useCallback(() => {
        fetchProfile();
      }, [])
    );
  
    const fetchProfile =
      async () => {
  
        try {
  
          const user =
            auth.currentUser;
  
          if (!user) return;
  
          const studentRef =
            doc(db, 'students', user.uid);
  
          const studentSnap =
            await getDoc(studentRef);
  
          if (studentSnap.exists()) {
            setStudent(studentSnap.data());
          }

          const registrationQuery = query (
            collection(db, "registrations"),
            where ("studentUid", "==", user.uid)
          );

          const registrationSnap = await getDocs (registrationQuery);

          setJoinedCount (registrationSnap.size);

          const settingSnap = await getDoc (
            doc(db, "settings", "eventLimit")
          );

          if (settingSnap.exists()) {
            setEventLimit (settingSnap.data().limit);
          }
  
        } catch (error) {
  
          console.log(error);
  
        }
  
        setLoading(false);
  
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
  
    if (loading) {
  
      return (
  
        <View
          style={[
            globalStyles.container,
            {
              justifyContent:
                'center',
              alignItems:
                'center',
            },
          ]}
        >
  
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
  
        </View>
  
      );
  
    }

    const initials = student?.name? student.name.split("").map(word => word[0]).slice (0,2).join("").toUpperCase(): "";
  
    return (
  
      <ScrollView style={globalStyles.container}>
  
        <Text style={globalStyles.title}>
          My Profile
        </Text>
  
        <View style = {styles.avatarContainer}>
          <View style = {styles.avatar}>
            <Text style = {styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <Text style = {styles.profileName}>
          {student?.name}
        </Text>

        <Text style = {styles.profileCourse}>
          {student?.course}
        </Text>

        <View style = {styles.infoRow}>
          <Text>Semester</Text>
          <Text>{student?.semester}</Text>
        </View>

        <View style = {styles.infoRow}>
          <Text>Student ID</Text>
          <Text>{student?.studentId}</Text>
        </View>
  
        <View style = {styles.infoRow}>
          <Text>Email</Text>
          <Text>{student?.email}</Text>
        </View>

        <Text style = {styles.sectionTitle}>
          Event Progress
        </Text>

        <View style = {styles.progressContainer}>
          <View style = {styles.smallCard}>
            <Text style = {styles.smallTitle}>Joined</Text>
            <Text style = {styles.bigNumber}>{joinedCount}</Text>
          </View>

          <View style = {styles.smallCard}>
            <Text style = {styles.smallTitle}>Limit</Text>
            <Text style = {styles.bigNumber}>{eventLimit}</Text>
          </View>
        </View>

        <View style = {styles.progressBarBackground}>
          <View style = {[styles.progressBarFill, {
            width: `${(joinedCount/eventLimit)*100}%`,
          },]}
          />
        </View>

        <Text style = {styles.progressText}>
          {joinedCount} / {eventLimit} Events Joined
        </Text>

        <CustomButton
          title = "Update Semester"
          onPress={() => navigation.navigate("UpdateSemester")}
        />

        <CustomButton
          title="Logout"
          onPress={handleLogout}
        />
  
      </ScrollView>
  
    );
  
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      elevation: 3,
    },

    avatarContainer:{
      alignItems:"center",
      marginBottom:20,
    },
  
    avatar:{
      width:90,
      height:90,
      borderRadius:45,
      backgroundColor:COLORS.primary,
      justifyContent:"center",
      alignItems:"center",
      elevation:5,
    },
  
    avatarText:{
      color:"#FFFFFF",
      fontSize:34,
      fontWeight:"bold",
    },

    profileName:{
      fontSize:24,
      fontWeight:"bold",
      textAlign:"center",
      marginBottom:4,
    },
      
    profileCourse:{
      textAlign:"center",
      color:"#666",
      marginBottom:20,
    },
      
    infoRow:{
      flexDirection:"row",
      justifyContent:"space-between",
      paddingVertical:12,
      borderBottomWidth:1,
      borderBottomColor:"#EFEFEF",
    },
      
    sectionTitle:{
      fontSize:18,
      fontWeight:"700",
      marginBottom:15,
    },
      
    progressContainer:{
      flexDirection:"row",
      justifyContent:"space-between",
      marginBottom:25,
    },
      
    smallCard:{
      width:"48%",
      backgroundColor:"#FFF",
      padding:20,
      borderRadius:18,
      alignItems:"center",
      elevation:3,
    },
      
    smallTitle:{
      color:"#666",
      fontSize:14,
    },
      
    bigNumber:{
      fontSize:30,
      fontWeight:"bold",
      color:COLORS.primary,
      marginTop:10,
    },

    progressBarBackground:{
      height:12,
      backgroundColor:"#E5E5E5",
      borderRadius:20,
      overflow:"hidden",
      marginTop:5,
      marginBottom: 5,
    },
  
    progressBarFill:{
      height:12,
      backgroundColor:COLORS.primary,
      borderRadius:20,
    },
  
    progressText:{
      textAlign:"center",
      marginTop:8,
      color:"#666",
      marginBottom: 20,
    },
  
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.text,
      marginTop: 12,
    },
  
    value: {
      fontSize: 16,
      color: COLORS.text,
      marginTop: 4,
    },
  
  });