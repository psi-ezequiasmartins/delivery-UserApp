/**
* src/contexts/OrderContext.js
*/

import { useState, useEffect, useContext, createContext } from 'react';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

import api from '../config/apiAxios';

const OrderContext = createContext({});

function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { delivery, CleanBasket } = useContext(CartContext);
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
      const isServerAvailable = await api.ping();
      if (!isServerAvailable) {
        throw new Error('Servidor não está respondendo. Verifique sua conexão.');
      }
      console.log('Iniciando createOrder...', orderData);     
      const response = await api.post('/api/add/pedido/', orderData, {
        timeout: 10000, // 10 segundos
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        }
      });
      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);
      console.log('Dados da resposta:', response.data);
      if (!response.data) {
        throw new Error('Resposta vazia do servidor');
      }
      await api.get(`/api/listar/pedidos/usuario/${orderData.USER_ID}`).then((snapshot) => {
        setPedidos(snapshot.data);
      });
      return response.data;
    } catch (error) {
      console.error('Erro detalhado em createOrder:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
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
