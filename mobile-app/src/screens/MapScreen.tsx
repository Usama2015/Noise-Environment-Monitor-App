/**
 * MapScreen Component
 *
 * Displays a Google Map with a heatmap overlay showing noise levels
 * across the GMU campus. Subscribes to real-time Firestore updates.
 *
 * @see PROJECT_PLAN.md - Phase 2: Map Visualization
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { StorageService } from '../services/StorageService';
import type { NoiseReadingDocument } from '../types';

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

  useEffect(() => {
    console.log('[MapScreen] Subscribing to heatmap data...');

    // Subscribe to real-time heatmap data
    const unsubscribe = storageService.subscribeToHeatmap(
      (readings: NoiseReadingDocument[]) => {
        console.log('[MapScreen] Received readings:', readings.length);

        // Transform readings to heatmap points
        const points = readings.map(reading => ({
          latitude: reading.location.latitude,
          longitude: reading.location.longitude,
          weight: reading.decibel / 120, // Normalize 0-120 dB to 0-1
        }));

        setHeatmapPoints(points);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('[MapScreen] Unsubscribing from heatmap data');
      unsubscribe();
    };
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

      {/* Data count indicator */}
      <View style={[styles.statusBar, { top: insets.top + 10 }]}>
        <Text style={styles.statusText}>
          {isLoading
            ? 'Loading noise data...'
            : heatmapPoints.length > 0
              ? `${heatmapPoints.length} noise readings`
              : 'No noise data available'}
        </Text>
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
