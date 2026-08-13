import React, { useEffect, useState } from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import EventCard from "../components/EventCard";

import globalStyles from "../styles/globalStyles";
import COLORS from "../styles/colors";

export default function UpcomingEventsScreen({ navigation }) {

  const [events, setEvents] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db,"events"),

      snapshot => {

        const today = new Date();

        const upcoming = snapshot.docs

          .map(doc=>({

            id:doc.id,

            ...doc.data(),

          }))

          .filter(item => {

            if (!item.eventDate) 
              return false;

            return item.eventDate.toDate() >= today;

          });

        setEvents(upcoming);

      }

    );

    return ()=>unsubscribe();

  },[]);

  const getCountdown = (eventDate) => {
    
    const today = new Date();
    const diff = Math.ceil ((eventDate.toDate() - today) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return "TODAY";

    if (diff === 1) return "TOMORROW";

    return `${diff} DAYS LEFT`;
  };

  if (events.length === 0) {
    return (
      <View
        style={[globalStyles.container, {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: COLORS.gray,
          }}
        >
          No upcoming events.
        </Text>
      </View>
    );
  }

  return (

    <View style = {globalStyles.container}>

        <Text style = {globalStyles.title}>Upcoming Events</Text>

        <Text style = {{
          color: COLORS.gray,
          marginBottom: 15,
        }}
      >
        {events.length} Upcoming Events
      </Text>

        <FlatList
            contentContainerStyle = {{
              paddingBottom: 20,
            }}
            data = {events}
            keyExtractor={item => item.id}
            renderItem={({item}) => (

                <TouchableOpacity
                    style = {styles.eventCard}
                    onPress={() => navigation.navigate ("AdminEventDetails", {
                        eventId: item.id,
                        showParticipants: true,
                    }
                    )}
                >

                    <View style = {styles.countdownBadge}>

                      <Text style = {styles.countdownText}>
                        {getCountdown (item.eventDate)}
                      </Text>

                    </View>

                    <Text style = {styles.eventTitle}>{item.title}</Text>

                    <Text
                      numberOfLines={2}
                      style = {styles.eventDescription}
                    >
                      {item.description}
                    </Text>

                    <Text style = {styles.date}>{item.date}</Text>

                    <Text style = {styles.viewDetails}>View Details</Text>

                </TouchableOpacity>
            )}

        />
    </View>
  );
}



const styles=StyleSheet.create({

  eventCard:{
    backgroundColor:"#FFFFFF",
    borderRadius:20,
    padding:20,
    marginBottom:18,
    elevation:4,
  },

  countdownBadge:{
    alignSelf:"flex-start",
    backgroundColor:"#E8F5E9",
    borderRadius:20,
    paddingHorizontal:12,
    paddingVertical:6,
    marginBottom:15,
  },

  countdownText:{
    color:"#2E7D32",
    fontWeight:"700",
  },

  eventTitle:{
    fontSize:20,
    fontWeight:"bold",
    color:"#222",
    marginBottom:8,
  },

  eventDescription:{
    color:"#666",
    lineHeight:22,
    marginBottom:15,
  },

  date:{
    color:"#777",
    marginBottom:15,
  },

  viewDetails:{
    color:COLORS.primary,
    fontWeight:"700",
    textAlign:"right",
  },

});