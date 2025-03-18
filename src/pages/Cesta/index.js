/**
* src/pages/Cesta/index.js
*/

import { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { Fontisto } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../../contexts/CartContext';
import { OrderContext } from '../../contexts/OrderContext';
import { AuthContext } from '../../contexts/AuthContext';

import BasketItem from '../../components/Basket';

export default function Cesta() {
  const navigation = useNavigation();
  const { delivery, basket, AddToBasket, RemoveFromBasket, CleanBasket } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext);
  const { user, tokenMsg } = useContext(AuthContext);
  const [ subtotal, setSubTotal] = useState(0);
  const [ total, setTotal ] = useState(0);
  
  function updateSubTotal() {
    let new_value = 0;
    basket.forEach((item) => {
      let items_total = parseFloat(item.VR_UNITARIO);
      if (item.ACRESCIMOS) {
        item.ACRESCIMOS.forEach((extra) => {
          items_total += parseFloat(extra.VR_UNITARIO);
        });
      }
      new_value += items_total * item.QTD; // Multiplica pela quantidade do item
    });
    setSubTotal(new_value);
    const soma = new_value + parseFloat(delivery?.TAXA_ENTREGA);
    setTotal(soma);
  }

  useEffect(() => {
    updateSubTotal();
    console.log(basket);
  }, [basket, delivery, total, subtotal]);

  async function EnviarPedidoELimparCestaDeCompras() {
    function formatAcrescimos(acrescimos) {
      return acrescimos.map((acrescimo) => {
        return {
          "DESCRICAO": acrescimo?.DESCRICAO,
          "VR_UNITARIO": acrescimo?.VR_UNITARIO,
        };
      });
    }

    const formattedBasket = basket.map((item) => ({
      ...item,
      "ACRESCIMOS": formatAcrescimos(item?.VR_ACRESCIMOS),
    }));
  
    const json = {
      "DELIVERY_ID": delivery?.DELIVERY_ID,
      "USER_ID": user?.UserID,
      "VR_SUBTOTAL": subtotal,
      "TAXA_ENTREGA": delivery?.TAXA_ENTREGA,
      "VR_TOTAL": subtotal + delivery?.TAXA_ENTREGA,
      "TOKEN_MSG": tokenMsg,
      "STATUS": "NOVO",
      "itens": formattedBasket,
    };
  
    const jsonString = JSON.stringify(json, null, 2);
    const pedido = await createOrder(jsonString);
    LinkTo("Pedidos");
  }

  async function CancelarPedido() {
    await CleanBasket();
    navigation.goBack();
  }

  function LinkTo(page) {
    return (
      navigation.navigate(page)
    )
  }

  if (!basket) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color='#FFF' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} focusable={true} >

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

        {
          (basket?.length > 0) &&
          <TouchableOpacity style={styles.btnAdd} onPress={EnviarPedidoELimparCestaDeCompras}>
            <Text style={{color: '#FFF', fontSize: 18}}>CONFIRMAR PEDIDO</Text>
          </TouchableOpacity>
        }

        <TouchableOpacity style={styles.btnCancel} onPress={CancelarPedido}>
          <Text style={{color: '#FFF', fontSize: 18}}>CANCELAR</Text>
        </TouchableOpacity>

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
    marginTop: 10
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
