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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Geolocation from '@react-native-community/geolocation';
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
import { CAMPUS_LOCATIONS } from '../constants/locations';

// Sample rate configuration (matches AudioService)
const SAMPLE_RATE = 44100;

// Moving average window size
const MOVING_AVG_WINDOW = 5;

/**
 * HomeScreen component
 */
export const HomeScreen: React.FC = () => {
  // Get safe area insets for proper padding
  const insets = useSafeAreaInsets();

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

  // Location selection state
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  // Process audio samples
  const processAudioSample = useCallback(
    (sample: AudioSample) => {
      try {
        // 1. Use calibrated dB value from AudioService
        const instantDb = sample.decibelLevel;

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

  // Handle building selection change
  const handleBuildingChange = useCallback((buildingName: string) => {
    setSelectedBuilding(buildingName);
    setSelectedRoom(''); // Reset room when building changes

    // Get rooms for selected building
    const location = CAMPUS_LOCATIONS.find(loc => loc.name === buildingName);
    if (location) {
      setAvailableRooms(location.rooms);
    } else {
      setAvailableRooms([]);
    }
  }, []);

  // Start monitoring with location
  const startMonitoring = async () => {
    // Validate location selection
    if (!selectedBuilding || !selectedRoom) {
      Alert.alert(
        'Location Required',
        'Please select both building and room before starting monitoring.'
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Request microphone permission
      const hasPermission = await audioService.requestPermission();
      if (!hasPermission) {
        setError('Microphone permission denied. Please enable it in settings.');
        setIsLoading(false);
        return;
      }

      // Get GPS coordinates
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Set location in AudioService
          audioService.setLocation(selectedBuilding, selectedRoom, latitude, longitude);

          // Reset filters and history
          movingAverage.reset();
          setReadings([]);

          // Subscribe to audio samples
          audioService.onAudioSample(processAudioSample);

          // Start recording
          await audioService.startRecording();

          setIsMonitoring(true);
          setIsLoading(false);
        },
        (geoError) => {
          // Use default GMU coordinates if GPS fails
          Alert.alert(
            'GPS Unavailable',
            'Using default campus coordinates. Map location may be inaccurate.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setIsLoading(false),
              },
              {
                text: 'Continue Anyway',
                onPress: async () => {
                  // Use GMU default coordinates
                  audioService.setLocation(
                    selectedBuilding,
                    selectedRoom,
                    38.8304, // GMU latitude
                    -77.3078  // GMU longitude
                  );

                  // Reset filters and history
                  movingAverage.reset();
                  setReadings([]);

                  // Subscribe to audio samples
                  audioService.onAudioSample(processAudioSample);

                  // Start recording
                  await audioService.startRecording();

                  setIsMonitoring(true);
                  setIsLoading(false);
                },
              },
            ]
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.error('Error starting monitoring:', err);
      setError(err instanceof Error ? err.message : 'Failed to start monitoring');
      Alert.alert(
        'Error',
        'Failed to start monitoring. Please check microphone permissions.'
      );
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
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
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
            {/* Location Selection Section */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Select Location</Text>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Building:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedBuilding}
                    onValueChange={handleBuildingChange}
                    style={styles.picker}
                    enabled={!isMonitoring}
                    dropdownIconColor="#333"
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Building..." value="" color="#999" style={styles.pickerItem} />
                    {CAMPUS_LOCATIONS.map(location => (
                      <Picker.Item
                        key={location.id}
                        label={location.name}
                        value={location.name}
                        color="#333"
                        style={styles.pickerItem}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Room:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedRoom}
                    onValueChange={(value) => setSelectedRoom(value)}
                    style={styles.picker}
                    enabled={!isMonitoring && availableRooms.length > 0}
                    dropdownIconColor="#333"
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Room..." value="" color="#999" style={styles.pickerItem} />
                    {availableRooms.map(room => (
                      <Picker.Item key={room} label={room} value={room} color="#333" style={styles.pickerItem} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Location status indicator */}
              {selectedBuilding && selectedRoom && (
                <View style={styles.locationStatus}>
                  <Text style={styles.locationStatusText}>
                    Location: {selectedBuilding} - {selectedRoom}
                  </Text>
                </View>
              )}
            </View>

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
                  1. Select your building and room above
                </Text>
                <Text style={styles.infoText}>
                  2. Tap "Start Monitoring" to begin
                </Text>
                <Text style={styles.infoText}>
                  3. See real-time noise levels and classification
                </Text>
                <Text style={styles.infoText}>
                  4. View the Campus Map tab to see all readings
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
  // Location picker styles
  locationSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    justifyContent: 'center',
    minHeight: 56,
  },
  picker: {
    height: 56,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  pickerItem: {
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  locationStatus: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
  },
  locationStatusText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
});
