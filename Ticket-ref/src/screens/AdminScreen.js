import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addStudent, updateStudent, removeStudent, resetTickets, clearStudents, setStudents } from '../redux/studentsSlice';

export default function AdminScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [turma, setTurma] = useState('');
  const [turno, setTurno] = useState('');
  const [editingId, setEditingId] = useState(null);

  const students = useSelector(state => state.students.students);
  const dispatch = useDispatch();

  // Carrega alunos do AsyncStorage ao abrir a tela
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const savedStudents = await AsyncStorage.getItem('@students');
        if (savedStudents) {
          dispatch(setStudents(JSON.parse(savedStudents)));
        }
      } catch (error) {
        console.log('Erro ao carregar alunos:', error);
      }
    };
    loadStudents();
  }, [dispatch]);

  const handleAddOrUpdate = async () => {
    // Validações básicas
    if (!name.trim() || !email.trim() || !turma.trim() || !turno.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos para cadastrar.");
      return;
    }

    // Nome: apenas letras (maiúsculas/minúsculas) e espaços
    const nomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(name.trim());
    if (!nomeValido) {
      Alert.alert("Nome inválido", "O nome só pode conter letras e espaços.");
      return;
    }

    // Email: obrigatório terminar com @gmail.com ou @hotmail.com
    const emailValido = /@(?:gmail\.com|hotmail\.com)$/i.test(email.trim());
    if (!emailValido) {
      Alert.alert("E-mail inválido", "O e-mail deve terminar com @gmail.com ou @hotmail.com.");
      return;
    }

    // Turma: exatamente 3 dígitos (ex: 222)
    const turmaValida = /^\d{3}$/.test(turma.trim());
    if (!turmaValida) {
      Alert.alert("Turma inválida", "A turma deve conter exatamente 3 dígitos (ex: 222).");
      return;
    }

    // Turno: somente manhã, tarde ou noite (aceita com ou sem acento e case-insensitive)
    const turnoNormalized = turno.trim().toLowerCase();
    const validTurnos = ['manhã', 'manha', 'tarde', 'noite'];
    if (!validTurnos.includes(turnoNormalized)) {
      Alert.alert("Turno inválido", "O turno deve ser 'manhã', 'tarde' ou 'noite'.");
      return;
    }

    // Se estiver editando, atualiza; caso contrário adiciona
    if (editingId) {
      dispatch(updateStudent({ id: editingId, name, email, turma, turno }));
    } else {
      dispatch(addStudent({ name, email, turma, turno }));
    }

    // Determina o id correto para salvar como currentStudent
    // Para novo aluno, o reducer gera o id baseado em students.length + 1
    const novoIdGerado = editingId ? editingId : (students.length + 1).toString();

    const currentStudent = {
      id: editingId || novoIdGerado,
      name,
      email,
      turma,
      turno,
    };

    try {
      await AsyncStorage.setItem('@currentStudent', JSON.stringify(currentStudent));
    } catch (error) {
      console.log('Erro ao salvar currentStudent no AsyncStorage:', error);
    }

    // Resetar campos e estado de edição
    setName('');
    setEmail('');
    setTurma('');
    setTurno('');
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setTurma(student.turma);
    setTurno(student.turno);
    setEditingId(student.id);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Atenção",
      "Deseja realmente excluir este aluno?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => dispatch(removeStudent(id)) }
      ]
    );
  };

  const handleClearStudents = () => {
    Alert.alert(
      "Atenção",
      "Você tem certeza que deseja excluir TODOS os alunos cadastrados?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => dispatch(clearStudents()) }
      ]
    );
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  // Função para liberar ticket dependendo do turno
  const liberarTicket = (student) => {
    const horaAtual = new Date().getHours();

    let permitido = false;
    if (student.turno === 'manhã' && horaAtual >= 6 && horaAtual < 12) permitido = true;
    if (student.turno === 'tarde' && horaAtual >= 12 && horaAtual < 18) permitido = true;
    if (student.turno === 'noite' && horaAtual >= 18 && horaAtual <= 23) permitido = true;

    if (permitido) {
      Alert.alert('Ticket liberado', `Aluno ${student.name} pode usar o ticket.`);
    } else {
      Alert.alert('Fora do horário', 'Não é possível liberar o ticket fora do turno da turma.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>

      {/* Inputs para adicionar/editar aluno */}
      <TextInput
        style={styles.input}
        placeholder="Nome do aluno"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Turma"
        value={turma}
        onChangeText={setTurma}
      />
      <TextInput
        style={styles.input}
        placeholder="Turno (manhã, tarde, noite)"
        value={turno}
        onChangeText={setTurno}
      />

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <Button title={editingId ? "Atualizar Aluno" : "Adicionar Aluno"} onPress={handleAddOrUpdate} />
        <Button title="Resetar Tickets" onPress={() => dispatch(resetTickets())} />
        <Button title="Sair" color="red" onPress={handleLogout} />
      </View>

      <Button title="Limpar todos os alunos" color="red" onPress={handleClearStudents} />

      {/* Lista de alunos */}
      <Text style={styles.subtitle}>Alunos cadastrados:</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - Matrícula: {item.matricula} - Email: {item.email} - Turma: {item.turma} - Turno: {item.turno}</Text>
            <View style={styles.itemButtons}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => liberarTicket(item)} style={styles.ticketButton}>
                <Text style={styles.buttonText}>Liberar Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  buttonContainer: { marginVertical: 10, gap: 5 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5 },
  itemButtons: { flexDirection: 'row', marginTop: 5, gap: 5 },
  editButton: { backgroundColor: '#4CAF50', padding: 5, borderRadius: 5 },
  deleteButton: { backgroundColor: '#F44336', padding: 5, borderRadius: 5 },
  ticketButton: { backgroundColor: '#2196F3', padding: 5, borderRadius: 5 },
  buttonText: { color: '#fff' },
});
