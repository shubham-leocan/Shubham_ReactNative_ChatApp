import React,{useState} from 'react';
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity,Alert,LogBox} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    HeaderView:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'5%',
        marginLeft:'2%',
        marginRight:'4%'
    },
    HeaderText:{
        fontSize:18,
        fontWeight:'bold',
        opacity:0.6
    }
  });
 