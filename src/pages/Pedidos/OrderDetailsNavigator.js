/**
* src/pages/Pedidos/OrderDetailsNavigator.js
*/

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import api from '../../config/apiAxios';

import OrderDetails from "./OrderDetails";
import OrderLiveUpdates from "./OrderLiveUpdates";
import OrderPayment from "./OrderPayment";

const Tab = createMaterialTopTabNavigator();

export default function OrderDetailsNavigator({ route }) {
  const { orderId } = route.params || {};
  const [pedido, setPedido] = useState(null);

  console.log('ID do Pedido em OrderDetailsNavigator: ', orderId);

  useEffect(() => {
    async function fetchPedido() {
      await api.get(`/api/pedido/${orderId}`).then((response)=>{
        setPedido(response?.data);
        console.log('Dados recuperados do pedido: ', response?.data);
      }).catch((error) =>{
        console.log('Error: ', error)
      });
    }
    fetchPedido();
  }, [orderId]);

  if (!pedido) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro ao carregar dados do pedido</Text>
      </View>
    );
  } 

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
        {()=><OrderDetails pedido={pedido}/> }
      </Tab.Screen>
      <Tab.Screen name="LOCALIZAÇÃO">
        {()=><OrderLiveUpdates pedido={pedido}/> }
      </Tab.Screen>
      <Tab.Screen name="PAGAMENTO">
        {()=><OrderPayment pedido={pedido}/> }
      </Tab.Screen>
    </Tab.Navigator>
  );
};
