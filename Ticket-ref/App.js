import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function TicketScreen({ navigation }) {
  const [user, setUser ] = useState(null);
  const [ticketStatus, setTicketStatus] = useState('Nenhum ticket recebido');
  const [isInRegion, setIsInRegion] = useState(false);
  const [canReceiveTicket, setCanReceiveTicket] = useState(false);
  // Definir horário do intervalo (exemplo: intervalo das 12:00 às 12:30)
  const intervaloInicio = new Date();
  intervaloInicio.setHours(12, 0, 0, 0);
  const intervaloFim = new Date();
  intervaloFim.setHours(12, 30, 0, 0);
   useEffect(() => {
    // Carregar usuário logado
    AsyncStorage.getItem('userLogged').then(data => {
      if (!data) {
        navigation.replace('Login');
        return;
      }
      const userData = JSON.parse(data);
      setUser (userData);
      checkTicketStatus(userData);
    });
      // Verifica a cada 30 segundos se o botão deve aparecer
    const interval = setInterval(() => {
      checkIntervalTime();
    }, 30000);
    checkIntervalTime();
    return () => clearInterval(interval);
  }, []);
  const checkTicketStatus = async (userData) => {
    if (userData.type !== 'aluno') {
      setTicketStatus('Administrador não pode receber ticket');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const ticketsRaw = await AsyncStorage.getItem('tickets');
    const tickets = ticketsRaw ? JSON.parse(ticketsRaw) : {};
    if (tickets[userData.matricula] && tickets[userData.matricula][today]) {
      const status = tickets[userData.matricula][today];
      if (status === 'usado') {
        setTicketStatus('Ticket usado');
      } else if (status === 'disponivel') {
        setTicketStatus('Ticket disponível');
      }
    } else {
      setTicketStatus('Nenhum ticket recebido');
    }
  };
   const checkIntervalTime = () => {
    const now = new Date();
    // Botão aparece nos 5 minutos antes do intervalo
    const cincoMinAntes = new Date(intervaloInicio.getTime() - 5 * 60000);
    if (now >= cincoMinAntes && now < intervaloInicio) {
      setCanReceiveTicket(true);
    } else {
      setCanReceiveTicket(false);
    }
  };
  const handleReceiveTicket = async () => {
    if (!isInRegion) {
      Alert.alert('Erro', 'Você precisa estar na região permitida para receber o ticket');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const ticketsRaw = await AsyncStorage.getItem('tickets');
    const tickets = ticketsRaw ? JSON.parse(ticketsRaw) : {};
    if (tickets[user.matricula] && tickets[user.matricula][today]) {
      Alert.alert('Aviso', 'Você já recebeu um ticket hoje');
      return;
    }
    // Salvar ticket como disponível
    if (!tickets[user.matricula]) tickets[user.matricula] = {};
    tickets[user.matricula][today] = 'disponivel';
    await AsyncStorage.setItem('tickets', JSON.stringify(tickets));
    setTicketStatus('Ticket disponível');
    Alert.alert('Sucesso', 'Ticket recebido com sucesso!');
  };
  const toggleRegion = () => {
    setIsInRegion(!isInRegion);
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userLogged');
    navigation.replace('Login');
  };
   if (!user) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user.type === 'aluno' ? user.matricula : 'Administrador'}</Text>
      {user.type === 'aluno' && (
        <>
          <Text>Status do Ticket: {ticketStatus}</Text>
          <TouchableOpacity onPress={toggleRegion} style={[styles.regionButton, isInRegion ? styles.regionActive : styles.regionInactive]}>
            <Text style={{ color: 'white' }}>{isInRegion ? 'Está na região permitida' : 'Não está na região permitida'}</Text>
          </TouchableOpacity>
          {canReceiveTicket && ticketStatus === 'Nenhum ticket recebido' && (
            <Button title="Receber Ticket" onPress={handleReceiveTicket} />
          )}
          {!canReceiveTicket && (
            <Text style={{ marginTop: 10, color: 'gray' }}>
              O botão "Receber Ticket" aparece 5 minutos antes do intervalo.
            </Text>
          )}
        </>
      )}
      {user.type === 'admin' && (
        <Text>Área do Administrador (implementar depois)</Text>
      )}
      <View style={{ marginTop: 30 }}>
        <Button title="Sair" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  regionButton: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  regionActive: {
    backgroundColor: 'green',
  },
  regionInactive: {
    backgroundColor: 'gray',
  },
});