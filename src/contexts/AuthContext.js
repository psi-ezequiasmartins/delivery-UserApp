/**
 * src/contexts/AuthContext.js
 */

import { EXPO_PROJECT_ID } from '@env';
import React, { createContext, useState, useEffect  } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { auth, firebase_app } from '../config/apiFirebase';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import api, { isDevelopment } from '../config/apiAxios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { is } from 'date-fns/locale';

export const AuthContext = createContext();

export function AuthProvider({ children }) { 
  const db = getDatabase(firebase_app);
  
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ user, setUser ] = useState(null);

  useEffect(()=>{
    setLoading(true);
    async function checkTokenValidity() {
      try {
        const token = await AsyncStorage.getItem('token');
        const expiresAt = await AsyncStorage.getItem('expiresAt');
  
        if (token && expiresAt) {
          const now = Date.now();
          if (now >= Number(expiresAt)) {
            if (isDevelopment) {
              console.log('Token expirado. Usuário será desconectado.');  
            }
            // Desconecta o usuário
            await AsyncStorage.multiRemove(['token', 'expiresAt']);
            setAuthenticated(false);
            setUser(null);
            Alert.alert('Sessão expirada. Faça login novamente.');
          } else {
            api.defaults.headers.Authorization = `Bearer ${token}`;
            setAuthenticated(true);
          }
        } else {
          if (isDevelopment) {
            console.warn('Token não encontrado ou inválido.');
          } 
          setAuthenticated(false);
        }                
      } catch (error) {
        console.error('Erro ao verificar a validade do token:', error);
        setAuthenticated(false);
      } finally { 
        setLoading(false);
      }
    }
    checkTokenValidity();
  }, []);

  async function signIn(email, password) {
    setLoading(true);     
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const id = result.user.uid;

      onValue(ref(db, `users/${id}`), async (snapshot) => {
        const data = snapshot.val();
        if (isDevelopment) {
          console.log('Dados do usuário (recuperado do Firebase):', data);
        }

        const userId = data?.UserID;
        if (isDevelopment) {
          console.log('UserID (recuperado do Firebase):', userId);
        }
        
        if (!userId) {
          Alert.alert('Erro ao recuperar o UserID. Tente novamente.');
          setLoading(false);
          return;
        }

        try {
          // Chama a rota /api/authenticate para gerar o token
          const authResponse = await api.post('/api/authenticate', {
            "USER_ID": userId,
            "CHV": 1,
            "timezoneOffset": new Date().getTimezoneOffset(),
          });
  
          const token = authResponse.data?.token;
          const expiresAt = Date.now() + authResponse.data.expiresIn * 1000; // Converte para milissegundos
  
          if (token) {
            // Armazena o token no AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('expiresAt', expiresAt.toString());
            if (isDevelopment) {
              console.log('Token armazenado no AsyncStorage:', token);
              console.log('Token expira em:', new Date(expiresAt).toLocaleString());            
            }
            // Configura o cabeçalho Authorization
            api.defaults.headers.Authorization = `Bearer ${token}`;
          } else {
            throw new Error('Token não encontrado na resposta do backend.');
          }
  
          // Recupera os dados do usuário no backend
          const response = await api.get(`/api/usuario/${userId}`);
          const userData = response.data[0];

          if (isDevelopment) {
            console.log('Dados do usuário:', userData);
          }
  
          // Armazena os dados no AsyncStorage
          AsyncStorage.multiSet([
            ["vUserID", String(userData?.USER_ID)],
            ["vNome", userData?.NOME],
            ["vSobrenome", userData?.SOBRENOME],
            ["vTelefone", userData?.TELEFONE],
            ["vEmail", userData?.EMAIL],
            ["vPushToken", userData?.PUSH_TOKEN],
          ]);
          if (isDevelopment) {
            console.log('Dados do Usuário retornados pelo backend:', userData);
          }
          setUser(userData);
          setAuthenticated(true);
        } catch (error) {
          console.error('Erro ao autenticar ou recuperar dados do usuário:', error);
          Alert.alert('Erro ao autenticar. Verifique sua conexão e tente novamente.');
          setAuthenticated(false);
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Erro no login com Firebase:', error);
      Alert.alert('Email e/ou Senha inválidos!');
      setLoading(false);
    }
  }

  async function signUp(
    nome, sobrenome, 
    CEP, endereco, numero, complemento, bairro, cidade, UF, 
    telefone, email, password, confirm_password, pushToken
  ) {
    setLoading(true);

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

    try {
      const pushToken = await registerForPushNotifications();
      if (!pushToken) {
        Alert.alert('Erro ao obter o Push Token. Verifique as permissões de notificação.');
        setLoading(false);
        return;  
      }

      const json = {
        "USER_ID": null, 
        "NOME": nome, "SOBRENOME": sobrenome,
        "TELEFONE": telefone, EMAIL: email, 
        "CEP": CEP, "ENDERECO": endereco, "NUMERO": numero, "COMPLEMENTO": complemento, "BAIRRO": bairro, "CIDADE": cidade, "UF": UF,
        "URL_IMAGEM": "https://via.placeholder.com/300x400",
        "PUSH_TOKEN": pushToken
      };

      const result = await api.post('/api/add/usuario/', json);

      // Crie o usuário no Firebase
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const id = value.user.uid;

      // Armazene o UserID no Firebase
      await set(ref(db, 'users/' + id), {
        "UserID": result.data.USER_ID,
        "Nome": result.data.NOME,
        "Sobrenome": result.data.SOBRENOME,
        "Telefone": result.data.TELEFONE,
        "Email": result.data.EMAIL,
      });    
    
      Alert.alert('Usuário registrado com sucesso!');
      setLoading(false);

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      Alert.alert('Erro ao registrar usuário. Tente novamente.');
      setLoading(false);        
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setAuthenticated(false);
    api.defaults.headers['Authorization'] = undefined;
    AsyncStorage.multiRemove(["token", "vID", "vNome", "vSobrenome", "vTelefone", "vEmail", "vPushToken"]);
    console.clear();
    setUser(null);
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

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn('Notificações push só estão disponíveis em dispositivos físicos.');
      return null;
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      console.warn('Permissão para notificações push não concedida.');
      return null;
    }
  
    // const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    const push_token = (await Notifications.getExpoPushTokenAsync({
      "projectId": EXPO_PROJECT_ID || Constants.easConfig?.projectId || Constants.expoConfig?.extra.eas?.projectId
    })).data;

    if (!push_token) {
      console.error('Falha ao gerar o pushToken.');
      return null;
    }
  
    return push_token;
  }

  return(
    <AuthContext.Provider value={{
      signed: !!authenticated, user, setUser, 
      loading, signIn, signUp,  changePassword, signOut
    }}>
      { children }
    </AuthContext.Provider> 
  )
}

