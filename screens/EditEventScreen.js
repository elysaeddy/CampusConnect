import React, {useEffect, useState} from 'react';
import {ScrollView, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
  
import {doc, getDoc, updateDoc} from 'firebase/firestore';
  
import { Dropdown } from 'react-native-element-dropdown';

import  DateTimePicker  from '@react-native-community/datetimepicker';
  
import {db} from '../firebase/firebaseConfig';
  
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
  
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
  
export default function EditEventScreen({
  route,
  navigation,
  }) {
  
    const { eventId } =
      route.params;
  
    const [title, setTitle] =
      useState('');
  
    const [description,
      setDescription] =
      useState('');
  
    const [date, setDate] =
      useState('');

    const [eventDate, setEventDate] = 
      useState (new Date());

    const [showPicker, setShowPicker] = 
      useState (false);
  
    const [venue, setVenue] =
      useState('');
  
    const [category,
      setCategory] =
      useState('Category');
  
    const categoryData = [
      { label: 'Technology', value: 'Technology' },
      { label: 'Academic', value: 'Academic' },
      { label: 'Leadership', value: 'Leadership' },
      { label: 'Sports', value: 'Sports' },
      { label: 'Volunteer', value: 'Volunteer' },
      { label: 'Entrepreneurship', value: 'Entrepreneurship' },
      { label: 'Club & Association', value: 'Club & Association' },
      { label: 'Arts', value: 'Arts' },
    ];
  
    const [participantLimit,
      setParticipantLimit] =
      useState('');
  
    useEffect(() => {
  
      fetchEvent();
  
    }, []);
  
    const fetchEvent =
      async () => {
  
        try {
  
          const eventRef =
            doc(
              db,
              'events',
              eventId
            );
  
          const eventSnap =
            await getDoc(
              eventRef
            );
  
          if (
            eventSnap.exists()
          ) {
  
            const data =
              eventSnap.data();
  
            setTitle(
              data.title
            );
  
            setDescription(
              data.description
            );
  
            setDate(
              data.date
            );
  
            setVenue(
              data.venue
            );
  
            setCategory(
              data.category
            );
  
            setParticipantLimit(
              String(
                data.participantLimit
              )
            );

            if (data.eventDate) {
              setEventDate (data.eventDate.toDate());
            }
  
          }
  
        } catch (error) {
  
          console.log(error);
  
        }
  
      };
  
    const handleUpdate =
      async () => {
  
        try {
  
          await updateDoc(
  
            doc(
              db,
              'events',
              eventId
            ),
  
            {
  
              title,
              description,
              date: eventDate.toLocaleDateString ("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              eventDate,
              venue,
              category,
  
              participantLimit:
                Number(
                  participantLimit
                ),
  
            }
  
          );
  
          Alert.alert(
            'Success',
            'Event updated successfully.'
          );
  
          navigation.goBack();
  
        } catch (error) {
  
          console.log(error);
  
          Alert.alert(
            'Error',
            'Failed to update event.'
          );
  
        }
  
      };
  
    return (
  
      <ScrollView
        style={
          globalStyles.container
        }
      >
  
        <Text
          style={
            globalStyles.title
          }
        >
          Edit Event
        </Text>
  
        <InputField
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
  
        <InputField
          placeholder="Description"
          value={description}
          onChangeText={
            setDescription
          }
          multiline
        />

        <TouchableOpacity
          style = {{
            backgroundColor: "#FFFFFF",
            padding: 16,
            borderRadius: 15,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "#E5E5E5",
          }}
          onPress={() => setShowPicker(true)}
        >
          <Text>
            {eventDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })},

          </Text>
        </TouchableOpacity>
  
        {showPicker && (

<DateTimePicker
  value = {eventDate}
  mode = "date"
  display = "spinner"
  onChange={(_, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  }}
/>
)}
  
        <InputField
          placeholder="Venue"
          value={venue}
          onChangeText={setVenue}
        />
  
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={categoryData}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={category}
          onChange={item => {
            setCategory(item.value);
          }}
        />
  
        <InputField
          placeholder="Participant Limit"
          value={
            participantLimit
          }
          onChangeText={
            setParticipantLimit
          }
          keyboardType="numeric"
        />
  
        <CustomButton
          title="Update Event"
          onPress={
            handleUpdate
          }
        />
  
      </ScrollView>
  
    );
  
  }

  const styles = StyleSheet.create({
  
    subtitle: {
  
      textAlign: 'center',
  
      color: COLORS.text,
  
      marginBottom: 20,
  
    },
  
    dropdown: {

      backgroundColor: COLORS.white,
    
      borderRadius: 15,
    
      paddingHorizontal: 15,
    
      height: 55,
    
      marginBottom: 15,
    
      borderWidth: 1,
    
      borderColor: '#E5E5E5',
    
    },
    
    placeholderStyle: {
    
      color: '#999',
    
    },
    
    selectedTextStyle: {
    
      color: COLORS.text,
    
    },

    dateText: {
      fontSize: 16,
      color: "#333",
    },
  
  });