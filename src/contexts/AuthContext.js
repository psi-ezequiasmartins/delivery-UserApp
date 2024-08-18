/**
 * src/contexts/AuthContext.js
 */

import { useState, useEffect, createContext } from 'react';
import { Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, onValue, child, update } from "firebase/database";
import { firebase_app } from '../config/apiFirebase';
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
  const [ tokenMsg, setTokenMSG ] = useState("");
  const [ notify, setNotify ] = useState(false);
  
  const token = '';

  useEffect(() => {
    async function checkToken() {
      // setLoading(true);
      const token = AsyncStorage.getItem("token");
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        setAuthenticated(true);
      }
      // setLoading(false);
    }
    checkToken();
  }, []);

  async function checkValidateTokenMsg(pushToken) {
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
      const result = await response.json();
      if (result.data && result.data[0].status === 'ok') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Erro ao verificar a validade do token:', error);
      return false;
    }
  }

  function SetNotificationSMS(notification) {
    setNotify(notification);
  }

  async function signIn(email, password) {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const id = result.user.uid;
      const useData = ref(db, 'users/' + id);
      onValue(useData, async (snapshot) => {
        const data = snapshot.val();
        console.log('dados recuperado do Firebase Auth: ', data);
        setTokenMSG(data.TOKEN_MSG);
        setUser(data);
        await AsyncStorage.multiSet(
          ["vID", data.UserID], 
          ["vNome", data.NOME], 
          ["vSobrenome", data.SOBRENOME], 
          ["vTelefone", data.TELEFONE], 
          ["vEmail", data.EMAIL], 
          ["vTokenMSG", data.TOKEN_MSG]
        )
      });

      const isTokenValid = await checkValidateTokenMsg();
      if (!isTokenValid) {
        const result = await registerForPushNotificationsAsync();
        setTokenMSG(result);
        await update(child(db, `users/${id}`), {
          "TOKEN_MSG": tokenMsg
        });
      }

      const response = await api.post('/authenticate', { USER_ID: id, CHV: 1 });  // console.log({ USER_ID: id, CHV: 1 });
      const token = response.data?.token; // console.log(`Tamanho do token: ${token.length}`);
      if (token) {
        await AsyncStorage.setItem('token', JSON.stringify(token));
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setAuthenticated(true);
        setLoading(false);
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    } catch (error) {
      console.log('Erro ao autenticar:', error);
      setAuthenticated(false);
      setLoading(false);
      Alert.alert('E-mail e/ou senha inválidos!');
    }
  }

  async function signUp(
    nome, sobrenome, CEP, endereco, complemento, bairro, cidade, UF, telefone, email, 
    password, confirm_password
  ) {
    setLoading(true);
    const tokenForPushNotifications = await registerForPushNotificationsAsync();
    setTokenMSG(tokenForPushNotifications);

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
  
    const userData = {
      USER_ID: null, 
      NOME: nome, 
      SOBRENOME: sobrenome,
      TELEFONE: telefone, 
      EMAIL: email, 
      CEP: CEP,
      ENDERECO: endereco,
      NUMERO: numero,
      COMPLEMENTO: complemento,
      BAIRRO: bairro,
      CIDADE: cidade, 
      UF: UF,
      URL_IMAGEM: "https://via.placeholder.com/200x200",
      TOKEN_MSG: tokenMsg
    };

    try {
      api.post('/add/usuario/', userData);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const id = result.user.uid;

      await set(ref(db, 'users/' + id), {
        UserID: id,
        Nome: userData.NOME,
        Sobrenome: userData.SOBRENOME,
        Email: userData.EMAIL,
        Telefone: userData.TELEFONE,
        CEP: userData.CEP,
        Endereco: userData.ENDERECO,
        Numero: userData.NUMERO,
        Complemento: userData.COMPLEMENTO,
        Bairro: userData.BAIRRO,
        Cidade: userData.CIDADE,
        UF: userData.UF,
        TokenMsg: userData.TOKEN_MSG 
      });

      const response = await api.post('/authenticate', { USER_ID: id, CHV: 1 });
      const token = response.data?.token;
      if (token) {
        await AsyncStorage.setItem("token", JSON.stringify(token));
        await AsyncStorage.setItem("vID", id);
        await AsyncStorage.setItem("vNome", userData.NOME);
        await AsyncStorage.setItem("vSobrenome", userData.SOBRENOME);
        await AsyncStorage.setItem("vTelefone", userData.TELEFONE);
        await AsyncStorage.setItem("vEmail", userData.EMAIL);
        await AsyncStorage.setItem("vTokenMSG", userData.TOKEN_MSG);

        api.defaults.headers.Authorization = `Bearer ${token}`;
        setLoading(false);
        setUser(response.data);
        setAuthenticated(true);
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    } catch (error) {
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
    }
  }

  async function changePassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Email de Recuperação enviado com sucesso! Confira sua caixa de Entrada.");
      setAuthenticated(false);
    } catch (error) {
      Alert.alert('Erro ao enviar email: ' + error.message);
      setAuthenticated(false);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setAuthenticated(false);
    api.defaults.headers.Authorization = undefined;
    await AsyncStorage.multiRemove(["token", "vID", "vNome", "vSobrenome", "vTelefone", "vEmail", "vTokenMSG"]);
    console.clear();
    setUser(null);
  }

  async function registerForPushNotificationsAsync() {
    let tokenMsg;
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
      tokenMsg = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('É necessário um dispositivo físico para notificações push');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        "name": 'default',
        "importance": Notifications.AndroidImportance.MAX,
        "vibrationPattern": [0, 250, 250, 250],
        "lightColor": '#FF231F7C',
      });
    }
    return tokenMsg;
  };

  return(
    <AuthContext.Provider value={{ 
      signed: !!authenticated, user,
      signIn, signUp,  signOut, changePassword,
      loading, notify, tokenMsg, 
      SetNotificationSMS
    }}>
      { children }
    </AuthContext.Provider> 
  )
}

export { AuthContext, AuthProvider }
