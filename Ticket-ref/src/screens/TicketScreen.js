import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as Location from 'expo-location';

export default function TicketScreen() {
  const [isInRegion, setIsInRegion] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [ticketValidated, setTicketValidated] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [accuracyMeters, setAccuracyMeters] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [schoolCoords, setSchoolCoords] = useState(null);

  // Endereço fornecido (sua solicitação)
  const SCHOOL_ADDRESS = 'R. Joacir dos Passos, 18 - Jardim Eldorado, Palhoça - SC, 88133-597';
  const BASE_ALLOWED_METERS = 100; // raio desejado (100m)
  const EXTRA_MARGIN_METERS = 50;   // margem extra para compensar imprecisões

  // verifica e geocodifica a escola, depois checa localização do usuário
  useEffect(() => {
    (async () => {
      // tenta geocodificar o endereço para obter coords mais precisas
      try {
        const geocoded = await Location.geocodeAsync(SCHOOL_ADDRESS);
        if (geocoded && geocoded.length > 0) {
          setSchoolCoords({ latitude: geocoded[0].latitude, longitude: geocoded[0].longitude });
        } else {
          // fallback: coords conhecidas (caso geocode falhe)
          setSchoolCoords({ latitude: -27.645375, longitude: -48.673794 });
        }
      } catch (e) {
        setSchoolCoords({ latitude: -27.645375, longitude: -48.673794 });
      }
      // checar localização imediatamente
      await checkLocation();
    })();
  }, []);

  // função reutilizável para checar localização atual do usuário
  async function checkLocation() {
    setLocationError(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      const granted = (permission && (permission.status === 'granted' || permission.granted === true));
      if (!granted) {
        setLocationGranted(false);
        setLocationError('Permissão de localização negada.');
        return;
      }
      setLocationGranted(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 1000,
        timeout: 15000,
      });
      const { latitude, longitude } = location.coords;
      setUserCoords({ latitude, longitude });

      const dist = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        schoolCoords ? schoolCoords.latitude : -27.645375,
        schoolCoords ? schoolCoords.longitude : -48.673794
      );
      const accuracy = typeof location.coords.accuracy === 'number' ? location.coords.accuracy : 0;
      const allowedDistance = BASE_ALLOWED_METERS + Math.max(0, accuracy) + EXTRA_MARGIN_METERS;
      setDistanceMeters(Math.round(dist));
      setAccuracyMeters(Math.round(accuracy));
      setIsInRegion(dist <= allowedDistance);
    } catch (err) {
      setLocationGranted(false);
      setLocationError(err.message || 'Erro ao obter localização.');
    }
  }

  const handleReceiveTicket = () => {
    setTicketValidated(true);
  };

  const canPress = locationGranted && isInRegion;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recebimento de Ticket</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: canPress ? '#007bff' : '#ccc' }]}
        disabled={!canPress}
        onPress={handleReceiveTicket}
      >
        <Text style={styles.buttonText}>Receber Ticket</Text>
      </TouchableOpacity>

      {ticketValidated && <Text style={styles.validated}>Ticket validado</Text>}

      {locationError && <Text style={styles.error}>{locationError}</Text>}
      {/* Depuração: mostra distância, precisão e coords */}
      {distanceMeters !== null && (
        <>
          <Text style={styles.info}>Distância: {distanceMeters} m • Precisão GPS: {accuracyMeters ?? '?'} m</Text>
          {userCoords && (
            <Text style={styles.info}>Você: {userCoords.latitude.toFixed(6)}, {userCoords.longitude.toFixed(6)}</Text>
          )}
          {schoolCoords && (
            <Text style={styles.info}>Local: {schoolCoords.latitude.toFixed(6)}, {schoolCoords.longitude.toFixed(6)}</Text>
          )}
        </>
      )}
      <View style={{ marginTop: 8 }}>
        <Button title="Rechecar localização" onPress={checkLocation} />
      </View>

      {!locationGranted && <Text style={styles.info}>Permita o acesso à localização para continuar.</Text>}
      {locationGranted && !isInRegion && <Text style={styles.info}>Você não está na área da escola.</Text>}
    </View>
  );
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371; // radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  return distanceKm * 1000; // meters
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  validated: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
  },
  info: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    color: '#b00020',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});