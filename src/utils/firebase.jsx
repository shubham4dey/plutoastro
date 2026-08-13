// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ Ye line add ki
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6aWBaYoHBcGjHPQVCrVxN6Mt9EzqFzUc",
  authDomain: "plutoastro.firebaseapp.com",
  projectId: "plutoastro",
  storageBucket: "plutoastro.firebasestorage.app",
  messagingSenderId: "888401696702",
  appId: "1:888401696702:web:521c41141fd1a8f254cbef",
  measurementId: "G-S6GR3159M9",
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 
// ✅ Ye export zaroori hai — LoginForm, Header, FootIcons sab use karte hain
export const auth = getAuth(app);