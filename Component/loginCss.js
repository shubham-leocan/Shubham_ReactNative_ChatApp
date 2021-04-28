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
    topView:{
    marginLeft:'5%',
    marginTop:'6%',
    flexDirection:'row',
    alignItems:'center'
  },
  headerTop:{
      textAlign:'center',
      fontSize:20,
      opacity:0.8,
      fontWeight:'bold',
      color:'grey'},
      emailView:{marginLeft:'5%',
      height:hp('6.5%'),
      borderColor:'grey',
      borderWidth:1,
      marginRight:'5%',
      marginTop:'5%',
      borderRadius:12,
      width:'90%'
    },
    emailText:{fontSize:16,
        fontWeight:'bold',
        color:'grey',justifyContent:'center',
        marginLeft:'4%',
        alignItems:'center'
    },
    passwordView:{marginLeft:'5%',height:hp('6.5%'),
    borderColor:'grey',
    borderWidth:1,marginRight:'5%',marginTop:'5%',borderRadius:12,width:'90%',flexDirection:'row',justifyContent:'space-between',
    alignItems:'center'},
  });
 