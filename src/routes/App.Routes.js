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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const OrdersStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppRoutes() {

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    switch (routeName) {
      case 'Home' || 'HomeStack': return 'psi-Delivery';
      case 'Deliveries': return 'Lista de Deliveries';
      case 'DeliveryDetails': return 'Delivery Info'
      case 'Orders': return 'Meus Pedidos';
      case 'OrderDetails': return 'Detalhes do Pedido';
      case 'Profile': return 'Dados do Usuário';
      case 'HomeStack': return 'psi-Delivery';
      case 'OrdersStack': return 'Meus Pedidos';
    }
  };

  function HomeTabNavigator() {
    return(
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 65 },
          fontWeight: 'bold',
          headerShown: false,
          backgroundColor: '#000',
        }}
      >
        <Tab.Screen
          name='HomeStack'
          component={HomeStackNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: '#FFF',
            headerStyle: {
              backgroundColor: '#000',
              borderBottomWidth: 0,
            },
            tabBarIcon: ({ focused }) => {
              return <Entypo name='shop' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          })}
        />
        <Tab.Screen
          name='OrdersStack'
          component={OrderStackNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: '#FFF',
            headerStyle: {
              backgroundColor: '#000',
              borderBottomWidth: 0,
            },
            tabBarIcon: ({ focused }) => {
              return <Fontisto name='shopping-bag-1' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          })}
        />
        <Tab.Screen
          name='Profile'
          component={Perfil}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: '#FFF',
            headerStyle: {
              backgroundColor: '#000',
              borderBottomWidth: 0,
            },
            tabBarIcon: ({ focused }) => {
              return <FontAwesome5 name='user-cog' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            },
          })}
        />
      </Tab.Navigator>
    )
  }

  function HomeStackNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Deliveries"
          component={Deliveries}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DeliveryInfo"
          component={DeliveryInfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cesta"
          component={Cesta}
          options={{ headerShown: false}}
        />
      </Stack.Navigator>   
    )
  }

  function OrderStackNavigator() {
    return (
      <OrdersStack.Navigator 
        screenOptions={{ 
          headerShown: false 
        }}
      >
        <OrdersStack.Screen
          name="Orders"
          component={Pedidos}
          options={{ headerShown: false }}
        />
        <OrdersStack.Screen
          name="OrderDetailsNavigator"
          component={OrderDetailsNavigator}
          options={{ 
            title: 'Detalhes do Pedido',  
            headerTitleAlign: 'center',
            headerTintColor: '#FFF',
            headerStyle: {
              backgroundColor: '#000',
              borderBottomWidth: 0,
            },
            tabBarIcon: {
              color: '#000'
            },

          }}
        />
      </OrdersStack.Navigator>
    );
  }

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
        name="Home"
        component={HomeTabNavigator}
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
