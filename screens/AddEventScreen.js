import React, {useState} from 'react';
import {ScrollView, Text, Alert, StyleSheet, View, TouchableOpacity, Platform} from 'react-native';

import {addDoc, collection, Timestamp} from 'firebase/firestore';
  
import { Dropdown } from 'react-native-element-dropdown';
  
import {db} from '../firebase/firebaseConfig';

import DateTimePicker from '@react-native-community/datetimepicker'
  
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
  
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';
  
export default function AddEventScreen({
  navigation,
  }) {
  
    const [title, setTitle] =
      useState('');
  
    const [description,
      setDescription] =
      useState('');

    const [eventDate, setEventDate] =
      useState(new Date());

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
  
    const handleAddEvent =
      async () => {
  
        if (
          !title ||
          !description ||
          !venue ||
          !category ||
          !participantLimit
        ) {
  
          Alert.alert(
            'Error',
            'Please fill in all fields.'
          );
  
          return;
  
        }
  
        try {
  
          await addDoc(
  
            collection(
              db,
              'events'
            ),
  
            {
  
              title,
  
              description,
  
              date: eventDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),

              eventDate: Timestamp.fromDate(eventDate),
  
              venue,
  
              category,
  
              participantLimit:
                Number(
                  participantLimit
                ),
  
              createdAt:
                new Date(),
  
            }
  
          );
  
          Alert.alert(
            'Success',
            'Event added successfully.'
          );
  
          navigation.goBack();
  
        } catch (error) {
  
          console.log(error);
  
          Alert.alert(
            'Error',
            'Failed to add event.'
          );
  
        }
  
      };
  
    return (
  
      <ScrollView
        style={globalStyles.container}
        showsVerticalScrollIndicator={
          false
        }
      >
  
        <Text style={globalStyles.title}>
          Add Event
        </Text>
  
        <InputField
          placeholder="Event Title"
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
          title="Add Event"
          onPress={
            handleAddEvent
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
  
  });