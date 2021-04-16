import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyA5p9AYAdrLGZoRMXb_ORzRhr9XexXmVNg",
  authDomain: "yatou-sarl.firebaseapp.com",
  projectId: "yatou-sarl",
  storageBucket: "yatou-sarl.appspot.com",
  messagingSenderId: "519445991306",
  appId: "1:519445991306:web:57ee81803d2d33c3404273",
  measurementId: "G-CRJS8DTQMX",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default app;
