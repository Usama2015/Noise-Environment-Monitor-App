/**
 * Type definitions for Noise Environment Monitor App
 * Phase 1: Core Types for Audio Processing and Classification
 */

/**
 * Classification categories for noise levels
 * - Quiet: < 50 dB
 * - Normal: 50-70 dB
 * - Noisy: > 70 dB
 */
export type NoiseClassification = 'Quiet' | 'Normal' | 'Noisy';

/**
 * Raw audio sample data from microphone
 */
export interface AudioSample {
  samples: Float32Array;
  sampleRate: number;
  timestamp: Date;
}

/**
 * Decibel reading with classification
 */
export interface DecibelReading {
  value: number;
  timestamp: Date;
  classification: NoiseClassification;
}

/**
 * Complete noise reading with optional location data
 * This is the primary data model for storing measurements
 */
export interface NoiseReading {
  id: string;
  timestamp: Date;
  decibels: number;
  classification: NoiseClassification;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

/**
 * FFT analysis result containing frequency domain data
 */
export interface FrequencyData {
  frequencies: number[];
  magnitudes: number[];
  sampleRate: number;
}

/**
 * Extracted audio features for classification
 */
export interface AudioFeatures {
  spectralCentroid: number;
  spectralEnergy: number;
  dominantFrequency: number;
  energyDistribution: number[];
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

/**
 * App permission status
 */
export interface PermissionStatus {
  microphone: boolean;
  location: boolean;
}
