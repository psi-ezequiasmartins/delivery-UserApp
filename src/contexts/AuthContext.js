/**
 * src/contexts/AuthContext.js
 */

import { useState, useEffect, createContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, child, update } from "firebase/database";
import { auth, firebase_app } from '../config/apiFirebase';
import { Alert } from 'react-native';

import api from '../config/apiAxios';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

function AuthProvider({ children }) { 
  const db = getDatabase(firebase_app);
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ user, setUser ] = useState(null);

  useEffect(()=>{
    setLoading(true);
    async function tokenAutorization() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setAuthenticated(true);
      }
      setLoading(false); 
    }
    tokenAutorization();
  }, []);

  function signIn(email, password) {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password).then(async(result) => {
      const id = result.user.uid;
      onValue(ref(db, `users/${id}`), async(snapshot) => {
        const data = snapshot.val();
        setUser(data);       

        // recupera o token e os dados do usuário do dispositivo
        const currentTime = new Date().toISOString();
        AsyncStorage.multiSet([
          ["vID", String(data?.UserID)],
          ["vNome", data?.Nome],
          ["vSobrenome", data?.Sobrenome],
          ["vTelefone", data?.Telefone],
          ["vEmail", data?.Email],
          ["vToken", data?.TokenMSG],
          ["vTokenDT", currentTime]
        ]);
        const userId = await AsyncStorage.getItem("vID");

        // processa a autenticação do usuário e armazena o token JWT
        try {
          const response = await api.post('/authenticate', { USER_ID: userId, CHV: 1 });
          const token = response.data?.token; 
          if (token) {
            AsyncStorage.setItem('token', JSON.stringify(token)); 
            api.defaults.headers.Authorization = `Bearer ${token}`;
            setAuthenticated(true);
            setLoading(false)              
          } else {
            throw new Error('Token não encontrado na resposta');
          }
        } catch (error) {
          console.log('Erro ao antenticar: ', error);
          Alert.alert('Erro ao autenticar. Verifique sua conexão e tente novamente.');
          setAuthenticated(false);
          setLoading(false);
        };
      });
    }).catch((error) => {
      console.log('Erro no login com Firebase: ', error);
      setAuthenticated(false);
      setLoading(false)
      Alert.alert('Email e/ou Senha inválidos!');
    });   
  }

  async function signUp(
    nome, sobrenome, 
    CEP, endereco, numero, complemento, bairro, cidade, UF, 
    telefone, email, password, confirm_password) {
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

          api.defaults.headers['Authorization'] = `Bearer ${token}`;

          setUser(result.data);
          setAuthenticated(true);
          setLoading(false);
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
    api.defaults.headers['Authorization'] = undefined;
    AsyncStorage.multiRemove(["token", "vID", "vNome", "vSobrenome", "vTelefone", "vEmail", "vTokenSMS"]);
    console.clear();
    setUser(null);
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

export { AuthContext, AuthProvider }
