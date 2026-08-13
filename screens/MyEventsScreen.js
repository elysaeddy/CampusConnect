import React, {useState, useEffect} from 'react';

import {View, Text, FlatList, ActivityIndicator} from 'react-native';
  
import {collection, query, where, doc, getDoc, onSnapshot} from 'firebase/firestore';
  
import {auth, db} from '../firebase/firebaseConfig';
  
import EventCard from '../components/EventCard';
  
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
  
  export default function MyEventsScreen({
    navigation,
  }) {
  
    const [events, setEvents] =
      useState([]);
  
    const [loading, setLoading] =
      useState(true);

    const [studentName, setStudentName] = 
      useState('');
  
      useEffect(() => {
        fetchStudent();

        const user = auth.currentUser;

        if (!user) return;

        const q = query(
          collection(db, 'registrations'),
          where ('studentUid', '==', user.uid)
        );

        const unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const eventList = [];

            for (const registration of snapshot.docs) {
              const eventSnap = await getDoc(
                doc ( db, 'events', registration.data().eventId)
              );

              if (eventSnap.exists()) {
                eventList.push({
                  id: eventSnap.id,
                  ...eventSnap.data(),
                });
              }
            }

            setEvents (eventList);
            setLoading(false);
          }
        );

        return () => unsubscribe();

      }, []);
  
    const fetchStudent = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const studentSnap = await getDoc(doc(db, 'students', user.uid));

      if (studentSnap.exists()) {
        setStudentName (
          studentSnap.data().name
        );
      }
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
          Hi, {studentName}!
        </Text>

        <Text style={globalStyles.subtitle}>
          You've joined {events.length} {events.length === 1? 'event': 'events'}.
        </Text>
  
        {events.length === 0 ? (
  
          <Text
            style={{
              textAlign: 'center',
              marginTop: 280,
              color: COLORS.text,
            }}
          >
            No events joined yet.
          </Text>
  
        ) : (
  
          <FlatList
  
            data={events}
  
            keyExtractor={(item) =>
              item.id
            }
  
            showsVerticalScrollIndicator={
              false
            }
  
            renderItem={({
              item,
            }) => (
  
              <EventCard
  
                event={item}
  
                onPress={() =>
                  navigation.navigate(
                    'EventDetails',
                    {
                      eventId:
                        item.id,
                    }
                  )
                }

                hideBadge = {true}
  
              />
  
            )}
  
          />
  
        )}
  
      </View>
  
    );
  
  }