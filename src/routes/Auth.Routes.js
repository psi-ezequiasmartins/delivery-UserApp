/**
 * src/routes/Auth.Routes.js
 */

import React from 'react';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import SignIn from '../pages/User/SignIn';

import SignUp1 from '../pages/User/SignUp1';
import SignUp2 from '../pages/User/SignUp2';
import SignUp3 from '../pages/User/SignUp3';

const AuthStack = createNativeStackNavigator();

export default function AuthRoutes() {

  return(
    <AuthStack.Navigator>

      <AuthStack.Screen 
        name="SignIn" 
        component={SignIn}
        options={{headerShown: false}}
      />

      <AuthStack.Screen 
        name="SignUp1" 
        component={SignUp1}
        options={{
          headerStyle:{
            backgroundColor: 'black',
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFF',
          headerBackTitleVisible: false,
          headerTitle: 'Voltar',
        }}
      />

      <AuthStack.Screen 
        name="SignUp2" 
        component={SignUp2}
        options={{
          headerStyle:{
            backgroundColor: 'black',
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFF',
          headerBackTitleVisible: false,
          headerTitle: 'Voltar',
        }}
      />

      <AuthStack.Screen 
        name="SignUp3" 
        component={SignUp3}
        options={{
          headerStyle:{
            backgroundColor: 'black',
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFF',
          headerBackTitleVisible: false,
          headerTitle: 'Voltar',
        }}
      />

    </AuthStack.Navigator>
  )
}
