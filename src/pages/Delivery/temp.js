/**
* DeliveryItemToSelect.js
*/

import React, { useState, useContext } from "react";
import { View, FlatList, Text, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { CartContext } from "../../contexts/CartContext";

export default function DeliveryItemToSelect({ produto, close }) {
  const { AddToBasket } = useContext(CartContext);
  const [ qtd, setQtd ] = useState(1);
  const [ totalextras, setTotalExtras ] = useState(0);
  const [ acrescimos, setAcrescimos ] = useState([]);
  const [ obs, setObs ] = useState("");

  const total = atualizaTotal();

  useEffect(() => {
    async function loadAcrescimos() {
      await api.get(`/api/listar/extras/delivery/${id}`).then((response) => {
        setAcrescimos(response.data);
      });
    }
    loadAcrescimos();
  }, []);

  function add() {
    setQtd(qtd + 1);
  }

  function remove() {
    if (qtd > 1) {
      setQtd(qtd - 1);
    }
  }

  function onSelect(extra) {
    const extraIndex = acrescimos.findIndex((item) => item.ExtraID === extra.ExtraID);

    if (extraIndex === -1) {
      setAcrescimos([...acrescimos, extra]);
    } else {
      const newAcrescimos = [...acrescimos];
      newAcrescimos.splice(extraIndex, 1);
      setAcrescimos(newAcrescimos);
    }
  }

  function atualizaTotal() {
    const valorItem = produto?.VrUnitario * qtd;
    const valorExtras = acrescimos.reduce((total, extra) => total + extra.VrUnitario, 0);
    setTotalExtras(valorExtras);
    return valorItem + valorExtras;
  }

  function AddItem() {
    const itemComAcrescimos = { ...produto, extras: acrescimos };
    AddToBasket(itemComAcrescimos, qtd, total);
    close();
  }

  function ExtraListItem({ extra, isSelected }) {
    return (
      <View style={{ padding: 10, marginBottom: 10, borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{extra?.Descricao}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          {isSelected ? (
            <Text>+ R$ {parseFloat(extra?.VrUnitario).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Text>
          ) : (
            <Text>Acrescentar item?</Text>
          )}
          <TouchableOpacity onPress={() => onSelect(extra)}>
            {isSelected ? <Fontisto name="checkbox-active" size={30} color="black" /> : <Fontisto name="checkbox-passive" size={30} color="gray" />}
          </TouchableOpacity>
        </View>
      </View>
    );
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
          </View>

          <FlatList
            data={acrescimos}
            ListHeaderComponent={<Text style={{ marginBottom: 5, fontWeight: "bold" }}>Deseja acrescentar?</Text>}
            ListEmptyComponent={() => <Text style={styles.empty}>Não há produtos nesta categoria.</Text>}
            keyExtractor={(item) => item.ExtraID}
            renderItem={({ item }) => <ExtraListItem extra={item} isSelected={acrescimos.some((acrescimo) => acrescimo.ExtraID === item.ExtraID)} />}
            style={styles.extras}
          />

          <View style={styles.areaInput}>
            <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Alguma observação?</Text>
            <TextInput
              value={obs}
              placeholder="Ex.: sem alface e tomate, etc"
              onChangeText={(text) => setObs(text)}
              autoCapitalize="sentences"
              multiline={true}
              numberOfLines={4}
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
            <Text style={styles.summary}>{qtd} x R$ {parseFloat(produto?.VrUnitario).toFixed(2)} + R$ {parseFloat(totalextras).toFixed(2)} = R$ {parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Text>

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
    marginBottom: 20
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
    marginTop: 10,
    marginBottom: 10,
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
