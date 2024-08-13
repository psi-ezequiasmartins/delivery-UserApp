/* 
* src/pages/Pedidos/OrderPayment.js
*/

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Keyboard, Button, TouchableOpacity, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { TextInputMask } from 'react-native-masked-text';

import api from "../../config/apiAxios";

export default function OrderPayment({ id }) {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const [ pedido, setPedido ] = useState(null);
  const order_id = id;

  useEffect(() => {
    async function getOrder() {
      await api.get(`/pedido/${order_id}`).then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
    }
    getOrder();
  }, [order_id]);

  async function handlePayment() {
    setLoading(true);
    try {
      const paymentData = {
        itemId: order_id,
        itemDescription: pedido?.PedidoID+' '+pedido?.Data+' '+pedido?.Delivery,
        itemAmount: pedido?.VrTotal,
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
        <Text style={{fontSize: 13, fontWeight: "bold" }}>PEDIDO Nº {id} {pedido?.Data}</Text>
        <Text style={{fontSize: 13}}>
          R$ {parseFloat(pedido?.VrSubTotal).toFixed(2)} + R$ {parseFloat(pedido?.TaxaEntrega).toFixed(2)} = R$ {parseFloat(pedido?.VrTotal).toFixed(2)}
        </Text>
        <View style={styles.areaInput}>
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
          <TextInputMask
            type={'custom'}
            placeholder="Número do Cartão"
            value={cardNumber}
            onChangeText={setCardNumber} // onChangeText={(input)=>setCardNumber(input) }
            options={{
              mask: "9999 9999 9999 9999",
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <TextInputMask
            type={'custom'}
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv} // onChangeText={(input)=>setCvv(input) }
            options={{
              mask: "999",
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <TextInputMask
            type={'custom'}
            placeholder="Data de Expiração"
            value={expiryDate}
            onChangeText={setExpiryDate} // onChangeText={(input)=>setExpiryDate(input) }
            options={{
              mask: "99/9999",
            }}
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
