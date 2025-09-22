import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IntervalScreen() {
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Horário de Brasília: 16:02 até 16:22
  function getBrasiliaDate() {
    const now = new Date();
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60000) - (3 * 60 * 60 * 1000));
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = getBrasiliaDate();
      const diaSemana = agora.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
      if (diaSemana >= 1 && diaSemana <= 4) { // Segunda a quinta
        const intervaloComeco = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 16, 0, 0, 0);
        const intervaloFim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 16, 20, 0, 0);
        if (agora >= intervaloComeco && agora <= intervaloFim) {
          setIsBreak(true);
          const diff = Math.floor((intervaloFim - agora) / 1000);
          setTimeLeft(`Intervalo acaba em ${formatTime(diff)}`);
        } else if (agora < intervaloComeco) {
          const diff = Math.floor((intervaloComeco - agora) / 1000);
          setIsBreak(false);
          setTimeLeft(`Intervalo começa em ${formatTime(diff)}`);
        } else {
          setIsBreak(false);
          setTimeLeft('Intervalo já acabou hoje');
        }
      } else {
        setIsBreak(false);
        setTimeLeft('Hoje não tem intervalo (apenas de segunda a quinta às 16:00)');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
    
        <MaterialIcons name="free-breakfast" size={48} color="#1976d2" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Intervalo</Text>
        <Text style={isBreak ? styles.statusActive : styles.statusInactive}>
          {isBreak ? 'Estamos no intervalo!' : 'Fora do intervalo'}
        </Text>
        <Text style={styles.timer}>{timeLeft}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 280,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
    letterSpacing: 1,
  },
  statusActive: {
    color: '#43a047',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  statusInactive: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  timer: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 2,
    letterSpacing: 2,
  },
});
