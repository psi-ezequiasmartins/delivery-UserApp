/**
* src/pages/Pedidos/OrderLiveUpdates.js
*/

import MapView, { Marker } from "react-native-maps";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { Fontisto, AntDesign } from "@expo/vector-icons";
// import { getCoordinatesFromAddress } from "../../components/gps/useGeolocation";

import api from "../../config/apiAxios";

export default function OrderLiveUpdates({ orderId }) {
  const [ pedido, setPedido ] = useState(null);
  const [ courier, setCourier ] = useState(null);
  // const [ delivery_coords, setDeliveryCoords ] = useState(null);
  // const [ courier_coords, setCourierCoords ] = useState(null);
  
  const courierId = 200001; //Os dados do Courier serão fornecidos posteriormente junto com a atualização do status (coleta/retirada e entrega)
  // setCourierCoords({"latitude": -19.82628, "longitude": -43.98033});
  
  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${orderId}`).then(async(response) => {
        setPedido(response?.data);
        console.log('Pedido recuperado: ', pedido);
        // const coords = await getCoordinatesFromAddress(response?.data?.CLIENTE_ENDERECO);
        // if (coords) { 
        //   console.log('Coordenadas obtidas (Delivery): ', coords);
        //   setDeliveryCoords(coords);
        // }       
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

          <Marker
            coordinate={{
              latitude: delivery_coords?.latitude, //-19.82277,
              longitude: delivery_coords?.longitude, //-43.97870, 
            }}
            title={pedido?.DELIVERY_NOME}
            description="Delivery"
          >
            <View style={{ padding: 5 }}>
              <AntDesign name="pushpin" size={45} color="blue" />
            </View>
          </Marker>

          <Marker
            coordinate={{
              latitude: pedido?.LATITUDE,
              longitude: pedido?.LONGITUDE
            }}
            title={pedido?.CLIENTE_NOME}
            description="Sua Localização"
          >
            <View style={{ padding: 5 }}>
              <Fontisto name="map-marker-alt" size={45} color="red" />
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

