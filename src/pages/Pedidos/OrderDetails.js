/**
 * src/pages/Pedidos/OrderDetails.js
 */

import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { Card, ListItem, Divider } from 'react-native-elements';
import { differenceInDays, parse, isToday } from 'date-fns';
import { useNavigation } from "@react-navigation/native";

import api from '../../config/apiAxios';

export default function OrderDetails({ orderId }) {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Ignore specific warning
  LogBox.ignoreLogs([
    'Warning: TextElement: Support for defaultProps will be removed from function components',
  ]);
 
  useEffect(() => {
    let isMounted = true; // Controle de montagem do componente
    async function getOrder() {
      try {
        setLoading(true);r
        setError(null);   
        // console.log('ID recebido no OrderDetails:', orderId);
        if (!orderId) {
          throw new Error('ID do pedido não informado!');
        }
        // console.log('Buscando pedido ID: ', orderId);
        const response = await api.get(`/pedido/${orderId}`);
        // validação da resposta
        if (!response?.data) {
          throw new Error('Resposta inválida do servidor, dados não encontrados!'); 
        }
        if (isMounted) {
          // console.log('Dados recebidos: ', response.data);
          setPedido(response.data);
        }
      } catch (error) {
        console.error('Erro detalhado:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }    
    }
    getOrder();
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#145E7D" />
        <Text>Carregando pedido...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={()=>navigation.goBack()}
        >
          <Text style={styles.buttonText}> Voltar </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Validação adicional antes de renderizar
  if (!pedido || !pedido?.PEDIDO_ID) {
    return (
      <View style={styles.centerContainer}>
        <Text>Pedido não encontrado</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={()=>navigation.goBack()}
        >
          <Text style={styles.buttonText}> Voltar </Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  // Mova a lógica de data para dentro de uma função
  const formatDataPedido = (dataPedido) => {
    if (!dataPedido) return '';
    
    try {
      const dataPedidoObj = parse(dataPedido, 'dd/MM/yyyy HH:mm:ss', new Date());
      const dif = differenceInDays(new Date(), dataPedidoObj);
      const qtdDias = Math.floor(dif);

      if (isToday(dataPedidoObj)) {
        return 'HOJE';
      } else if(qtdDias === 0) {
        return 'ONTEM';
      } else {
        return qtdDias <= 1 ? 'há 1 dia atrás' : `há mais de ${qtdDias} dias atrás`;
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };
  
  // Renderização principal com try/catch
  try {
    return (
      <ScrollView>
        <Card>
          <Image 
            style={styles.image} 
            source={{ uri: pedido?.DELIVERY_IMG }} 
            onError={(e)=>console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
          />
          <Text style={styles.title}>{pedido?.DELIVERY_NOME}</Text>
          <Text style={styles.subtitle}>Pedido Nº {pedido?.PEDIDO_ID}</Text>
          <Text style={styles.line}>Data: {pedido?.DATA} &#8226; {formatDataPedido(pedido?.DATA)}</Text>
          <Text style={styles.line}>Status: {renderStatusMessage(pedido?.STATUS)}</Text>
          <Text style={{ fontWeight: 'bold' }}>{pedido?.CLIENTE_NOME}</Text>
          <Text>Endereço: {pedido?.ENDERECO}</Text>        
        </Card>
  
        <Text style={[styles.title, {marginTop: 10}]}>ITENS DO PEDIDO</Text>
  
        <FlatList
          data={pedido?.ITENS}
          keyExtractor={(item)=>String(item?.ITEM_ID)}
          renderItem={({item}) => (
            <Card>
              <ListItem>
                <Image
                  source={{ uri: item?.URL_IMAGEM }}
                  style={{ width: 50, height: 50 }}
                />
                <ListItem.Content>
                  <ListItem.Title>{item?.PRODUTO}</ListItem.Title>
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
              {item?.OBS && (
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
  } catch (error) {
    console.error('Erro ao renderizar pedido:', error);
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao renderizar pedido</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={()=>navigation.goBack()}
        >
          <Text style={styles.buttonText}> Voltar </Text>
        </TouchableOpacity>
      </View>
    );   
  }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#145E7D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});
