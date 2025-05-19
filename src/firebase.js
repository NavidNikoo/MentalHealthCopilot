import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDRW6JwZZFxLYlS_ARalqMbDTAUsxDnG-U",
    authDomain: "mentalhealthcopilot.firebaseapp.com",
    projectId: "mentalhealthcopilot",
    storageBucket: "mentalhealthcopilot.appspot.com",
    messagingSenderId: "652983556855",
    appId: "1:652983556855:web:66181a1a7ed10ac4611f2f",
    measurementId: "G-JLXGGGZSEK"
};

const app = initializeApp(firebaseConfig);

// These are what we’ll use across your app
export const auth = getAuth(app);
export const db = getFirestore(app);
