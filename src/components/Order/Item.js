/**
 * src/components/Order/Item.js
 */

import { View, Text, Image, StyleSheet } from "react-native";

export default function Item({ dish }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.produto}>{dish?.PRODUTO_NOME.toUpperCase()}</Text>
        <Text style={styles.qtd}>{dish?.QTD} x R$ {parseFloat(dish?.VR_UNITARIO).toFixed(2)}</Text>
        <Text style={styles.total}>TOTAL R$ {parseFloat(dish?.QTD * dish?.VR_UNITARIO).toFixed(2)}</Text>
      </View>
      <Image style={styles.imagem} source={{uri: dish?.URL_IMAGEM}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 2,
    marginBottom: 10,
    padding: 5,
  },
  produto:{
    fontWeight: 'bold',
    fontSize: 12,
  },
  qtd:{
    fontWeight: 'bold',
    fontSize: 14,
  },
  total:{
    color: "#D65656",
    fontSize: 14,
  },
  imagem:{
    width: 75, 
    height: 75,
  },

});
