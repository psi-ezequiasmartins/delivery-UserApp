/**
 * src/config/apiFirebase.js
 */

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyC6YSUb6L47sKu1ykiKFSsfdTfJNmhlgx4',
  authDomain: 'deliverybairro-app-d259e.firebaseapp.com', 
  databaseURL: 'https://deliverybairro-app-d259e-default-rtdb.firebaseio.com',
  projectId: 'deliverybairro-app-d259e',
  storageBucket: 'deliverybairro-app-d259e.appspot.com',
  messagingSenderId: '118623960431',
  appId: '1:118623960431:android:c14bce16edbb08c9e87c9a'
};

export const firebase_app = initializeApp(firebaseConfig);

/**
 * 
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN, 
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID 

  apiKey: 'AIzaSyC6YSUb6L47sKu1ykiKFSsfdTfJNmhlgx4',
  authDomain: 'deliverybairro-app-d259e.firebaseapp.com', 
  databaseURL: 'https://deliverybairro-app-d259e-default-rtdb.firebaseio.com',
  projectId: 'deliverybairro-app-d259e',
  storageBucket: 'deliverybairro-app-d259e.appspot.com',
  messagingSenderId: '118623960431',
  appId: '1:118623960431:android:c14bce16edbb08c9e87c9a'
* 
*/
