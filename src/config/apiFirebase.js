/**
 * src/config/apiFirebase.js
 */

import { initializeApp } from 'firebase/app';
import { 
  API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, 
  STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN, 
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

const firebase_app = initializeApp(firebaseConfig);
