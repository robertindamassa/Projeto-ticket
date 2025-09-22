import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IntervalScreen() {
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [nextInterval, setNextInterval] = useState('');

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
    setLoading(true);
    // Simula coleta de informações por 1.2s
    const infoTimeout = setTimeout(() => {
      setLoading(false);
    }, 1200);
    const timer = setInterval(() => {
      const agora = getBrasiliaDate();
      const diaSemana = agora.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
      let intervaloComeco = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 16, 0, 0, 0);
      let intervaloFim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 16, 20, 0, 0);
      let proximoIntervalo = '';
      if (diaSemana >= 1 && diaSemana <= 4) { // Segunda a quinta
        if (agora < intervaloComeco) {
          const diff = Math.floor((intervaloComeco - agora) / 1000);
          setIsBreak(false);
          setTimeLeft(`Faltam ${formatTime(diff)} para o próximo intervalo`);
          proximoIntervalo = intervaloComeco;
        } else if (agora >= intervaloComeco && agora <= intervaloFim) {
          setIsBreak(true);
          const diff = Math.floor((intervaloFim - agora) / 1000);
          setTimeLeft(`Intervalo acaba em ${formatTime(diff)}`);
          proximoIntervalo = new Date(intervaloComeco.getTime() + 24 * 60 * 60 * 1000); // próximo dia
        } else {
          // Já passou o intervalo hoje, mostra tempo para amanhã
          let nextDay = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 16, 0, 0, 0);
          // Se sexta, pula para segunda
          if (diaSemana === 4) {
            nextDay = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 4, 16, 0, 0, 0);
          }
          const diff = Math.floor((nextDay - agora) / 1000);
          setIsBreak(false);
          setTimeLeft(`Faltam ${formatTime(diff)} para o próximo intervalo`);
          proximoIntervalo = nextDay;
        }
      } else {
        // Fim de semana, mostra tempo para segunda
        let nextMonday = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + ((8 - diaSemana) % 7), 16, 0, 0, 0);
        const diff = Math.floor((nextMonday - agora) / 1000);
        setIsBreak(false);
        setTimeLeft(`Faltam ${formatTime(diff)} para o próximo intervalo`);
        proximoIntervalo = nextMonday;
      }
      setNextInterval(proximoIntervalo);
    }, 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(infoTimeout);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' }}
            style={{ width: 80, height: 80, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, color: '#1976d2', fontWeight: 'bold', marginTop: 10 }}>Carregando informações...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="free-breakfast" size={54} color="#1976d2" style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Intervalo Escolar</Text>
        <Text style={isBreak ? styles.statusActive : styles.statusInactive}>
          {isBreak ? 'Estamos no intervalo!' : 'Fora do intervalo'}
        </Text>
        <Text style={styles.timer}>{timeLeft}</Text>
        <Text style={{ fontSize: 16, color: '#1976d2', marginTop: 10 }}>
          Próximo intervalo: {nextInterval ? new Date(nextInterval).toLocaleString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
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
