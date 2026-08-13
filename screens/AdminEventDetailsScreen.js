import React, { useEffect, useState } from "react";

import {View, Text, StyleSheet, ActivityIndicator, FlatList} from "react-native";

import {doc, getDoc, collection, query, where, onSnapshot} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import globalStyles from "../styles/globalStyles";
import COLORS from "../styles/colors";

export default function AdminEventDetailsScreen({

    route,
    
    }) {
    
    const { eventId, showParticipants } = route.params;
    
    const [event,setEvent]=useState(null);
    
    const [students,setStudents]=useState([]);
    
    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        fetchEvent();
        
        let unsubscribe;

        if(showParticipants)
           unsubscribe = fetchParticipants();

        return () => {
            if (unsubscribe)
                unsubscribe();
        };
        
    },[]);

    const fetchEvent = async()=>{

        const snap=await getDoc(
        
        doc(db,"events",eventId)
        
        );
        
        if(snap.exists()){
        
        setEvent({
        
        id:snap.id,
        
        ...snap.data(),
        
        });
        
        }
        
        setLoading(false);
        
        };

        const fetchParticipants=()=>{

            const q=query(
                collection(db,"registrations"),
                where("eventId","==",eventId)
            );
            
            const unsubscribe=onSnapshot(
                q,
            
                async(snapshot)=>{
            
                    const list=[];
            
                    for(const registration of snapshot.docs) {
            
                        const studentSnap=await getDoc(
                            doc(db, "students", registration.data().studentUid));
            
                        if(studentSnap.exists()) {
                            list.push(studentSnap.data());
                        }
                    }
            
                    setStudents(list);
            
                }
            
            );
            
            return unsubscribe;
            
        };

        if(loading) {

            return(
            
                <View
                    style={[globalStyles.container, {
                        justifyContent:"center",
                        alignItems:"center"
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

        {showParticipants && (
            <>

                <Text style = {styles.label}>Registered</Text>

                <Text style = {styles.value}>{students.length} / {event.participantLimit}</Text>
            
            </>
        )}

        return (

            <FlatList
                style={globalStyles.container}
                data={showParticipants?students:[]}
                keyExtractor={(item,index)=>index.toString()}

                ListEmptyComponent = {
                    showParticipants? (
                        <Text style = {styles.emptyText}>No students have registered yet.</Text>
                    ) : null
                }
                
                ListHeaderComponent={

                    <>

                    <Text style = {globalStyles.title}>{event.title}</Text>

                    <View style = {styles.card}>

                        <Text style = {styles.label}>Description</Text>
                        <Text style = {styles.value}>{event.description}</Text>

                        <Text style = {styles.label}>Date</Text>
                        <Text style = {styles.value}>{event.date}</Text>

                        <Text style = {styles.label}>Venue</Text>
                        <Text style = {styles.value}>{event.venue}</Text>

                        <Text style = {styles.label}>Category</Text>
                        <Text style = {styles.value}>{event.category}</Text>

                        {showParticipants && (
                            <>
                            <Text style = {styles.label}>Participants</Text>
                            
                            <Text style = {styles.value}>{students.length} / {event.participantLimit}</Text>
                            </>
                        )}

                    </View>

                    {showParticipants && (
                        <Text style={globalStyles.subtitle}>Registered Students</Text>
                    )}

                    </>
                }

                renderItem={({item})=>(

                    <View style={styles.studentCard}>
                    
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentId}>{item.studentId}</Text>
                    
                    </View>
                    
                )}
            />
        )
    }

    const styles=StyleSheet.create({

        card:{
            backgroundColor:"#FFF",
            padding:20,
            borderRadius:20,
            marginBottom:20,
            elevation:4,
        },
                
        label:{
            fontWeight:"700",
            marginTop:15,
            color:COLORS.primary,
        },
                
        value:{
            fontSize:16,
            marginTop:5,
        },
                
        studentCard:{
            backgroundColor:"#FFF",
            padding:15,
            borderRadius:15,
            marginBottom:12,
            elevation:2,
        },
                
        studentName:{
            fontWeight:"700",
            fontSize:16,
        },
                
        studentId:{
            marginTop:4,
            color:"#777",
        },

        emptyText: {
            textAlign: "center",
            color: "#888",
            marginTop: 30,
        },
                
    });