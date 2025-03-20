/**
* src/pages/Pedidos/OrderDetailsNavigator.js
*/

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import OrderDetails from "./OrderDetails";
import OrderLiveUpdates from "./OrderLiveUpdates";
import OrderPayment from "./OrderPayment";

const Tab = createMaterialTopTabNavigator();

export default function OrderDetailsNavigator({ route }) {
  const { id } = route.params || {};
  console.log('ID recebido no Navigator:', id);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIndicatorStyle: { backgroundColor: '#145E7D' },
        tabBarActiveTintColor: '#145E7D',
        tabBarInactiveTintColor: '#666'
      }}
    >
      <Tab.Screen name="DETALHES">
        {()=><OrderDetails orderId={id}/> }
      </Tab.Screen>
      <Tab.Screen name="LOCALIZAÇÃO">
        {()=><OrderLiveUpdates orderId={id}/> }
      </Tab.Screen>
      <Tab.Screen name="PAGAMENTO">
        {()=><OrderPayment orderId={id}/> }
      </Tab.Screen>
    </Tab.Navigator>
  );
};
