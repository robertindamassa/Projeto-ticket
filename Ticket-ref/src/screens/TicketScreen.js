import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function TicketScreen({ student }) {
  const [isInRegion, setIsInRegion] = useState(false);
  const [ticketStatus, setTicketStatus] = useState('Não disponível');
  const [canReceive, setCanReceive] = useState(false);
  const [receivedToday, setReceivedToday] = useState(false);

  useEffect(() => {
    const intervaloComeco = new Date();
    intervaloComeco.setHours(10, 0, 0);
    const agora = new Date();
    const diffMin = (intervaloComeco - agora) / 60000;
    setCanReceive(diffMin <= 5 && diffMin > 0);
  }, []);

  const handleReceiveTicket = () => {
    if (receivedToday) return;
    setTicketStatus('Ticket disponível');
    setReceivedToday(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recebimento de Ticket</Text>
      <TouchableOpacity
        style={{ backgroundColor: isInRegion ? '#1976d2' : '#aaa', padding: 10, borderRadius: 8, marginBottom: 10 }}
        onPress={() => setIsInRegion(!isInRegion)}
      >
        <Ionicons name="location" size={20} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isInRegion ? 'Dentro da escola' : 'Fora da escola'}</Text>
      </TouchableOpacity>
      {canReceive && isInRegion && !receivedToday ? (
        <TouchableOpacity style={{ backgroundColor: '#43a047', padding: 12, borderRadius: 8 }} onPress={handleReceiveTicket}>
          <MaterialCommunityIcons name="ticket-confirmation" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Receber Ticket</Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ color: '#888', marginBottom: 10 }}>Ticket não disponível</Text>
      )}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Status: {ticketStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 80 },
});

