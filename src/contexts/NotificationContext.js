import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { AuthContext } from './AuthContext';
import { EXPO_PROJECT_ID } from '@env';
import api from '../config/apiAxios';

export const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const [pushToken, setPushToken] = useState(null);
  const { user } = useContext(AuthContext);

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
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
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID
      })).data;

      if (user?.UserID) {
        await api.put('/api/usuario/push-token', {
          userId: user?.UserID,
          token
        });
      }

      await AsyncStorage.setItem('@UserApp:pushToken', token);
      setPushToken(token);
      return token;
    } catch (error) {
      console.error('Erro ao registrar push token:', error);
      return null;
    }
  }

  async function getPushToken() {
    if (pushToken) return pushToken;
    
    const storedToken = await AsyncStorage.getItem('@UserApp:pushToken');
    if (storedToken) {
      setPushToken(storedToken);
      return storedToken;
    }

    return await registerForPushNotifications();
  }

  useEffect(() => {
    if (user?.UserID) {
      registerForPushNotifications();
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      pushToken, getPushToken, registerForPushNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}