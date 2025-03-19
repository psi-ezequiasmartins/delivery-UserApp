/**
* src/pages/Pedidos/index.js 
*/

import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";

import Header from '../../components/Header';
import OrderListItem from './OrderListItem';

import api from "../../config/apiAxios";

export default function Pedidos() {
  const { user } = useContext(AuthContext); // incluir notify 
  const [ listadepedidos, setListaDePedidos] = useState([]);

  const listRef = useRef(null);

  let id = user?.UserID;

  useEffect(() => {
    async function loadPedidos() {
      await api.get(`/listar/pedidos/usuario/${id}`).then((snapshot) => {
        setListaDePedidos(snapshot.data);
      });
    }
    loadPedidos();
  }, [id]);
  //}, [id, notify]); // se notify = true, atualiza a lista de pedidos com seus status atualizados.

  async function moveToTop() {
    await listRef.current.scrollToOffset({offset: 0, animated: true})
  }

  async function moveToDown() {
    await listRef.current.scrollToEnd({animated: true})
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <Header />
      <View style={styles.subheader}>
        <Text style={styles.title}>MEUS PEDIDOS</Text>
        <View style={{flexDirection: "row", width: "25%"}}>
          <TouchableOpacity onPress={ moveToTop }>
            <MaterialCommunityIcons name='arrow-up' size={50} color={'green'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={ moveToDown }>
            <MaterialCommunityIcons name='arrow-down' size={50} color={'red'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={listadepedidos}
          showsVerticalScrollIndicator={ true }
          ListEmptyComponent={()=><Text style={styles.empty}>Ainda não há pedidos deste Usuário.</Text>}
          keyExtractor={(item)=>String(item?.PEDIDO_ID)}
          renderItem={({item})=><OrderListItem order={item}/>}
          ref={listRef}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1, 
    backgroundColor: "#FFF"
  },
  container:{
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  subheader:{
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 10, 
    borderBottomColor: '#E2E2E2', 
    borderBottomWidth: 1 
  },
  title:{
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10
  },
  subtitle:{
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold'
  },
})
