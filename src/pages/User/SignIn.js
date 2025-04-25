/**
 * src/pages/User/SignIn.js
 */

import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Keyboard, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';

import icon from '../../../assets/icon.png';
import marca from '../../../assets/logomarca.png';

export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, loading } = useContext(AuthContext);
  const { getPushToken } = useContext(NotificationContext);

  const [ email, setEmail ] = useState('');
  const [ password, setPassword]  = useState('');

  async function handleLogin(email, password) {
    const pushToken = getPushToken();
    console.log('Push Token:', pushToken);
    signIn(email, password, pushToken);
  }
  
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>

        <View style={styles.header}>
          <Image style={styles.logo} source={icon} resizeMode="contain" />
          <Image style={styles.marca} source={marca} resizeMode="contain" />
          <Text style={styles.title}>Seja bem vindo!</Text>
          <Text style={styles.subtitle}>UserApp v2.0</Text>
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 10}}>Email:</Text>
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

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 10}}>Senha:</Text>
          <TextInput
            value={password}
            onChangeText={(input)=>setPassword(input)}
            placeholder='Senha (6 dígitos numéricos)'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            keyboardType='numeric'
            textContentType='password'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={()=>handleLogin(email, password)}>
          {loading ? (
            <View style={styles.indicator}>
              <Text style={styles.btnTxt}>Aguarde... </Text>
              <ActivityIndicator size="large" color='#FFF999' />
            </View> 
          ) : (
            <Text style={styles.btnTxt}> ACESSAR </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={()=>navigation.navigate('SignUp1')}>
          <Text style={styles.linkTxt}>Ainda não possui Conta? Junte-se a Nós!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={()=>navigation.navigate('Reset')}>
          <Text style={styles.linkTxt}>Esqueceu sua senha? Clique aqui.</Text>
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
