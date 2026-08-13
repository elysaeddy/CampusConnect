import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
  
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore';

import {db} from '../firebase/firebaseConfig';

import { useFocusEffect } from '@react-navigation/native';
  
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
  
export default function ManageEventsScreen({
  navigation,
  }) {
  
    const [events, setEvents] =
      useState([]);
  
    const [loading, setLoading] =
      useState(true);
  
      useFocusEffect(

        useCallback(() => {
      
          fetchEvents();
      
        }, [])
      
      );
  
    const fetchEvents =
      async () => {
  
        try {
  
          const snapshot =
            await getDocs(
              collection(
                db,
                'events'
              )
            );
  
          const eventList =
            snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data(),
              })
            );
  
          setEvents(eventList);
  
        } catch (error) {
  
          console.log(error);
  
        }
  
        setLoading(false);
  
      };
  
    const handleDelete =
      (eventId) => {
  
        Alert.alert(
          'Delete Event',
          'Are you sure you want to delete this event?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
  
            {
              text: 'Delete',
  
              style:
                'destructive',
  
              onPress:
                async () => {
  
                  try {
  
                    await deleteDoc(
                      doc(
                        db,
                        'events',
                        eventId
                      )
                    );
  
                    fetchEvents();
  
                    Alert.alert(
                      'Success',
                      'Event deleted successfully.'
                    );
  
                  } catch (error) {
  
                    console.log(error);
  
                    Alert.alert(
                      'Error',
                      'Failed to delete event.'
                    );
  
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
  
    return (
  
      <View style={globalStyles.container}>
  
        <Text style={globalStyles.title}>
          Manage Events
        </Text>
  
        <FlatList
  
          data={events}
  
          keyExtractor={(item) =>
            item.id
          }
  
          showsVerticalScrollIndicator={
            false
          }
  
          renderItem={({ item }) => (
  
            <View style={styles.card}>
  
              <Text style={styles.title}>
                {item.title}
              </Text>
  
              <Text style={styles.info}>
                📅 {item.date}
              </Text>
  
              <Text style={styles.info}>
                📍 {item.venue}
              </Text>
  
              <Text style={styles.info}>
                👥 Limit: {item.participantLimit}
              </Text>
  
              <View
                style={
                  styles.buttonContainer
                }
              >
  
                <TouchableOpacity
  
                  style={
                    styles.editButton
                  }
  
                  onPress={() =>
                    navigation.navigate(
                      'EditEvent',
                      {
                        eventId:
                          item.id,
                      }
                    )
                  }
  
                >
  
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    Edit
                  </Text>
  
                </TouchableOpacity>
  
                <TouchableOpacity
  
                  style={
                    styles.deleteButton
                  }
  
                  onPress={() =>
                    handleDelete(
                      item.id
                    )
                  }
  
                >
  
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    Delete
                  </Text>
  
                </TouchableOpacity>
  
              </View>
  
            </View>
  
          )}
  
        />
  
      </View>
  
    );
  
  }
  
  const styles = StyleSheet.create({
  
    card: {
  
      backgroundColor:
        COLORS.white,
  
      borderRadius: 20,
  
      padding: 15,
  
      marginBottom: 15,
  
      elevation: 3,
  
    },
  
    title: {
  
      fontSize: 18,
  
      fontWeight: 'bold',
  
      color: COLORS.primary,
  
      marginBottom: 8,
  
    },
  
    info: {
  
      color: COLORS.text,
  
      marginBottom: 4,
  
    },
  
    buttonContainer: {
  
      flexDirection: 'row',
  
      justifyContent:
        'space-between',
  
      marginTop: 15,
  
    },
  
    editButton: {
  
      flex: 1,
  
      backgroundColor:
        COLORS.primary,
  
      padding: 10,
  
      borderRadius: 10,
  
      marginRight: 5,
  
      alignItems:
        'center',
  
    },
  
    deleteButton: {
  
      flex: 1,
  
      backgroundColor:
        '#FF6B6B',
  
      padding: 10,
  
      borderRadius: 10,
  
      marginLeft: 5,
  
      alignItems:
        'center',
  
    },
  
    buttonText: {
  
      color: '#FFFFFF',
  
      fontWeight: 'bold',
  
    },
  
  });