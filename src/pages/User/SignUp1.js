/**
 * src/pages/User/SignUp1.js
 */

import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, Keyboard, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import icon from '../../../assets/icon.png';
import marca from '../../../assets/logomarca.png';

export default function SignUp1() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');

  function checkEmptyField(field){
    if(field.trim()==='') {
      return false;
    } else {
      return true;
    }
  }

  function avancar(){
    const vNome = checkEmptyField(nome);
    const vSobrenome = checkEmptyField(sobrenome);

    if(!vNome || !vSobrenome){
      alert('Dados obrigatórios');
    } else {
      navigation.navigate('SignUp2', {nome, sobrenome})
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>

        <View style={styles.header}>
          <Image source={icon} style={styles.logo} resizeMode="contain" />
          <Image source={marca} style={styles.marca} resizeMode="contain" />
          <Text style={styles.title}>Seja bem vindo!</Text>
          <Text style={styles.subtitle}>Cadastre-se! É simples e rápido.</Text>
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Nome:</Text>
          <TextInput
            value={nome}
            onChangeText={(input) => setNome(input)}
            placeholder="Ex.: José"
            autoCorrect={true}
            autoCapitalize="setences"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Sobrenome:</Text>
          <TextInput
            value={sobrenome}
            onChangeText={(input) => setSobrenome(input)}
            placeholder="Ex.: Silva"
            autoCorrect={true}
            autoCapitalize="sentences"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={avancar}>
          <Text style={styles.btnTxt}> AVANÇAR </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={()=>navigation.navigate('SignIn')}>
          <Text style={styles.linkTxt}>Já tenho uma Conta!</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 10
  },
  header: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title:{ 
    color: '#000',
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 21,
  },
  subtitle:{
    color: '#000',
    textAlign: "center",
    fontSize: 15,
  },
  logo:{
    width: 70, 
    height: 70
  },
  marca:{
    width: 200, 
    height: 70,
    marginBottom: 15
  },
  areaInput:{
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
    marginBottom: 10
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
  link: {
    marginTop: 10,
  },
  linkTxt:{
    textAlign: "center",
    color: "#000",
  },
  indicator:{
    flex:1, 
    flexDirection: 'row',
    position: 'absolute', 
    alignItems: 'center',
    justifyContent: 'center'
  }
})
