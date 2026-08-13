import React, {useEffect, useState} from 'react';

import {View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert} from 'react-native';

import {deleteDoc, doc, getDoc, addDoc, collection, getDocs, query, where, onSnapshot} from 'firebase/firestore';

import { auth, db} from '../firebase/firebaseConfig';

import CustomButton from '../components/CustomButton';

import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
import { scheduleEventReminder } from '../services/notificationService';

export default function EventDetailsScreen({
  route,
}) {

  const { eventId } =
    route.params;

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [joined, setJoined] = 
    useState(false);

  const [participantCount, setParticipantCount] = 
    useState(0);

    useEffect(() => {
      fetchEvent();
      
      const unsubscribe = checkRegistration();
      const unsubscribeParticipants = checkParticipants();

      return () => {
        if (unsubscribe) unsubscribe();
        if (unsubscribeParticipants) unsubscribeParticipants();
      };
    }, []);

    const checkRegistration = () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(

        collection (db, 'registrations'),
        where ('eventId', '==', eventId),
        where ('studentUid', '==', user.uid)
      );

      return onSnapshot (q, snapshot => {
        setJoined(!snapshot.empty);
      });

    };

    const checkParticipants = () => {
      const q = query (
        collection(db, 'registrations'),
        where ('eventId', '==', eventId)
      );

      return onSnapshot(q, snapshot => {
        setParticipantCount(snapshot.size);
      });
    };
  
    const fetchEvent = async () => {
  
      try {

        const eventRef = doc(
          db, 'events', eventId
        );
  
        const eventSnap =
          await getDoc(eventRef);

        if (eventSnap.exists()) {
  
          setEvent({
            id: eventSnap.id,
            ...eventSnap.data(),
          });
        }
      } catch (error) {

        console.log(error);
  
      }
  
      setLoading(false);

    };

  const handleJoinEvent = async () => {

      try {

        const user =
          auth.currentUser;

        if (!user) {

          Alert.alert(
            'Error',
            'Please login first.'
          );

          return;

        }

        // Get student data

        const studentRef = doc(
          db,
          'students',
          user.uid
        );

        const studentSnap =
          await getDoc(
            studentRef
          );

          console.log(studentSnap.exists());
console.log(studentSnap.data());

        const student =
          studentSnap.data();

        // Check duplicate registration

        const q = query(

          collection(
            db,
            'registrations'
          ),

          where(
            'eventId',
            '==',
            eventId
          ),

          where(
            'studentUid',
            '==',
            user.uid
          )

        );

        const existing =
          await getDocs(q);

        if (!existing.empty) {

          Alert.alert(
            'Already Registered',
            'You have already joined this event.'
          );

          return;

        }

        const settingSnap = await getDoc (
          doc (db, 'settings', 'eventLimit')
        );

        const maxLimit = settingSnap.data().limit;

        const registrationSnap = await getDocs(
          query(
            collection(db, 'registrations'),
            where ('studentUid', '==', user.uid)
          )
        );

        if (registrationSnap.size >= maxLimit) {
          Alert.alert(
            'Limit Reached',
            `You can only join a maximum of ${maxLimit} events per semester.`
          );

          return;

        }

        await addDoc(

          collection(db, 'registrations'),

          {
            eventId,
            studentUid: user.uid,
            studentName: student.name,
            studentId: student.studentId,
            registeredAt: new Date(),
          }

        );

        try {
          await scheduleEventReminder(event.title, event.date);
        } catch (reminderError) {
          console.log("Reminder scheduling failed but registration is safe:", reminderError);
        }

        Alert.alert(
          'Success',
          'Event joined successfully!'
        );

      } catch (error) {

        console.log("JOIN EVENT ERROR");
        console.log(error.code);
        console.log(error.message);
        console.log(error);

        Alert.alert(
          'Error',
          'Failed to join event.'
        );

      }

    };

    const handleLeaveEvent = async () => {

      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, 'registrations'),
        where ('eventId', '==', eventId),
        where ('studentUid', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);

        Alert.alert(
          'Sucess',
          'You have left the event.'
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
          color={COLORS.danger}
        />

      </View>

    );

  }

  const isFull = 
  participantCount >= event?.participantLimit;

  return (

    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={
        false
      }
    >

      <Text style={globalStyles.title}>
        Event Details
      </Text>

      <View style={styles.card}>

        <Text style={styles.eventTitle}>
          {event?.title}
        </Text>

        <Text style={styles.label}>
          Date
        </Text>

        <Text style={styles.value}>
          {event?.date}
        </Text>

        <Text style={styles.label}>
          Venue
        </Text>

        <Text style={styles.value}>
          {event?.venue}
        </Text>

        <Text style={styles.label}>
          Category
        </Text>

        <Text style={styles.value}>
          {event?.category}
        </Text>

        <Text style={styles.label}>
          Participant Limit
        </Text>

        <Text style={styles.value}>
          {participantCount} / {event?.participantLimit}
        </Text>

        <Text style={styles.label}>
          Description
        </Text>

        <Text style={styles.value}>
          {event?.description}
        </Text>

      </View>

      <CustomButton
        title={joined? "Leave Event": isFull? "Event Full": "Join Event"}
        color = {joined? COLORS.danger: COLORS.primary}
        onPress={joined? handleLeaveEvent: handleJoinEvent}
        disabled = {!joined && isFull}
      />

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  card: {

    backgroundColor:
      COLORS.white,

    padding: 20,

    borderRadius: 20,

    marginBottom: 20,

    elevation: 3,

  },

  eventTitle: {

    fontSize: 20,

    fontWeight: 'bold',

    color: '#2D2D2D',

    marginBottom: 15,

  },

  label: {

    marginTop: 12,

    fontWeight: '600',

    color: COLORS.text,

  },

  value: {

    marginTop: 4,

    color: COLORS.text,

  },

});