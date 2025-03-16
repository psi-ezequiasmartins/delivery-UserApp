/**
* src/pages/Home/index.js
*/

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import api from '../../config/apiAxios';

export default function Home() {
  const navigation = useNavigation();
  const [categorias, setCategorias] = useState(null);

  useEffect(() => {
    async function loadCategorias() {
      await api.get('/listar/categorias').then((response) => {
        setCategorias(response.data);
      });
    }
    loadCategorias();
  }, []);

  function LinkTo(page, p) {
    return (
      navigation.navigate(page, p)
    )
  }

  if (!categorias) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    )
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.title}>CATEGORIAS</Text>
        <FlatList
          data={categorias}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item)=>String(item.CATEGORIA_ID)}
          renderItem={({item}) => (
            <View>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: item.CADETORIA_ID, categoria: item.CATEGORIA_NOME })}>
                <View style={styles.card}>
                  <Image source={{ uri: item.URL_IMAGEM }} style={styles.imagem} />
                  <Text style={styles.label}>{item.CATEGORIA_NOME}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#99CFFF",
  },
  title:{
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1
  },
  card:{
    flex: 1,
    height: 115,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1
  },
  label:{
    fontSize: 21,
    fontWeight: 'bold'
  },
  imagem:{
    width: 100,
    height: 100,
    margin: 5
  },
  indicator:{
    flex:1, 
    position: 'absolute', 
    backgroundColor: '#000', 
    opacity: 0.7, 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
})
