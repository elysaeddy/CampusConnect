import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
  
import {collection, onSnapshot} from 'firebase/firestore';
  
import {db} from '../firebase/firebaseConfig';
  
  import CustomButton from '../components/CustomButton';
  
  import globalStyles from '../styles/globalStyles';
  import COLORS from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

  export default function AdminDashboardScreen({
    navigation,
  }) {
  
    const [totalEvents, setTotalEvents] =
      useState(0);

    const [upcomingEvents, setUpcomingEvents] = 
      useState (0);

    useEffect(() => {

      const unsubscribeEvents = onSnapshot(
        collection(db, 'events'),
        (snapshot) => 
        {
          setTotalEvents(snapshot.size);
          const today = new Date();
          const upcoming = snapshot.docs.filter(doc => {
            const data = doc.data();
            return data.eventDate?.toDate() >= today;
          });
          setUpcomingEvents(upcoming.length);
        },
      );

      return () => {
        unsubscribeEvents();
      };
  
    }, []);
  
    return (
  
      <ScrollView style={globalStyles.container}>
  
        <Text style={globalStyles.title}>
          Welcome Back, Admin!
        </Text>

        <Text style = {styles.welcomeSubtitle}>Manage all CampusConnect events here.</Text>
  
        <View style={styles.cardContainer}>
  
          <TouchableOpacity
            style = {styles.dashboardCard}
            onPress={() => navigation.navigate("UpcomingEvents")}
          >

            <Ionicons
              name = "time-outline"
              size = {34}
              color = {COLORS.primary}
            />

            <Text style = {styles.cardHeading}>Upcoming</Text>

            <Text style = {styles.cardValue}>{upcomingEvents}</Text>

          </TouchableOpacity>

          <TouchableOpacity
            style = {styles.dashboardCard}
            onPress={() => navigation.navigate("AllEvents")}
          >

            <Ionicons
              name = "calendar-outline"
              size = {34}
              color = {COLORS.primary}
            />

            <Text style = {styles.cardHeading}>Events</Text>

            <Text style = {styles.cardValue}>{totalEvents}</Text>

          </TouchableOpacity>
  
        </View>
  
        <CustomButton
          title="Add Event"
          onPress={() =>
            navigation.navigate(
              'AddEvent'
            )
          }
        />
  
        <CustomButton
          title="Participants"
          onPress={() =>
            navigation.navigate(
              'Participants'
            )
          }
        />
  
      </ScrollView>
  
    );
  
  }
  
  const styles = StyleSheet.create({
    
    welcomeSubtitle: {
      color: "#777",
      marginBottom: 20,
    },
    
    cardContainer:{
      marginTop:25,
    },
      
    dashboardCard:{
      backgroundColor:"#FFFFFF",
      borderRadius:20,
      padding:22,
      marginBottom:18,
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
      
    cardTitle:{
      fontSize:18,
      fontWeight:"700",
      marginTop: 10,
    },
  
    cardValue: {
      fontSize: 38,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginTop: 15,
    },

    cardHeading: {
      fontSize: 18,
      fontWeight: "700",
      color: "#222",
      marginTop: 10,
    },
  
  });