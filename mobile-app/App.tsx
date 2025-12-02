/**
 * Noise Monitor App
 *
 * Environmental sound monitoring and classification application.
 * Integrates audio processing, FFT analysis, and machine learning-based
 * noise classification to help users find quiet spaces.
 *
 * @see PROJECT_PLAN.md - Phase 1: Core Mobile App Development
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeScreen } from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import authService from './src/services/AuthService';

const Tab = createBottomTabNavigator();

function AppContent() {
  const insets = useSafeAreaInsets();
  // Sign in anonymously on app startup
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!authService.isSignedIn()) {
          const userId = await authService.signInAnonymously();
          console.log('[App] Signed in anonymously:', userId);
        } else {
          console.log('[App] Already signed in:', authService.getUserId());
        }
      } catch (error) {
        console.error('[App] Failed to sign in anonymously:', error);
      }
    };

    initAuth();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: '#666',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              paddingBottom: insets.bottom + 5,
              paddingTop: 5,
              height: 60 + insets.bottom,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen
            name="Monitor"
            component={HomeScreen}
            options={{
              title: 'Monitor',
              tabBarIcon: ({ color, size }) => (
                <Icon name="mic" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              title: 'Campus Map',
              tabBarIcon: ({ color, size }) => (
                <Icon name="map" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

export default App;
