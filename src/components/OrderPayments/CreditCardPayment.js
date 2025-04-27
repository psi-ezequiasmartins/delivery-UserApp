/* 
* src/pages/Pedidos/CreditCardPayment.js
*/

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Keyboard, TouchableOpacity, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";

import api from "../../config/apiAxios";

export default function OrderCreditCardPayment({ orderId }) {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const [pedido, setPedido] = useState(null);
  
  useEffect(() => {
    async function getOrder() {
      await api.get(`/api/pedido/${orderId}`).then((response) => {
        setPedido(response.data);
        if (isDevelopment) {
          console.log('Pedido:', {
            id: response.data.PEDIDO_ID,
            data: response.data.DATA,
            valor: response.data.VR_TOTAL,
            taxaEntrega: response.data.TAXA_ENTREGA,
            nome: response.data.DELIVERY_NOME
          });         
        }
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
        <Text>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail} 
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          onSubmitEditing={() => Keyboard.dismiss()}
          style={styles.input}
        />
      </View>

      <View style={styles.areaInput}>
        <Text>Número do Cartão</Text>
        <MaskedTextInput
          value={cardNumber}
          mask={"9999 9999 9999 9999"}
          placeholder="9999 9999 9999 9999"
          onChangeText={(masked, unmasked) => {setCardNumber(masked)}}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.areaInput}>
        <Text>Validade do Cartão</Text>
        <MaskedTextInput
          value={expiryDate}
          mask="99/9999"
          placeholder="MM/AAAA"
          onChangeText={(masked, unmasked) => {setExpiryDate(masked)}}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.areaInput}>
        <Text>Código CVV</Text>
        <MaskedTextInput
          value={cvv}
          mask={"999"}
          placeholder="999"
          onChangeText={(masked, unmasked)=>{setCvv(masked)}}
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
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    padding: 20,
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
    padding: 5
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
