import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('aluno'); // Aluno ou Administrador
  const [error, setError] = useState('');

  const students = useSelector(state => state.students.students);

  const handleLogin = () => {
    if (role === 'administrador') {
      // login fixo do admin
      if (username === 'arthur' && password === 'silksong') {
        setError('');
        navigation.replace('Admin'); // Painel do admin
      } else {
        setError('Usuário ou senha inválidos!');
      }
    } else {
      // login do aluno
    const student = students.find(
      s => s.name.toLowerCase() === username.toLowerCase() && s.matricula === password
    );

      if (student) {
        setError('');
        navigation.replace('Aluno', { student });
      } else {
        setError('Aluno não encontrado ou matrícula incorreta!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text>Sou:</Text>
      <Picker
        selectedValue={role}
        onValueChange={itemValue => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Aluno" value="aluno" />
        <Picker.Item label="Administrador" value="administrador" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder={role === 'administrador' ? 'Usuário' : 'Nome do aluno'}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder={role === 'administrador' ? 'Senha' : 'Matrícula'}
        secureTextEntry={role === 'administrador'}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 15, borderRadius: 5 },
  picker: { height: 50, marginBottom: 15 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});
