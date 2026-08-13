import React, {
    useEffect,
    useState,
  } from 'react';
  
  import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
  } from 'react-native';
  
  import {
    collection,
    getDocs,
    query,
    where,
  } from 'firebase/firestore';
  
  import {
    db,
  } from '../firebase/firebaseConfig';
  
  import globalStyles from '../styles/globalStyles';
  import COLORS from '../styles/colors';
  
  export default function ParticipantScreen({
    navigation,
  }) {
  
    const [events, setEvents] =
      useState([]);
  
    const [loading, setLoading] =
      useState(true);
  
    useEffect(() => {
  
      fetchEvents();
  
    }, []);
  
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
            [];
  
          for (
            const eventDoc
            of snapshot.docs
          ) {
  
            const participantQuery =
              query(
  
                collection(
                  db,
                  'registrations'
                ),
  
                where(
                  'eventId',
                  '==',
                  eventDoc.id
                )
  
              );
  
            const participantSnap =
              await getDocs(
                participantQuery
              );
  
            eventList.push({
  
              id:
                eventDoc.id,
  
              ...eventDoc.data(),
  
              totalParticipants:
                participantSnap.size,
  
            });
  
          }
  
          setEvents(
            eventList
          );
  
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
  
      <View
        style={
          globalStyles.container
        }
      >
  
        <Text
          style={
            globalStyles.title
          }
        >
          Participants
        </Text>
  
        <FlatList
  
          data={events}
  
          keyExtractor={
            item => item.id
          }
  
          renderItem={({
            item,
          }) => (
  
            <TouchableOpacity
  
              style={
                styles.card
              }
  
              onPress={() =>
  
                navigation.navigate(
                  'ParticipantDetails',
                  {
                    eventId:
                      item.id,
  
                    eventTitle:
                      item.title,
                  }
                )
  
              }
  
            >
  
              <Text
                style={
                  styles.title
                }
              >
                {item.title}
              </Text>
  
              <Text
                style={
                  styles.count
                }
              >
                {item.totalParticipants}
                {' '}
                Participants
              </Text>
  
            </TouchableOpacity>
  
          )}
  
        />
  
      </View>
  
    );
  
  }
  
  const styles =
    StyleSheet.create({
  
      card: {
  
        backgroundColor:
          COLORS.white,
  
        padding: 20,
  
        borderRadius: 20,
  
        marginBottom: 15,
  
        elevation: 3,
  
      },
  
      title: {
  
        fontSize: 18,
  
        fontWeight: 'bold',
  
        color:
          COLORS.primary,
  
      },
  
      count: {
  
        marginTop: 8,
  
        color:
          COLORS.text,
  
      },
  
    });