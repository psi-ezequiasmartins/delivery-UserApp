/**
* src/pages/Pedidos/OrderDetailsNavigator.js
*/

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import OrderDetails from "./OrderDetails";
import OrderLiveUpdates from "./OrderLiveUpdates";
import OrderPayment from "./OrderPayment";

const Tab = createMaterialTopTabNavigator();

export default function OrderDetailsNavigator({ route }) {
  const id = route?.params?.PEDIDO_ID;

  return (
    <Tab.Navigator>
      <Tab.Screen name="DETALHES">
        {()=><OrderDetails id={id}/> }
      </Tab.Screen>
      <Tab.Screen name="LOCALIZAÇÃO">
        {()=><OrderLiveUpdates id={id}/> }
      </Tab.Screen>
      <Tab.Screen name="PAGAMENTO">
        {()=><OrderPayment id={id}/> }
      </Tab.Screen>
    </Tab.Navigator>
  );
};
