/**
* src/contexts/OrderContext.js
*/

import { useState, useEffect, useContext, createContext } from 'react';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import { Alert } from 'react-native'; 

import api from '../config/apiAxios';

const OrderContext = createContext({});

function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { delivery, CleanBasket } = useContext(CartContext);
  const [ pedido, setPedido ] = useState([]);
  const [ pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function loadOrdersByUserID() {
      await api.get(`/listar/pedidos/usuario/${user?.UserID}`).then((snapshot) => {
        setPedidos(snapshot.data)
      });
    }
    loadOrdersByUserID();
  }, [user, pedido]);

  async function createOrder(order) {
    await api.post('/add/pedido/', order).then((response) => {
      Alert.alert('Pedido enviado com sucesso! #' + response.data.PedidoID);
      setPedido(order);
      CleanBasket();
    }).catch(error => {
      Alert.alert('Erro', 'Falha ao criar pedido: ' + error.message);
      console.error('Erro ao criar pedido: ', error);
    })
    return pedido;
  };

  async function getOrder(id) {
    await api.get(`/pedido/${id}`).then((response) => {
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
