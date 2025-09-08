import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, resetTickets } from '../redux/studentsSlice';

export default function AdminScreen({ navigation }) {
  const [name, setName] = useState('');
  const students = useSelector(state => state.students.students);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (name.trim()) {
      dispatch(addStudent({ name }));
      setName('');
    }
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do aluno"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.buttonContainer}>
        <Button title="Adicionar Aluno" onPress={handleAdd} />
        <Button title="Resetar Tickets" onPress={() => dispatch(resetTickets())} />
        <Button title="Sair" color="red" onPress={handleLogout} />
      </View>

      <Text style={styles.subtitle}>Alunos cadastrados:</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{item.name} - Matrícula: {item.matricula}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5 },
  buttonContainer: { marginVertical: 10, gap: 5 }
});
