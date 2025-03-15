/**
 * DeliveryListItem.js
 */

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function DeliveryListItem({ item, selectItem }) {
  const produto = item;
  return (
    <TouchableOpacity onPress={ selectItem } style={ styles.container }>
      <View style={{ flex: 1 }}>
        <Text style={ styles.name }>{ produto?.PRODUTO_NOME }</Text>
        <Text style={ styles.description } numberOfLines={ 3 }>
          { produto?.DESCRICAO }
        </Text>
        <Text style={ styles.price }>R$ { (produto?.VR_UNITARIO > 0) ? parseFloat( produto?.VR_UNITARIO ).toFixed(2) : "0,00" }</Text>
      </View>
      <Image style={ styles.image } source={{uri:(produto?.URL_IMAGEM === "" ? "https://via.placeholder.com/500x500" : produto.URL_IMAGEM)}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  description: {
    color: "gray",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  image: {
    width: 100,
    aspectRatio: 1,
    margin: 10, 
  }
});
