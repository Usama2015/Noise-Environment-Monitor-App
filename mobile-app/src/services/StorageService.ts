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
import { NoiseReading, NoiseReadingDocument } from '../types';

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

      console.log('[StorageService] Reading saved. Doc ID:', docRef.id);

      return docRef.id;
    } catch (error) {
      console.error('[StorageService] Failed to save reading:', error);
      throw new Error('Failed to save reading to cloud');
    }
  }

  /**
   * Subscribe to real-time heatmap data
   * Listens to all readings from the last hour
   *
   * @param callback - Function to call when data changes
   * @returns Unsubscribe function
   */
  subscribeToHeatmap(
    callback: (readings: NoiseReadingDocument[]) => void
  ): () => void {
    // Query: Get readings from the last 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const unsubscribe = firestore()
      .collection(this.COLLECTION_NAME)
      .where('timestamp', '>', oneHourAgo)
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

          console.log(`[StorageService] Heatmap updated: ${readings.length} readings`);
          callback(readings);
        },
        error => {
          console.error('[StorageService] Heatmap subscription error:', error);
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

      console.log('[StorageService] Connection test successful');
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
