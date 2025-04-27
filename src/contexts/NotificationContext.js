import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { AuthContext } from './AuthContext';

import { EXPO_PROJECT_ID } from '@env';
import api from '../config/apiAxios';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [pushToken, setPushToken] = useState(null);
  const [notify, setNotify] = useState(false);
  const { user } = useContext(AuthContext);
 
  const getPushToken = () => pushToken;

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn('Notificações push só estão disponíveis em dispositivos físicos.');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permissão para notificações push não concedida.');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID
      })).data;

      if (!token) {
        console.error('Falha ao gerar o pushToken.');
        return null;
      }
  
      setPushToken(token);
      if (isDevelopment) {
        console.log('Push Token gerado:', token);
      }
    } catch (error) {
      console.error('Erro ao registrar push token:', error);
      return null;
    }
  }

  // async function getPushToken() {
  //   if (pushToken) return pushToken;
  //   const storedToken = await AsyncStorage.getItem('@UserApp:pushToken');
  //   if (storedToken) {
  //     setPushToken(storedToken);
  //     return storedToken;
  //   }
  //   return await registerForPushNotifications();
  // }

  useEffect(() => {
    if (user?.UserID) {
      registerForPushNotifications();
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      pushToken, notify, setNotify, setPushToken, getPushToken, registerForPushNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}