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

  async function createOrder(json) {
    await api.post('/add/pedido/', json).then((response) => {
      Alert.alert('Pedido enviado com sucesso! #' + response.data.PedidoID);
      setPedido(json);
      CleanBasket();
    }).catch(error => {
      console.log('ERROR: ' + error);
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

  // import * as Location from 'expo-location';

  // async function getPositionByGps() {
  //   try {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permissão para acessar a localização foi negada');
  //       return;
  //     }
  //     const { coords } = await Location.getCurrentPositionAsync({});
  //     setLatitude(coords.latitude);
  //     setLongitude(coords.longitude);
  //   } catch (error) {
  //     console.log("Não foi possível obter a localização atual do Usuário.");
  //     return;
  //   }
  //   return { latitude, longitude };
  // }

  // getPositionByGps();
