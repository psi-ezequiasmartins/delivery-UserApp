/**
 * src/components/Order/OrderListItem.js
 */

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function OrderListItem({ order }) {
  const navigation = useNavigation();

  function handleOrderPress() {   
    navigation.navigate('OrderDetailsNavigator', { orderId: order?.PEDIDO_ID });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleOrderPress}>
        <Text style={{fontWeight: 'bold'}}>Pedido Nº {order?.PEDIDO_ID}</Text>
        <Text style={{fontWeight: 'normal'}}>Data/Hora do Pedido: {order?.DATA}</Text>
        <Text style={{fontWeight: 'normal'}}>Qtd. de Itens: {order?.QTD_ITENS} &#8226; Total: R$ { parseFloat(order?.VR_TOTAL).toFixed(2) }</Text>
        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center", marginBottom: 5}}>
          { order?.STATUS === "NOVO" ? <Text style={[styles.status, {backgroundColor: 'red'}]}> NOVO </Text> : null }
          { order?.STATUS === "AGUARDANDO" ? <Text style={[styles.status, {backgroundColor: 'orange', color: 'black'}]}> AGUARDANDO </Text> : null }
          { order?.STATUS === "PREPARANDO" ? <Text style={[styles.status, {backgroundColor: 'gray', color: 'white'}]}> PREPARANDO </Text> : null }
          { order?.STATUS === "PRONTO_PARA_RETIRADA" ? <Text style={[styles.status, {backgroundColor: 'green', color: 'white'}]}> PRONTO PARA RETIRADA </Text> : null }
          { order?.STATUS === "SAIU_PARA_ENTREGA" ? <Text style={[styles.status, {backgroundColor: 'blue', color: 'white'}]}> SAIU PARA ENTREGA </Text> : null }
          { order?.STATUS === "ENTREGUE" ? <Text style={[styles.status, {backgroundColor: 'purple', color: 'white'}]}> PEDIDO ENTREGUE </Text> : null }
          { order?.STATUS === "PGTO_PENDENTE" ? <Text style={[styles.status, {backgroundColor: 'red', color: 'white'}]}> PGTO PENDENTE </Text> : null }
          { order?.STATUS === "PGTO_OK" ? <Text style={[styles.status, {backgroundColor: 'green', color: 'white'}]}> PGTO OK </Text> : null }
          { order?.STATUS === "FINALIZADO" ? <Text style={[styles.status, {backgroundColor: 'black', color: 'white'}]}> FINALIZADO </Text> : null }
          { order?.STATUS === "CANCELADO" ? <Text style={[styles.status, {backgroundColor: 'gray', color: 'white'}]}> CANCELADO </Text> : null }
          <Text><AntDesign color="#000" name='ellipsis1' size={28}/></Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  card:{
    borderBottomWidth: 0.5,
    borderColor: "#9C9C9C",
    padding: 5,
  },
  title:{
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  subtitle:{
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold'
  },
  status:{
    color: '#FFF',
    borderRadius: 5,
    marginTop: 5,
    padding: 3
  },
  line18:{ 
    color: '#000', 
    fontSize: 18 
  },
  line13:{
    color: '#000',
    fontSize: 13,
    marginBottom: 10
  },
})
