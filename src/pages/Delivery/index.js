/**
 * src/pages/Delivery/index.js
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isDevelopment } from '../../config/apiAxios';

import Header from '../../components/Header';
import api from '../../config/apiAxios';

export default function Deliveries({ route }) {
  const navigation = useNavigation();
  const [deliveries, setDeliveries] = useState([]);

  if (isDevelopment) {
    console.log('ID:', route.params.id);
    console.log('CATEGORIA:', route.params.categoria);
  }
  
  useEffect(() => {
    async function loadDeliveries() {
      try {
        if (route.params.id === 101) {
          const response = await api.get('/api/listar/deliveries');
          setDeliveries(response?.data);
        } else {
          const response = await api.get(`/api/listar/deliveries/categoria/${route.params.id}`);
          setDeliveries(response?.data);
        }                 
      } catch (error) {
        console.error("Erro ao carregar deliveries: ", error);
      }
    }
    loadDeliveries();
  }, [route.params.id]);

  function LinkTo(page, p) {
    navigation.navigate(page, p);
  }

  if (!deliveries) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color='#FA7E4A' />
      </View>
    )
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.categoria_title}>{ route.params.categoria }</Text>
        <FlatList
          data={deliveries}
          keyExtractor={(item)=>String(item.DELIVERY_ID)}
          ListEmptyComponent={() => <Text style={styles.empty}>Ainda não há deliveries nesta categoria.</Text>}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>LinkTo("DeliveryInfo", { id: item?.DELIVERY_ID })}>
              <Text style={styles.delivery_title}>{ item?.DELIVERY_NOME }</Text>
              <Image style={styles.imagem} source={{uri:(item?.URL_IMAGEM === "" ? "https://via.placeholder.com/540x300" : item?.URL_IMAGEM)}} />
              <View style={styles.row}>
                <Text style={styles.subtitle}>
                  Taxa de Entrega R$ { parseFloat(item?.TAXA_ENTREGA).toFixed(2) } &#8226; { item?.MIN_DELIVERY_TIME }-{ item?.MAX_DELIVERY_TIME } minutos
                </Text>
                <View style={styles.rating}>
                  <Text style={{color: "#FFF"}}>{ parseFloat(item?.RATING).toFixed(1) }</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  label:{
    fontSize: 21,
    fontWeight: 'bold'
  },
  imagem: {
    width: "100%",
    aspectRatio: 5 / 3,
    marginBottom: 5,
  },
  categoria_title:{
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomColor: "#E2E2E2",
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  delivery_title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    color: "grey",
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rating: {
    marginLeft: "auto",
    backgroundColor: "black",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  empty:{
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10
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
