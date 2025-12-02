/**
 * MapScreen Component
 *
 * Displays a Google Map with a heatmap overlay showing noise levels
 * across the GMU campus. Subscribes to real-time Firestore updates.
 *
 * @see PROJECT_PLAN.md - Phase 2: Map Visualization
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { StorageService } from '../services/StorageService';
import type { DecayedReading, HeatmapConfig } from '../types/index';
import { DEFAULT_HEATMAP_CONFIG } from '../types/index';

// Time window bounds (in minutes)
const MIN_TIME_WINDOW = 1;
const MAX_TIME_WINDOW = 60;

// Noise level color mapping (Material Design colors for better visibility)
const getNoiseColor = (decibel: number): string => {
  if (decibel < 40) return '#2196F3'; // Material Blue - Quiet
  if (decibel < 60) return '#4CAF50'; // Material Green - Normal
  if (decibel < 80) return '#FFC107'; // Material Amber - Moderate
  return '#F44336'; // Material Red - Noisy
};

// Get opacity based on decay weight (older = more transparent)
const getOpacity = (decayedWeight: number): number => {
  // decayedWeight is 0-1, map to 0.3-0.7 opacity range
  return 0.3 + (decayedWeight * 0.4);
};

interface NoiseCircle {
  latitude: number;
  longitude: number;
  decibel: number;
  decayedWeight: number;
  key: string;
}

// GMU campus center coordinates
const GMU_CAMPUS = {
  latitude: 38.8304,
  longitude: -77.3078,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const storageService = new StorageService();

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [noiseCircles, setNoiseCircles] = useState<NoiseCircle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeWindowMinutes, setTimeWindowMinutes] = useState(DEFAULT_HEATMAP_CONFIG.timeWindowMinutes);

  // Create config with user-selected time window
  const heatmapConfig: HeatmapConfig = useMemo(() => ({
    ...DEFAULT_HEATMAP_CONFIG,
    timeWindowMinutes,
    // Scale decay start proportionally (20% of time window)
    decayStartMinutes: Math.max(1, Math.floor(timeWindowMinutes * 0.2)),
  }), [timeWindowMinutes]);

  useEffect(() => {
    setIsLoading(true);

    // Subscribe to real-time noise data with time decay
    const unsubscribe = storageService.subscribeToHeatmapWithDecay(
      (readings: DecayedReading[]) => {
        // Transform readings to noise circles with color based on dB level
        const circles = readings.map((reading, index) => ({
          latitude: reading.latitude,
          longitude: reading.longitude,
          decibel: reading.decibel,
          decayedWeight: reading.decayedWeight,
          key: `${reading.building}-${reading.room}-${index}`,
        }));

        setNoiseCircles(circles);
        setIsLoading(false);
      },
      heatmapConfig
    );

    // Cleanup subscription on unmount or when config changes
    return () => {
      unsubscribe();
    };
  }, [heatmapConfig]);

  // Handle slider change (debounced by only updating on release)
  const handleTimeWindowChange = useCallback((value: number) => {
    setTimeWindowMinutes(Math.round(value));
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={GMU_CAMPUS}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Render noise circles - color based on dB level, opacity based on age */}
        {noiseCircles.map(circle => (
          <Circle
            key={circle.key}
            center={{
              latitude: circle.latitude,
              longitude: circle.longitude,
            }}
            radius={5} // 5 meters radius
            fillColor={getNoiseColor(circle.decibel) + Math.round(getOpacity(circle.decayedWeight) * 255).toString(16).padStart(2, '0')}
            strokeColor={getNoiseColor(circle.decibel)}
            strokeWidth={2}
          />
        ))}
      </MapView>

      {/* Data count indicator and time window slider */}
      <View style={[styles.statusBar, { top: insets.top + 10 }]}>
        <View style={styles.statusRow}>
          {isLoading && <ActivityIndicator size="small" color="#4CAF50" style={styles.spinner} />}
          <Text style={styles.statusText}>
            {isLoading
              ? 'Loading noise data...'
              : noiseCircles.length > 0
                ? `${noiseCircles.length} locations (last ${timeWindowMinutes} min)`
                : `No noise data in the last ${timeWindowMinutes} min`}
          </Text>
        </View>

        {/* Time Window Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Time Window:</Text>
          <Slider
            style={styles.slider}
            minimumValue={MIN_TIME_WINDOW}
            maximumValue={MAX_TIME_WINDOW}
            step={1}
            value={timeWindowMinutes}
            onSlidingComplete={handleTimeWindowChange}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#CCCCCC"
            thumbTintColor="#4CAF50"
          />
          <Text style={styles.sliderValue}>{timeWindowMinutes} min</Text>
        </View>
      </View>

      {/* Legend - positioned above tab bar */}
      <View style={[styles.legend, { bottom: 20 }]}>
        <Text style={styles.legendTitle}>Noise Level</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Quiet (0-40 dB)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Normal (40-60 dB)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
          <Text style={styles.legendText}>Moderate (60-80 dB)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>Noisy (80+ dB)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  statusBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    minWidth: 50,
    textAlign: 'right',
  },
  legend: {
    position: 'absolute',
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});
