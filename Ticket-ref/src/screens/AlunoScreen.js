import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import IntervalScreen from './IntervalScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TicketScreen from './TicketScreen';

const Tab = createBottomTabNavigator();

function TicketTab() {
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

function HomeScreen({ student }) {
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const brasilia = new Date(now.getTime() - (now.getTimezoneOffset() * 60000) - (3 * 60 * 60 * 1000));
      setDateTime(brasilia);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <View style={styles.container}>
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
      <View style={{ backgroundColor: '#e3f2fd', borderRadius: 10, padding: 12, marginTop: 18 }}>
  <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold', marginBottom: 6 }}>
    Matrícula: <Text style={{ color: '#333' }}>{student.matricula}</Text>
  </Text>
  <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold', marginBottom: 6 }}>
    Turma: <Text style={{ color: '#333' }}>{student.turma}</Text>
  </Text>
  <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold' }}>
    Turno: <Text style={{ color: '#333' }}>{student.turno}</Text>
  </Text>
</View>
    </View>
  );
}



export default function StudentScreen({ route, navigation }) {
  const { student } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#1976d2',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#e3f2fd' },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <MaterialIcons name="home" color={color} size={size} />;
            } else if (route.name === 'Interval') {
              return <MaterialIcons name="free-breakfast" color={color} size={size} />;
            } else if (route.name === 'Ticket') {
              return <MaterialCommunityIcons name="ticket-confirmation" color={color} size={size} />;
            }
          },
        })}
      >
        <Tab.Screen name="Home" options={{ tabBarLabel: 'Início' }}>
          {() => <HomeScreen student={student} />}
        </Tab.Screen>
  <Tab.Screen name="Interval" component={IntervalScreen} options={{ tabBarLabel: 'Intervalo' }} />
        <Tab.Screen name="Ticket" component={TicketTab} options={{ tabBarLabel: 'Receber Ticket' }} />
      </Tab.Navigator>
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
    right: 20,
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 10,
    elevation: 4,
    opacity: 0.92,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
 //teste 