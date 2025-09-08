import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AlunoScreen({ route, navigation }) {
  const { student } = route.params;

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {student.name}!</Text>
      <Text>Matrícula: {student.matricula}</Text>

      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
});
