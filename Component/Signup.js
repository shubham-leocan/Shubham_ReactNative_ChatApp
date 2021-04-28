import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity,Alert,LogBox} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Wrong from '../assets/wrong.png';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Eye from '../assets/visibility.png';
import  StyleLogin from './loginCss';
import firebase from '../FireStore';
LogBox.ignoreLogs(['Setting a timer']);
const Signup=({ navigation: { goBack },navigation})=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [name,setName]=useState('');
    const [passwordShow,setPasswordShow]=useState(false);
    var database=firebase.firestore().collection('users');
    const onSignup=()=>{ 
        database.add({
            email:email,
            name:name,
            password:password,
            last_chat:'',
            unread_msg:{}
        }).then((doc)=>{
            database.doc(doc.id).set({
                status:'online',
            },{merge:true}).then(()=>{
                navigation.navigate('Home',{id:doc.id});
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    return(
        <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
           
                <View style={StyleLogin.topView}>
                    <Image source={Wrong} style={{tintColor:'rgb(248, 251, 246)'}}/>
                    <View style={{width:'85%',alignItems:'center'}}>
                        <Text style={StyleLogin.headerTop}>
                        Enter Chat Room
                        </Text>
                    </View> 
                </View>
               
                <View style={{marginTop:'8%'}}>
                <View style={StyleLogin.emailView}>
                        <TextInput placeholder="Name" placeholderTextColor="grey" 
                         style={[StyleLogin.emailText,{marginTop:'2.25%'}]}
                         onChangeText={(text)=>setName(text)}/>
                </View>
                <View style={StyleLogin.emailView}>
                        <TextInput placeholder="email" placeholderTextColor="grey" 
                         style={[StyleLogin.emailText,{marginTop:'2.25%'}]}
                         onChangeText={(text)=>setEmail(text)}/>
                </View>
                <View style={StyleLogin.passwordView}>
                        <TextInput placeholder="Password" secureTextEntry={passwordShow?false:true} placeholderTextColor="grey" style={[StyleLogin.emailText,{width:'80%'}]}  onChangeText={(text)=>setPassword(text)}/>
                       <TouchableOpacity style={{marginRight:'3%'}} onPress={()=>setPasswordShow(!passwordShow)}>
                           <Image source={Eye} style={passwordShow?{tintColor:'blue'}:{tintColor:'black'}}/>
                       </TouchableOpacity>
                </View>
               
                {
                    email!=='' && password!=='' && name!==''?
                    <TouchableOpacity 
                    style={
                    {
                        marginLeft:'5%',height:hp('6%'),borderColor:'#4d74ff',
                        borderWidth:1,marginRight:'5%',marginTop:'5%',borderRadius:12,
                        backgroundColor:'#4d74ff'
                   }
                     } 
                    onPress={onSignup}>
                       <Text style={{textAlign:'center',justifyContent:'center',fontSize:16,fontWeight:'bold',alignItems:'center',marginTop:'2%',color:'white'}}>Sign up</Text>
                   </TouchableOpacity>
               
                : <TouchableOpacity style={{marginLeft:'5%',height:hp('6%'),borderColor:'grey',borderWidth:1,marginRight:'5%',marginTop:'5%',borderRadius:12,backgroundColor:'grey'}} disabled={true} >
                <Text style={{textAlign:'center',justifyContent:'center',fontSize:16,fontWeight:'bold',alignItems:'center',marginTop:'2%',color:"black",opacity:0.5}}>Sign up</Text>
                </TouchableOpacity>}
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',marginTop:'2%'}}>
                    <Text style={{fontSize:18,fontWeight:'bold',color:'blue',opacity:0.7}}>Already Have Account?</Text>
                </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}
export default Signup;

  