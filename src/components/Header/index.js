/**
 * src/components/Header/index.js
 */

import { 
  // useState, 
  useContext, 
  // useEffect, 
  // useRef 
} from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';

// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async() => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true
//   })
// })

import icon from '../../../assets/icon.png';
import logomarca from '../../../assets/logomarca.png';
import sacola from '../../../assets/pedidos.png';

export default function Header(props) {
  const navigation = useNavigation();
  const { basket } = useContext(CartContext);
  // const { token_sms, SetNotificationSMS } = useContext(AuthContext);
  // const [ notification, setNotification ] = useState(null);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   notificationListener.current = Notifications.addNotificationReceivedListener((new_notification) => {
  //     setNotification(new_notification);
  //     SetNotificationSMS(new_notification);
  //   });
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
  //     console.log(response.notification.request.content.body)
  //   });
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //     GoToLink("Pedidos");
  //   };
  // }, [notification]);

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
            alert('psi-Delivery UserApp v1.0' + '\n' + '(31) 98410-7540 '); // + '\n' + token_sms
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
