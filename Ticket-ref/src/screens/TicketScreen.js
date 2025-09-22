import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TicketScreen() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="ticket-confirmation" size={48} color="#1976d2" style={{ marginBottom: 10 }} />
      <Text style={styles.title}>Recebimento de Ticket</Text>
      <Button title="Receber Ticket" onPress={() => Alert.alert('Ticket recebido!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
