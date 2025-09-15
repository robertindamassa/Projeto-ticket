import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetTickets } from '../redux/studentsSlice';

export default function StudentScreen({ route, navigation }) {
  const { studentId } = route.params; // id do aluno logado
  const dispatch = useDispatch();
  const [student, setStudent] = useState(null);

  const students = useSelector(state => state.students.students);

  useEffect(() => {
    const currentStudent = students.find(s => s.id === studentId);
    if (currentStudent) {
      setStudent(currentStudent);
    }
  }, [students, studentId]);

  const liberarTicket = () => {
    if (!student) return;

    const horaAtual = new Date().getHours();
    let permitido = false;

    if (student.turno === 'manhã' && horaAtual >= 6 && horaAtual < 12) permitido = true;
    if (student.turno === 'tarde' && horaAtual >= 12 && horaAtual < 18) permitido = true;
    if (student.turno === 'noite' && horaAtual >= 18 && horaAtual <= 23) permitido = true;

    if (!permitido) {
      Alert.alert('Fora do horário', 'Não é possível liberar o ticket fora do turno da sua turma.');
      return;
    }

    if (student.ticketUsed) {
      Alert.alert('Atenção', 'Você já utilizou seu ticket hoje.');
      return;
    }

    // Marca ticket como usado
    student.ticketUsed = true;
    AsyncStorage.setItem('@students', JSON.stringify(students));
    Alert.alert('Sucesso', 'Ticket liberado com sucesso!');
  };

  if (!student) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {student.name}</Text>
      <Text>Matrícula: {student.matricula}</Text>
      <Text>Turma: {student.turma}</Text>
      <Text>Turno: {student.turno}</Text>

      <Button title="Liberar Ticket" onPress={liberarTicket} />

      <Button title="Sair" color="red" onPress={() => navigation.replace('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
