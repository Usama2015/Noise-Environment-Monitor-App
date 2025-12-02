/**
 * StorageService - Firebase Firestore Wrapper
 *
 * Handles all cloud I/O operations:
 * - Saving noise readings to Firestore
 * - Subscribing to real-time heatmap data
 * - Query noise readings for the map
 */

import firestore from '@react-native-firebase/firestore';
import { Platform } from 'react-native';
import authService from './AuthService';
import {
  NoiseReading,
  NoiseReadingDocument,
  DecayedReading,
  HeatmapConfig,
  DEFAULT_HEATMAP_CONFIG,
} from '../types';

/**
 * Maximum time window for Firestore queries (in hours)
 * Prevents querying data that is days/weeks old
 * This is a hard limit regardless of config.timeWindowMinutes
 */
const MAX_QUERY_WINDOW_HOURS = 6;

/**
 * Calculate the decay weight for a reading based on its age
 * Uses exponential decay starting after decayStartMinutes
 *
 * @param decibel - The original decibel value
 * @param ageMinutes - Age of the reading in minutes
 * @param config - Heatmap configuration
 * @returns Decayed weight between 0 and 1
 */
function calculateDecayedWeight(
  decibel: number,
  ageMinutes: number,
  config: HeatmapConfig = DEFAULT_HEATMAP_CONFIG
): number {
  // Normalize decibel to 0-1 range (assuming max ~120 dB)
  const baseWeight = Math.min(decibel / 120, 1);

  // No decay for fresh readings
  if (ageMinutes <= config.decayStartMinutes) {
    return baseWeight;
  }

  // Calculate decay progress (0 to 1) over the decay period
  const decayPeriod = config.timeWindowMinutes - config.decayStartMinutes;
  const decayProgress = Math.min(
    (ageMinutes - config.decayStartMinutes) / decayPeriod,
    1
  );

  // Exponential decay: e^(-rate * progress)
  const decayFactor = Math.exp(-config.decayRate * decayProgress);

  // Apply decay but maintain minimum weight
  return Math.max(baseWeight * decayFactor, config.minWeightFactor * baseWeight);
}

/**
 * Aggregate readings by location (building + room)
 * Returns the most impactful reading per location after decay
 *
 * @param readings - Array of decayed readings
 * @returns Map of location key to best reading
 */
function aggregateByLocation(
  readings: DecayedReading[]
): Map<string, DecayedReading> {
  const locationMap = new Map<string, DecayedReading>();

  for (const reading of readings) {
    const key = `${reading.building}:${reading.room}`;
    const existing = locationMap.get(key);

    // Keep the reading with highest decayed weight for this location
    if (!existing || reading.decayedWeight > existing.decayedWeight) {
      locationMap.set(key, reading);
    }
  }

  return locationMap;
}

export class StorageService {
  private readonly COLLECTION_NAME = 'noise_readings';

