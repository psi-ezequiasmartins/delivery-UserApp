/**
* src/pages/Cesta/index.js
*/

import { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';
import { Alert, View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getCurrentLocationStandalone } from '../../components/Gps/useGeolocation';
import { ScrollView } from "react-native-virtualized-view";
import { Fontisto } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../../contexts/CartContext';
import { OrderContext } from '../../contexts/OrderContext';
import { AuthContext } from '../../contexts/AuthContext';

import AddressConfirmationModal from '../../components/gps/AddressConfirmationDialog';

import BasketItem from '../../components/Basket';

export default function Cesta() {
  const navigation = useNavigation();
  const { delivery, basket, AddToBasket, RemoveFromBasket, CleanBasket } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const { getPushToken } = useContext(NotificationContext);

  const [subtotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempOrderData, setTempOrderData] = useState(null);  
  const [tempAddress, setTempAddress] = useState('');

  function formattedBasketItems(basketItems) {
    return basketItems.map((item) => ({
      ...item,
      "ACRESCIMOS": item?.ACRESCIMOS?.map(acrescimo => ({
        "DESCRICAO": acrescimo?.DESCRICAO,
        "VR_UNITARIO": acrescimo?.VR_UNITARIO,
      })),
      "TOTAL": (item?.VR_ACRESCIMOS + item?.VR_UNITARIO) * item?.QTD
    }));
  }

  function updateSubTotal() {
    let new_value = 0;
    basket.forEach((item) => {
      let items_total = parseFloat(item.VR_UNITARIO);
      if (item.ACRESCIMOS) {
        item.ACRESCIMOS.forEach((extra) => {
          items_total += parseFloat(extra.VR_UNITARIO);
        });
      }
      new_value += items_total * item.QTD; 
    });
    setSubTotal(new_value);
    const soma = new_value + parseFloat(delivery?.TAXA_ENTREGA);
    setTotal(soma);
  }

  useEffect(() => {
    updateSubTotal();
  }, [basket, delivery, total, subtotal]);

  async function handleFinalizarPedido() {
    try {
      setLoading(true); 
      const locationData = await getCurrentLocationStandalone();
      if (!locationData?.location || !locationData?.address) {
        Alert.alert('Erro', 'Não foi possível obter sua localização');
        return;
      }

      const pushToken = await getPushToken();
      if (!pushToken) {
        Alert.alert('Aviso', 'Não foi possível configurar as notificações');
        return;
      }

      const order = {
        "DELIVERY_ID": delivery?.DELIVERY_ID,
        "USER_ID": user?.UserID,
        "VR_SUBTOTAL": subtotal,
        "TAXA_ENTREGA": delivery?.TAXA_ENTREGA,
        "VR_TOTAL": total,
        "PUSH_TOKEN": pushToken,
        "STATUS": "NOVO",
        "ENDERECO_ENTREGA": locationData.address.formatted,
        "LATITUDE": locationData.location.latitude,
        "LONGITUDE": locationData.location.longitude,
        "itens": formattedBasketItems(basket),
      };

      setTempOrderData(order);
      setTempAddress(locationData.address.formatted);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    } finally {
      setLoading(false);
    }
  }  

  async function handleConfirmAddress(confirmedAddress) {
    try {
      setLoading(true);
      setShowModal(false);

      const finalOrder = {
        ...tempOrderData,
        ENDERECO_ENTREGA: confirmedAddress
      };

      const response = await createOrder(finalOrder);

      if (response) {
        await CleanBasket();
        navigation.reset({
          index: 0,
          routes: [{ name: 'OrdersStack', params: { screen: 'Pedidos', initial: false } }],    
        });
        Alert.alert('Sucesso', 'Pedido enviado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível criar o pedido');
      }

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelarPedido() {
    await CleanBasket();
    navigation.goBack();
  }

  {loading && (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>Processando pedido...</Text>
    </View>
  )}

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} focusable={true} >
        { basket.length === 0 && <Text style={styles.empty}>Cesta de Compras vazia!</Text> }

        { basket.length > 0 && <>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>{delivery?.DELIVERY_NOME}</Text>
                <Text style={{ fontSize: 13}}>{delivery?.HORARIO}</Text>
                <Text style={{ fontSize: 13}}><Fontisto color="#FF0000" name='map-marker-alt' size={18}/> {delivery?.ENDERECO}, {delivery?.NUMERO} - {delivery?.BAIRRO}</Text>
                <Text style={{ fontSize: 13, marginBottom: 5}}>Valor da Taxa de Entrega: R$ {parseFloat(delivery?.TAXA_ENTREGA).toFixed(2)}</Text>
                <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 19 }}>Seus Pedidos</Text>
              </View>
            </View>

            <FlatList
              data={basket}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item)=>String(item?.PRODUTO_ID)}
              renderItem={ ({item}) => (
                <BasketItem 
                  item={item} 
                  AddQtd={()=>AddToBasket(item, 1, item?.VR_UNITARIO, [], 0, '')} 
                  RemoveQtd={()=>RemoveFromBasket(item)}  
                  updateTotal={()=>updateSubTotal()}
                />
              )}
              ListEmptyComponent={()=><Text style={styles.empty}>Cesta de Compras vazia!</Text>}
              ListFooterComponent={()=>(
                <View>
                  <Text style={styles.subtotal}>+ Sub-Total: R$ {parseFloat(subtotal).toFixed(2)}</Text>
                  <Text style={styles.taxa}>+ Taxa de Entrega: R$ {parseFloat(delivery?.TAXA_ENTREGA).toFixed(2)}</Text>
                  <Text style={styles.total}>= Total: R$ {parseFloat(total).toFixed(2)}</Text>
                </View>
              )}
            />

            <TouchableOpacity style={styles.btnAdd} onPress={handleFinalizarPedido}>
              <Text style={{color: '#FFF', fontSize: 18}}>FINALIZAR PEDIDO</Text>
            </TouchableOpacity>
          </>
        }

        <TouchableOpacity style={styles.btnCancel} onPress={handleCancelarPedido}>
          <Text style={{color: '#FFF', fontSize: 18}}>CANCELAR</Text>
        </TouchableOpacity>

        <AddressConfirmationModal
          visible={showModal}
          address={tempAddress}
          onConfirm={handleConfirmAddress}
          onCancel={() => setShowModal(false)}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingStart: 14,
    paddingEnd: 14,
    paddingTop: 14,
  },
  content: {
    width: '98%',
    paddingHorizontal: 10,
  },
  card:{
    flex: 1,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 2,
    marginBottom: 10,
    padding: 10,
  },
  qtd:{
    width: 100, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 5
  },
  empty:{
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    color: "red",
    marginTop: 30,
    marginBottom: 30,
  },
  subtotal:{
    fontSize: 18,
  }, 
  acrescimo: {
    fontSize: 18,
  }, 
  taxa:{
    fontSize: 18,
  },
  total:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  areaInput:{
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  input:{
    flex: 1, 
    width: "98%",
    overflow: "scroll",
    textAlignVertical: "top", 
    height: 45,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#8CB8D2",
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: "#000",
  },
  btnAdd: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: '#145E7D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  btnCancel: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  imagem:{
    width: 75, 
    height: 75,
  },
  indicator: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16
  }
});
