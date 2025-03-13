/**
 * src/contexts/AuthContext.js
 */

import { useState, useEffect, createContext } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, child, update } from "firebase/database";
import { firebase_app } from '../config/apiFirebase';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import api from '../config/apiAxios';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const auth = getAuth(firebase_app);
  const db = getDatabase(firebase_app);
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ user, setUser ] = useState(null);
  const [ token_sms, setTokenSMS ] = useState("");
  const [ notify, setNotify ] = useState(false);

  useEffect(()=>{
    setLoading(true);
    async function tokenAutorization() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        setAuthenticated(true);
      }
      setLoading(false); 
    }
    tokenAutorization();
  }, []);

  function SetNotificationSMS(notification) {
    setNotify(notification);
  }

  async function checkValidateTokenSMS(pushToken) {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de notificação não concedida.');
        return false;
      }
      const notification = {
        "to": pushToken,
        "title": "DeliveryBairro.com",
        "body": "Verificação de Token: "+pushToken,
      };
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        "method": 'POST',
        "headers": {
          "Accept": 'application/json',
          'Content-Type': 'application/json',
        },
        "body": JSON.stringify(notification),
      });

      // Verifique o código de status da resposta HTTP
      if (!response.ok) {
        console.log(`Erro ao enviar requisição: ${response.status} - ${response.statusText}`);
        return false;
      }

      const result = await response.json();

      // Adicione um log para verificar o que é retornado pela API
      console.log('Resultado da resposta:', result);

      // Verifique se a estrutura de 'result' é válida
      if (result.data && result.data[0] && result.data[0].status === 'ok') {
        return true;
      } else {
        console.log('Token não válido ou erro na resposta da API');
        return false;
      }
    } catch (error) {
      console.log('Erro ao verificar a validade do token:', error);
      return false;
    }
  }

  async function registerForPushNotificationsAsync() {
    let token_sms;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Falha ao obter Token push para notificação push!');
        return;
      }
      token_sms = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('É necessário um dispositivo físico para notificações push');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        "name": 'default',
        "importance": Notifications.AndroidImportance.MAX,
        "vibrationPattern": [0, 250, 250, 250],
        "lightColor": '#4DCE4D',
      });
    }
    return token_sms;
  };

  function signIn(email, password) {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password).then(async(result) => {
      const id = result.user.uid;
      const useData = ref(db, 'users/' + id);
      onValue(useData, async(snapshot) => {
        const data = snapshot.val();
        console.log(data);
        setTokenSMS(data.TokenMsg);
        setUser(data);
        AsyncStorage.multiSet([
          ["vID", data.UserID.asString()], 
          ["vNome", data.Nome], ["vSobrenome", data.Sobrenome], 
          ["vTelefone", data.Telefone], ["vEmail", data.Email], 
          ["vTokenSMS", data.TokenMsg]
        ]);
      });

      console.log('dados recuperados e salvos em AsyncStorage e token_sms definido: ', token_sms);

      const isTokenValid = await checkValidateTokenSMS(token_sms);
      console.log(isTokenValid);

      if (!isTokenValid) {
          await registerForPushNotificationsAsync().then(async(result)=>{
          setTokenSMS(result);
          await update(child(db, `users/${id}`), {
            "TOKEN_MSG": token_sms
          });
        });         
      }  

      console.log('token_sms validado');

      try {
        const id = await AsyncStorage.getItem('vID');
        const response = await api.post('/authenticate', {USER_ID: id, CHV: 1});
        console.log({USER_ID: id, CHV: 1});
        const token = response.data?.token; // Verifica se 'data' e 'token' estão definidos
        console.log(`Tamanho do token: ${token.length}`);
        if (token) {
          await AsyncStorage.setItem('token', JSON.stringify(token));
          api.defaults.headers.Authorization `Bearer ${token}`;
          setAuthenticated(true);
          setLoading(false)
        } else {
          throw new Error('Token não encontrado na resposta');
        }
      } catch (error) {
        console.log('Erro au antenticar: ', error);
        setAuthenticated(false);
        setLoading(false);
        Alert.alert('Email e/ou Senha inválidos!');
      };
    });   
  }

  async function signUp(nome, sobrenome, CEP, endereco, numero, complemento, bairro, cidade, UF, telefone, email, password, confirm_password) {
    setLoading(true);
    registerForPushNotificationsAsync().then((token_sms) => {
      setTokenSMS(token_sms);
    })
    if (!email || !password) {
      Alert.alert('Favor preencher todos os campos!');
      setLoading(false); 
      return;
    }
    if (password !== confirm_password) {
      Alert.alert('As senhas não conferem! Digite-as novamente');
      setLoading(false); 
      return;
    }
    const json = {
      USER_ID: null, 
      NOME: nome, SOBRENOME: sobrenome,
      TELEFONE: telefone, EMAIL: email, 
      CEP: CEP, ENDERECO: endereco, NUMERO: numero, COMPLEMENTO: complemento, BAIRRO: bairro, CIDADE: cidade, UF: UF,
      URL_IMAGEM: "https://via.placeholder.com/300x400",
      TOKEN_MSG: token_sms
    };
    api.post('/add/usuario/', json).then(result => {
      createUserWithEmailAndPassword(auth, email, password).then(async(value) => {
        // Signed In
        const id = value.user.uid;
        set(ref(db, 'users/'+id), {
          UserID: result.data.USER_ID,
          Nome: result.data.NOME,
          Sobrenome: result.data.SOBRENOME,
          Email: result.data.EMAIL,
          Telefone: result.data.TELEFONE,
          CEP: result.data.CEP,
          Endereco: result.data.ENDERECO,
          Numero: result.data.NUMERO,
          Complemento: result.data.COMPLEMENTO,
          Bairro: result.data.BAIRRO,
          Cidade: result.data.CIDADE,
          UF: result.data.UF,
          TOKEN_MSG: result.data.TOKEN_MSG
        });
        const response = await api.post('/authenticate', { USER_ID: result.data.USER_ID, CHV: 1});
        const token = response.data?.token;
        if (token) {
          AsyncStorage.multiSet([
            ["token", JSON.stringify(token)],
            ["vID", data.UserID.asString()], ["vNome", data.NOME], ["vSobrenome", data.SOBRENOME], 
            ["vTelefone", data.TELEFONE], ["vEmail", data.EMAIL], 
            ["vTokenSMS", data.TOKEN_MSG]
          ]);
          api.defaults.headers.Authorization = `Bearer ${token}`;
          setLoading(false);
          setUser(result.data);
          setAuthenticated(true);
        } else {
          throw new Error('Token não encontrado na resposta');
        }
      }).catch(error => {
        setAuthenticated(false);
        setLoading(false);
        if (error.message === 'Password should be at least 6 characters') {
          Alert.alert('A senha deverá conter pelo menos 6 caracteres'); 
        } else if (error.message === 'The email address is badly formatted.') {
          Alert.alert('O formato do E-mail está incorreto') 
        } else if (error.message === 'The email address is already in use by another account.') {
          Alert.alert('E-mail já em uso por outra conta');
        } else {
          Alert.alert('Erro ao criar conta: ' + error.message);
        }
      })
    });
  }

  function changePassword(email) {
    sendPasswordResetEmail(auth, email).then(() => {
      Alert.alert("Email de Recuperação enviado com sucesso! Confira sua caixa de Entrada.");
      setAuthenticated(false);
    }).catch(error => {
      Alert.alert('Erro ao enviar email: ' + error.message);
      setAuthenticated(false);
    })
  }

  async function signOut() {
    await firebaseSignOut(auth); // auth.signOu();
    setAuthenticated(false);
    api.defaults.headers.Authorization = undefined;
    AsyncStorage.multiRemove(["token", "vID", "vNome", "vSobrenome", "vTelefone", "vEmail", "vTokenSMS"]);
    console.clear();
    setUser(null);
  }

  return(
    <AuthContext.Provider value={{ 
      signed: !!authenticated, user, setUser,
      loading, notify, token_sms, 
      signIn, signUp,  changePassword, signOut, 
      SetNotificationSMS
    }}>
      { children }
    </AuthContext.Provider> 
  )
}

export { AuthContext, AuthProvider }
