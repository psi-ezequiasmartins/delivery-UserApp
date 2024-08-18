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
  const { delivery, basket, subtotal, AddToBasket, RemoveFromBasket, CleanBasket } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext);
  const { user, tokenMsg } = useContext(AuthContext);
  const [ total, setTotal ] = useState(0);
  
  useEffect(() => {
    function atualizaTotal() {
      const soma = parseFloat(subtotal) + parseFloat(delivery?.TaxaEntrega);
      setTotal(soma);
    }
    atualizaTotal();
  }, [subtotal]);

  async function EnviarPedidoELimparCestaDeCompras() {
    // Função para formatar os valores de "Acrescimos"
    function formatAcrescimos(acrescimos) {
      return acrescimos.map((acrescimo) => {
        // Aqui você pode selecionar os campos que deseja manter no objeto acrescimo
        return {
          Descricao: acrescimo.Descricao,
          VrUnitario: acrescimo.VrUnitario,
          // Adicione outros campos que desejar manter
        };
      });
    }

    // Formate os valores de "Acrescimos" em cada item do carrinho
    const formattedBasket = basket.map((item) => ({
      ...item,
      Acrescimos: formatAcrescimos(item.Acrescimos),
    }));
  
    // Formate o objeto JSON final
    const json = {
      DeliveryID: delivery.DeliveryID,
      UserID: user.UserID,
      VrSubTotal: parseFloat(subtotal),
      TaxaEntrega: parseFloat(delivery.TaxaEntrega),
      VrTotal: parseFloat(subtotal) + parseFloat(delivery?.TaxaEntrega),
      TokenMSG: tokenMsg,
      Status: "NOVO",
      itens: formattedBasket,
    };
  
    // Converte o objeto JSON em uma string e imprime no log
    const jsonString = JSON.stringify(json, null, 2); // O segundo argumento é para formatação
    const pedido = await createOrder(jsonString);
    console.log(pedido);
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
            <Text style={{ fontSize: 21, fontWeight: 'bold' }}>{ delivery?.Nome }</Text>
            <Text style={{ fontSize: 13}}>{ delivery?.Horario }</Text>
            <Text style={{ fontSize: 13}}><Fontisto color="#FF0000" name='map-marker-alt' size={18}/> { parseFloat(delivery?.Latitude).toFixed(6) }, { parseFloat(delivery?.Longitude).toFixed(6) }</Text>
            <Text style={{ fontSize: 13, marginBottom: 5}}>Valor da Taxa de Entrega: R$ { parseFloat(delivery?.TaxaEntrega).toFixed(2) }</Text>
            <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 19 }}>Seus Pedidos</Text>
          </View>
        </View>

        <FlatList
          data={ basket }
          showsVerticalScrollIndicator={ false }
          keyExtractor={(item)=>String(item.ProdutoID)}
          renderItem={ ({item}) => (
            <BasketItem 
              item={item} 
              AddQtd={()=>AddToBasket(item, 1, item.VrUnitario, [], 0, '')} 
              RemoveQtd={()=>RemoveFromBasket(item)}  
            />
          )}
          ListEmptyComponent={ () => <Text style={styles.empty}>Cesta de Compras vazia!</Text> }
          ListFooterComponent={ () => (
            <View>
              <Text style={styles.subtotal}>+ Sub-Total: R$ { parseFloat(subtotal).toFixed(2) }</Text>
              <Text style={styles.taxa}>+ Taxa de Entrega: R$ { parseFloat(delivery?.TaxaEntrega ).toFixed(2)}</Text>
              <Text style={styles.total}>= Total: R$ { parseFloat(total).toFixed(2) }</Text>
            </View>
          )}
        />

        {
          (basket?.length > 0) &&
          <TouchableOpacity style={styles.btnAdd} onPress={ EnviarPedidoELimparCestaDeCompras }>
            <Text style={{color: '#FFF', fontSize: 18}}>CONFIRMAR PEDIDO</Text>
          </TouchableOpacity>
        }

        <TouchableOpacity style={styles.btnCancel} onPress={ CancelarPedido }>
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
    // marginTop: 20
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
})
