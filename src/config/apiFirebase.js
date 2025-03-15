/**
 * src/config/apiFirebase.js
 */

import { initializeApp } from 'firebase/app';
// import { getMessaging } from "firebase/messaging";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

// Inicialize o Firebase App
const firebase_app = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebase_app);
// Inicialize o Firebase Auth com persistência no AsyncStorage
const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { 
  firebase_app,
  // messaging, 
  auth 
};
