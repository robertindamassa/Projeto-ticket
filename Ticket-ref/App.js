import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { setStudents } from './src/redux/studentsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import AlunoScreen from './src/screens/AlunoScreen';

enableScreens();

const Stack = createNativeStackNavigator();

const Loader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadStudents = async () => {
      const data = await AsyncStorage.getItem('@students');
      if (data) {
        dispatch(setStudents(JSON.parse(data)));
      }
    };
    loadStudents();
  }, [dispatch]);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Painel Admin' }} />
      <Stack.Screen name="Aluno" component={AlunoScreen} options={{ title: 'Área do Aluno' }} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Loader />
      </NavigationContainer>
    </Provider>
  );
}
