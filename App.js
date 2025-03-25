/**
 * App.js
 */

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { OrderProvider } from './src/contexts/OrderContext';

import Routes from './src/routes';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <StatusBar backgroundColor='#FCC000' barStyle='dark-content'  />
            <Routes />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
