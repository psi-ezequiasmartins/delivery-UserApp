/**
 * src/config/apiFirebase.js
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
const firestore = getFirestore(firebase_app);
const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, firestore, firebase_app };

/**
 * 
  apiKey: 'AIzaSyDA9aDxjC2zxQ_C6SLLsYAhGPg5T-F9TBc',
  authDomain: 'deliverybairro-app-d259e.firebaseapp.com', 
  databaseURL: 'https://deliverybairro-app-d259e-default-rtdb.firebaseio.com',
  projectId: 'deliverybairro-app-d259e',
  storageBucket: 'deliverybairro-app-d259e.appspot.com',
  messagingSenderId: '118623960431',
  appId: '1:118623960431:android:c14bce16edbb08c9e87c9a'
* 
*/
