import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Locationscreen from './src/screens/Locationscreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Location">
        <Stack.Screen name="Location" component={Locationscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

