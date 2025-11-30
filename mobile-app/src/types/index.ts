/**
 * Type definitions for Noise Environment Monitor App
 * Cloud-First Edition with Firebase
 */

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Classification categories for noise levels
 * - Quiet: < 50 dB
 * - Normal: 50-70 dB
 * - Noisy: > 70 dB
 */
export type NoiseClassification = 'Quiet' | 'Normal' | 'Noisy';

/**
 * Firestore document structure for noise readings
 * This is the primary data model stored in the cloud
 */
export interface NoiseReadingDocument {
  // WHO (Managed by Auth)
  userId: string;          // Firebase UID (Anonymous)
  deviceId?: string;       // Optional: Device model for debugging

  // WHEN (Managed by Server)
  timestamp: FirebaseFirestoreTypes.Timestamp;

  // WHAT (The Data)
  decibel: number;         // e.g., 65.4
  classification: NoiseClassification; // "Quiet" | "Normal" | "Noisy"

  // WHERE (The Hybrid Location)
  location: {
    latitude: number;      // GPS Lat (for Map placement)
    longitude: number;     // GPS Long (for Map placement)
    building: string;      // User Selected: "Fenwick Library"
    room: string;          // User Selected: "3rd Floor Quiet Area"
  };

  sessionId: string;       // UUID to group continuous readings
}

/**
 * Local representation of a noise reading (before upload)
 * Used in the app before converting to NoiseReadingDocument
 */
export interface NoiseReading {
  decibel: number;
  classification: NoiseClassification;
  location: {
    latitude: number;
    longitude: number;
    building: string;
    room: string;
  };
  sessionId: string;
}

/**
 * Location picker item structure
 */
export interface CampusLocation {
  id: string;
  name: string;
  rooms: string[];
}

/**
 * App permission status
 */
export interface PermissionStatus {
  microphone: boolean;
  location: boolean;
}

/**
 * GPS/Location coordinates
 */
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}
