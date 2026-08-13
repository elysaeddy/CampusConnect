import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, ScrollView} from 'react-native';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {db, auth} from '../firebase/firebaseConfig';

import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

import EventCard from '../components/EventCard';
  
import globalStyles from '../styles/globalStyles';
import COLORS from '../styles/colors';

export default function HomeScreen({
    navigation,
  }){
    
    const [event, setEvents] =
      useState([]);

    const [categories, setCategories] = 
      useState([]);

    const [selectedCategory, setSelectedCategory] = 
      useState ("All");

    const [eventFilter, setEventFilter] = 
      useState ("All");

    const [joinedEvents, setJoinedEvents] = 
      useState ([]);
  
    const [loading, setLoading] =
      useState(true);

    const [searchText, setSearchText] = 
      useState ("");

    const expired = 
      event.eventDate?.toDate() < new Date();
  
      useEffect (() => {
        const unsubscribe = onSnapshot (
          collection(db, "categories"),

          (snapshot) => {

            const categoryList = snapshot.docs.map(doc => ({

              id: doc.id, ...doc.data(),

            }));

            setCategories(categoryList);

          }
        );

        return () => unsubscribe();
      }, []);
      
      useEffect(() => {

        const unsubscribe = onSnapshot(
      
          collection(db, 'events'),
      
          (snapshot) => {
      
            const eventList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            const today = new Date();

            const availableEvents = eventList.filter(item => {
              return item.eventDate?.toDate() >= today;
            });
      
            setEvents(availableEvents);
      
            setLoading(false);
      
          },
      
          (error) => {
      
            console.log(error);
      
            setLoading(false);
      
          }
      
        );
      
        return () => unsubscribe();
      
      }, []);
      
      useEffect (() => {

        const user = auth.currentUser;

        if (!user) return;
        const q = query (
          collection (db, 'registrations'),
          where ('studentUid', '==', user.uid)
        );

        const unsubscribe = onSnapshot (

          q,
          (snapshot) => {
            const joined = snapshot.docs.map(
              doc => doc.data().eventId
            );

            setJoinedEvents(joined);
          }
        );

        return () => unsubscribe();

      }, []);

      let filteredEvents =
        selectedCategory === "All" ? event: event.filter(
          item => item.category === selectedCategory
        );

    if (eventFilter === "Joined") {
      filteredEvents = filteredEvents.filter(item => joinedEvents.includes(item.id));
    }

    if (eventFilter === "Available") {
      filteredEvents = filteredEvents.filter(item => !joinedEvents.includes(item.id));
    }

    filteredEvents = filteredEvents.filter(
      item => item.title?.toLowerCase().includes (searchText.toLowerCase())
    );
  
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

    const categoryColumns = [];

    for (let i = 0; i<categories.length; i += 2) {
      categoryColumns.push(categories.slice(i, i+2));
    }
  
    return (
  
      <FlatList
        style = {globalStyles.container}
        data = {filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator = {false}

        ListHeaderComponent={
          <>
            <Text style = {styles.title}>
              CampusConnect
            </Text>

            <View style = {styles.topBar}>

              <View style = {styles.searchContainer}>

                <TextInput
                  placeholder='Search events...'
                  value = {searchText}
                  onChangeText={setSearchText}
                  style = {styles.searchInput}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate ("Notification")}
              >

                <Ionicons
                  name = "notifications-outline"
                  size = {28}
                  color = {COLORS.primary}
                />

              </TouchableOpacity>

            </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator = {false}
            contentContainerStyle = {{paddingVertical: 10}}
          >

            {categoryColumns.map((column, index) => (
              <View key = {index} style = {{marginRight: 16}}>
                {column.map((item) => (
                  <TouchableOpacity
                    key = {item.id}
                    style = {[styles.categoryCard, 
                      {backgroundColor: item.color,
                        transform: [
                          {scale: selectedCategory === item.name? 1.12: 0.9,},
                        ],
                        opacity: selectedCategory === item.name? 1: 0.75,
                        borderWidth: selectedCategory === item.name? 3: 0,
                        shadowColor: "#000",
                        shadowOpacity: selectedCategory === item.name? 0.25: 0.1,
                        shadowRadius: selectedCategory === item.name? 8: 3,
                        elevation: selectedCategory === item.name? 8: 3,
                        borderColor: "#FFFFFF",
                      },
                    ]}
                    onPress={() => setSelectedCategory(item.name)}>

                    <Ionicons
                      name = {item.icon}
                      size = {32}
                      color = "#FFFFFF"
                    />

                    <Text style = {styles.categoryText}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          <View
            style = {{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style = {globalStyles.subtitle}>
              {selectedCategory === "All"? "All Events": `${selectedCategory} Events`}
            </Text>

            <TouchableOpacity
              style = {styles.filterButton}
              onPress = {() => {
                if (eventFilter === "All") {
                  setEventFilter("Joined");
                } else if (eventFilter === "Joined") {
                  setEventFilter ("Available");
                } else {
                  setEventFilter ("All");
                }
              }}
            >

              <Ionicons
                name = "filter"
                size = {18}
                color = {COLORS.primary}
              />

              <Text style = {styles.filterText}>
                {eventFilter}
              </Text>
            </TouchableOpacity>
          </View>
          </>
        }

        renderItem={({item}) => {

          const expired = 
            item.eventDate && item.eventDate.toDate()< new Date ();

          return (
          <EventCard
            event={item}
            joined = {joinedEvents.includes(item.id)}
            expired = {expired}
            onPress={() =>
              navigation.navigate ('EventDetails', {eventId: item.id})
            }
          /> 
          );

        }}
        
        ListFooterComponent={<View style = {{height: 20}} />}

      />

    );
  
  }

  const styles = StyleSheet.create ({
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginTop: 90,
      marginBottom: 20,
    },

    topBar: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
    },

    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F1F3F5",
      borderRadius: 15,
      paddingHorizontal: 12,
      marginRight: 12,
    },

    searchInput: {
      flex: 1,
      paddingVertical: 10,
      marginLeft: 8,
      fontSize: 15,
    },

    categoryScroll: {
      paddingBottom: 10,
    },

    categoryContainer: {
      flexDirection: "column",
      flexWrap: "wrap",
      height: 250,
    },

    categoryCard: {

      width: 85,
      height: 85,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
      marginVertical: 7,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    
    categoryIcon: {
      marginBottom: 2,
    },
    
    categoryText: {
      color: "#FFFFFF",
      marginTop: 5,
      fontWeight: "700",
      fontSize: 13,
      textAlign: "center",
    },

    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F3F4F6",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },

    filterText: {
      marginLeft: 5,
      color: COLORS.gray,
      fontWeight: "600",
    },

  });
