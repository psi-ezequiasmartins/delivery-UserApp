/**
 * src/pages/Pedidos/OrderDetails.js
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { Card, ListItem, Divider } from 'react-native-elements';
import { differenceInDays, parse, isToday } from 'date-fns';
import { useNavigation } from "@react-navigation/native";

import api from '../../config/apiAxios';

export default function OrderDetails({ route }) {
  const [pedido, setPedido] = useState(null);
  const navigation = useNavigation();
 
  const orderId = route?.params?.id;

  useEffect(() => {
    if (!orderId) {
      console.error('ID do pedido não encontrado.');
      navigation.goBack();  
      return;
    }
    async function getOrder() {
      try {
        const response = await api.get(`/pedido/${orderId}`);
        setPedido(response.data); 
      } catch (error) {
        console.error('Erro ao carregar pedido: ', error);
      }
    }
    getOrder();
  }, [orderId]);

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
      return <Text style={[styles.status, statusStyle[status]]}> {pedido?.STATUS.replace(/_/g, ' ')} </Text>
    } else {
      return <Text> loading... </Text>;
    }
  }

  const dataPedidoObj = parse(pedido?.DATA, 'dd/MM/yyyy HH:mm:ss', new Date());
  const dif = differenceInDays(new Date(), dataPedidoObj);
  const qtdDias = Math.floor(dif);

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
        <Image style={styles.image} source={{ uri: pedido?.DELIVERY_IMG }} />
        <Text style={styles.title}>{pedido?.DELIVERY_NOME}</Text>
        <Text style={styles.subtitle}>Pedido Nº {pedido?.PEDIDO_ID}</Text>
        <Text style={styles.line}>Data: {pedido?.DATA} &#8226; {qtdDiasFormatado}</Text>
        <Text style={styles.line}>Status: {renderStatusMessage(pedido?.STATUS)}</Text>
        <Text style={{ fontWeight: 'bold' }}>{pedido?.CLIENTE_NOME}</Text>
        <Text>Endereço: {pedido?.ENDERECO}</Text>        
      </Card>

      <Text style={[styles.title, {marginTop: 10}]}>ITENS DO PEDIDO</Text>

      <FlatList
        data={pedido.itens}
        keyExtractor={(item) => item?.ITEM_ID.toString()}
        renderItem={({ item }) => (
          <Card>
            <ListItem>
              <Image
                source={{ uri: item?.URL_IMAGEM }}
                style={{ width: 50, height: 50 }}
              />
              <ListItem.Content>
                <ListItem.Title>{item?.PRODUTO_NOME}</ListItem.Title>
                <ListItem.Subtitle>Quantidade: {item.QTD} x R$ {parseFloat(item.VR_UNITARIO).toFixed(2)}</ListItem.Subtitle>
                {/* Outros detalhes do item */}
              </ListItem.Content>
            </ListItem>

            {/* Acréscimos */}
            {item.Acrescimos && item.Acrescimos.length > 0 && (
              <View>
                <Text style={{ fontWeight: 'bold' }}>Acréscimos:</Text>
                {item.Acrescimos.map((acrescimo, index) => (
                  <View key={index}>
                    <Text>+ {acrescimo.Descricao}: {item?.QTD} x R$ {parseFloat(acrescimo?.VR_UNITARIO).toFixed(2)} </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Observações */}
            {item.Obs && (
              <Text style={styles.obs}>Obs.: {item?.OBS}</Text>
            )}

            <Divider />
            <Text style={{fontWeight: "bold"}}>{item.QTD} x (R$ {parseFloat(item?.VR_UNITARIO).toFixed(2)} + R$ R$ {parseFloat(item?.VR_ACRESCIMOS).toFixed(2)}) = R$ {parseFloat(item?.TOTAL).toFixed(2)}</Text>
          </Card>
        )}
      />
      {/* Exibição do sumário dos totais */}
      <Card>
        <Text style={{fontWeight: "bold"}}>RESUMO TOTAL</Text>
        <Divider />
        <Text style={{fontWeight: "bold"}}>+ SUB-TOTAL: R$ {parseFloat(pedido?.VR_SUBTOTAL).toFixed(2)}</Text>
        <Text style={{fontWeight: "bold"}}>+ TAXA DE ENTREGA: R$ {parseFloat(pedido?.TAXA_ENTREGA).toFixed(2)}</Text>
        <Text style={{fontWeight: "bold"}}>= TOTAL DO PEDIDO: R$ {parseFloat(pedido?.VR_TOTAL).toFixed(2)}</Text>
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
