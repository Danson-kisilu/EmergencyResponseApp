// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  CodeBlue: undefined;
  CodeSilver: undefined;
  CodeRed: undefined;
  RapidResponse: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Emergency code buttons configuration
const emergencyCodes = [
  {
    id: 'blue',
    name: 'CODE BLUE',
    subtitle: 'Medical Emergency',
    description: 'Cardiac arrest • Unconscious • Difficulty breathing',
    color: '#2196F3',
    textColor: '#fff',
    screen: 'CodeBlue',
    icon: '🫀',
  },
  {
    id: 'silver',
    name: 'CODE SILVER',
    subtitle: 'Security Threat',
    description: 'Violent person • Active threat • Weapon',
    color: '#9C27B0',
    textColor: '#fff',
    screen: 'CodeSilver',
    icon: '⚠️',
  },
  {
    id: 'red',
    name: 'CODE RED',
    subtitle: 'Fire Emergency',
    description: 'Fire • Smoke • Gas leak',
    color: '#F44336',
    textColor: '#fff',
    screen: 'CodeRed',
    icon: '🔥',
  },
  {
    id: 'rapid',
    name: 'RAPID RESPONSE',
    subtitle: 'Live Medical Help',
    description: 'Talk to a medical professional • First aid guidance',
    color: '#4CAF50',
    textColor: '#fff',
    screen: 'RapidResponse',
    icon: '💊',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (screen: string, codeName: string) => {
    // Haptic feedback for emergency press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Navigate to the appropriate screen
    navigation.navigate(screen as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Response</Text>
        <Text style={styles.headerSubtitle}>
          Tap any code to start emergency response
        </Text>
      </View>

      <View style={styles.codesContainer}>
        {emergencyCodes.map((code) => (
          <TouchableOpacity
            key={code.id}
            style={[styles.codeCard, { backgroundColor: code.color }]}
            onPress={() => handlePress(code.screen, code.name)}
            activeOpacity={0.9}
          >
            <Text style={styles.codeIcon}>{code.icon}</Text>
            <Text style={styles.codeName}>{code.name}</Text>
            <Text style={styles.codeSubtitle}>{code.subtitle}</Text>
            <Text style={styles.codeDescription}>{code.description}</Text>
            <View style={styles.tapIndicator}>
              <Text style={styles.tapText}>TAP FOR EMERGENCY</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>⚠️ Important</Text>
        <Text style={styles.infoText}>
          Only use emergency codes for genuine emergencies. False alarms will be
          tracked and may result in account suspension.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  codesContainer: {
    padding: 16,
    gap: 16,
  },
  codeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  codeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  codeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  codeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  codeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  tapIndicator: {
    marginTop: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tapText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#1a1a2e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  infoTitle: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});