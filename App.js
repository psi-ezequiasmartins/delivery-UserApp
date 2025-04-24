/**
 * App.js
 * eas build --platform android --profile preview
 */

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { OrderProvider } from './src/contexts/OrderContext';

import { NotificationProvider } from './src/contexts/NotificationContext';
import Routes from './src/routes';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <NotificationProvider>
              <StatusBar backgroundColor='#FCC000' barStyle='dark-content'  />
              <Routes />
            </NotificationProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
