// src/screens/CodeBlueScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Question = {
  id: string;
  text: string;
  options: { label: string; value: string }[];
};

const questions: Question[] = [
  {
    id: 'conscious',
    text: 'Is the patient conscious?',
    options: [
      { label: 'Yes, fully conscious', value: 'conscious' },
      { label: 'Confused/drowsy', value: 'confused' },
      { label: 'Unconscious', value: 'unconscious' },
    ],
  },
  {
    id: 'breathing',
    text: 'Are they breathing normally?',
    options: [
      { label: 'Yes, normal breathing', value: 'normal' },
      { label: 'Difficult/irregular', value: 'difficult' },
      { label: 'Not breathing', value: 'not_breathing' },
    ],
  },
  {
    id: 'patient',
    text: 'Are you the patient?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No, I am assisting', value: 'no_assisting' },
      { label: 'No, I am a bystander', value: 'no_bystander' },
    ],
  },
];

export default function CodeBlueScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [countdown, setCountdown] = useState(15);
  const [isDispatching, setIsDispatching] = useState(false);
  const [autoLocationTimer, setAutoLocationTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestLocationPermission();
    startAutoLocationTimer();
    return () => {
      if (autoLocationTimer) clearInterval(autoLocationTimer);
    };
  }, []);

  useEffect(() => {
    if (countdown > 0 && locationPermission === 'pending') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && locationPermission === 'pending') {
      // Auto-share location after timer expires
      handleLocationDecision(true);
    }
  }, [countdown, locationPermission]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }
  };

  const startAutoLocationTimer = () => {
    const timer = setTimeout(() => {
      if (locationPermission === 'pending') {
        Alert.alert(
          'Location Timeout',
          'No response received. Sharing location automatically for emergency dispatch.',
          [{ text: 'OK', onPress: () => handleLocationDecision(true) }]
        );
      }
    }, 15000);
    setAutoLocationTimer(timer);
  };

  const handleLocationDecision = async (shareLocation: boolean) => {
    if (autoLocationTimer) clearTimeout(autoLocationTimer);
    
    if (shareLocation) {
      setLocationPermission('granted');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } else {
      setLocationPermission('denied');
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // All questions answered, proceed to dispatch
      dispatchEmergency(newAnswers);
    }
  };

  const dispatchEmergency = async (finalAnswers: Record<string, string>) => {
    setIsDispatching(true);
    Vibration.vibrate([500, 500, 500]);

    // Prepare emergency data
    const emergencyData = {
      type: 'CODE_BLUE',
      timestamp: new Date().toISOString(),
      answers: finalAnswers,
      location: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      } : null,
      locationShared: locationPermission === 'granted',
    };

    // Save to local storage for history
    try {
      const history = await AsyncStorage.getItem('emergency_history');
      const historyArray = history ? JSON.parse(history) : [];
      historyArray.unshift(emergencyData);
      await AsyncStorage.setItem('emergency_history', JSON.stringify(historyArray.slice(0, 50)));
    } catch (error) {
      console.error('Failed to save history:', error);
    }

    // Simulate API call to backend
    setTimeout(() => {
      setIsDispatching(false);
      
      // Navigate to emergency call screen
      navigation.navigate('EmergencyCall', {
        codeType: 'CODE BLUE',
        eta: '8 minutes',
        ambulanceId: 'AMB-7421',
        location: emergencyData.location,
      });
    }, 2000);
  };

  const LocationPermissionScreen = () => (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>📍 Location Access Required</Text>
      <Text style={styles.permissionText}>
        For emergency services to reach you quickly, we need access to your location.
      </Text>
      <Text style={styles.countdownText}>
        Auto-sharing in {countdown} seconds...
      </Text>
      <View style={styles.permissionButtons}>
        <TouchableOpacity
          style={[styles.permissionButton, styles.shareButton]}
          onPress={() => handleLocationDecision(true)}
        >
          <Text style={styles.shareButtonText}>Share Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permissionButton, styles.manualButton]}
          onPress={() => handleLocationDecision(false)}
        >
          <Text style={styles.manualButtonText}>Enter Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const QuestionsScreen = () => (
    <View style={styles.questionsContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / questions.length) * 100}%` }]} />
      </View>
      <Text style={styles.questionText}>{questions[step].text}</Text>
      <View style={styles.optionsContainer}>
        {questions[step].options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.optionButton}
            onPress={() => handleAnswer(questions[step].id, option.value)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const DispatchingScreen = () => (
    <View style={styles.dispatchingContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.dispatchingTitle}>Dispatching Emergency Services</Text>
      <Text style={styles.dispatchingText}>
        Finding the nearest ambulance...
      </Text>
      <Text style={styles.dispatchingSubtext}>
        Please stay where you are. Help is on the way.
      </Text>
    </View>
  );

  let content;
  if (isDispatching) {
    content = DispatchingScreen();
  } else if (locationPermission === 'pending') {
    content = LocationPermissionScreen();
  } else {
    content = QuestionsScreen();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CODE BLUE</Text>
        <Text style={styles.headerSubtitle}>Medical Emergency</Text>
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24,
  },
  countdownText: {
    fontSize: 18,
    color: '#F44336',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  permissionButtons: {
    width: '100%',
    gap: 12,
  },
  permissionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  manualButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
  },
  manualButtonText: {
    color: '#ccc',
    fontSize: 16,
  },
  questionsContainer: {
    flex: 1,
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 40,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  dispatchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dispatchingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    textAlign: 'center',
  },
  dispatchingText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
  },
  dispatchingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});