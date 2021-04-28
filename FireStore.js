import firebase from 'firebase';
import firestore from 'firebase/firestore'
var firebaseConfig = {
    apiKey: "AIzaSyDeKgnqe0QnGI55YwO_bpOspe64cJ0xkY8",
    authDomain: "chatapp-f7ef5.firebaseapp.com",
    projectId: "chatapp-f7ef5",
    storageBucket: "chatapp-f7ef5.appspot.com",
    messagingSenderId: "777724940255",
    appId: "1:777724940255:web:182a6ce99484efcce3be6a",
    measurementId: "G-3G3FZRY149"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
export default firebase;