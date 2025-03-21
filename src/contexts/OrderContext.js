/**
* src/contexts/OrderContext.js
*/

import { useState, useEffect, useContext, createContext } from 'react';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import { AddressConfirmationDialog } from '../components/gps/AddressConfirmationDialog';
import { getCurrentLocationStandalone } from '../components/gps/useGeolocation';
import { Alert } from 'react-native'; 

import api from '../config/apiAxios';

const OrderContext = createContext({});

function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { delivery, CleanBasket } = useContext(CartContext);
  const [ pedido, setPedido ] = useState([]);
  const [ pedidos, setPedidos] = useState([]);
  const [ showAddressDialog, setShowAddressDialog ] = useState(false);
  const [ tempOrderData, setTempOrderData ] = useState(null);

  useEffect(() => {
    async function loadOrdersByUserID() {
      await api.get(`/listar/pedidos/usuario/${user?.UserID}`).then((snapshot) => {
        setPedidos(snapshot.data)
      });
    }
    loadOrdersByUserID();
  }, [user, pedido]);

  async function createOrder(order) { 
    try {
      const locationData = await getCurrentLocationStandalone();
      if (!locationData?.location || !locationData?.address) {
        Alert.alert('Não foi possível obter sua localização');
        return;
      } 

      // Armazena dados temporários do pedido
      setTempOrderData({
        order,       
        location: locationData.location,
        address: locationData.address
      });      

      // Mostra diálogo de confirmação
      setShowAddressDialog(true);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar pedido: ' + error.message);
      console.error('Erro ao criar pedido: ', error);
    }
  };

  async function handleAddressConfirm(confirmedAddress) {
    try {
      setShowAddressDialog(false);

      if (!confirmedAddress) {
        throw new Error('Endereço de entrega não confirmado');
      } 

      const newOrder = {
        "DELIVERY_ID": tempOrderData.order.DELIVERY_ID,
        "USER_ID": tempOrderData.order.USER_ID,
        "VR_SUBTOTAL": tempOrderData.order.VR_SUBTOTAL,
        "TAXA_ENTREGA": tempOrderData.order.TAXA_ENTREGA,
        "VR_TOTAL": tempOrderData.order.VR_TOTAL,
        "TOKEN_MSG": tempOrderData.order.TOKEN_MSG,
        "STATUS": tempOrderData.order.STATUS,
        // Dados de localização confirmados
        "ENDERECO_ENTREGA": confirmedAddress.enderecoCompleto,
        "LATITUDE": confirmedAddress.coordinates.latitude,
        "LONGITUDE": confirmedAddress.coordinates.longitude,
        "itens": tempOrderData.order.cartItems
      };

      const response = await api.post('/add/pedido/', newOrder);
      Alert.alert('Pedido enviado com sucesso! #' + response.data.PEDIDO_ID);
      setPedido(json);
      CleanBasket();

      return response.data;
    } catch (error) {
      console.error('Erro ao finalizar pedido: ', error);
      throw error;
    }
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
      <AddressConfirmationDialog
        visible={showAddressDialog}
        address={tempOrderData?.address}
        onConfirm={handleAddressConfirm}
        onCancel={()=>setShowAddressDialog(false)}
      />
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
