/**
* DeliveryItemToSelect.js
*/

import React, { useState, useEffect, useContext } from "react";
import { View,FlatList, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../../contexts/CartContext";

import DeliveryListExtra from './DeliveryListExtra';
import api from "../../config/apiAxios";

export default function DeliveryItemToSelect({ produto, id, close }) {
  const { AddToBasket } = useContext(CartContext);
  const [ qtd, setQtd ] = useState(1);
  const [ total, setTotal ] = useState(produto?.VrUnitario);
  const [ acrescimos, setAcrescimos] = useState(null);
  const [ itensAcrescentar, setItensAcrescentar ] = useState([]);
  const [ valorAcrescentar, setValorAcrescentar ] = useState(0);
  const [ obs, setObs ] = useState("");

  useEffect(() => {
    async function loadAcrescimos() {
      await api.get(`/listar/extras/delivery/${id}`).then((response) => {
        setAcrescimos(response.data);
      });
    }
    loadAcrescimos();
  }, []);

  function add() {(
    setQtd(qtd +1),
    setTotal((qtd +1) * (produto?.VrUnitario + valorAcrescentar))
    )
  }

  function remove() {
    if (qtd>1) {
      setQtd(qtd -1);
      setTotal((qtd -1) * (produto?.VrUnitario + valorAcrescentar))
    }
  }

  function setExtrasTotal(extras) {
    let result = extras.reduce((acc, obj) => {return acc + obj?.VrUnitario}, 0);
    setValorAcrescentar(result);
  }

  function AddToAcrescimos(extra) {
    console.log("AddToAcrescimos", extra);
    itensAcrescentar.push(extra);
    console.log(itensAcrescentar);
    setExtrasTotal(itensAcrescentar);
  }

  function RemoveFromAcrescimos(extra) {
    console.log("RemoveFromAcrescimos", extra);
    const result = itensAcrescentar.indexOf(extra);
    if (result !== -1) {
        itensAcrescentar.splice(result, 1);
        console.log(itensAcrescentar);
        setExtrasTotal(itensAcrescentar);
      } else {
        console.log("Item não encontrado!");
    }
  }

  function AddItem() {
    AddToBasket(produto, qtd, itensAcrescentar, valorAcrescentar, obs); // incluir acréscimos (itensAcrescentar, valorAcrescentar)
    close();
  }

  return (
    <View style={styles.shadow}>
      <View style={styles.modal}>
        <ScrollView contentContainerStyle={styles.content} focusable={true}>

          <View style={styles.indicator} />

          <View style={styles.card}>
            <Image style={styles.image} source={{ uri: (produto?.UrlImagem === "" ? "https://via.placeholder.com/500x500" : produto.UrlImagem) }} />
            <Text style={styles.title}>{produto?.Nome}</Text>
            <Text style={styles.description}>{produto?.Descricao}</Text>
            <Text style={styles.summary}>R$ {parseFloat(produto?.VrUnitario).toFixed(2)}</Text>
          </View>

          <FlatList
            data={acrescimos}
            ListHeaderComponent={<Text style={{ marginBottom: 5, fontWeight: "bold" }}>Deseja acrescentar?</Text>}
            ListEmptyComponent={() => <Text style={styles.empty}>Não há produtos nesta categoria.</Text>}
            ListFooterComponent={ () => (
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={styles.resumo}>VALOR A ACRESCENTAR P/ UNIDADE:</Text>
                <Text style={styles.resumo}>R$ {parseFloat(valorAcrescentar).toFixed(2)}</Text>
              </View>
            )}
            keyExtractor={(item) => item.ExtraID}
            renderItem={({ item }) => <DeliveryListExtra extra={item} add={()=>AddToAcrescimos(item)} remove={()=>RemoveFromAcrescimos(item)} />}
            style={styles.extras}
          />

          <View style={styles.areaInput}>
            <Text style={{ marginLeft: 10, marginBottom: 10, fontWeight: "bold" }}>Alguma observação?</Text>
            <TextInput
              value={obs}
              placeholder="Ex.: sem alface e tomate, etc"
              onChangeText={(text) => setObs(text)}
              autoCapitalize="sentences"
              multiline={true}
              numberOfLines={3}
              style={styles.input}
            />
          </View>

          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 150, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <TouchableOpacity onPress={remove}>
                <Ionicons name="md-remove-circle-outline" size={50} color="red" />
              </TouchableOpacity>
              <Text style={styles.title}>{qtd}</Text>
              <TouchableOpacity onPress={add}>
                <Ionicons name="ios-add-circle-outline" size={50} color="green" />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={styles.summary}>{qtd} x (R$ {parseFloat(produto?.VrUnitario).toFixed(2)} + R$ {parseFloat(valorAcrescentar).toFixed(2)}) = </Text>
              <Text style={styles.summary}>R$ {(qtd * (parseFloat(produto?.VrUnitario)+parseFloat(valorAcrescentar))).toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.btnAdd} onPress={() => AddItem()}>
              <Text style={{ color: '#FFF', fontSize: 18 }}>Adiciona Item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnClose} onPress={close}>
              <Text style={{ color: '#FFF', fontSize: 18 }}>FECHAR</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute'
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: '80%',
    backgroundColor: '#FFF',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 15,
    color: "#525252",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 10
  },
  areaInput: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    width: "98%",
    overflow: "scroll",
    textAlignVertical: "top",
    height: 45,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#8CB8D2",
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: "#000",
  },
  summary: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },
  resumo: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 10
  },
  description: {
    color: 'grey',
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  btnAdd: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  btnClose: {
    width: '100%',
    height: 45,
    borderRadius: 7,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
})

