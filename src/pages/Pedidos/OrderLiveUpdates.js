/**
* src/pages/Pedidos/OrderLiveUpdates.js
*/

import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { Fontisto, AntDesign } from "@expo/vector-icons";
import { getCoordinatesFromAddress } from "../../components/Gps/useGeolocation";

import api, { isDevelopment } from "../../config/apiAxios";

export default function OrderLiveUpdates({ pedido }) {
  const [ courier, setCourier ] = useState(null);
  const [ delivery_coords, setDeliveryCoords ] = useState(null);
//const [ courier_coords, setCourierCoords ] = useState(null);
//Os dados do Courier serão fornecidos posteriormente junto com a atualização do status (coleta/retirada e entrega)

  const courierId = 200001; 
  
  useEffect(() => {
    async function getOrder() {
      try {
        if (pedido?.DELIVERY_ENDERECO) {
          const coords = await getCoordinatesFromAddress(pedido.DELIVERY_ENDERECO);
          if (coords?.latitude && coords?.longitude) {
            if (isDevelopment) {
              console.log('Coordenadas do Delivery: ', coords);
            }
            setDeliveryCoords(coords);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    getOrder(); 
  }, [pedido]);

  useEffect(() => {
    async function getCourier() {
      await api.get(`/api/courier/${courierId}`).then(response => {
        setCourier(response.data[0]);
      })
    }
    getCourier();
  }, []);

  function renderStatusMessage(status) {
    const statusStyle = {
      "NOVO": { backgroundColor: 'red', color: 'white' },
      "AGUARDANDO": { backgroundColor: 'orange', color: 'black' },
      "PREPARANDO": { backgroundColor: 'gray', color: 'white' },
      "PRONTO_PARA_RETIRADA": { backgroundColor: 'green', color: 'white' },
      "SAIU_PARA_ENTREGA": { backgroundColor: 'blue', color: 'white' },
      "RECEBIDO": { backgroundColor: 'purple', color: 'white' },
      "FINALIZADO": { backgroundColor: 'black', color: 'white' },
      "CANCELADO": { backgroundColor: 'gray', color: 'white' },
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
        <ActivityIndicator size="small" color="#FFF" />
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
            latitude: -19.82277, // coordenadas iniciais
            longitude: -43.98033, // coordenadas iniciais
            latitudeDelta: 0.007,
            longitudeDelta: 0.007
          }}
          showsUserLocation={true} 
          showsTraffic={true}
          flipY={true} 
        >
          {courier?.COURIER_ID && (
            <Marker 
              coordinate={{ 
                latitude: -19.82628,
                longitude: -43.98033,
              }}
              title={courier?.NOME}
              description="Entregador"
            >
              <View style={{ padding: 5, backgroundColor: "red", borderRadius: 5 }}>
                <Fontisto name="motorcycle" size={40} color="yellow" />
              </View>
            </Marker>
          )}

          {delivery_coords?.latitude && delivery_coords?.longitude && (
            <Marker
              coordinate={{
                latitude: delivery_coords.latitude,
                longitude: delivery_coords.longitude,
              }}
              title={pedido?.DELIVERY_NOME}
              description="Delivery"
            >
              <View style={{ padding: 5 }}>
                <AntDesign name="pushpin" size={45} color="blue" />
              </View>
            </Marker>
          )}

          {pedido?.LATITUDE && pedido?.LONGITUDE && (
            <Marker
              coordinate={{
                latitude: pedido.LATITUDE,
                longitude: pedido.LONGITUDE
              }}
              title={pedido?.CLIENTE_NOME}
              description="Sua Localização"
            >
              <View style={{ padding: 5 }}>
                <Fontisto name="map-marker-alt" size={45} color="red" />
              </View>
            </Marker>
          )}

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
  }
});
