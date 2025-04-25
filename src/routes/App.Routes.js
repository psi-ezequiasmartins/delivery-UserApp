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
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeTab';
    switch (routeName) {
      case 'HomeTab': return 'psi-Delivery';
      case 'Deliveries': return 'Lista de Deliveries';
      case 'DeliveryDetails': return 'Delivery Info'
      case 'OrdersTab': return 'Meus Pedidos';
      case 'OrderDetails': return 'Detalhes do Pedido';
      case 'ProfileTab': return 'Dados do Usuário';
      case 'HomeStack': return 'psi-Delivery';
      default: return 'psi-Delivery';
    }
  };

  function HomeTabNavigator() {
    return(
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 70 },
          tabBarActiveTintColor: '#FC0000',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name='HomeTab'
          component={HomeStackNavigator}
          options={({ route }) => ({
            tabBarLabel: 'Deliveries', // Rótulo personalizado
            tabBarIcon: ({ focused }) => (
              <Entypo name='shop' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            ),
          })}
        />
        <Tab.Screen
          name='OrdersTab'
          component={OrderStackNavigator}
          options={({ route }) => ({
            tabBarLabel: 'Meus Pedidos', // Rótulo personalizado
            tabBarIcon: ({ focused }) => (
              <Fontisto name='shopping-bag-1' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            ),
          })}
        />
        <Tab.Screen
          name='ProfileTab'
          component={Perfil}
          options={({ route }) => ({
            tabBarLabel: 'Perfil', // Rótulo personalizado
            tabBarIcon: ({ focused }) => (
              <FontAwesome5 name='user-cog' color={(focused !== true) ? '#5D5D5D' : '#000'} size={35} />
            ),
          })}
        />
      </Tab.Navigator>
    )
  }

  function HomeStackNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#000', borderBottomWidth: 0 },
        }}
      >
        <Stack.Screen name="HomeStack" component={Home} />
        <Stack.Screen name="Deliveries" component={Deliveries} />
        <Stack.Screen name="DeliveryInfo" component={DeliveryInfo} />
        <Stack.Screen name="Cesta" component={Cesta} />
      </Stack.Navigator>   
    );
  }

  function OrderStackNavigator() {
    return (
      <OrdersStack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#000', borderBottomWidth: 0 },
        }}
      >
        <OrdersStack.Screen name="OrdersStack" component={Pedidos} />
        <OrdersStack.Screen
          name="OrderDetailsNavigator"
          component={OrderDetailsNavigator}
          options={{ 
            title: 'Detalhes do Pedido',  
            headerTitleAlign: 'center',
          }}
        />
      </OrdersStack.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFF',
          width: '70%',
          marginTop: 5,
          marginBotton: 5,
          borderTopRightRadius: 25,
          borderBottomRightRadius: 25,
        },
        drawerLabelStyle: { fontWeight: 'bold' },
        drawerItemStyle: {
          activeTintColor: '#FCC000',
          activeBackgroundColor: '#FF0000',
          inactiveTintColor: '#5D5D5D',
          inactiveBackgroundColor: '#000',
          marginVertical: 5,
        },
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeTabNavigator}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: getHeaderTitle(route),
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#000', borderBottomWidth: 0 },
        })}
      />
    </Drawer.Navigator>
  );
}
