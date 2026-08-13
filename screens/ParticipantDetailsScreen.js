import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
  
import {collection, getDocs, query, where, doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase/firebaseConfig';
  
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
  
export default function ParticipantDetailsScreen({
    route,
  }) {
  
    const {
      eventId,
      eventTitle,
    } = route.params;
  
    const [participants,
      setParticipants] =
      useState([]);
  
    const [loading,
      setLoading] =
      useState(true);
  
    useEffect(() => {
  
      fetchParticipants();
  
    }, []);
  
    const fetchParticipants = async () => {

      try {
    
        const participantQuery = query(
          collection(db, "registrations"),
          where("eventId", "==", eventId)
        );
    
        const snapshot = await getDocs(participantQuery);
    
        const participantList = [];
    
        for (const registration of snapshot.docs) {
    
          const registrationData = registration.data();
    
          const studentSnap = await getDoc(
            doc(db, "students", registrationData.studentUid)
          );
    
          if (studentSnap.exists()) {
    
            participantList.push({
              id: registration.id,
              ...studentSnap.data(),
            });
    
          }
    
        }
    
        setParticipants(participantList);
    
      } catch (error) {
    
        console.log(error);
    
      }
    
      setLoading(false);
    
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
  
    return (
  
      <View style={globalStyles.container}>
  
        <Text style={globalStyles.title}>
          Participants
        </Text>
  
        <Text style={styles.eventTitle}>
          {eventTitle}
        </Text>
  
        {participants.length === 0 ? (
  
          <Text style={styles.emptyText}>
            No participants registered yet.
          </Text>
  
        ) : (
  
          <FlatList
  
            data={participants}
  
            keyExtractor={
              item => item.id
            }
  
            showsVerticalScrollIndicator={
              false
            }
  
            renderItem={({ item }) => (

              <View style={styles.studentCard}>
            
                <View style={styles.avatar}>
            
                  <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
            
                </View>
            
                <View style={{ flex: 1 }}>
            
                  <Text style={styles.studentName}>Name: {item.name}</Text>

                  <Text style={styles.studentInfo}>Student ID: {item.studentId}</Text>
            
                  <Text style={styles.studentInfo}>Course: {item.course}</Text>
            
                  <Text style={styles.studentInfo}>Semester: {item.semester}</Text>

                  <Text style={styles.studentInfo}>Email: {item.email}</Text>
            
                </View>
            
              </View>
            
            )}
  
          />
  
        )}
  
      </View>
  
    );
  
  }
  
  const styles = StyleSheet.create({
  
    eventTitle: {
  
      textAlign: 'center',
  
      fontSize: 16,
  
      color: COLORS.text,
  
      marginBottom: 20,
  
    },
  
    emptyText: {
  
      textAlign: 'center',
  
      marginTop: 40,
  
      color: COLORS.text,
  
    },
  
    studentCard: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 18,
      marginBottom: 15,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 5,
    },
    
    avatar: {
      width: 55,
      height: 55,
      borderRadius: 30,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    
    avatarText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 22,
    },
    
    studentName: {
      fontSize: 18,
      fontWeight: "700",
      color: "#222",
      marginBottom: 8,
    },
    
    studentInfo: {
      color: "#666",
      marginBottom: 4,
      fontSize: 14,
    },
  
  });