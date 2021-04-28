import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity,Alert,AppState ,FlatList,BackHandler} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomeCss from './HomeCss';
import Chat from '../assets/chat.png';
import firebase from '../FireStore';

const Home=({navigation,route})=>{
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    var database=firebase.firestore().collection('users');
    const [data,setData]=useState([]);
    const [unread,setUnread]=useState();
    const _handleAppStateChange = (nextAppState) => {
        console.log(nextAppState);
        database.doc(route.params.id).set({
            status:nextAppState=='background'?'offline':'online',
        },{merge:true})
      };
    useEffect(()=>{
     AppState.addEventListener('change', _handleAppStateChange);
     hello();


    },[])
   function hello()
   {    
       var a=[];
      
        database.onSnapshot((quersnapshort)=>{
           a=[];
         const ans=quersnapshort.forEach((doc)=>{
                var b={
                    name:doc.data().name,
                    email:doc.data().email,
                    id:doc.id,
                    status:doc.data().status,
                    unread:doc.data().unread_msg
                }
            if(doc.id!==route.params.id)
            {
              a.push(b);
            }
            else{
                setUnread(doc.data().unread_msg);
            }
            })
            setData(a);
        })
       
    
   }
   const renderItem=({item,index})=>{
        return(
            <TouchableOpacity key={index} style={{width:'100%',backgroundColor:'grey',marginTop:'2%',flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderRadius:7}}
            onPress={()=>{
                if(unread[item.id]!==undefined)
                {
                   
                   unread[item.id].forEach((doc)=>{
                       firebase.firestore().collection('Meassge').doc(doc).set({
                          seen:true,
                      },{merge:true})
                    })
                var a=unread;
                a[item.id]=[];
                firebase.firestore().collection('users').doc(route.params.id).set({
                    unread_msg:a,
                    last_chat:item.id
                },{merge:true}).then((doc)=>{
                    console.log("data updated");
                })
    
            }
                
                navigation.navigate('Meassge',{sendid:route.params.id,reciverId:item.id,token:route.params.token})
            }}
            ><View>
              
              <Text style={{marginLeft:'4%',fontSize:20,fontWeight:'bold',opacity:0.7,paddingTop:"2.5%",paddingBottom:'2.5%'}}>{item.name}</Text>
              <Text style={{marginLeft:'4%',fontSize:16,opacity:0.7,paddingTop:"2.5%",paddingBottom:'2.5%',color:'black'}}>{item.status}</Text>
              </View>
                <View style={{marginTop:'2%',marginBottom:'2%',marginRight:'4%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginLeft:'2%',fontSize:16,opacity:0.7,paddingTop:"2.5%",paddingBottom:'2.5%',color:'black'}}>
                        {unread[item.id]!=undefined && unread[item.id].length>0 ?unread[item.id].length:''}
                    </Text>
                    <Image source={Chat}/>
                    
                </View>
            </TouchableOpacity>
        )
        
   }

    return(
        <SafeAreaView style={{flex:1,backgroundColor:'white'}}> 
                <View style={HomeCss.HeaderView}>
                   <Text style={HomeCss.HeaderText}> Select Your Friend For Chat</Text>
                   <TouchableOpacity onPress={()=>{
                       database.doc(route.params.id).set({
                            status:'offline',
                            last_chat:''
                       },{merge:true}).then(()=>{
                           navigation.navigate('Login');
                       })
                   }}>
                       <Text style={HomeCss.HeaderText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                {data.length>0?
                <View style={{flex:1,marginLeft:'4%',marginRight:'5%',marginTop:'5%'}}>
                        <FlatList data={data} keyExtractor={(item,index)=>index.toString()} renderItem={renderItem}/>
                </View>
                :null
                }
         </SafeAreaView>
    )
}
export default Home;