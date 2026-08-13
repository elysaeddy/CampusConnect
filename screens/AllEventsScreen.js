import React, { useEffect, useState } from "react";
import {View, FlatList, ActivityIndicator, TouchableOpacity} from "react-native";

import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import EventCard from "../components/EventCard";

import globalStyles from "../styles/globalStyles";
import COLORS from "../styles/colors";

export default function AllEventsScreen({

    navigation,
    
    }) {
    
    const [events,setEvents]=useState([]);
    
    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        const unsubscribe=onSnapshot(
        
            collection(db,"events"), snapshot=>{
        
                const list=snapshot.docs.map(doc=>({
                    id:doc.id,
                    ...doc.data(),
                }));
        
            setEvents(list);
        
            setLoading(false);
        
            }
        
        );
        
        return ()=>unsubscribe();
        
    },[]);

    if(loading) {

        return (
        
            <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{flex:1}}
            />
        
        );
        
    }

    return(

        <FlatList
            style = {globalStyles.container}
            data = {events}
            keyExtractor = {item=>item.id}
            showsVerticalScrollIndicator = {false}

            renderItem = {({item}) => (

                <EventCard
                    event = {item}
                    onPress={() => navigation.navigate ("AdminEventDetails", {
                        eventId: item.id,
                        showParticipants: false,
                    })}
                    hideBadge = {true}
                />
                
            )}

        />

    );
}