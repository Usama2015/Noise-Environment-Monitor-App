/**
 * Manual Testing Component for AudioService
 *
 * This component provides a simple UI to manually test AudioService functionality
 * on a real device or emulator.
 *
 * Usage:
 * 1. Replace the content of App.tsx with this component temporarily
 * 2. Run the app: npm run android (or npm run ios)
 * 3. Test each feature by tapping buttons
 * 4. Restore original App.tsx when done
 *
 * Features tested:
 * - Permission request
 * - Start/stop recording
 * - Audio sample callbacks
 * - Real-time sample data display
 *
 * Author: Group 4 (GMU)
 * Date: 2025-10-15
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AudioService from '../services/AudioService';
import type { AudioSample } from '../types';

const AudioServiceTestApp: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const [lastSample, setLastSample] = useState<AudioSample | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial status
    setIsRecording(AudioService.getRecordingStatus());
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const handleRequestPermission = async () => {
    try {
      addLog('Requesting microphone permission...');
      const granted = await AudioService.requestPermission();
      setHasPermission(granted);

      if (granted) {
        addLog('✅ Permission granted');
        Alert.alert('Success', 'Microphone permission granted');
      } else {
        addLog('❌ Permission denied');
        Alert.alert('Error', 'Microphone permission denied');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ Error: ${errorMsg}`);
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  };

  const handleStartRecording = async () => {
    try {
      addLog('Starting recording...');

      // Register callback before starting
      const unsubscribe = AudioService.onAudioSample((sample: AudioSample) => {
        setSampleCount(prev => prev + 1);
        setLastSample(sample);
        addLog(`📊 Received sample #${sampleCount + 1} (${sample.samples.length} values)`);
      });

      await AudioService.startRecording();
      setIsRecording(true);
      addLog('✅ Recording started');
      Alert.alert('Success', 'Recording started');

      // Store unsubscribe function for later
      (window as any).__audioUnsubscribe = unsubscribe;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ Error: ${errorMsg}`);
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  };

  const handleStopRecording = async () => {
    try {
      addLog('Stopping recording...');

      // Unsubscribe from callbacks
      if ((window as any).__audioUnsubscribe) {
        (window as any).__audioUnsubscribe();
        delete (window as any).__audioUnsubscribe;
      }

      await AudioService.stopRecording();
      setIsRecording(false);
      addLog('✅ Recording stopped');
      Alert.alert('Success', `Recording stopped. Captured ${sampleCount} samples`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ Error: ${errorMsg}`);
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  };

  const handleGetConfig = () => {
    const config = AudioService.getConfig();
    addLog('📋 Audio Configuration:');
    addLog(`  Sample rate: ${config.sampleRate} Hz`);
    addLog(`  Channels: ${config.channels}`);
    addLog(`  Bits per sample: ${config.bitsPerSample}`);

    Alert.alert(
      'Audio Configuration',
      `Sample rate: ${config.sampleRate} Hz\n` +
      `Channels: ${config.channels}\n` +
      `Bits per sample: ${config.bitsPerSample}`
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
    setSampleCount(0);
    setLastSample(null);
    setError(null);
    addLog('🧹 Logs cleared');
  };

  const renderButton = (
    title: string,
    onPress: () => void,
    disabled: boolean = false,
    color: string = '#007AFF'
  ) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AudioService Test App</Text>
        <Text style={styles.subtitle}>Manual Testing Tool</Text>
      </View>

      {/* Status Section */}
      <View style={styles.statusSection}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Permission:</Text>
          <Text style={[styles.statusValue, { color: hasPermission ? '#34C759' : '#FF3B30' }]}>
            {hasPermission === null ? 'Unknown' : hasPermission ? 'Granted ✅' : 'Denied ❌'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Recording:</Text>
          <Text style={[styles.statusValue, { color: isRecording ? '#34C759' : '#8E8E93' }]}>
            {isRecording ? 'Active 🎙️' : 'Stopped'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Samples:</Text>
          <Text style={styles.statusValue}>{sampleCount}</Text>
        </View>
      </View>

      {/* Last Sample Info */}
      {lastSample && (
        <View style={styles.sampleSection}>
          <Text style={styles.sectionTitle}>Last Sample</Text>
          <Text style={styles.sampleInfo}>
            Timestamp: {lastSample.timestamp.toLocaleTimeString()}
          </Text>
          <Text style={styles.sampleInfo}>
            Sample Rate: {lastSample.sampleRate} Hz
          </Text>
          <Text style={styles.sampleInfo}>
            Samples: {lastSample.samples.length}
          </Text>
          <Text style={styles.sampleInfo}>
            First 5 values: [{lastSample.samples.slice(0, 5).map(v => v.toFixed(3)).join(', ')}]
          </Text>
          <Text style={styles.sampleInfo}>
            Min: {Math.min(...Array.from(lastSample.samples)).toFixed(3)} |
            Max: {Math.max(...Array.from(lastSample.samples)).toFixed(3)} |
            Avg: {(Array.from(lastSample.samples).reduce((a, b) => a + b, 0) / lastSample.samples.length).toFixed(3)}
          </Text>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorSection}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.buttonsSection}>
        {renderButton('Request Permission', handleRequestPermission, hasPermission === true)}
        {renderButton('Start Recording', handleStartRecording, !hasPermission || isRecording, '#34C759')}
        {renderButton('Stop Recording', handleStopRecording, !isRecording, '#FF3B30')}
        {renderButton('Get Config', handleGetConfig, false, '#5856D6')}
        {renderButton('Clear Logs', handleClearLogs, false, '#8E8E93')}
      </View>

      {/* Logs Section */}
      <View style={styles.logsSection}>
        <Text style={styles.sectionTitle}>Event Logs</Text>
        <ScrollView style={styles.logsList}>
          {logs.length === 0 ? (
            <Text style={styles.logsEmpty}>No logs yet. Start testing!</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logItem}>{log}</Text>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  statusLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  sampleSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  sampleInfo: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  errorSection: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  buttonsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logsSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logsList: {
    flex: 1,
  },
  logsEmpty: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  logItem: {
    fontSize: 12,
    color: '#3C3C43',
    fontFamily: 'Courier',
    marginBottom: 4,
    paddingVertical: 2,
  },
});

export default AudioServiceTestApp;
