/**
 * src/config/apiFirebase.js
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.YOUR_API_KEY,
  authDomain: process.env.YOUR_AUTH_DOMAIN,
  databaseURL: process.env.YOUR_DATABASE_URL,
  projectId: process.env.YOUR_PROJECT_ID,
  storageBucket: process.env.YOUR_STORAGE_BUCKET,
  messagingSenderId: process.env.YOUR_MESSAGING_SENDER_ID,
  appId: process.env.YOUR_APP_ID
};

const firebase_app = initializeApp(firebaseConfig);
const messaging = getMessaging(firebase_app);
const firestore = getFirestore(firebase_app);
const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, firestore, messaging, firebase_app };
