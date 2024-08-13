import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { Card, ListItem, Divider } from 'react-native-elements';
import { differenceInDays, parse, isToday } from 'date-fns';

import api from '../../config/apiAxios';

export default function OrderDetails({ id }) {
  const [ pedido, setPedido ] = useState(null);

  const order_id = id;
  const dataPedidoObj = parse(pedido?.Data, 'dd/MM/yyyy HH:mm:ss', new Date());
  const dif = differenceInDays(new Date(), dataPedidoObj);
  const qtdDias = Math.floor(dif);

  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${order_id}`).then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
    }
    getOrder();
  }, [order_id]);

  function renderStatusMessage(status) {
    const statusStyle = {
      "NOVO": { backgroundColor: 'red' },
      "AGUARDANDO": { backgroundColor: 'pink', color: 'black' },
      "PREPARANDO": { backgroundColor: 'orange', color: 'black' },
      "PRONTO_PARA_RETIRADA": { backgroundColor: 'green' },
      "SAIU_PARA_ENTREGA": { backgroundColor: 'lime', color: 'black' },
      "RECEBIDO": { backgroundColor: 'purple' },
      "FINALIZADO": { backgroundColor: 'black' },
      "CANCELADO": { backgroundColor: 'gray' },
    };
    if (status in statusStyle) {
      return <Text style={[styles.status, statusStyle[status]]}> {pedido?.Status.replace(/_/g, ' ')} </Text>
    } else {
      return <Text> loading... </Text>;
    }
  }

  let qtdDiasFormatado = '';
    if (isToday(dataPedidoObj)) {
    qtdDiasFormatado = 'HOJE';
  } else if(qtdDias === 0) {
    qtdDiasFormatado = 'ONTEM';
  } else {
    qtdDiasFormatado = qtdDias <= 1 ? 'há 1 dia atrás' : `há ${qtdDias} dias atrás`;
  }

  if (!pedido) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>Carregando...</Text>
        <ActivityIndicator size="large" color="#145E7D" />
      </View>
    )
  }

  return (
    <ScrollView>
      <Card>
        <Image style={styles.image} source={{ uri: pedido.DeliveryImg }} />
        <Text style={styles.title}>{pedido.Delivery}</Text>
        <Text style={styles.subtitle}>Pedido Nº {pedido.PedidoID}</Text>
        <Text style={styles.line}>Data: {pedido.Data} &#8226; {qtdDiasFormatado}</Text>
        <Text style={styles.line}>Status: {renderStatusMessage(pedido.Status)}</Text>
        <Text style={{ fontWeight: 'bold' }}>{pedido.Nome}</Text>
        <Text>Endereço: {pedido.Endereco}</Text>
        <Text>{pedido.DeliveryLat} | {pedido.DeliveryLng}</Text>
      </Card>

      <Text style={[styles.title, {marginTop: 10}]}>ITENS DO PEDIDO</Text>

      <FlatList
        data={pedido.itens}
        keyExtractor={(item) => item.ItemID.toString()}
        renderItem={({ item }) => (
          <Card>
            <ListItem>
              <Image
                source={{ uri: item.UrlImagem }}
                style={{ width: 50, height: 50 }}
              />
              <ListItem.Content>
                <ListItem.Title>{item.Produto}</ListItem.Title>
                <ListItem.Subtitle>Quantidade: {item.Qtd} x R$ {parseFloat(item.VrUnitario).toFixed(2)}</ListItem.Subtitle>
                {/* Outros detalhes do item */}
              </ListItem.Content>
            </ListItem>

            {/* Acréscimos */}
            {item.Acrescimos && item.Acrescimos.length > 0 && (
              <View>
                <Text style={{ fontWeight: 'bold' }}>Acréscimos:</Text>
                {item.Acrescimos.map((acrescimo, index) => (
                  <View key={index}>
                    <Text>+ {acrescimo.Descricao}: {item.Qtd} x R$ {parseFloat(acrescimo.VrUnitario).toFixed(2)} </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Observações */}
            {item.Obs && (
              <Text style={styles.obs}>Obs.: {item.Obs}</Text>
            )}

            <Divider />
            <Text style={{fontWeight: "bold"}}>{item.Qtd} x (R$ {parseFloat(item.VrUnitario).toFixed(2)} + R$ R$ {parseFloat(item.VrAcrescimos).toFixed(2)}) = R$ {parseFloat(item.Total).toFixed(2)}</Text>
          </Card>
        )}
      />
      {/* Exibição do sumário dos totais */}
      <Card>
        <Text style={{fontWeight: "bold"}}>RESUMO TOTAL</Text>
        <Divider />
        <Text style={{fontWeight: "bold"}}>+ SUB-TOTAL: R$ {parseFloat(pedido?.VrSubTotal).toFixed(2)}</Text>
        <Text style={{fontWeight: "bold"}}>+ TAXA DE ENTREGA: R$ {parseFloat(pedido?.TaxaEntrega).toFixed(2)}</Text>
        <Text style={{fontWeight: "bold"}}>= TOTAL DO PEDIDO: R$ {parseFloat(pedido?.VrTotal).toFixed(2)}</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 5 / 3,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    color: "#000",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: "#5D5D5D",
  },
  status:{
    color: '#FFF',
    borderRadius: 5,
    marginTop: 5,
    padding: 3
  },
  produto:{
    fontWeight: 'bold',
    fontSize: 14,
  },
  obs:{
    color: 'red',
  },
  summary:{
    color: "black",
    fontSize: 14,
    marginBottom: 10
  },
  subtotal:{
    fontSize: 14,
  },
  total:{
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
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


// export default PedidoScreen;

/**
* src/pages/Pedidos/OrderDetails.js


import { useEffect, useState, useContext } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from "react-native";
import { differenceInDays, parse, isToday } from 'date-fns';
import { ScrollView } from "react-native-virtualized-view";
import { AuthContext } from "../../contexts/AuthContext";

import api from "../../config/mysql";

export default function OrderDetails({ id }) {
  const { user } = useContext(AuthContext);
  const [ pedido, setPedido ] = useState(null);

  async function loadOrderDetails() {
    await api.get(`/pedido/${id}`).then((response) => {
      setPedido(response.data);
    }).catch(error => {
      console.error("Erro ao carregar detalhes do pedido:", error);
    })
  }

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  function OrderDetailsHeader() {
    const dataPedidoObj = parse(pedido?.Data, 'dd/MM/yyyy HH:mm:ss', new Date());
    const dif = differenceInDays(new Date(), dataPedidoObj);

    let qtdDiasFormatado = '';
      if (isToday(dataPedidoObj)) {
      qtdDiasFormatado = 'HOJE';
    } else {
      const qtdDias = Math.floor(dif);
      qtdDiasFormatado = qtdDias === 1 ? 'há 1 dia atrás' : `há ${qtdDias} dias atrás`;
    }

    return (
      <View>
        {pedido && (
          <>
            <Image style={styles.image} source={{ uri: pedido.DeliveryImg }} />
            <Text style={styles.title}>{pedido.Delivery}</Text>
            <Text style={styles.subtitle}>Pedido Nº {pedido.PedidoID}</Text>
            <Text style={styles.line}>Data e Hora: {pedido.Data}</Text>
            <Text style={styles.line}>Status do Pedido: {pedido?.Status} &#8226; {qtdDiasFormatado}</Text>
            <Text style={styles.line}></Text>
            <Text style={{ fontWeight: 'bold' }}>{user.Nome} {user.Sobrenome}</Text>
            <Text style={styles.line}>{user.Endereco}</Text>
            <Text style={styles.line}>{user.Telefone}</Text>
          </>
        )}
      </View>
    );
  }
  

  function Item({ produto }) {
    return (
      <View style={{ borderBottomColor: '#CCC', borderBottomWidth: 1, marginBottom: 10 }}>
        <Image style={styles.imagem} source={{ uri: produto.UrlImagem }} />
        <Text style={styles.produto}>({produto.Qtd}) {produto.Produto}</Text>

        {produto.Acrescimos && produto.Acrescimos.length > 0 && (
          <FlatList
            data={produto.Acrescimos}
            keyExtractor={(item) => item.ExtraID}
            renderItem={({ item }) => (
              <View>
                <Text>+ {item.Descricao} R$ {parseFloat(item.VrUnitario).toFixed(2)}</Text>
              </View>
            )}
            ListEmptyComponent={() => <Text style={styles.empty}>Sem acréscimos neste item.</Text>}
          />
        )}

        {produto.Obs && (
          <Text style={styles.obs}>Obs.: {produto.Obs}</Text>
        )}

        <Text style={styles.summary}>
          SUB-TOTAL: {produto.Qtd}x (R$ {parseFloat(produto.VrUnitario).toFixed(2)} + R$ {parseFloat(produto.VrAcrescimos).toFixed(2)}) = R$ {parseFloat(produto.Total).toFixed(2)}
        </Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color="#145E7D" />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} focusable={true}>
          <OrderDetailsHeader />
          <FlatList
            data={pedido?.itens || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => (item?.ProdutoID || '').toString()}
            renderItem={({ item }) => <Item produto={item} />}
            ListFooterComponent={() => (
              <View>
                <Text style={styles.subtotal}>+ SUB-TOTAL: R$ {parseFloat(pedido?.VrSubTotal).toFixed(2)}</Text>
                <Text style={styles.subtotal}>+ TAXA DE ENTREGA R$ {parseFloat(pedido?.TaxaEntrega).toFixed(2)}</Text>
                <Text style={styles.total}>= TOTAL DO PEDIDO: R$ {parseFloat(pedido?.VrTotal).toFixed(2)}</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


*/

/*
  const diffInMs = new Date() - new Date(pedido?.Data);
  const qtdDias = diffInMs / (1000 * 60 * 60 * 24); //calcular nº de dias maior que 1 a partir do parâmetro date() - createdAt **
  <Text style={styles.line}>Status do Pedido: {order?.Status} &#8226; {qtdDias > 1 ? `${qtdDias} dias atrás` : "hoje"} </Text>

  <Text style={ styles.price }>
    R$ { (produto?.VrUnitario > 0) ? parseFloat( produto?.VrUnitario ).toFixed(2) : "0,00" }
  </Text>
*/
