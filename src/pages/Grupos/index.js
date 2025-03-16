import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';

import btn_ofertas from './images/ofertas.jpg';
import btn_sanduiches from './images/sanduiches.jpg';
import btn_hotdogs from './images/hotdogs.jpg';
import btn_bebidas from './images/bebidas.jpg';
import btn_pratosporcoes from './images/pratosporcoes.jpg';
import btn_sushi from './images/sushi.jpg';
import btn_frutasverduras from './images/frutasverduras.jpg';
import btn_medicamentos from './images/medicamentos.jpg';
import btn_gasdecozinha from './images/gasdecozinha.jpg';
import btn_floricultura from './images/floricultura.jpg';
import btn_aguamineral from './images/aguamineral.jpg';
import btn_mercado from './images/mercado.jpg';

export default function Grupos() { 

  const navigation = useNavigation();

  function LinkTo(page, p) {
    return (
      navigation.navigate(page, p)
    )
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header/>
        <View styles={styles.grupos}>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 101, categoria: "OFERTAS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_ofertas}/>
              </TouchableOpacity>
              <Text>Ofertas</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 102, categoria: "SANDUICHES" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_sanduiches}/>
              </TouchableOpacity>
              <Text>Sanduiches</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 103, categoria: "HOTDOGS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_hotdogs}/>
              </TouchableOpacity>
              <Text>Hotdogs</Text>
            </View>
          </View>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 104, categoria: "BEBIDAS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_bebidas}/>
              </TouchableOpacity>
              <Text>Bebidas</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 105, categoria: "PRATOS & PORÇÕES" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_pratosporcoes}/>
              </TouchableOpacity>
              <Text>Pratos & Porções</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 106, categoria: "SUSHI" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_sushi}/>
              </TouchableOpacity>
              <Text>Sushi</Text>
            </View>
          </View>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 107, categoria: "FRUTAS & VERDURAS" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_frutasverduras}/>
              </TouchableOpacity>
              <Text>Frutas & Verduras</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 108, categoria: "MEDICAMENTOS" })}>
                <Image style={[styles.item, {opacity: 0.5}]} source={btn_medicamentos}/>
              </TouchableOpacity>
              <Text>Medicamentos</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 109, categoria: "GÁS DE COZINHA" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_gasdecozinha}/>
              </TouchableOpacity>
              <Text>Gás de Cozinha</Text>
            </View>
          </View>

          <View style={styles.linha}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 110, categoria: "FLORICULTURA" })}>
                <Image style={[styles.item, {opacity: 0.5}]} source={btn_floricultura}/>
              </TouchableOpacity>
              <Text>Floricultura</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 111, categoria: "ÁGUA MINERAL" })}>
                <Image style={[styles.item, {opacity: 1.0}]} source={btn_aguamineral}/>
              </TouchableOpacity>
              <Text>Água Mineral</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>LinkTo('Deliveries', { id: 112, categoria: "MERCADO" })}>
                <Image style={[styles.item, {opacity: 0.5}]} source={btn_mercado}/>
              </TouchableOpacity>
              <Text>Mercado</Text>
            </View>
          </View>

        </View>

      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  background:{
    flex: 1,
    backgroundColor: '#FFF',
  },
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#D9ECFD',
  },
  grupos: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  linha:{
    flexDirection: 'row', 
    alignSelf: 'center',
  },
  item: {
    width: 119, 
    height: 116, 
    margin: 5, 
    backgroundColor: 'white', 
    borderRadius: 7,
    resizeMode: 'contain',
  },
});  