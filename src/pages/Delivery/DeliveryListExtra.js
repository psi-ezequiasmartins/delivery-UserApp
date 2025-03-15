/**
* DeliveryListExtra.js
*/

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";

export default function ExtraListItem({ item_extra, add, remove }) {
  const [ checkbox, setCheckBox ] = useState(false);

  function selecionar() {
    if (checkbox === true) {(
      setCheckBox(false),
      remove()
    )} else {(
      setCheckBox(true), 
      add()
    )}
  }

  return (
    <View style={styles.card}>
      <Text style={styles.descricao}>{item_extra?.DESCRICAO}</Text>

      <View style={styles.info}>
        {checkbox ? (
          <Text>+ R$ {parseFloat(item_extra?.VR_UNITARIO).toFixed(2)}</Text>
        ) : (
          <Text>Acrescentar item?</Text>
        )}
        <TouchableOpacity onPress={selecionar}>
          {checkbox ? <Fontisto name="checkbox-active" size={30} color="black" /> : <Fontisto name="checkbox-passive" size={30} color="gray" />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 10, 
    borderBottomColor: 'lightgray', 
    borderBottomWidth: 1 
  },
  descricao: { 
    fontWeight: "bold" 
  },
  info: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
})
