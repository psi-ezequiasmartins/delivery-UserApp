/**
* src/contexts/OrderContext.js
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationContext } from './NotificationContext';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

import api from '../config/apiAxios';

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { getPushToken } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const { delivery } = useContext(CartContext);
  const [ pedido, setPedido ] = useState([]);
  const [ orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrdersByUserID() {
      await api.get(`/api/listar/pedidos/usuario/${user?.UserID}`).then((snapshot) => {
        setOrders(snapshot.data)
      });
    }
    loadOrdersByUserID();
  }, [user, pedido]);

  async function createOrder(orderData) {
    try {
      const pushToken = await getPushToken();
      // console.log('Push Token:', pushToken);

      const completeOrderData = {
        ...orderData,
        pushToken
      };
      const response = await api.post('/api/add/pedido/', completeOrderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  async function getOrder(id) {
    await api.get(`/api/pedido/${id}`).then((response) => {
      setPedido(response.data[0]);
    }).catch((error) => {
      console.error('Pedido não encontrado! ', error.message);
    });
    return { ...pedido, dishes: pedido.itens }; 
  };

  return (
    <OrderContext.Provider value={{ delivery, orders, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};


