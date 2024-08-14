/**
 * src/pages/User/SignUp2.js
 */

import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, Keyboard, Platform, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { TextInputMask } from 'react-native-masked-text';
import { useNavigation } from '@react-navigation/native';

import SelectUF from '../../components/SelectUF';
import icon from '../../../assets/icon.png';

export default function SignUp2(props) {
  const navigation = useNavigation();

  const nome = props.route.params.nome;
  const sobrenome = props.route.params.sobrenome;

  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Belo Horizonte');
  const [UF, setUf] = useState('MG');
  const [CEP, setCep] = useState('');

  function checkEmptyField(field){
    if(field.trim()==='') {
      return false;
    } else {
      return true;
    }
  }

  async function SearchAddressByCEP(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Erro na consulta do CEP');
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado');
      return data;
    } catch (error) {
      console.error('Erro na busca do endereço pelo CEP:', error);
      return null;
    }
  }

  async function handleEditCEP(value) {
    if (value.length === 9) {
      const cleanedCEP = value.replace(/\D/g, ''); // Remove non-numeric characters
      const addressData = await SearchAddressByCEP(cleanedCEP);
      if (addressData) {
        setCep(value);
        setEndereco(addressData.logradouro);
        setBairro(addressData.bairro);
        setCidade(addressData.localidade);
        setUf(addressData.uf);
      } else {
        setMsg({text: 'CEP não encontrado ou inválido', type: 1});
      }
    }
  }

  function avancar(){
    const vCEP = checkEmptyField(CEP);
    if(!vCEP) {
      alert('Dados obrigatórios');
    } else {
      navigation.navigate('SignUp3', {nome, sobrenome, CEP, endereco, numero, complemento, bairro, cidade, UF})
    }
  }

  return (
  <SafeAreaView style={styles.background}>
    <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>

      <View style={styles.header}>
        <Text style={styles.title}>Olá! {nome + ' ' + sobrenome}</Text>
        <Text style={styles.subtitle}>Por favor, preencha o formulário abaixo com o endereço completo para suas entregas.</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.areaInput, { width: "40%" }]}>
          <View style={styles.areaInput}>
            <Text style={{ marginBottom: 5 }}>CEP</Text>
            <TextInputMask
              type={'custom'}
              options={{
                mask: "99999-999",
              }}
              value={CEP}
              placeholder="31000-000"
              onChangeText={(input) => setCep(input)}
              onSubmitEditing={() => Keyboard.dismiss()}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={[styles.areaInput, { width: "60%" }]}>
          <Text></Text>
          <TouchableOpacity style={styles.btnSubmit} onPress={() => handleEditCEP(CEP)}>
            <Text style={styles.btnTxt}> PESQUISAR CEP </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.areaInput, {width: "80%"}]}>
          <Text style={{ marginBottom: 5 }}>Endereço</Text>
          <TextInput
            value={endereco}
            onChangeText={(input) => setEndereco(input)}
            placeholder="Av/Rua/Travessa, etc"
            autoCorrect={true}
            autoCapitalize="sentences"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>
        <View style={[styles.areaInput, {width: "20%"}]}>
          <Text style={{ marginBottom: 5 }}>Número</Text>
          <TextInput
            value={numero}
            onChangeText={(input) => setNumero(input)}
            placeholder="Nº"
            keyboardType="numeric"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.areaInput}>
        <Text style={{marginBottom: 5}}>Complemento</Text>
        <TextInput
          value={complemento}
          onChangeText={(input) => setComplemento(input)}
          placeholder="Ex.: Apto, Casa, Loja Nº etc."
          autoCorrect={true}
          autoCapitalize="sentences"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={styles.input}
        />
      </View>

      <View style={styles.areaInput}>
        <Text style={{marginBottom: 5}}>Bairro</Text>
        <TextInput
          value={bairro}
          onChangeText={(input) => setBairro(input)}
          placeholder="Ex.: Santa Mônica"
          autoCorrect={true}
          autoCapitalize="sentences"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.areaInput, {width: "60%"}]}>
          <Text style={{marginBottom: 5}}>Cidade:</Text>
          <TextInput
            value={cidade}
            onChangeText={(input) => setCidade(input)}
            placeholder="Ex.: Belo Horizonte"
            autoCorrect={true}
            autoCapitalize="words"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>
        <View style={[styles.areaInput, {width: "40%"}]}>
          <Text style={{marginBottom: 5}}>UF:</Text>
          <SelectUF
            onChange={setUf}
            uf={UF}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.btnSubmit} onPress={avancar}>
        <Text style={styles.btnTxt}> AVANÇAR </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSubmit} onPress={()=>navigation.navigate('SignUp1')}>
        <Text style={styles.btnTxt}> VOLTAR </Text>
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
    width: 100, 
    height: 100
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
    margin: 5,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "flex-start",
    marginLeft: 5,
    marginRight: 20,
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
    marginBottom: 10,
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
