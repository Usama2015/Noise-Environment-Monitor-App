/**
 * Noise Monitor App
 *
 * Environmental sound monitoring and classification application.
 * Integrates audio processing, FFT analysis, and machine learning-based
 * noise classification to help users find quiet spaces.
 *
 * @see PROJECT_PLAN.md - Phase 1: Core Mobile App Development
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
