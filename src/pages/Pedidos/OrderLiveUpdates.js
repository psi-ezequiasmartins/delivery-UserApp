/**
* src/pages/Pedidos/OrderLiveUpdates.js
*/

import MapView, { Marker } from "react-native-maps";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { Fontisto, AntDesign } from "@expo/vector-icons";

import api from "../../config/apiAxios";

export default function OrderLiveUpdates({ id }) {
  const [ pedido, setPedido ] = useState(null);
  const [ courier, setCourier ] = useState(null);

  const order_id = id;
  const courier_id = 200001; //O ID do Courier será fornecido posteriormente junto a atualização do status de entrega

  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${order_id}`).then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
    }
    getOrder();
  }, [order_id]);

  useEffect(() => {
    async function getCourier() {
      await api.get(`/courier/${courier_id}`).then(response => {
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
      return <Text style={[styles.status, statusStyle[status]]}>{pedido?.Status.replace(/_/g, ' ')}</Text>
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
        {renderStatusMessage(pedido?.Status)}
      </View>
      
      <View style={{flex: 1}}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pedido?.DeliveryLat,
            longitude: pedido?.DeliveryLng,
            latitudeDelta: 0.007,
            longitudeDelta: 0.007,
          }}
          showsUserLocation={true} 
          showsTraffic={true}
          maxZoomLevel={18}
          flipY={true} 
        >
          {courier?.Latitude && (
            <Marker 
              coordinate={{ 
                latitude: courier?.Latitude, 
                longitude: courier?.Longitude 
              }}
              title={courier?.Nome}
              description="Entregador"
            >
              <View style={{ padding: 5, backgroundColor: "red", borderRadius: 5 }}>
                <Fontisto name="motorcycle" size={40} color="yellow" />
              </View>
            </Marker>
          )}

          <Marker
            coordinate={{
              latitude: pedido?.DeliveryLat,
              longitude: pedido?.DeliveryLng
            }}
            title={pedido?.Delivery}
            description="Delivery"
          >
            <View style={{ padding: 5 }}>
              <AntDesign name="pushpin" size={40} color="red" />
            </View>
          </Marker>

          <Marker
            coordinate={{
              latitude: pedido?.Latitude,
              longitude: pedido?.Longitude
            }}
            title={pedido?.Nome}
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

