/**
* src/routes/App.Routes.js
*/

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';

import Home from '../pages/Grupos';
import Deliveries from '../pages/Delivery';
import DeliveryInfo from '../pages/Delivery/DeliveryInfo';
import Cesta from '../pages/Cesta';
import Pedidos from '../pages/Pedidos';
import Perfil from '../pages/User';

import SideBar from '../components/SideBar';
import OrderDetailsNavigator from '../pages/Pedidos/OrderDetailsNavigator';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function AppRoutes() {

  function TabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 65 },
          fontWeight: 'bold',
          headerShown: false
        }}
      >
        <Tab.Screen
          name='Home'
          component={ Home }
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              return <Entypo name='shop' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          }}
        />
        <Tab.Screen
          name='Meus Pedidos'
          component={ OrderStackNavigator }
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              return <Fontisto name='shopping-bag-1' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          }}
        />
        <Tab.Screen
          name='Perfil do Usuário'
          component={ Perfil }
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              return <FontAwesome5 name='user-cog' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  function DrawerNavigator() {

    function getHeaderTitle(route) {
      const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
      switch ( routeName ) {
        case 'Home': return 'psi-Delivery';
        case 'Pedidos': return 'Meus Pedidos';
        case 'Perfil': return 'Dados do Usuário';
      }
    };

    return (
      <Drawer.Navigator
        drawerContent={(props) => <SideBar {...props} />}
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            backgroundColor: '#FFF',
            width: '70%',
            marginTop: 5,
            marginBotton: 5,
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
          },
          drawerLabelStyle: {
            fontWeight: 'bold'
          },
          drawerItemStyle: {
            activeTintColor: '#FFF',
            activeBackgroundColor: '#FF0000',
            inactiveTintColor: '#5D5D5D',
            inactiveBackgroundColor: '#000',
            marginVertical: 5
          },
        }}
      >
        <Drawer.Screen
          name="psi-Delivery"
          component={ TabNavigator }
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: '#FFF',
            headerStyle: {
              backgroundColor: '#000',
              borderBottomWidth: 0,
            },
            tabBarIcon: {
              color: '#000'
            }
          })}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen 
        name="DrawerNavigator"
        component={ DrawerNavigator }
      />
      <Stack.Screen 
        name="Home" 
        component={ Home } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Lista de Categorias', 
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="Deliveries" 
        component={ Deliveries } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Lista de Deliveries', 
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="DeliveryInfo" 
        component={ DeliveryInfo } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Delivery Info',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="Cesta" 
        component={ Cesta } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Cesta de Compras',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="Pedidos" 
        component={ Pedidos } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Meus Pedidos',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="Perfil" 
        component={ Perfil } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Dados do Usuário',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const OrdersStack = createStackNavigator();

function OrderStackNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen 
        name="Orders"
        component={ Pedidos } 
        screenOptions={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        component={ OrderDetailsNavigator }
        screenOptions={{ headerShown: false }}
      />
    </OrdersStack.Navigator>
  );
};

/**
 * 
 
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';

import Grupos from '../pages/Grupos';
import Deliveries from "../pages/Delivery";
import DeliveryInfo from "../pages/Delivery/DeliveryInfo";
import Cesta from '../pages/Cesta';
import Pedidos from "../pages/Pedidos";
import Perfil from "../pages/User";

import SideBar from '../components/SideBar';
import OrderDetailsNavigator from '../pages/Pedidos/OrderDetailsNavigator';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function AppRoutes() {

  function TabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 65 },
          fontWeight: 'bold',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name='Grupos'
          component={ Grupos }
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              return <Entypo name='shop' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          }}
        />
        <Tab.Screen
          name='Pedidos'
          component={ OrderStackNavigator }
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              return <Fontisto name='shopping-bag-1' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          }}
        />
        <Tab.Screen
          name='Perfil'
          component={ Perfil }
          options={{
            tabBarIcon: ({ color, size, focused }) => {              
              return <FontAwesome5 name='user-cog' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  function DrawerNavigator() {

    const getHeaderTitle = (route) => {
      const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
      switch ( routeName ) {
        case 'Grupos': return 'Grupos de Delivery';
        case 'Pedidos': return 'Meus Pedidos';
        case 'Perfil': return 'Dados do Usuário';
      }
    };

    return (
      <Drawer.Navigator
        drawerContent={(props) => <SideBar {...props} />}
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            backgroundColor: '#FFF',
            width: '75%',
            marginTop: 90,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
          },
          drawerLabelStyle: {
            fontWeight: 'bold'
          },
          drawerItemStyle: {
            activeTintColor: '#FFF',
            activeBackgroundColor: '#FF0000',
            inactiveTintColor: '#5D5D5D',
            inactiveBackgroundColor: '#000',
            marginVertical: 5
          },
        }}
      >
        <Drawer.Screen
          name="psi-Delivery"
          component={ TabNavigator }
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: '#FFF',
            headerStyle: {
              backgroundColor: '#000',
              borderBottomWidth: 0,
            },
            tabBarIcon: {
              color: '#000'
            }
          })}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen 
        name="DrawerNavigator"
        component={ DrawerNavigator }
      />
      <Stack.Screen 
        name="Deliveries" 
        component={ Deliveries } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Deliveries', 
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="DeliveryInfo" 
        component={ DeliveryInfo } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Delivery Info',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="Cesta" 
        component={ Cesta } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Cesta de Compras',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
      <Stack.Screen 
        name="Pedidos" 
        component={ Pedidos } 
        options={{ 
          headerShown: true, 
          headerTitle: 'Meus Pedidos',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const OrdersStack = createStackNavigator();

function OrderStackNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen 
        name="Orders" 
        component={ Pedidos } 
        screenOptions={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        component={ OrderDetailsNavigator }
        screenOptions={{ headerShown: false }}
      />
    </OrdersStack.Navigator>
  );
};
*/
