/**
* DeliveryItemToSelect.js
*/

import React, { useState, useEffect } from "react";
import { View, Image, Text, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

import api from "../../config/apiAxios";

export default function OrderDetails({ id }) {
  const [ pedido, setPedido ] = useState(null);

  useEffect(() => {
    async function loadOrderDetails() {
      await api.get(`/pedido/${id}`).then((response) => {
        setPedido(response.data);
      });
    }
    loadOrderDetails();
  }, []);

  function PedidoItem(item) {
    return (
      <View>
        <Image style={styles.imagem} source={{uri: item?.UrlImagem }} />
        <Text style={styles.nome}>{ item?.Nome }</Text>

        {item?.Acrescimos &&
          <FlatList
            data={ item?.Acrescimos }
            showsVerticalScrollIndicator={ false }
            keyExtractor={(item)=>String(item.ExtraID)}
            renderItem={ ({extra}) => (
              <View>
                <Text>+ {extra.Descricao} R$ {parseFloat(extra.VrUnitario).toFixed(2)}</Text>
              </View>
            )}
            ListEmptyComponent={ () => <Text style={styles.empty}>Sem acréscimos neste item.</Text> }
          />
        }

        {item?.Obs &&
          <Text style={{fontWeight: "bold"}}>Obs.: {item?.Obs}</Text>
        }

        <Text style={styles.summary}>{qtd} x (R$ {parseFloat(item?.VrUnitario).toFixed(2)} + R$ {parseFloat(item?.VrAcrescimos).toFixed(2)}) = R$ {parseFloat(total).toFixed(2)}</Text>
      </View>
    )
  }

  return (
    <View style={styles.shadow}>
      <View style={styles.modal}>
        <ScrollView contentContainerStyle={styles.content} focusable={true}>
          <View style={styles.indicator} />

          <View style={{flexDirection: 'column', width: '100%'}}>
            <Text style={{ fontSize: 21, fontWeight: 'bold' }}>Pedido Nº { pedido?.PedidoID }</Text>
            <Text style={{ fontSize: 13 }}>Delivery: { pedido?.Delivery }</Text>
            <Text style={{ fontSize: 13 }}>Data e Hora: { pedido?.Data}</Text>
            <Text style={{ fontSize: 13 }}>Status do Pedido: { pedido?.Status }</Text>
            <Text style={{ fontSize: 13 }}>Token SMS: { pedido?.TokenSMS }</Text>
            <Text style={{ fontSize: 13 }}>Cliente: { pedido?.Nome }</Text>
            <Text style={{ fontSize: 13 }}>Endereço: { pedido?.Endereco}</Text>
            <Text style={{ fontSize: 13, marginTop: 10, marginBotton: 10 }}>ITENS DO PEDIDO</Text>
          </View>

          <FlatList
            data={ pedido?.itens }
            showsVerticalScrollIndicator={ false }
            keyExtractor={(item)=>String(item.ProdutoID)}
            renderItem={ ({itemdopedido}) => (
              <PedidoItem item={itemdopedido} />
            )}
            ListFooterComponent={ () => (
              <View>
                <Text style={styles.subtotal}>+ Sub-Total: R$ { parseFloat(pedido?.VrSubTotal).toFixed(2) }</Text>
                <Text style={styles.taxa}>+ Taxa de Entrega: R$ { parseFloat(pedido?.TaxaEntrega).toFixed(2) }</Text>
                <Text style={styles.total}>= Total: R$ { parseFloat(pedido?.VrTotal).toFixed(2) }</Text>
              </View>
            )}
          />

        </ScrollView>
      </View>
    </View>
  )
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
  nome:{
    fontWeight: 'bold',
    fontSize: 18,
  },
  summary:{
    fontSize: 14,
  },
  imagem:{
    width: 75, 
    height: 75,
  },
  shadow: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute'
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: '80%',
    backgroundColor: '#FFF',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
})

  // let itensExtras = [
  //   {
  //     "ExtraID": 2,
  //     "DeliveryID": 1002,
  //     "Descricao": "Bacon Fatiado 50g",
  //     "VrUnitario": 3
  //   },
  //   {
  //     "ExtraID": 1,
  //     "DeliveryID": 1002,
  //     "Descricao": "Carne Hamburger artezanal 120g",
  //     "VrUnitario": 2.5
  //   },
  //   {
  //     "ExtraID": 7,
  //     "DeliveryID": 1002,
  //     "Descricao": "Molho Barbecue 50g",
  //     "VrUnitario": 3
  //   },
  //   {
  //     "ExtraID": 6,
  //     "DeliveryID": 1002,
  //     "Descricao": "Molho Especial 50g",
  //     "VrUnitario": 2
  //   },
  //   {
  //     "ExtraID": 4,
  //     "DeliveryID": 1002,
  //     "Descricao": "Mussarela",
  //     "VrUnitario": 1.5
  //   },
  //   {
  //     "ExtraID": 3,
  //     "DeliveryID": 1002,
  //     "Descricao": "Ovo (unidade)",
  //     "VrUnitario": 1
  //   },
  //   {
  //     "ExtraID": 5,
  //     "DeliveryID": 1002,
  //     "Descricao": "Salada Americana",
  //     "VrUnitario": 1
  //   }
  // ];
