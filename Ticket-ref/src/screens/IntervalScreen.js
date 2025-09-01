import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IntervalScreen() {
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Defina aqui o horário do intervalo
  const intervaloComeco = new Date();
  intervaloComeco.setHours(10, 0, 0); // 10:00
  const intervaloFim = new Date();
  intervaloFim.setHours(10, 20, 0); // 10:20

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      if (agora >= intervaloComeco && agora <= intervaloFim) {
        setIsBreak(true);
        const diff = Math.floor((intervaloFim - agora) / 1000);
        setTimeLeft(`${diff} segundos restantes`);
      } else if (agora < intervaloComeco) {
        const diff = Math.floor((intervaloComeco - agora) / 1000);
        setIsBreak(false);
        setTimeLeft(`Intervalo começa em ${diff} segundos`);
      } else {
        setIsBreak(false);
        setTimeLeft('Intervalo já acabou');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela do Intervalo</Text>
      <Text>{isBreak ? 'Estamos no intervalo!' : 'Fora do intervalo'}</Text>
      <Text>{timeLeft}</Text>
      {isBreak && <Button title="Receber Ticket" onPress={() => alert("Ticket recebido!")} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