  /**
   * Save a noise reading to Firestore
   *
   * @param reading - Local noise reading (without userId, timestamp)
   * @returns Promise<string> - Document ID
   * @throws Error if save fails
   */
  async saveReading(reading: NoiseReading): Promise<string> {
    try {
      const userId = authService.getUserId();

      if (!userId) {
        throw new Error('User not authenticated. Cannot save reading.');
      }

      // Create the Firestore document
      const document: Omit<NoiseReadingDocument, 'timestamp'> = {
        userId,
        deviceId: Platform.OS, // 'android' or 'ios'
        decibel: reading.decibel,
        classification: reading.classification,
        location: reading.location,
        sessionId: reading.sessionId,
      };

      // Add to Firestore (server will add timestamp)
      const docRef = await firestore()
        .collection(this.COLLECTION_NAME)
        .add({
          ...document,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      return docRef.id;
    } catch (error) {
      console.error('[StorageService] Failed to save reading:', error);
      throw new Error('Failed to save reading to cloud');
    }
  }

  /**
   * Subscribe to real-time heatmap data
   * Listens to all readings from the last hour (capped at MAX_QUERY_WINDOW_HOURS)
   *
   * @param callback - Function to call when data changes
   * @returns Unsubscribe function
   * @deprecated Use subscribeToHeatmapWithDecay instead for better data handling
   */
  subscribeToHeatmap(
    callback: (readings: NoiseReadingDocument[]) => void
  ): () => void {
    // Query: Get readings from the last 1 hour (within the 6-hour max limit)
    const oneHourMs = 60 * 60 * 1000;
    const maxQueryWindowMs = MAX_QUERY_WINDOW_HOURS * 60 * 60 * 1000;
    const queryWindowMs = Math.min(oneHourMs, maxQueryWindowMs);
    const cutoffTime = new Date(Date.now() - queryWindowMs);

    const unsubscribe = firestore()
      .collection(this.COLLECTION_NAME)
      .where('timestamp', '>', cutoffTime)
      .onSnapshot(
        querySnapshot => {
          const readings: NoiseReadingDocument[] = [];

          querySnapshot.forEach(doc => {
            const data = doc.data();

            // Convert Firestore document to NoiseReadingDocument
            readings.push({
              userId: data.userId,
              deviceId: data.deviceId,
              timestamp: data.timestamp, // Firestore Timestamp object
              decibel: data.decibel,
              classification: data.classification,
              location: data.location,
              sessionId: data.sessionId,
            });
          });

          callback(readings);
        },
        error => {
          console.error('[StorageService] Heatmap subscription error:', error);
        }
      );

    return unsubscribe;
  }

  /**
   * Subscribe to real-time heatmap data with time decay
   * Filters readings within the configured time window and applies decay
   *
   * @param callback - Function to call when data changes (receives decayed readings)
   * @param config - Optional heatmap configuration (uses defaults if not provided)
   * @returns Unsubscribe function
   */
  subscribeToHeatmapWithDecay(
    callback: (readings: DecayedReading[]) => void,
    config: HeatmapConfig = DEFAULT_HEATMAP_CONFIG
  ): () => void {
    // Calculate query window - use the smaller of config window or max limit (6 hours)
    const maxQueryWindowMs = MAX_QUERY_WINDOW_HOURS * 60 * 60 * 1000;
    const configWindowMs = config.timeWindowMinutes * 60 * 1000;
    const queryWindowMs = Math.min(configWindowMs, maxQueryWindowMs);
    const cutoffTime = new Date(Date.now() - queryWindowMs);

    const unsubscribe = firestore()
      .collection(this.COLLECTION_NAME)
      .where('timestamp', '>', cutoffTime)
      .onSnapshot(
        querySnapshot => {
          const now = Date.now();
          const decayedReadings: DecayedReading[] = [];

          querySnapshot.forEach(doc => {
            const data = doc.data();

            // Skip if no timestamp (shouldn't happen, but safety check)
            if (!data.timestamp) {
              return;
            }

            // Calculate age in minutes
            const timestampMs = data.timestamp.toMillis();
            const ageMinutes = (now - timestampMs) / (60 * 1000);

            // Skip readings older than the time window (edge case during subscription)
            if (ageMinutes > config.timeWindowMinutes) {
              return;
            }

            // Calculate decayed weight
            const decayedWeight = calculateDecayedWeight(
              data.decibel,
              ageMinutes,
              config
            );

            decayedReadings.push({
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              decibel: data.decibel,
              decayedWeight,
              ageMinutes,
              building: data.location.building,
              room: data.location.room,
            });
          });

          // Aggregate by location - keep the most impactful reading per location
          const aggregated = aggregateByLocation(decayedReadings);
          const result = Array.from(aggregated.values());

          callback(result);
        },
        error => {
          console.error('[StorageService] Heatmap subscription error:', error);
          // Return empty array on error so the UI can handle gracefully
          callback([]);
        }
      );

    return unsubscribe;
  }

  /**
   * Get all readings from a specific session
   *
   * @param sessionId - Session UUID
   * @returns Promise<NoiseReadingDocument[]>
   */
  async getSessionReadings(sessionId: string): Promise<NoiseReadingDocument[]> {
    try {
      const querySnapshot = await firestore()
        .collection(this.COLLECTION_NAME)
        .where('sessionId', '==', sessionId)
        .orderBy('timestamp', 'asc')
        .get();

      const readings: NoiseReadingDocument[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        readings.push({
          userId: data.userId,
          deviceId: data.deviceId,
          timestamp: data.timestamp,
          decibel: data.decibel,
          classification: data.classification,
          location: data.location,
          sessionId: data.sessionId,
        });
      });

      return readings;
    } catch (error) {
      console.error('[StorageService] Failed to get session readings:', error);
      throw new Error('Failed to fetch session readings');
    }
  }

  /**
   * Get readings for a specific building (for statistics)
   *
   * @param buildingName - Building name (e.g., "Fenwick Library")
   * @param limit - Max number of readings to fetch
   * @returns Promise<NoiseReadingDocument[]>
   */
  async getBuildingReadings(
    buildingName: string,
    limit: number = 100
  ): Promise<NoiseReadingDocument[]> {
    try {
      const querySnapshot = await firestore()
        .collection(this.COLLECTION_NAME)
        .where('location.building', '==', buildingName)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const readings: NoiseReadingDocument[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        readings.push({
          userId: data.userId,
          deviceId: data.deviceId,
          timestamp: data.timestamp,
          decibel: data.decibel,
          classification: data.classification,
          location: data.location,
          sessionId: data.sessionId,
        });
      });

      return readings;
    } catch (error) {
      console.error('[StorageService] Failed to get building readings:', error);
      throw new Error('Failed to fetch building readings');
    }
  }

  /**
   * Test connection to Firestore
   *
   * @returns Promise<boolean>
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to read from Firestore
      await firestore()
        .collection(this.COLLECTION_NAME)
        .limit(1)
        .get();

      return true;
    } catch (error) {
      console.error('[StorageService] Connection test failed:', error);
      return false;
    }
  }
}

/**
 * Singleton instance of StorageService
 * Use this instance throughout the application
 */
export default new StorageService();
