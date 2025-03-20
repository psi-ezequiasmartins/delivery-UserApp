/**
* src/pages/Pedidos/OrderLiveUpdates.js
*/

import MapView, { Marker } from "react-native-maps";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { Fontisto, AntDesign } from "@expo/vector-icons";

import api from "../../config/apiAxios";

export default function OrderLiveUpdates({ orderId }) {
  const [ pedido, setPedido ] = useState(null);
  const [ courier, setCourier ] = useState(null);

  const courierId = 200001; //O ID do Courier será fornecido posteriormente junto a atualização do status de entrega

  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${orderId}`).then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
    }
    getOrder();
  }, [orderId]);

  useEffect(() => {
    async function getCourier() {
      await api.get(`/courier/${courierId}`).then(response => {
        setCourier(response.data[0]);
        console.log(courier);
      })
    }
    getCourier();
  }, []);

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
      return <Text style={[styles.status, statusStyle[status]]}>{pedido?.STATUS.replace(/_/g, ' ')}</Text>
    } else {
      return <Text> loading... </Text>;
    }
  }

  if (!courier) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{height: 70}}>
        {renderStatusMessage(pedido?.STATUS)}
      </View>
      
      <View style={{flex: 1}}>
        <MapView
          style={styles.map}
          initialRegion={{    
            latitude: -19.82628, // pedido?.DeliveryLat,
            longitude: -43.98033, //pedido?.DeliveryLng,
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}
          showsUserLocation={true} 
          showsTraffic={true}
          flipY={true} 
        >
          {courier?.COURIER_ID && (
            <Marker 
              coordinate={{ 
                latitude: -19.82628, //courier?.Latitude, 
                longitude: -43.98033, //courier?.Longitude 
              }}
              title={courier?.NOME}
              description="Entregador"
            >
              <View style={{ padding: 5, backgroundColor: "red", borderRadius: 5 }}>
                <Fontisto name="motorcycle" size={40} color="yellow" />
              </View>
            </Marker>
          )}

          <Marker
            coordinate={{
              latitude: -19.82277, //pedido?.DeliveryLat,
              longitude: -43.97870, //pedido?.DeliveryLng
            }}
            title={pedido?.DELIVERY_NOME}
            description="Delivery"
          >
            <View style={{ padding: 5 }}>
              <AntDesign name="pushpin" size={40} color="red" />
            </View>
          </Marker>

          <Marker
            coordinate={{
              latitude: -19.82724, //pedido?.DeliveryLat,
              longitude: -43.98316, //pedido?.DeliveryLng
            }}
            title={pedido?.CLIENTE_NOME}
            description="Sua Localização"
          >
            <View style={{ padding: 5 }}>
              <Fontisto name="map-marker-alt" size={40} color="red" />
            </View>
          </Marker>

        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  status: {
    color: '#FFF',
    textAlign: "center",
    borderRadius: 5,
    margin: 10,
    padding: 15
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
  map:{
    flex: 1,
    // width: "100%",
    // height: "100%"
  }
});

