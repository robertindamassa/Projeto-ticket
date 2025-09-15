import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('aluno');
  const [error, setError] = useState('');

  // estado para recuperação de matrícula
  const [email, setEmail] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const students = useSelector(state => state.students.students);
  const defaultAdminUsername = 'arthur';
  const defaultAdminPassword = 'silksong';

  const [storedAdminPassword, setStoredAdminPassword] = useState(null);

  // Carregar senha do admin do AsyncStorage
  useEffect(() => {
    const loadPassword = async () => {
      const pw = await AsyncStorage.getItem('@admin_password');
      setStoredAdminPassword(pw || defaultAdminPassword);
    };
    loadPassword();
  }, []);

  // login normal
  const handleLogin = () => {
    if (role === 'administrador') {
      if (username === defaultAdminUsername && password === storedAdminPassword) {
        setError('');
        navigation.replace('Admin');
      } else {
        setError('Usuário ou senha inválidos!');
      }
    } else {
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

  // recuperação de matrícula (para aluno)
  const handleRecuperarMatricula = async () => {
    try {
      const alunos = await AsyncStorage.getItem('@students');
      if (!alunos) return Alert.alert('Nenhum aluno cadastrado.');

      const alunosParse = JSON.parse(alunos);
      const alunoEncontrado = alunosParse.find(a => a.email === email);

      if (alunoEncontrado) {
        Alert.alert(`Sua matrícula é: ${alunoEncontrado.matricula}`);
      } else {
        Alert.alert('Aluno não encontrado com esse e-mail.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro ao recuperar matrícula.');
    }
  };

  // redefinição de senha (para admin)
  const handleForgotPassword = () => {
    if (role !== 'administrador') {
      Alert.alert('Apenas administradores podem redefinir a senha.');
      return;
    }
    setNewPassword('');
    setModalVisible(true);
  };

  const saveNewPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Digite uma nova senha válida!');
      return;
    }
    await AsyncStorage.setItem('@admin_password', newPassword);
    setStoredAdminPassword(newPassword);
    setModalVisible(false);
    Alert.alert('Senha alterada com sucesso!');
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

      {/* Botão para admin */}
      {role === 'administrador' && (
        <Button title="Esqueci a senha" color="orange" onPress={handleForgotPassword} />
      )}

      {/* Campo e botão para aluno recuperar matrícula */}
      {role === 'aluno' && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5 }}>Digite seu e-mail para recuperar a matrícula:</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail cadastrado"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title="Esqueci minha matrícula"
            color="orange"
            onPress={handleRecuperarMatricula}
          />
        </View>
      )}

      {/* Modal para nova senha do admin */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Nova senha do admin</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a nova senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Button title="Salvar senha" onPress={saveNewPassword} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 15, borderRadius: 5 },
  picker: { height: 50, marginBottom: 15 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
});
