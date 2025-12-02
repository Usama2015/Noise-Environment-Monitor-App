/**
 * MapScreen Component
 *
 * Displays a Google Map with a heatmap overlay showing noise levels
 * across the GMU campus. Subscribes to real-time Firestore updates.
 *
 * @see PROJECT_PLAN.md - Phase 2: Map Visualization
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { StorageService } from '../services/StorageService';
import type { DecayedReading, HeatmapConfig } from '../types';
import { DEFAULT_HEATMAP_CONFIG } from '../types';

// Time window bounds (in minutes)
const MIN_TIME_WINDOW = 1;
const MAX_TIME_WINDOW = 60;

interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight?: number;
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
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
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
    console.log('[MapScreen] Subscribing to heatmap data with decay...');
    console.log('[MapScreen] Config:', heatmapConfig);
    setIsLoading(true);

    // Subscribe to real-time heatmap data with time decay
    const unsubscribe = storageService.subscribeToHeatmapWithDecay(
      (readings: DecayedReading[]) => {
        console.log('[MapScreen] Received decayed readings:', readings.length);

        // Transform decayed readings to heatmap points
        // Use the decayedWeight which accounts for age and decay
        const points = readings.map(reading => ({
          latitude: reading.latitude,
          longitude: reading.longitude,
          weight: reading.decayedWeight, // Already normalized with decay applied
        }));

        setHeatmapPoints(points);
        setIsLoading(false);
      },
      heatmapConfig
    );

    // Cleanup subscription on unmount or when config changes
    return () => {
      console.log('[MapScreen] Unsubscribing from heatmap data');
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
        {heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            radius={40}
            opacity={0.7}
            gradient={{
              colors: ['#0000FF', '#00FF00', '#FFFF00', '#FF0000'],
              startPoints: [0.2, 0.4, 0.6, 1.0],
              colorMapSize: 256,
            }}
          />
        )}
      </MapView>

      {/* Data count indicator and time window slider */}
      <View style={[styles.statusBar, { top: insets.top + 10 }]}>
        <Text style={styles.statusText}>
          {isLoading
            ? 'Loading noise data...'
            : heatmapPoints.length > 0
              ? `${heatmapPoints.length} locations (last ${timeWindowMinutes} min)`
              : `No noise data in the last ${timeWindowMinutes} min`}
        </Text>

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
          <View style={[styles.legendColor, { backgroundColor: '#0000FF' }]} />
          <Text style={styles.legendText}>Quiet (0-40 dB)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#00FF00' }]} />
          <Text style={styles.legendText}>Normal (40-60 dB)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#FFFF00' }]} />
          <Text style={styles.legendText}>Moderate (60-80 dB)</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: '#FF0000' }]} />
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
