/**
* src/contexts/OrderContext.js
*/

import { useState, useEffect, useContext, createContext } from 'react';
import { NotificationContext } from './NotificationContext';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

import api from '../config/apiAxios';

const OrderContext = createContext({});

function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { delivery } = useContext(CartContext);
  const { getPushToken } = useContext(NotificationContext);
  const [ pedido, setPedido ] = useState([]);
  const [ pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function loadOrdersByUserID() {
      await api.get(`/api/listar/pedidos/usuario/${user?.UserID}`).then((snapshot) => {
        setPedidos(snapshot.data)
      });
    }
    loadOrdersByUserID();
  }, [user, pedido]);

  async function createOrder(orderData) {
    try {
      const pushToken = await getPushToken();
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
    <OrderContext.Provider value={{ delivery, pedidos, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
