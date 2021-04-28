import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity,Alert,LogBox} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Wrong from '../assets/wrong.png';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Eye from '../assets/visibility.png';
import  StyleLogin from './loginCss';
import firebase from '../FireStore';
import * as Notifications from 'expo-notifications';
import { configureFonts } from 'react-native-paper';
LogBox.ignoreLogs(['Setting a timer']);
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
const Login=({ navigation: { goBack },navigation})=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [passwordShow,setPasswordShow]=useState(false);
    var database=firebase.firestore().collection('users');
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
        });
      }, []);
      async function registerForPushNotificationsAsync() {
      let  token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
      }
    const onSignup=()=>{ 
        console.log("click",expoPushToken);

            database.where('email','==',email).get().then((querySnapShort)=>{
                    console.log(querySnapShort.size);
                querySnapShort.forEach((doc)=>{
                   if(doc.data().password===password)
                   {
                    database.doc(doc.id).set({
                        status:'online',
                        token:expoPushToken
                    },{merge:true}).then(()=>{
                        setEmail('');
                        setPassword('');
                        navigation.navigate('Home',{id:doc.id,token:doc.data().token});
                    })
                   }
                   else{
                       Alert.alert("email or password is Wrong");
                   }
                })       
            });
        
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
                <View style={{marginTop:'10%'}}>
                <View style={StyleLogin.emailView}>
                        <TextInput placeholder="email" placeholderTextColor="grey" 
                         style={[StyleLogin.emailText,{marginTop:'2.25%'}]}
                         onChangeText={(text)=>setEmail(text)}
                         value={email}
                         />
                </View>
                <View style={StyleLogin.passwordView}>
                        <TextInput placeholder="Password" secureTextEntry={passwordShow?false:true} placeholderTextColor="grey" 
                        style={[StyleLogin.emailText,{width:'80%'}]} 
                        value={password}
                        onChangeText={(text)=>setPassword(text)}/>
                       <TouchableOpacity style={{marginRight:'3%'}} onPress={()=>setPasswordShow(!passwordShow)}>
                           <Image source={Eye} style={passwordShow?{tintColor:'blue'}:{tintColor:'black'}}/>
                       </TouchableOpacity>
             
                </View>
                {
                    email!=='' && password!==''?
                    <TouchableOpacity 
                    style={
                    {
                        marginLeft:'5%',height:hp('6%'),borderColor:'#4d74ff',
                        borderWidth:1,marginRight:'5%',marginTop:'5%',borderRadius:12,
                        backgroundColor:'#4d74ff'
                   }
                     } 
                    onPress={onSignup}>
                       <Text style={{textAlign:'center',justifyContent:'center',fontSize:16,fontWeight:'bold',alignItems:'center',marginTop:'2%',color:'white'}}>Sign in</Text>
                   </TouchableOpacity>
               
                : <TouchableOpacity style={{marginLeft:'5%',height:hp('6%'),borderColor:'grey',borderWidth:1,marginRight:'5%',marginTop:'5%',borderRadius:12,backgroundColor:'grey'}} disabled={true} >
                <Text style={{textAlign:'center',justifyContent:'center',fontSize:16,fontWeight:'bold',alignItems:'center',marginTop:'2%',color:"black",opacity:0.5}}>Sign in</Text>
                </TouchableOpacity>}
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',marginTop:'2%'}}
                onPress={()=>navigation.navigate('Signup')}
                >
                    <Text style={{fontSize:18,fontWeight:'bold',color:'blue',opacity:0.7}}>Sign Up?</Text>
                </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}

export default Login;
