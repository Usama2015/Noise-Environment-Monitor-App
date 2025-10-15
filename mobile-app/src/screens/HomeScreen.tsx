/**
 * HomeScreen Component
 *
 * Main screen for the Noise Monitor app. Integrates all audio processing
 * components and displays real-time noise monitoring with classification.
 *
 * Features:
 * - Real-time decibel display
 * - Noise classification with enhanced features
 * - Start/Stop monitoring button
 * - History of recent readings
 * - Error handling and loading states
 *
 * @see PROJECT_PLAN.md - Step 1.7: Basic UI Implementation
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AudioService } from '../services/AudioService';
import { calculateDecibels } from '../utils/DecibelCalculator';
import { FFTProcessor } from '../utils/FFTProcessor';
import { MovingAverageFilter } from '../utils/MovingAverageFilter';
import {
  ClassificationResult,
  NoiseClassifier,
} from '../services/NoiseClassifier';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { DecibelDisplay } from '../components/DecibelDisplay';
import type { NoiseReading } from '../components/NoiseHistory';
import { NoiseHistory } from '../components/NoiseHistory';
import type { AudioSample } from '../types';

// Sample rate configuration (matches AudioService)
const SAMPLE_RATE = 44100;

// Moving average window size
const MOVING_AVG_WINDOW = 5;

/**
 * HomeScreen component
 */
export const HomeScreen: React.FC = () => {
  // Services (initialized once)
  const [audioService] = useState(() => new AudioService());
  const [movingAverage] = useState(() => new MovingAverageFilter(MOVING_AVG_WINDOW));
  const [fftProcessor] = useState(() => new FFTProcessor(SAMPLE_RATE));
  const [classifier] = useState(() => new NoiseClassifier());

  // State
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDecibels, setCurrentDecibels] = useState(0);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [readings, setReadings] = useState<NoiseReading[]>([]);

  // Process audio samples
  const processAudioSample = useCallback(
    (sample: AudioSample) => {
      try {
        // 1. Calculate decibels
        const instantDb = calculateDecibels(sample.samples);

        // 2. Apply smoothing
        const smoothedDb = movingAverage.add(instantDb);

        // 3. Perform FFT and extract features
        const fftResult = fftProcessor.performFFT(sample.samples);
        const features = fftProcessor.extractSpectralFeatures(
          fftResult.frequencies,
          fftResult.magnitudes
        );

        // 4. Enhanced classification
        const result = classifier.classifyEnhanced(smoothedDb, features);

        // 5. Update state
        setCurrentDecibels(smoothedDb);
        setClassification(result);

        // 6. Add to history
        const newReading: NoiseReading = {
          decibels: smoothedDb,
          category: result.category,
          timestamp: new Date(),
          description: result.description,
        };

        setReadings(prev => [...prev, newReading]);
      } catch (err) {
        console.error('Error processing audio sample:', err);
        setError(err instanceof Error ? err.message : 'Processing error');
      }
    },
    [movingAverage, fftProcessor, classifier]
  );

  // Start monitoring
  const startMonitoring = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request permission
      const hasPermission = await audioService.requestPermission();
      if (!hasPermission) {
        setError('Microphone permission denied. Please enable it in settings.');
        return;
      }

      // Reset filters and history
      movingAverage.reset();
      setReadings([]);

      // Subscribe to audio samples
      audioService.onAudioSample(processAudioSample);

      // Start recording
      await audioService.startRecording();

      setIsMonitoring(true);
    } catch (err) {
      console.error('Error starting monitoring:', err);
      setError(err instanceof Error ? err.message : 'Failed to start monitoring');
      Alert.alert(
        'Error',
        'Failed to start monitoring. Please check microphone permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Stop monitoring
  const stopMonitoring = async () => {
    try {
      await audioService.stopRecording();
      setIsMonitoring(false);
    } catch (err) {
      console.error('Error stopping monitoring:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop monitoring');
    }
  };

  // Toggle monitoring
  const toggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isMonitoring) {
        audioService.stopRecording().catch(console.error);
      }
    };
  }, [audioService, isMonitoring]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Noise Monitor</Text>
          <Text style={styles.subtitle}>Environmental Sound Analysis</Text>
        </View>

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Loading state */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Starting monitoring...</Text>
          </View>
        )}

        {/* Main content */}
        {!isLoading && (
          <>
            {/* Decibel Display */}
            <DecibelDisplay
              decibels={currentDecibels}
              category={classification?.category || 'Normal'}
              label="Current Sound Level"
            />

            {/* Classification Badge */}
            {classification && (
              <ClassificationBadge
                category={classification.category}
                color={classifier.getCategoryColor(classification.category)}
                icon={classifier.getCategoryIcon(classification.category)}
                description={classification.description}
                confidence={classification.confidence}
                categoryInfo={classifier.getCategoryDescription(classification.category)}
              />
            )}

            {/* Start/Stop Button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                isMonitoring ? styles.buttonStop : styles.buttonStart,
                pressed && styles.buttonPressed,
              ]}
              onPress={toggleMonitoring}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Text>
            </Pressable>

            {/* Monitoring status */}
            {isMonitoring && (
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Monitoring active</Text>
              </View>
            )}

            {/* History */}
            {readings.length > 0 && (
              <NoiseHistory
                readings={readings}
                maxReadings={10}
                showTimestamps={true}
              />
            )}

            {/* Info section */}
            {!isMonitoring && readings.length === 0 && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>How to use:</Text>
                <Text style={styles.infoText}>
                  1. Tap "Start Monitoring" to begin
                </Text>
                <Text style={styles.infoText}>
                  2. Grant microphone permission when prompted
                </Text>
                <Text style={styles.infoText}>
                  3. See real-time noise levels and classification
                </Text>
                <Text style={styles.infoText}>
                  4. View history of recent readings
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    fontSize: 13,
    color: '#C62828',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonStop: {
    backgroundColor: '#F44336',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
});
