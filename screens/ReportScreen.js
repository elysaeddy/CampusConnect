import React, {
    useEffect,
    useState,
  } from 'react';
  
  import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
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
  
  export default function ReportScreen() {
  
    const [loading,
      setLoading] =
      useState(true);
  
    const [totalEvents,
      setTotalEvents] =
      useState(0);
  
    const [totalStudents,
      setTotalStudents] =
      useState(0);
  
    const [totalRegistrations,
      setTotalRegistrations] =
      useState(0);
  
    const [popularEvent,
      setPopularEvent] =
      useState('N/A');
  
    useEffect(() => {
  
      fetchReportData();
  
    }, []);
  
    const fetchReportData =
      async () => {
  
        try {
  
          // Events
  
          const eventSnapshot =
            await getDocs(
              collection(
                db,
                'events'
              )
            );
  
          setTotalEvents(
            eventSnapshot.size
          );
  
          // Students
  
          const studentSnapshot =
            await getDocs(
              collection(
                db,
                'students'
              )
            );
  
          setTotalStudents(
            studentSnapshot.size
          );
  
          // Registrations
  
          const registrationSnapshot =
            await getDocs(
              collection(
                db,
                'registrations'
              )
            );
  
          setTotalRegistrations(
            registrationSnapshot.size
          );
  
          // Most Popular Event
  
          let highestCount = 0;
          let highestEvent = 'N/A';
  
          for (const eventDoc of eventSnapshot.docs) {
  
            const registrationQuery =
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
  
            const registrationData =
              await getDocs(
                registrationQuery
              );
  
            if (
              registrationData.size >
              highestCount
            ) {
  
              highestCount =
                registrationData.size;
  
              highestEvent =
                eventDoc.data().title;
  
            }
  
          }
  
          setPopularEvent(
            highestEvent
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
  
      <ScrollView
        style={globalStyles.container}
        showsVerticalScrollIndicator={false}
      >
  
        <Text style={globalStyles.title}>
          Reports
        </Text>
  
        <View style={styles.card}>
  
          <Text style={styles.label}>
            Total Events
          </Text>
  
          <Text style={styles.value}>
            {totalEvents}
          </Text>
  
        </View>
  
        <View style={styles.card}>
  
          <Text style={styles.label}>
            Total Students
          </Text>
  
          <Text style={styles.value}>
            {totalStudents}
          </Text>
  
        </View>
  
        <View style={styles.card}>
  
          <Text style={styles.label}>
            Total Registrations
          </Text>
  
          <Text style={styles.value}>
            {totalRegistrations}
          </Text>
  
        </View>
  
        <View style={styles.card}>
  
          <Text style={styles.label}>
            Most Popular Event
          </Text>
  
          <Text style={styles.value}>
            {popularEvent}
          </Text>
  
        </View>
  
      </ScrollView>
  
    );
  
  }
  
  const styles = StyleSheet.create({
  
    subtitle: {
  
      textAlign: 'center',
  
      color: COLORS.text,
  
      marginBottom: 20,
  
    },
  
    card: {
  
      backgroundColor:
        COLORS.white,
  
      borderRadius: 20,
  
      padding: 20,
  
      marginBottom: 15,
  
      elevation: 3,
  
      alignItems: 'center',
  
    },
  
    label: {
  
      fontSize: 16,
  
      fontWeight: '600',
  
      color: COLORS.text,
  
    },
  
    value: {
  
      fontSize: 28,
  
      fontWeight: 'bold',
  
      color: COLORS.primary,
  
      marginTop: 10,
  
      textAlign: 'center',
  
    },
  
  });