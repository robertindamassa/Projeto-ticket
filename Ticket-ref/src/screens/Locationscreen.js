import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const Locationscreen = () => {
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert('Permissão de localização negada');
    } else {
      setPermissionDenied(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      {permissionDenied ? (
        <>
          <Text>Permissão de localização negada.</Text>
          <Button title="Tentar Novamente" onPress={requestPermission} />
        </>
      ) : (
        <Text>Permissão de localização concedida ou aguardando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Locationscreen;
