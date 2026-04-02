// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens (we'll create these)
import HomeScreen from './src/screens/HomeScreen';
import CodeBlueScreen from './src/screens/CodeBlueScreen';
import CodeSilverScreen from './src/screens/CodeSilverScreen';
import CodeRedScreen from './src/screens/CodeRedScreen';
import RapidResponseScreen from './src/screens/RapidResponseScreen';
import EmergencyCallScreen from './src/screens/EmergencyCallScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator for non-emergency sections
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#1a1a2e', paddingBottom: 5 },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main app navigator
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="CodeBlue" component={CodeBlueScreen} />
          <Stack.Screen name="CodeSilver" component={CodeSilverScreen} />
          <Stack.Screen name="CodeRed" component={CodeRedScreen} />
          <Stack.Screen name="RapidResponse" component={RapidResponseScreen} />
          <Stack.Screen name="EmergencyCall" component={EmergencyCallScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}