// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "***************",
    authDomain: "***************",
    projectId: "***************",
    storageBucket: "***************",
    messagingSenderId: "***************",
    appId: "***************",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new EmailAuthProvider();

export { app, auth, provider };
