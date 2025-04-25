/**
 * src/pages/User/SignUp3.js
 */

import React, {useState, useContext} from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';

import icon from '../../../assets/icon.png';
import { push } from 'firebase/database';

export default function SignUp3(props) {
  const navigation = useNavigation();

  const nome = props.route.params.nome;
  const sobrenome = props.route.params.sobrenome;
  const endereco = props.route.params.endereco;
  const complemento = props.route.params.complemento;
  const bairro = props.route.params.bairro;
  const cidade = props.route.params.cidade;
  const UF = props.route.params.UF;
  const CEP = props.route.params.CEP;

  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loading } = useContext(AuthContext);
  const { getPushToken } = useContext(NotificationContext);


  function checkEmptyField(field){
    if(field.trim()==='') {
      return false;
    } else {
      return true;
    }
  }

  function AddNewUser(){
    const vTelefone = checkEmptyField(telefone);
    const vEmail = checkEmptyField(email);
    const vPassword = checkEmptyField(password);

    if(!vTelefone || !vEmail || !vPassword) {
      alert('Dados obrigatórios');
    } else {
      const pushToken = getPushToken();
      console.log('pushToken: ', pushToken);
      
      signUp(
        nome.trim(),
        sobrenome.trim(),
        CEP,
        endereco.trim(),
        complemento.trim(),
        bairro.trim(),
        cidade.trim(),
        UF,
        telefone.trim(),
        email.trim(),
        password.trim(),
        pushToken
      );
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>

        <View style={styles.header}>
          <Image style={styles.logo} source={icon} resizeMode="contain" />
          <Text style={styles.subtitle}>Já estamos concluindo...</Text>
          <Text style={styles.subtitle}>Informe seu telefone e email, defina um senha com 6 dígitos numéricos.</Text>
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Telefone:</Text>
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
          <Text style={{marginBottom: 5}}>Email:</Text>
          <TextInput
            value={email}
            onChangeText={(input)=>setEmail(input)}
            placeholder='Ex.: username@email.com'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{marginBottom: 5}}>Senha:</Text>
          <TextInput
            value={password}
            onChangeText={(input)=>setPassword(input)}
            placeholder='999999'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            keyboardType='numeric'
            textContentType='password'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <Text style={{fontSize: 12, textAlign: 'center', margin: 10}} >
          (*) Ao clicar em "Registrar Usuário", você estará concordando automaticamente com a nossa Política de Uso e Privacidade. Dúvidas: acesse https://deliverybairro.com
        </Text>

        <TouchableOpacity style={styles.btnSubmit} onPress={AddNewUser}>
          {loading ? (
            <View style={styles.indicator}>
              <Text style={styles.btnTxt}>Aguarde... </Text>
              <ActivityIndicator size="large" color='#FFF333' />
            </View> 
          ) : (
            <Text style={styles.btnTxt}> REGISTRAR USUÁRIO </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSubmit} onPress={()=>navigation.navigate('SignUp2')}>
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
