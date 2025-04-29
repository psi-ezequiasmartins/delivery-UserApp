import { EXPO_PROJECT_ID } from '@env';
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { AuthContext } from './AuthContext';

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
 
  async function getPushToken() {
    if (pushToken) return pushToken; // Retorna o token se já estiver armazenado
    const storedToken = await AsyncStorage.getItem('@UserApp:pushToken');
    if (storedToken) { 
      setPushToken(storedToken);  // Atualiza o estado com o token armazenado
      return storedToken;
    }
    const newToken = await registerForPushNotifications();
    setPushToken(newToken); // Atualiza o estado com o novo token
    await AsyncStorage.setItem('@UserApp:pushToken', newToken);
    if (isDevelopment) {
      console.log('Push Token armazenado no AsyncStorage:', newToken);
    }

    // Envia o novo pushToken para o servidor
    await api.post('/api/push-token', { token: newToken, userId: user?.USER_ID }).then((response) => {
      if (response.status === 200) {
        console.log('pushToken enviado com sucesso:', response.data);
      } else {
        console.error('Erro ao enviar o pushToken:', response.status, response.data);
      }
    }).catch((error) => {
      console.error('Erro ao enviar o pushToken:', error.message);
    });

    return newToken;
  }

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn('Notificações push só estão disponíveis em dispositivos físicos.');
      return null;
    }

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

    // const token = (await Notifications.getExpoPushTokenAsync()).data;

    const token = (await Notifications.getExpoPushTokenAsync({
      'projectId': EXPO_PROJECT_ID || Constants.easConfig?.projectId || Constants.expoConfig?.extra.eas?.projectId
    })).data;

    if (!token) {
      console.error('Falha ao gerar o pushToken.');
      return null;
    }

    return token;
  }

  useEffect(() => {
    if (user?.USER_ID) {
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