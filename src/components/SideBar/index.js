/**
 * src/components/SideBar/index.js
 */

import { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { FontAwesome5, MaterialCommunityIcons, Fontisto, AntDesign, Entypo } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

import logotipo from '../../../assets/logo.png';

export default function SideBar(props) {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  function GoToLink(link) {
    return (
      navigation.navigate(link)
    )
  }

  return (
    <DrawerContentScrollView {...props}>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 15 }}>
        <Image source={logotipo} style={{ width: 120, height: 120 }} resizeMode="contain" />
        <Text style={{ color: '#5D5D5D', fontSize: 18, marginTop: 25 }}>Bem vindo!</Text>
        <Text style={{ color: '#000000', fontSize: 17, fontWeight: 'bold' }}>{user?.Nome} {user?.Sobrenome}</Text>
        <Text style={{ color: '#000000', fontSize: 17 }}>UserID {user?.UserID}</Text>
      </View>

      <DrawerItem
        label="CATEGORIAS"
        onPress={() => GoToLink("HomeStack")}
        activeTintColor='#000'
        activeBackgroundColor='#FFCC00'
        inactiveTintColor='#000'
        inactiveBackgroundColor='#FFCC'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <Entypo name='shop' size={size} color={(focused !== true) ? '#000' : '#FFCC'} />
        )}
      />

      <DrawerItem
        label="MEUS PEDIDOS"
        onPress={() => GoToLink("OrdersStack")}
        activeTintColor='#000'
        activeBackgroundColor='#FFCC00'
        inactiveTintColor='#000'
        inactiveBackgroundColor='#FFCC'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <Fontisto name='shopping-bag-1' size={size} color={(focused !== true) ? '#000' : '#FFCC'} />
        )}
      />

      <DrawerItem
        label="MEUS DADOS"
        onPress={() => GoToLink("Profile")}
        activeTintColor='#000'
        activeBackgroundColor='#FFCC00'
        inactiveTintColor='#000'
        inactiveBackgroundColor='#FFCC'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <FontAwesome5 name='user-cog' size={size} color={(focused !== true) ? '#000' : '#FFCC'} />
        )}
      />

      <DrawerItem
        label="SAIR (FECHAR)"
        onPress={signOut}
        activeTintColor='#000'
        activeBackgroundColor='#FFCC00'
        inactiveTintColor='#000'
        inactiveBackgroundColor='#FFCC'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <FontAwesome5 name="door-open" size={size} color={(focused !== true) ? '#000' : '#FFCC'} />
        )}
      />

      <DrawerItem
        label="FECHAR ESTE MENU"
        onPress={() => props.navigation.closeDrawer()}
        activeTintColor='#7F7B7B'
        icon={({ focused, size }) => (
          <MaterialCommunityIcons name="close-box-multiple-outline" size={size} color={(focused !== true) ? '#7F7B7B' : '#000'} />
        )}
      />

      <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
        <Text style={{ color: '#000', fontSize: 18 }}><AntDesign name="copyright" color='#000' size={12} /> 2025 PSI-SOFTWARE</Text>
        <Text style={{ color: '#000', fontSize: 14 }}>Direitos Reservados</Text>
      </View>

    </DrawerContentScrollView>
  );
}

/**
 * tabela de cores:
 *rgb(39, 34, 22)
 *
 * #55A9D6 #7F7B7B #5D5D5D #FF0000
 * 
 * #0033CC #FFF000 #131313 #4DCE4D
 * 
 */
