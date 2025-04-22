/* 
* src/pages/User/index.js
*/

import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from "react-native-virtualized-view";
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

import Header from '../../components/Header';
import api from '../../config/apiAxios';

export default function Perfil() {
  const navigation = useNavigation();
  const { user, setUser, pushToken, signOut } = useContext(AuthContext);

  // const [ UserId, setUserId ] = useState(user?.UserID || "");
  const [ nome, setNome ] = useState(user?.Nome || "");
  const [ sobrenome, setSobrenome ] = useState(user?.Sobrenome || "");
  const [ url_imagem, setUrlImagem ] = useState(user?.url_imagem || "https://via.placeholder.com/250");
  const [ telefone, setTelefone ] = useState(user?.Telefone || "");
  const [ email, setEmail ] = useState(user?.Email || "");

  async function onSave() {
    await updateUser();
    navigation.goBack();
  };

  async function updateUser() {
    const json = {
      "USER_ID": user?.UserID, 
      "NOME": nome, 
      "SOBRENOME": sobrenome,
      "URL_IMAGEM": url_imagem, 
      "TELEFONE": telefone, 
      "EMAIL": email,
      "PUSH_TOKEN": pushToken
    }
    try {
      await api.put(`/api/update/usuario/${user?.UserID} `, json).then(response => {
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

          <Text>ID (Ficha Nº):</Text>
          <TextInput 
            value={user?.UserID}
            placeholder={String(user?.UserID)}
            autoCorrect={false}
            autoCapitalize="words"
            style={styles.input}
            editable={false}
          />
        </View>

        <View style={styles.areaInput}>
          <Text>Nome:</Text>
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
          <Text>Sobrenome:</Text>
          <TextInput
            value={sobrenome}
            placeholder="Sobrenome"
            onChangeText={(input) => setSobrenome(input)}
            autoCapitalize="words"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text>Telefone:</Text>
          <MaskedTextInput
            value={telefone}
            mask={"(99) 99999-9999"}
            placeholder="(31) 99999-9999"
            onChangeText={(masked, unmasked)=>{setTelefone(masked)}}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text>Email:</Text>
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
    padding: 5
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