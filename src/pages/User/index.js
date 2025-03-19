/* 
* src/pages/User/index.js
*/

import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { TextInputMask } from 'react-native-masked-text';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

import Header from '../../components/Header';
import api from '../../config/apiAxios';

export default function Perfil() {
  const navigation = useNavigation();
  const { user, setUser, tokenMsg, signOut } = useContext(AuthContext);

  const [ nome, setNome ] = useState(user?.NOME || "");
  const [ sobrenome, setSobrenome ] = useState(user?.SOBRENOME || "");
  const [ url_imagem, setUrlImagem ] = useState(user?.URL_IMAGEM || "https://via.placeholder.com/250");
  const [ telefone, setTelefone ] = useState(user?.TELEFONE || "");
  const [ email, setEmail ] = useState(user?.EMAIL || "");
  // const [ CEP, setCep ] = useState(user?.CEP || "")
  // const [ endereco, setEndereco ] = useState(user?.ENDERECO || "");
  // const [ numero, setNumero ] = useState(user?.NUMERO || "");
  // const [ complemento, setComplemento ] = useState(user?.COMPLEMENTO || "");
  // const [ bairro, setBairro ] = useState(user?. BAIRRO || "");
  // const [ cidade, setCidade ] = useState(user?.CIDADE || "");
  // const [ UF, setUf] = useState(user?.UF || "");

  async function onSave() {
    await updateUser();
    navigation.goBack();
  };

  async function updateUser() {
    const json = {
      "USER_ID": user.UserID, 
      "NOME": nome, 
      "SOBRENOME": sobrenome,
      "URL_IMAGEM": url_imagem, 
      "TELEFONE": telefone, 
      "EMAIL": email,
      // "CEP": CEP,  
      // "ENDERECO": endereco, 
      // "NUMERO": numero,
      // "COMPLEMENTO": complemento, 
      // "BAIRRO": bairro, 
      // "CIDADE": cidade, 
      // "UF": UF,
      "TOKEN_MSG": tokenMsg
    }
    try {
      await api.put(`/update/usuario/${user.UserID} `, json).then(response => {
        setUser(response.data[0]);
        Alert.alert('Dados atualizados com sucesso!');
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header/>
      <Text style={styles.subtitle}>PERFIL DO USUÁRIO</Text>
      <ScrollView contentContainerStyle={styles.content} focusable={true} >

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Nome:</Text>
          <TextInput 
            value={nome}
            placeholder="Nome"
            autoCorrect={false}
            onChangeText={(input) => setNome(input)}
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Sobrenome:</Text>
          <TextInput
            value={sobrenome}
            placeholder="Sobrenome"
            onChangeText={(input) => setSobrenome(input)}
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Telefone:</Text>
          <TextInputMask
            type={'custom'}
            options={{
              mask: "(99) 99999-9999",
            }}
            value={telefone}
            placeholder="(31) 99999-9999"
            onChangeText={ (input) => setTelefone(input) }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Email:</Text>
          <TextInput
            value={email}
            onChangeText={(input)=>setEmail(input)}
            placeholder='username@email.com'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        {/* 
          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>CEP:</Text>
            <TextInputMask
              type={'custom'}
              options={{
                mask: "99999-999",
              }}
              value={CEP}
              placeholder="99999-999"
              onChangeText={ (input) => setCep(input) }
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>Endereco:</Text>
            <TextInput
              value={endereco}
              placeholder="Endereço"
              onChangeText={(input) => setEndereco(input)}
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>Número:</Text>
            <TextInput
              value={numero}
              placeholder="Número"
              onChangeText={(input) => setNumero(input)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>Complemento:</Text>
            <TextInput
              value={complemento}
              placeholder="Complemento"
              onChangeText={(input) => setComplemento(input)}
              style={styles.input}
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>Bairro:</Text>
            <TextInput 
              value={bairro}
              placeholder="Bairro"
              onChangeText={(input) => setBairro(input)}
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>Cidade:</Text>
            <TextInput 
              value={cidade}
              placeholder="Cidade"
              autoCorrect={false}
              onChangeText={(input) => setCidade(input)}
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={{marginBottom: 5}}>UF:</Text>
            <TextInput 
              value={UF}
              placeholder="UF"
              onChangeText={(input) => setUf(input)}
              autoCapitalize="words"
              style={styles.input}
            />
          </View> 
        */}

      </ScrollView>
      <TouchableOpacity style={styles.btnSubmit} onPress={ onSave }>
        <Text style={styles.btnTxt}>ATUALIZAR DADOS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnLogout} onPress={ signOut }>
        <Text style={styles.btnTxt}>FECHAR (LOGOUT)</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  content: {
    width: '98%',
    paddingHorizontal: 10,
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
  areaInput:{
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 5,
  },
  input:{
    flex: 1, 
    width: "98%",
    height: 45,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#8CB8D2",
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: "#000",
  },
  btnSubmit:{
    width: "95%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5
  },
  btnLogout: {
    width: '95%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5
  },
  btnTxt:{
    color: "#FFF", 
    fontSize: 20,
    textAlign: "center", 
  },
})

/*
{
    "UserID": 100001,
    "Nome": "Ezequias",
    "Sobrenome": "Martins",
    "UrlImagem": "https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/usuarios%2Fezequiasmartins.jpg?alt=media&token=873161e8-922e-49df-b5c1-0d200023e326",
    "Email": "ezequiasmartins@gmail.com",
    "Telefone": "+55 31 98410-7540",
    "Endereco": "Rua dos Comanches, 870 Santa Mônica, Belo Horizonte, MG, 31530-250",
    "Latitude": -19.826617659416904, 
    "Longitude": -43.98354455908985,
    "TokenUSR": ""
}
*/

/**
 ** tabela de cores: #FFB901 #55A9D6 #7F7B7B #5D5D5D #FF0000 #0033CC #FFF000 #131313 #4DCE4D
 */