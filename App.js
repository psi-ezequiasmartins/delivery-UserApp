/**
 * App.js
 * eas build --platform android --profile preview
 */

import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { CartProvider } from './src/contexts/CartContext';
import { OrderProvider } from './src/contexts/OrderContext';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true); // Ignora todos os logs de aviso

import api from './src/config/apiAxios'; // Importa a configuração do Axios

import Routes from './src/routes';

export default function App() {
  useEffect(() => {
    async function checkConnectivity() {
      const isConnected = await api.ping(); 
      if (!isConnected) {
        console.warn('Servidor offline ou inacessível.');
      }
    }
    checkConnectivity(); 
  }, []); 

  return (
    <NavigationContainer>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <OrderProvider>
              <StatusBar backgroundColor='#FCC000' barStyle='dark-content'  />
              <Routes />
            </OrderProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
