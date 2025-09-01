import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, resetTickets } from '../redux/studentsSlice';

export default function AdminScreen() {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const students = useSelector(state => state.students.students);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (name && matricula) {
      dispatch(addStudent({ name, matricula }));
      setName('');
      setMatricula('');
    }
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
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <Button title="Adicionar Aluno" onPress={handleAdd} />
      <Button title="Resetar Tickets do Dia" onPress={() => dispatch(resetTickets())} />

      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.matricula} | Ticket: {item.hasTicket ? (item.ticketUsed ? 'Usado' : 'Disponível') : 'Nenhum'}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5 },
});
