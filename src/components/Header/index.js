/**
 * src/components/Header/index.js
 */

import { useEffect, useContext, useRef } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../../contexts/CartContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import * as Notifications from 'expo-notifications';

import icon from '../../../assets/icon.png';
import logomarca from '../../../assets/logomarca.png';
import sacola from '../../../assets/pedidos.png';

export default function Header(props) {
  const navigation = useNavigation();
  const { basket } = useContext(CartContext);
  const { pushToken }  = useContext(NotificationContext);  
  const { setNotify } = useContext(NotificationContext); 
  
  const notificationListener = useRef();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      setNotify(true);
      GoToLink('OrdersTab');
    })
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
    };
  }, [setNotify]);
                                                                                                                                                                                 
  function GoToLink(link) {
    return (
      navigation.navigate(link)
    )
  }

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={()=> {
            alert('psi-Delivery UserApp v1.0' + '\n' + '(31) 98410-7540 '+ '\n' + `pushToken: ${pushToken}`); 
            GoToLink("Home");
          }}
        >
          <Image source={icon} style={{ width: 85, height: 85 }} resizeMode="contain" />
        </TouchableOpacity>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={logomarca} style={{ width: 195, height: 85 }} resizeMode="contain" />
        </View>
        <TouchableOpacity onPress={()=>GoToLink('Cesta')}>
          <Image source={sacola} style={{ width: 85, height: 85 }} resizeMode="contain" />
          { basket.length >= 1 &&
            <View style={styles.dot}>
              <Text style={styles.dotText}>{ basket?.length }</Text>
            </View>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:{
    height: 100,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: '#CCC',
    borderBottomWidth: 0.5,
    marginBottom: 5,
  },
  dot:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: 30,
    height: 30, 
    borderRadius: 15,
    position: 'absolute',
    zIndex: 99,
    bottom: -4,
    left: -6
  },
  dotText:{
    fontSize: 14,
    color: '#FFF'
  }
})
