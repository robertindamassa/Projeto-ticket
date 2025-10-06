import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TicketScreen({ navigation }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadCurrentStudent = async () => {
      try {
        const raw = await AsyncStorage.getItem('@currentStudent');
        if (raw) setStudent(JSON.parse(raw));
      } catch (e) {
        console.log('Erro ao ler currentStudent:', e);
      }
    };
    loadCurrentStudent();
  }, []);

  const isWithinTurn = (turno) => {
    const hour = new Date().getHours();
    if (!turno) return false;
    const t = turno.toLowerCase();
    if (t === 'manhã' || t === 'manha') return hour >= 6 && hour < 12;
    if (t === 'tarde') return hour >= 12 && hour < 18;
    if (t === 'noite') return hour >= 18 && hour <= 23;
    return false;
  };

  const handleReceiveTicket = () => {
    if (!student) {
      Alert.alert('Sem aluno', 'Nenhum aluno selecionado para receber ticket.');
      return;
    }

    if (isWithinTurn(student.turno)) {
      // Aqui você pode adicionar lógica extra de registro do recebimento se necessário.
      Alert.alert('Ticket liberado', `Aluno ${student.name} pode receber o ticket.`);
    } else {
      Alert.alert('Fora do horário', 'Não é possível receber o ticket fora do turno da turma.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Ticket</Text>
      {student ? (
        <>
          <Text>Aluno: {student.name}</Text>
          <Text>Turma: {student.turma} - Turno: {student.turno}</Text>
          <View style={styles.button}>
            <Button title="Receber Ticket" onPress={handleReceiveTicket} />
          </View>
        </>
      ) : (
        <Text>Nenhum aluno carregado.</Text>
      )}
      <View style={styles.button}>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  button: { marginTop: 10 }
});
