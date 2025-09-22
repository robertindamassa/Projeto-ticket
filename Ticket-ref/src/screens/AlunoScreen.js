import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetTickets } from '../redux/studentsSlice';

export default function StudentScreen({ route, navigation }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Horário de Brasília (GMT-3)
      const now = new Date();
      const brasilia = new Date(now.getTime() - (now.getTimezoneOffset() * 60000) - (3 * 60 * 60 * 1000));
      setDateTime(brasilia);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const { student } = route.params; // recebe o objeto aluno diretamente
  const dispatch = useDispatch();

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
    // Atualiza no AsyncStorage
    AsyncStorage.getItem('@students').then(alunos => {
      if (alunos) {
        const alunosParse = JSON.parse(alunos);
        const idx = alunosParse.findIndex(a => a.id === student.id);
        if (idx !== -1) {
          alunosParse[idx].ticketUsed = true;
          AsyncStorage.setItem('@students', JSON.stringify(alunosParse));
        }
      }
    });
    Alert.alert('Sucesso', 'Ticket liberado com sucesso!');
  };

  if (!student) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>{student.name}</Text>
      <View style={styles.clockContainer}>
        <MaterialIcons name="access-time" size={32} color="#1976d2" style={{ marginRight: 10 }} />
        <View>
          <Text style={styles.clockDate}>
            {dateTime.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </Text>
          <Text style={styles.clockTime}>
            {dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Text>
        </View>
      </View>
      {/* ...outros campos... */}
    </View>
  );
}

const styles = StyleSheet.create({
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clockDate: {
    fontSize: 22,
    color: '#1976d2',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 2,
  },
  clockTime: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 2,
  },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 80 },
  logoutButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
