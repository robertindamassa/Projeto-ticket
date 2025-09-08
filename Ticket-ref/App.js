import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import AlunoScreen from './src/screens/AlunoScreen';

enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Painel Admin' }} />
          <Stack.Screen name="Aluno" component={AlunoScreen} options={{ title: 'Área do Aluno' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
