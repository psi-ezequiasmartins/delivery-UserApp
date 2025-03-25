/* 
* src/pages/Pedidos/OrderPayment.js
*/

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Keyboard, TouchableOpacity, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { TextInputMask } from 'react-native-masked-text'; //  "react-native-masked-text": "^1.13.0",

import api from "../../config/apiAxios";

export default function OrderPayment({ orderId }) {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const [ pedido, setPedido ] = useState(null);
  
  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${orderId}`).then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
    }
    getOrder();
  }, [orderId]);

  async function handlePayment() {
    setLoading(true);
    try {
      const paymentData = {
        itemId: orderId,
        itemDescription: pedido?.PEDIDO_ID+' '+pedido?.DATA+' '+pedido?.DELIVERY_NOME,
        itemAmount: pedido?.VR_TOTAL,
        itemQuantity: '1',
        cardNumber,
        cvv,
        expiryDate,
        email,
        // Outros dados necessários
      };
      const result = await api.post('/checkout', paymentData);
      setResponse(result.data);
      setLoading(false);
    } catch (error) {
      setResponse(error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>PAGAMENTO VIA CARTÃO</Text>
        <Text>{" "}</Text>
        <Text style={{fontSize: 13, fontWeight: "bold" }}>PEDIDO Nº {orderId} {pedido?.DATA}</Text>

        <Text style={{ fontSize: 13 }}>
          R$ {parseFloat(pedido?.VR_SUBTOTAL).toFixed(2)} + R$ {parseFloat(pedido?.TAXA_ENTREGA).toFixed(2)} =
          <Text style={{ fontWeight: 'bold' }}>
            R$ {parseFloat(pedido?.VR_TOTAL).toFixed(2)}
          </Text>
        </Text>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail} // onChangeText={(input)=>setEmail(input)}
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Número do Cartão</Text>
          <TextInputMask
            value={cardNumber}
            mask={"[0000] [0000] [0000] [0000]"}
            placeholder="9999 9999 9999 9999"
            onChangeText={setCardNumber}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Validade do Cartão</Text>
          <TextInputMask
            value={expiryDate}
            mask={"[99]/[9999]"}
            placeholder="99/9999"           
            onChangeText={setExpiryDate}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Código CVV</Text>
          <TextInputMask
            value={cvv}
            mask={"[999]"}
            placeholder="999"
            onChangeText={setCvv}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={handlePayment}>
          {loading ? (
            <View style={styles.indicator}>
              <Text style={styles.btnTxt}>Aguarde... </Text>
              <ActivityIndicator size="large" color='#000FFF' />
            </View> 
          ) : (
            <Text style={styles.btnTxt}>EFETUAR PAGAMENTO</Text>
          )}
        </TouchableOpacity>

        <Text>{response}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  subtitle:{
    color: '#000',
    textAlign: "center",
    fontSize: 15,
  },
  areaInput:{
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 5,
  },
  input:{
    width: "95%",
    height: 50,
    backgroundColor: "#FFF",
    padding: 10,
    borderColor: "#8CB8D2",
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: "#000",
  },
  btnSubmit:{
    width: "95%",
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 5,
    margin: 10,
  },
  btnTxt:{
    color: "#FFF", 
    fontSize: 20,
    textAlign: "center", 
  },
  indicator:{
    flex:1, 
    flexDirection: 'row',
    position: 'absolute', 
    alignItems: 'center',
    justifyContent: 'center'
  }
})
