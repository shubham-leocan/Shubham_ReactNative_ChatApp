import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat} from 'react-native-gifted-chat'
import firebase from '../FireStore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getDocumentAsync } from 'expo-document-picker';
import Popover from 'react-native-popover-view';
import Dialog, { DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { ProgressBar, Colors } from 'react-native-paper';
import Play from '../assets/play.png';
import { Audio,Video } from 'expo-av';
import Pause from '../assets/pause.png';
import Doc from '../assets/docs.png';
import PlayGif from '../assets/playgif.gif';
import * as Linking from 'expo-linking';

const Message = ({ navigation, route }) => {
    const [messages, setMessages] = useState([]);
    const [userStatus, setUserStatus] = useState();
    const [lastChat, setLastchat] = useState('');
    const [usename, setUsername] = useState('');
    const [imgae, setImgae] = useState('');
    const [play,setPlay]=useState(false);
    const [proress,setProgess]=useState(0);
    const [previousAudio,setPrevios]=useState('');
    const [sound,setSound]=useState(new Audio.Sound());
    const [File,setFile]=useState({
        name:'',
        uri:''
    })
    const [audioUri, setAudioUri] = useState({
        name: '',
        uri: ''
    });
    const [videouri,setVideoUri]=useState({
        name:'',
        uri:''
    });
   // var progress=0;
    const [showPopover, setShowPopover] = useState(false);

    var database = firebase.firestore().collection('Meassge');
    var table = firebase.firestore().collection('users');
    useEffect(() => {
        const ac = new AbortController();
        Promise.all([
            table.doc(route.params.reciverId).onSnapshot((doc) => {
                setUsername(doc.data().name);
                setLastchat(doc.data().last_chat == route.params.sendid ? true : false);
                setUserStatus(doc.data().status === 'offline' ? false : true);
            }),
            database.orderBy('time', "desc").onSnapshot(getmsg, onError)
        ])
        return ac.abort();
        function onError(error) {
            console.error(error);
        }
    }, [])
    async function getmsg(QuerySnapshot) {
        let a = [];
        try {
            if (QuerySnapshot !== undefined) {
                QuerySnapshot.forEach((doc) => {

                    if (doc.data().sender_id == route.params.sendid && doc.data().reciver_id == route.params.reciverId) {

                        const b = {
                            _id: doc.id,
                            text: doc.data().msg,
                            createdAt: new Date(doc.get('time').toDate()),
                            user: {
                                _id: route.params.sendid
                            },
                            sent: true,
                            image: doc.data().image,
                            received: JSON.parse(doc.data().seen),
                            audio:doc.data().audio,
                            video:doc.data().video,
                            doc:doc.data().doc,
                            docname:doc.data().docname
                        }
                        a.push(b);
                    }
                    if (doc.data().sender_id == route.params.reciverId && doc.data().reciver_id == route.params.sendid) {
                        const b = {
                            _id: doc.id,
                            text: doc.data().msg,
                            createdAt: new Date(doc.get('time').toDate()),
                            user: {
                                _id: route.params.reciverId
                            },
                            image: doc.data().image,
                            sent: userStatus,
                           audio:doc.data().audio,
                           doc:doc.data().doc,
                            //received: JSON.parse('recived'),
                        }
                        a.push(b);
                    }
                })


                setMessages(a);
            }

        } catch (error) {
            console.log(error);
        }

    }
    const onSend = async (messages = [],) => {
        database.add({
            sender_id: route.params.sendid,
            reciver_id: route.params.reciverId,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            msg: messages[0].text,
            seen: userStatus && lastChat
        }).then((doce) => {
            sendPushNotification();
            if (userStatus === false && lastChat === false) {
                firebase.firestore().collection('users').doc(route.params.reciverId).get().then((doc) => {
                    var a = {};
                    let key = route.params.sendid;
                    a = doc.data().unread_msg;
                    if (a[key] == undefined) {
                        a[key] = [doce.id];
                        console.log(a);
                    }
                    else {
                        let array = a[key];
                        array.push(doce.id);
                        a[key] = array
                    }
                    firebase.firestore().collection('users').doc(route.params.reciverId).set({
                        unread_msg: a
                    }, { merge: 'true' }).then(() => {
                        console.log("data updated");
                    })
                })
            }
            else {
                console.log("false");
            }
        })
    }
    const showPicker = React.useCallback(async () => {
        const file = await getDocumentAsync({
            copyToCacheDirectory: false,
            type: 'image/*',

        });
        if (file.type === 'success') {
            setImgae(file.uri);
            console.log("hello");
            setShowPopover(true);
        }
    }, []);



    const showPicker2 = React.useCallback(async () => {
        setProgess(0);
        const file = await getDocumentAsync({
            copyToCacheDirectory: false,
            type: 'audio/*',
        });
        if (file.type === 'success') {
            setAudioUri(({ name: file.name, uri: file.uri }))
            setShowPopover(true);
        }
    }, []);
    const showPicker3 = React.useCallback(async () => {
        //setProgess(0);
        const file = await getDocumentAsync({
            copyToCacheDirectory: false,
            type: 'video/*',
        });
        if(file.type==='success')
        {
        setVideoUri({
            name:file.name,
            uri:file.uri,           
        })
        setShowPopover(true);
    }
    }, []);

    const showPicker4 = React.useCallback(async () => {
        //setProgess(0);
        const file = await getDocumentAsync({
            copyToCacheDirectory: false,
            type: 'application/*',
        });
        if(file.type==='success')
        {
            setFile({
                name:file.name,
                uri:file.uri
            })
            setShowPopover(true);
        }
    }, []);
    const FileUpload=async(filedata)=>{
        const response = await fetch(filedata);
        const blob = await response.blob();
        var Filename = Date.now().toString();
        var ref = firebase.storage().ref('Document').child(Filename).put(blob);
         ref.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapsort) => {
               var progress = (snapsort.bytesTransferred / snapsort.totalBytes) * 100;
                setProgess(progress/100);
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error.code);
              }, 
            () => {
                ref.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    database.add({
                        sender_id: route.params.sendid,
                        reciver_id: route.params.reciverId,
                        time: firebase.firestore.FieldValue.serverTimestamp(),
                        msg: '',
                        seen: userStatus && lastChat,
                        doc:downloadURL,
                        docname:File.name
                    }).then((doce) => {
                        setShowPopover(false);
                        setProgess(0);
                        if (userStatus === false && lastChat === false) {
                            firebase.firestore().collection('users').doc(route.params.reciverId).get().then((doc) => {
                                var a = {};
                                let key = route.params.sendid;
                                a = doc.data().unread_msg;
                                if (a[key] == undefined) {
                                    a[key] = [doce.id];
                                    console.log(a);
                                }
                                else {
                                    let array = a[key];
                                    array.push(doce.id);
                                    a[key] = array
                                }
                                firebase.firestore().collection('users').doc(route.params.reciverId).set({
                                    unread_msg: a
                                }, { merge: 'true' }).then(() => {
                                    console.log("data updated");
                                })
                            })
                        }
                    }) 
                });
            }

        );
    }
    const renderview=(props)=>{
       
        if(props.currentMessage.doc!==undefined)
        {
            return<View style={{paddingLeft:10,paddingRight:5,paddingTop:5,paddingBottom:5}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                   <Image source={Doc}  style={{tintColor:"white"}}/>
                   <Text style={{color:'white',marginLeft:'5%',marginRight:'0%'}}>{props.currentMessage.docname}</Text>          
               </View>
               <TouchableOpacity style={{marginTop:'1%',justifyContent:'center',flexDirection:'row'}} onPress={()=>{
            Linking.openURL(`${props.currentMessage.doc}`);
               }}>
                   <Text style={{fontSize:16}} >Open</Text>
               </TouchableOpacity>
            </View>
        }
    }
    async function sendPushNotification() {
        const message = {
          to: route.params.token,
          sound: 'default',
          title: 'Original Title',
          body: 'And here is the body!',
          data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      }
    const auidoUpload = async (audio) => {
        const response = await fetch(audio);
        const blob = await response.blob();
        var audioname = Date.now().toString();
        var ref = firebase.storage().ref('audio').child(audioname).put(blob);
         ref.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapsort) => {
               var progress = (snapsort.bytesTransferred / snapsort.totalBytes) * 100;
                setProgess(progress/100);
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error.code);
              }, 
            () => {
                ref.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    database.add({
                        sender_id: route.params.sendid,
                        reciver_id: route.params.reciverId,
                        time: firebase.firestore.FieldValue.serverTimestamp(),
                        msg: '',
                        seen: userStatus && lastChat,
                        audio:downloadURL
                    }).then((doce) => {
                        setShowPopover(false);
                        setProgess(0);
                        if (userStatus === false && lastChat === false) {
                            firebase.firestore().collection('users').doc(route.params.reciverId).get().then((doc) => {
                                var a = {};
                                let key = route.params.sendid;
                                a = doc.data().unread_msg;
                                if (a[key] == undefined) {
                                    a[key] = [doce.id];
                                    console.log(a);
                                }
                                else {
                                    let array = a[key];
                                    array.push(doce.id);
                                    a[key] = array
                                }
                                firebase.firestore().collection('users').doc(route.params.reciverId).set({
                                    unread_msg: a
                                }, { merge: 'true' }).then(() => {
                                    console.log("data updated");
                                })
                            })
                        }
                    }) 
                });
            }

        );
    }
    const videoUpload=async(Video)=>{
        const response = await fetch(Video);
        const blob = await response.blob();
        var videoname = Date.now().toString();
        var ref = firebase.storage().ref('video').child(videoname).put(blob);
         ref.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapsort) => {
               var progress = (snapsort.bytesTransferred / snapsort.totalBytes) * 100;
                setProgess(progress/100);
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error.code);
              }, 
            () => {
                ref.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    database.add({
                        sender_id: route.params.sendid,
                        reciver_id: route.params.reciverId,
                        time: firebase.firestore.FieldValue.serverTimestamp(),
                        msg: '',
                        seen: userStatus && lastChat,
                        video:downloadURL
                    }).then((doce) => {
                        setShowPopover(false);
                        setProgess(0);
                        if (userStatus === false && lastChat === false) {
                            firebase.firestore().collection('users').doc(route.params.reciverId).get().then((doc) => {
                                var a = {};
                                let key = route.params.sendid;
                                a = doc.data().unread_msg;
                                if (a[key] == undefined) {
                                    a[key] = [doce.id];
                                    console.log(a);
                                }
                                else {
                                    let array = a[key];
                                    array.push(doce.id);
                                    a[key] = array
                                }
                                firebase.firestore().collection('users').doc(route.params.reciverId).set({
                                    unread_msg: a
                                }, { merge: 'true' }).then(() => {
                                    console.log("data updated");
                                })
                            })
                        }
                    }) 
                });
            }

        );
    }
