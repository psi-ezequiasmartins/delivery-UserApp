/**
 * src/components/Notify/index.js
 */

import { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// By test you can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications

// Send Push Notification
async function sendPushNotification(expoPushToken) {
  let data_registro = new Date();
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Teste SMS',
    body: 'Teste de envio (Push Notification).',
    data: { registro: data_registro },
  };
  
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Get Token
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function Notify() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around', backgroundColor: "#1A73E8" }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color: "#FFF"}}>Title: {notification && notification.request.content.title} </Text>
        <Text style={{color: "#FFF"}}>Body : {notification && notification.request.content.body}</Text>
        <Text style={{color: "#FFF"}}>Data : {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 45,
          borderRadius: 7,
          backgroundColor: '#145E7D',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10
        }}
        onPress={async() => {
          await sendPushNotification(expoPushToken);
        }}
      >
        <Text>Press to Send Notification</Text>
      </TouchableOpacity>

    </View>
  );
}
