/**
 * src/contexts/AuthContext.js
 */

import { useState, useEffect, createContext } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, onValue, child, update } from "firebase/database";
import { firebase_app } from '../config/apiFirebase';
import { Alert } from 'react-native';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import api from '../config/apiAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

/**
 * src/contexts/AuthContext.js
 */

function AuthProvider({ children }) {
  const auth = getAuth(firebase_app);
  const db = getDatabase();
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ user, setUser ] = useState(null);
  const [ token_msg, setTokenMSG ] = useState("");
  const [ notify, setNotify ] = useState(false);
  
  const token = '';

  // useEffect(() => {
  //   setLoading(true);
  //   const token = AsyncStorage.getItem("token");
  //   if (token) {
  //     api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  //     setAuthenticated(true);
  //   }
  //   setLoading(false);
  // }, []);

  function SetNotificationSMS(notification) {
    setNotify(notification);
  }

  async function checkValidateTokenMSG(pushToken) {
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

  async function signIn(email, password) {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const id = result.user.uid;

      const useData = ref(db, 'users/' + id);
      onValue(useData, async (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        setTokenMSG(data.TOKEN_MSG);
        setUser(data);
        await AsyncStorage.setItem("vID", data.USER_ID);
        await AsyncStorage.setItem("vNome", data.NOME);
        await AsyncStorage.setItem("vSobrenome", data.SOBRENOME);
        await AsyncStorage.setItem("vTelefone", data.TELEFONE);
        await AsyncStorage.setItem("vEmail", data.EMAIL);
        await AsyncStorage.setItem("vTokenMSG", data.TOKEN_MSG);
      });

      const isTokenValid = await checkValidateTokenMSG(token_msg);
      if (!isTokenValid) {
        const result = await registerForPushNotificationsAsync();
        setTokenMSG(result);
        await update(child(db, `users/${id}`), {
          "TOKEN_MSG": token_msg
        });
      }

      const response = await api.post('/authenticate', { USER_ID: id, CHV: 1 });
      // console.log({ USER_ID: id, CHV: 1 });
      const token = response.data?.token;
      // console.log(`Tamanho do token: ${token.length}`);
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

  function signUp(
    nome, sobrenome, CEP, endereco, complemento, bairro, cidade, UF, telefone, email, 
    password, confirm_password
  ) {
    setLoading(true);
    registerForPushNotificationsAsync().then((token_msg) => {
      setTokenMSG(token_msg);
    });

    if (!email || !password) {
      Alert.alert('Favor preencher todos os campos!');
      setLoading(false); // Para garantir que o loading seja desativado
      return;
    }

    if (password !== confirm_password) {
      Alert.alert('As senhas não conferem! Digite-as novamente');
      setLoading(false); // Para garantir que o loading seja desativado
      return;
    }
  
    const json = {
      "USER_ID": null, 
      "NOME": nome, 
      "SOBRENOME": sobrenome,
      "TELEFONE": telefone, 
      "EMAIL": email, 
      "CEP": CEP,
      "ENDERECO": endereco,
      "NUMERO": numero,
      "COMPLEMENTO": complemento,
      "BAIRRO": bairro,
      "CIDADE": cidade, 
      "UF": UF,
      "URL_IMAGEM": "https://via.placeholder.com/200x200",
      "TOKEN_MSG": token_msg
    };
  
    api.post('/add/usuario/', json).then(response => {
      createUserWithEmailAndPassword(auth, email, password).then(async(value) => {
        // SIGNED IN
        const id = value.user.uid;
  
        set(ref(db, 'users/' + id), {
          UserID: id,
          Nome: json.NOME,
          Sobrenome: json.SOBRENOME,
          Email: json.EMAIL,
          Telefone: json.TELEFONE,
          CEP: json.CEP,
          Endereco: json.ENDERECO,
          Numero: json.NUMERO,
          Complemento: json.COMPLEMENTO,
          Bairro: json.BAIRRO,
          Cidade: json.CIDADE,
          UF: json.UF
        });
  
        try {
          const response = await api.post('/authenticate', { USER_ID: id, CHV: 1 });
          const token = response.data?.token;
          if (token) {
            await AsyncStorage.setItem("token", JSON.stringify(token));
            await AsyncStorage.setItem("vID", id);
            await AsyncStorage.setItem("vNome", json.NOME);
            await AsyncStorage.setItem("vSobrenome", json.SOBRENOME);
            await AsyncStorage.setItem("vTelefone", json.TELEFONE);
            await AsyncStorage.setItem("vEmail", json.EMAIL);
            await AsyncStorage.setItem("vTokenMSG", json.TOKEN_MSG);
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
          Alert.alert('Erro ao autenticar:', error.message);
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
      });
    }).catch(error => {
      setLoading(false);
      Alert.alert('Erro ao adicionar usuário:', error.message);
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
    await auth.signOut();
    setAuthenticated(false);
    api.defaults.headers.Authorization = undefined;
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("vID");
    await AsyncStorage.removeItem("vNome");
    await AsyncStorage.removeItem("vSobrenome");
    await AsyncStorage.removeItem("vTelefone");
    await AsyncStorage.removeItem("vEmail");
    await AsyncStorage.removeItem("vTokenMSG");
    console.clear();
    setUser(null);
  }

  async function registerForPushNotificationsAsync() {
    let token_msg;
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
      token_msg = (await Notifications.getExpoPushTokenAsync()).data;
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
    return token_msg;
  };

  return(
    <AuthContext.Provider value={{ signed: !!authenticated, user, setUser, loading, notify, token_msg, signIn, signUp, changePassword, signOut, SetNotificationSMS }}>
      { children }
    </AuthContext.Provider> 
  )
}

export { AuthContext, AuthProvider }
