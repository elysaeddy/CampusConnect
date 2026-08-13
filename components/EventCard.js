import React from 'react';

import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function EventCard({

  event,
  joined,
  onPress,
  hideBadge = false,

}) {

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >

      <Text style={styles.title}>
        {event.title}
      </Text>

      <Text style={styles.info}>
        📅 {event.date}
      </Text>

      <Text style={styles.info}>
        📍 {event.venue}
      </Text>

      <Text style={styles.info}>
        👥 Limit: {event.participantLimit}
      </Text>

      {!hideBadge && (
        joined? (
          <View style = {styles.joinedBadge}>
            <Text style = {styles.joinedText}>Joined</Text>
          </View>
        ) : (
          <View style = {styles.joinedBadge}>
            <Text style = {styles.joinedText}>Available</Text>
          </View>
        )
      )}

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  card: {

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    padding: 20,

    marginBottom: 15,

    shadowColor: '#000',

    shadowOpacity: 0.1,

    shadowRadius: 5,

    elevation: 4,

  },

  title: {

    fontSize: 18,

    fontWeight: 'bold',

    color: '#2D2D2D',

    marginBottom: 10,

  },

  badge: {

    alignSelf: 'flex-start',
  
    marginTop: 12,
  
    paddingHorizontal: 14,
  
    paddingVertical: 6,
  
    borderRadius: 20,
  
  },
  
  badgeText: {
  
    fontWeight: 'bold',
  
    fontSize: 13,
  
  },

  joinedBadge: {
    marginTop: 12,
    backgroundColor: '#E7DFFF',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  joinedText: {
    color: '#8B7CF6',
    fontWeight: 'bold',
  },

  info: {

    color: '#666',

    marginBottom: 5,

  },

});