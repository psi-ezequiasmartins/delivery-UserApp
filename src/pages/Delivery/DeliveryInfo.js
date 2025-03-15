/**
 * DeliveryInfo.js
 */

import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { CartContext } from '../../contexts/CartContext';

import Header from '../../components/Header';
import api from '../../config/apiAxios';

import DeliveryHeader from './DeliveryHeader';
import DeliveryItemToSelect from './DeliveryItemToSelect';
import DeliveryListItem from './DeliveryListItem';

export default function DeliveryInfo({ route }) {
  const { delivery, setDelivery } = useContext(CartContext);
  const [ show, showModal ] = useState(false);
  const [ produto, setProduto ] = useState({});
  const [ listadeprodutos, setListaDeProdutos ] = useState([]);
  const [ isAscending, setIsAscending ] = useState(true);

  const id = route.params?.id; 

  const { setDelivery: setBasketDelivery } = useContext(CartContext);

  useEffect(() => {
    setBasketDelivery(null);
    async function loadDeliveryInfo() {
      await api.get(`/delivery/${id}`).then((response) => {
        let info = {
          "DELIVERY_ID": response.data.DELIVERY_ID,
          "DELIVERY_NOME": response.data.DELIVERY_NOME,
          "HORARIO": response.data.HORARIO,
          "MIN_DELIVERY_TIME": response.data.MIN_DELIVERY_TIME,
          "MAX_DELIVERY_TIME": response.data.MAX_DELIVERY_TIME,
          "TAXA_ENTREGA": response.data.TAXA_ENTREGA,
          "TELEFONE": response.data.TELEFONE,
          "ENDERECO": response.data.ENDERECO,
          "NUMERO": response.data.NUMERO,
          "BAIRRO": response.data.BAIRRO,
          "URL_IMAGEM": response.data.URL_IMAGEM,
        }
        setDelivery(info);
      }).catch(error => {
        console.log('ERROR: ' + error);
      })
    }

    async function loadProdutos() {
      await api.get(`/listar/produtos/delivery/${route.params.id}`).then((response) => {
        setListaDeProdutos(response.data);
      }).catch(error => {
        console.log('ERROR: ' + error);
      })
    }

    loadDeliveryInfo();
    loadProdutos();
  }, [id]);

  useEffect(() => {
    setBasketDelivery(delivery);
  }, [delivery]);

  function listByAZ() {
    const listaordenada = [...listadeprodutos].sort((a, b) => (
      isAscending ? a.PRODUTO_NOME.localeCompare(b.PRODUTO_NOME) : b.PRODUTO_NOME.localeCompare(a.PRODUTO_NOME)
    ));
    setListaDeProdutos(listaordenada);
    setIsAscending(!isAscending);
  }

  async function handleSelectItem(item) {
    setProduto(item);
    showModal(true);
  }

  async function handleCloseModal() {
    showModal(false);
  }
  // #145E7D
  if (!delivery) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  if (!listadeprodutos) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color='#FA7E4A' />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Modal animationType="slide" transparent={true} visible={show} >
          <DeliveryItemToSelect produto={produto} id={route.params.id} close={()=>handleCloseModal()} />
        </Modal>
        <Header />
        <FlatList
          data={listadeprodutos}
          ListHeaderComponent={()=><DeliveryHeader delivery={delivery} listbyaz={()=>listByAZ()} /> }
          ListEmptyComponent={()=><Text style={styles.empty}>Ainda não há produtos deste Delivery.</Text>}
          keyExtractor={(item)=>item.PRODUTO_ID}
          renderItem={({item})=><DeliveryListItem item={item} selectItem={()=>handleSelectItem(item)} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  empty: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10
  },
  flatlist: {
    flex: 1,
  },
  button: {
    backgroundColor: "black",
    margin: 10,
    padding: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  indicator:{
    flex:1, 
    position: 'absolute', 
    backgroundColor: '#000', 
    opacity: 0.7, 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
