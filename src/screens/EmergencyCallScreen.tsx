// src/screens/EmergencyCallScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EmergencyCallScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { codeType, eta, ambulanceId, location } = route.params as any;
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    // Simulate arrival after ETA
    const etaMinutes = parseInt(eta.split(' ')[0]);
    const arrivalTimer = setTimeout(() => {
      Vibration.vibrate([1000, 1000, 1000]);
      Alert.alert(
        'Emergency Services Arrived',
        'The ambulance has arrived at your location.',
        [{ text: 'OK' }]
      );
    }, etaMinutes * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(arrivalTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: codeType === 'CODE BLUE' ? '#2196F3' : '#F44336' }]}>
        <Text style={styles.codeType}>{codeType}</Text>
        <Text style={styles.status}>🚨 ACTIVE EMERGENCY</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Response Time</Text>
          <Text style={styles.timerValue}>{formatTime(timeElapsed)}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>🚑 Ambulance Assigned</Text>
          <Text style={styles.infoValue}>{ambulanceId}</Text>
          
          <Text style={[styles.infoLabel, { marginTop: 16 }]}>⏱️ Estimated Arrival</Text>
          <Text style={styles.infoValue}>{eta}</Text>
          
          <Text style={[styles.infoLabel, { marginTop: 16 }]}>📍 Location Shared</Text>
          <Text style={styles.infoValue}>
            {location ? 'Live location active' : 'Manual location entered'}
          </Text>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📋 While You Wait</Text>
          <Text style={styles.instructionsText}>
            • Stay calm and stay where you are{'\n'}
            • Keep the patient comfortable{'\n'}
            • Unlock the main door if possible{'\n'}
            • Do not move the patient unless necessary{'\n'}
            • Have medical information ready
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => Linking.openURL('tel:911')}
          >
            <Text style={styles.actionButtonText}>📞 Call 911</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              Alert.alert(
                'Cancel Emergency?',
                'Are you sure you want to cancel? Only cancel if help is no longer needed.',
                [
                  { text: 'No, Keep Active', style: 'cancel' },
                  { 
                    text: 'Yes, Cancel', 
                    style: 'destructive',
                    onPress: () => navigation.navigate('Home')
                  },
                ]
              );
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  codeType: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  status: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  timerCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  timerLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
  },
});