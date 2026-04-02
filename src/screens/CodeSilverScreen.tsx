// src/screens/CodeSilverScreen.tsx - Security Threat
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function CodeSilverScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [threatType, setThreatType] = useState<string | null>(null);
  const [weapon, setWeapon] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);

  const threatOptions = [
    { label: '⚠️ Violent person', value: 'violent_person' },
    { label: '🔫 Weapon involved', value: 'weapon' },
    { label: '🚗 Active shooter', value: 'active_shooter' },
    { label: '🏠 Home invasion', value: 'home_invasion' },
    { label: '👊 Physical assault', value: 'assault' },
  ];

  const weaponOptions = [
    { label: 'Firearm', value: 'firearm' },
    { label: 'Knife/blade', value: 'blade' },
    { label: 'Blunt object', value: 'blunt' },
    { label: 'Unknown', value: 'unknown' },
    { label: 'No weapon', value: 'none' },
  ];

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }
  };

  const dispatchPolice = async () => {
    Vibration.vibrate([500, 500, 500]);
    
    // Simulate dispatch
    setTimeout(() => {
      navigation.navigate('EmergencyCall', {
        codeType: 'CODE SILVER',
        eta: '5 minutes',
        ambulanceId: null,
        location: location,
      });
    }, 1500);
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <Text style={styles.questionTitle}>What type of threat?</Text>
          {threatOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={() => {
                setThreatType(option.value);
                if (option.value === 'weapon') {
                  setStep(1);
                } else {
                  dispatchPolice();
                }
              }}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <Text style={styles.questionTitle}>What type of weapon?</Text>
          {weaponOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={() => {
                setWeapon(option.value);
                dispatchPolice();
              }}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CODE SILVER</Text>
        <Text style={styles.headerSubtitle}>Security Threat</Text>
      </View>
      <View style={styles.content}>{renderStep()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { backgroundColor: '#9C27B0', padding: 20, paddingTop: 50, alignItems: 'center' },
  backButton: { position: 'absolute', left: 20, top: 50, zIndex: 10 },
  backButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  content: { flex: 1, padding: 20 },
  questionTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  optionButton: { backgroundColor: '#1a1a2e', padding: 18, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  optionText: { fontSize: 16, color: '#fff' },
});