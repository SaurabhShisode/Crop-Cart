// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCpynNEe8FXboDx0-R8Xx8XwLDbUfbcAY",
  authDomain: "cropcart-46bf3.firebaseapp.com",
  projectId: "cropcart-46bf3",
  storageBucket: "cropcart-46bf3.firebasestorage.app",
  messagingSenderId: "808486659252",
  appId: "1:808486659252:web:96145adc92363d05a463e1",
  measurementId: "G-RQHQRZ3QLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
export { auth, provider };