const playAudio=async(url)=>{
    console.log("click");
    if(previousAudio!==url)
    {
        setSound(new Audio.Sound());
         await sound.loadAsync({uri:url});
         setSound(sound);
        setPlay(true);
        setPrevios(url);
        await sound.playAsync();
    }
    else{
        
        if(play===true)
        {
            setPlay(!play);
            console.log("called");
            await sound.pauseAsync();
           
        }
        else
        {
            setPlay(!play);
            console.log("called2");
            await sound.playAsync();
           
        }
    }
 
}
const RederAudio=(props)=>{
        return(
       <View style={{padding:10}}>
           <TouchableOpacity onPress={(()=>playAudio(props.currentMessage.audio))}>
            {
                play?
                <View  style={{flexDirection:'row'}}>
                    <Image source={Pause} />
                    
                    <Image source={PlayGif} style={{height:30,marginLeft:'10%',width:'50%'}}/>
                </View>
                :<View>
                       <Image source={Play}/>
                 </View>
            }
               
          </TouchableOpacity>
       </View>
            
        )
}
const RenderVideo=(props)=>{
    return<View style={{padding:20}}>
                <Video
                 resizeMode="contain"
                 useNativeControls
                 shouldPlay={false}
                 source={{ uri: props.currentMessage.video }}
                 style={{height:200,width:300}}
                 />
        </View>
}

    const UploadFile = async (imagename) => {
        const response = await fetch(imagename);
        const blob = await response.blob();
        var imagename = Date.now().toString();
        var ref = firebase.storage().ref().child(imagename);
        ref.put(blob).then(() => {
            console.log("uploaded");
            setShowPopover(false);
            var imageref = firebase.storage().ref(imagename);
            imageref.getDownloadURL().then((url) => {
                database.add({
                    sender_id: route.params.sendid,
                    reciver_id: route.params.reciverId,
                    time: firebase.firestore.FieldValue.serverTimestamp(),
                    msg: '',
                    seen: userStatus && lastChat,
                    image: url
                }).then((doce) => {
                    if (userStatus === false && lastChat === false) {
                        firebase.firestore().collection('users').doc(route.params.reciverId).get().then((doc) => {
                            var a = {};
                            let key = route.params.sendid;
                            a = doc.data().unread_msg;
                            if (a[key] == undefined) {
                                a[key] = [doce.id];
                                console.log(a);
                            }
                            else {
                                let array = a[key];
                                array.push(doce.id);
                                a[key] = array
                            }
                            firebase.firestore().collection('users').doc(route.params.reciverId).set({
                                unread_msg: a
                            }, { merge: 'true' }).then(() => {
                                console.log("data updated");
                            })
                        })
                    }
                })
            });

        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ height: hp('6%'), backgroundColor: '#333333', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: '4%' }}>{usename}</Text>
                    {userStatus === true ?
                        <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: 'green', marginLeft: '4%', marginTop: '1%' }}>
                        </View>
                        : <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: '#ff4d4d', marginLeft: '4%', marginTop: '1%' }}>
                        </View>}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={showPicker}>
                        <Text style={{ color: 'white' }}>Select Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showPicker2} style={{ marginLeft: '2%', marginRight: '5%' }}>
                        <Text style={{ color: 'white' }}>SAudio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showPicker3} style={{ marginLeft: '2%', marginRight: '5%' }}>
                        <Text style={{ color: 'white' }}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showPicker4} style={{ marginLeft: '2%', marginRight: '5%' }}>
                        <Text style={{ color: 'white' }}>Doc</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Dialog
                visible={showPopover}
                onTouchOutside={() => {
                    setShowPopover(false)
                }}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="CANCEL"
                            onPress={() => { setShowPopover(false) }}
                        />
                        <DialogButton
                            text="Send"
                            onPress={imgae!==''?() => UploadFile(imgae)
                                    :
                                    audioUri.name!==''?()=>auidoUpload(audioUri.uri)
                                    :videouri.name!==''?()=>videoUpload(videouri.uri):
                                    File.name!==''?()=>FileUpload(File.uri):null
                                  }
                        />
                    </DialogFooter>
                }
            >
                <DialogContent >

                    <View style={{ marginTop: '5%' }}>
                        {
                            imgae !== '' ?
                                <Image source={{ uri: imgae }} style={{ height: 250, width: 300 }} />
                                : null
                        }
                        {
                            audioUri.name !== '' ?
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', opacity: 0.6 }}>
                                    {audioUri.name}
                                </Text>
                                <ProgressBar progress={proress} color={Colors.red800}  />
                            </View>
                                : null
                        }
                        {
                            videouri.uri!==''?
                            <View>
                              <Text style={{ fontSize: 18, fontWeight: 'bold', opacity: 0.6 }}>
                                    {videouri.name}
                                </Text>
                                <ProgressBar progress={proress} color={Colors.red800}  />
                            </View>
                            :null
                        }
                        {
                            File.uri!==''?
                            <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', opacity: 0.6 }}>
                                  {File.name}
                              </Text>
                              <ProgressBar progress={proress} color={Colors.red800}  />
                          </View>
                          :null
                        }
                    </View>

                </DialogContent>
            </Dialog>
            <GiftedChat
                isTyping
                messages={messages}
                onSend={messages => onSend(messages)}

                user={{
                    _id: route.params.sendid,
                    name: "shubham"
                }}
                alwaysShowSend
                placeholder={imgae ? 'Add Caption' : 'Type your message'}
                renderMessageAudio={(props)=>RederAudio(props)}
                renderMessageVideo={(props)=>RenderVideo(props)}
                renderCustomView={(props)=>renderview(props)}
            />
        </SafeAreaView>
    )
}
export default Message