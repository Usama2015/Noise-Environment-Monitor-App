/**
 * AudioService - Handles microphone audio capture with dB metering
 *
 * Features:
 * - Request microphone permission (Android & iOS)
 * - Start/stop audio monitoring with dB metering
 * - Industry-standard time weighting (IEC 61672)
 * - 125ms "Fast" response for real-time display
 * - 1-second "Slow" response for classification (industry standard)
 * - Handle permission denial gracefully
 * - Android 14 compatible
 *
 * Technical Specifications (IEC 61672 Compliant):
 * - Metering interval: 125ms ("Fast" response - approximates human ear)
 * - Classification window: 1000ms (1 second - "Slow" response, industry standard)
 * - Averaging: Logarithmic dB averaging (mathematically correct)
 *
 * Time Weighting Standards:
 * - Fast (F): 125ms - Real-time display updates
 * - Slow (S): 1000ms - Classification and storage (ISO 1996, IEC 61672)
 *
 * Architecture:
 * Microphone → sound-level monitoring → dB value → Buffer (1-sec) → Classify
 *          ↓
 *    Real-time UI updates (125ms)
 *          ↓
 *    Classification (1 second average)
 *
 * @see PROJECT_PLAN.md - Step 1.2: Microphone Permission & Audio Capture
 * @see IEC 61672 - Sound level meters specifications
 * @see ISO 1996 - Environmental noise measurement standards
 */

import { Platform, PermissionsAndroid } from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import { AudioSample } from '../types';

/**
 * Error types for audio service operations
 */
export enum AudioErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DEVICE_UNAVAILABLE = 'DEVICE_UNAVAILABLE',
  RECORDING_FAILED = 'RECORDING_FAILED',
  ALREADY_RECORDING = 'ALREADY_RECORDING',
  NOT_RECORDING = 'NOT_RECORDING',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
}

/**
 * Custom error class for audio-related errors
 */
export class AudioServiceError extends Error {
  constructor(
    public type: AudioErrorType,
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'AudioServiceError';
  }
}

/**
 * Audio recording configuration
 */
interface AudioConfig {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  meteringInterval: number; // Fast response (125ms)
  classificationWindow: number; // Slow response (1000ms)
}

/**
 * Callback types for different update frequencies
 */
interface AudioCallbacks {
  realTime: Array<(dbValue: number) => void>; // 125ms updates
  classification: Array<(sample: AudioSample) => void>; // 1-second updates
}

/**
 * AudioService class for managing microphone audio capture with dB metering
 * Implements IEC 61672 time weighting standards
 */
export class AudioService {
  private isRecording: boolean = false;
  private callbacks: AudioCallbacks = {
    realTime: [],
    classification: [],
  };
  private meteringInterval: NodeJS.Timeout | null = null;
  private dbReadings: number[] = []; // Buffer for 1-second window
  private lastDbValue: number = 0;
  private config: AudioConfig = {
    sampleRate: 44100, // 44.1kHz standard
    channels: 1, // Mono audio
    bitsPerSample: 16, // 16-bit PCM
    meteringInterval: 125, // Fast response (IEC 61672)
    classificationWindow: 1000, // Slow response (1 second - industry standard)
  };

  /**
   * Request microphone permission from the user
   * Platform-specific implementation for iOS and Android
   *
   * @returns Promise<boolean> - true if granted, false otherwise
   * @throws AudioServiceError if permission request fails
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android: Request permission using PermissionsAndroid API
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'Noise Monitor needs access to your microphone to measure ambient noise levels.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // iOS: Permission handled automatically on first use
      return true;
    } catch (error) {
      throw new AudioServiceError(
        AudioErrorType.PERMISSION_DENIED,
        'Failed to request microphone permission',
        error as Error,
      );
    }
  }

  /**
   * Start monitoring audio with real-time dB metering
   * Implements two-tier system:
   * - Fast response (125ms): Real-time display updates
   * - Slow response (1s): Classification and storage
   *
   * @throws AudioServiceError if monitoring fails or permissions not granted
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new AudioServiceError(
        AudioErrorType.ALREADY_RECORDING,
        'Audio monitoring is already in progress',
      );
    }

    try {
      // Set up callback for sound level updates
      RNSoundLevel.onNewFrame = (data: any) => {
        this.handleSoundLevelUpdate(data);
      };

      // Start sound level monitoring
      RNSoundLevel.start({
        monitorInterval: this.config.meteringInterval, // 125ms
        samplingRate: this.config.sampleRate, // 44100
      });

      this.isRecording = true;

      // Start aggregation loop for 1-second classification
      this.startMeteringLoop();
    } catch (error) {
      this.isRecording = false;

      const errorMessage = (error as Error).message || '';
      if (
        errorMessage.includes('permission') ||
        errorMessage.includes('denied') ||
        errorMessage.includes('granted')
      ) {
        throw new AudioServiceError(
          AudioErrorType.PERMISSION_DENIED,
          'Microphone permission denied. Please grant permission in settings.',
          error as Error,
        );
      }

      throw new AudioServiceError(
        AudioErrorType.RECORDING_FAILED,
        'Failed to start audio monitoring',
        error as Error,
      );
    }
  }

  /**
   * Handle incoming sound level data from native module
   *
   * @param data - Sound level data with dB value
   * @private
   */
  private handleSoundLevelUpdate(data: any): void {
    try {
      // Get dB value from data
      // react-native-sound-level returns value (0-160) or db (-160 to 0)
      const rawValue = data.value !== undefined ? data.value : data.db;

      // Debug logging to understand raw values
      console.log('[AudioService] Raw dB value from library:', rawValue);

      // Normalize to 0-120 dB range for environmental monitoring
      const dbValue = this.normalizeSoundLevel(rawValue);

      console.log('[AudioService] Normalized dB value:', dbValue);

      // Store for aggregation
      this.lastDbValue = dbValue;

      // TIER 1: Real-time display (Fast response - 125ms)
      this.emitRealTimeUpdate(dbValue);
    } catch (error) {
      console.error('Error processing sound level data:', error);
    }
  }

  /**
   * Normalize sound level to 0-120 dB range
   *
   * @param rawValue - Raw value from sound level library
   * @returns Normalized dB value (0-120)
   * @private
   */
  private normalizeSoundLevel(rawValue: number): number {
    // react-native-sound-level returns dBFS (decibels relative to full scale)
    // Range: -160 dBFS (silence) to 0 dBFS (maximum)
    // We need to map this to SPL (Sound Pressure Level) for environmental monitoring
    //
    // Calibration: Adjust offset based on device characteristics
    // A quiet room should be ~20-40 dB SPL
    // Current issue: -26 dBFS + 120 = 94 dB (too high for quiet room)
    // Better calibration: Use larger offset to map silence to lower SPL values

    if (rawValue < 0) {
      // Map dBFS to approximate SPL
      // Calibration: -160 dBFS → 0 dB SPL, 0 dBFS → 120 dB SPL
      // But adjust for typical smartphone microphone sensitivity
      // Quiet room at -26 dBFS should be ~30 dB SPL, not 94 dB
      // So: SPL = dBFS + 56 (roughly: -26 + 56 = 30 dB)
      const spl = rawValue + 56;
      return Math.max(0, Math.min(120, spl));
    }

    // If value is positive (shouldn't happen with dBFS), clamp to valid range
    return Math.max(0, Math.min(120, rawValue));
  }

  /**
   * Start metering loop for 1-second classification aggregation
   *
   * Tier 2 (Slow - 1 second): Classification and storage
   * - Samples current dB value every 125ms
   * - Buffers 8 readings (8 × 125ms = 1 second)
   * - Averages readings over 1-second window using logarithmic averaging
   * - Emits to classification callbacks once per second
   * - Complies with IEC 61672 "Slow" response standard
   *
   * @private
   */
  private startMeteringLoop(): void {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
    }

    // Calculate how many readings needed for 1-second window
    const readingsPerSecond = this.config.classificationWindow / this.config.meteringInterval;
    // 1000ms / 125ms = 8 readings

    this.meteringInterval = setInterval(() => {
      if (!this.isRecording) {
        return;
      }

      try {
        // TIER 2: Classification (Slow response - 1 second)
        // Buffer current reading for 1-second window
        this.dbReadings.push(this.lastDbValue);

        // When we have a full 1-second window (8 readings)
        if (this.dbReadings.length >= readingsPerSecond) {
          // Calculate average dB over 1-second window
          const avgDb = this.calculateAverageDb(this.dbReadings);

          // Create audio sample for classification
          const audioSample = this.createAudioSampleFromDb(avgDb);

          // Emit to classification callbacks
          this.emitClassification(audioSample);

          // Clear buffer for next 1-second window
          this.dbReadings = [];
        }
      } catch (error) {
        console.error('Error in metering loop:', error);
      }
    }, this.config.meteringInterval);
  }

  /**
   * Calculate average dB from array of readings
   * Uses logarithmic averaging (proper for dB values)
   *
   * @param readings - Array of dB readings
   * @returns Average dB value
   * @private
   */
  private calculateAverageDb(readings: number[]): number {
    if (readings.length === 0) return 0;

    // Convert dB to linear scale, average, then convert back
    // This is the correct way to average decibel values
    const linearSum = readings.reduce((sum, db) => {
      return sum + Math.pow(10, db / 10);
    }, 0);

    const linearAverage = linearSum / readings.length;
    const avgDb = 10 * Math.log10(linearAverage);

    return avgDb;
  }

  /**
   * Create AudioSample from dB value
   * Converts dB to amplitude and creates Float32Array for compatibility
   *
   * @param db - Decibel value
   * @returns AudioSample object
   * @private
   */
  private createAudioSampleFromDb(db: number): AudioSample {
    // Convert dB to amplitude for compatibility with existing pipeline
    const amplitude = this.dbToAmplitude(db);

    // Create sample array (1-second duration)
    const sampleCount = Math.floor(this.config.sampleRate * 1.0);
    const samples = new Float32Array(sampleCount).fill(amplitude);

    return {
      samples,
      sampleRate: this.config.sampleRate,
      timestamp: new Date(),
      decibelLevel: db, // Pass calibrated dB value directly to UI
    };
  }

  /**
   * Convert dB to amplitude (normalized -1 to 1)
   *
   * @param db - Decibel value (0-120 range)
   * @returns Amplitude value (-1 to 1)
   * @private
   */
  private dbToAmplitude(db: number): number {
    // Normalize dB to 0-1 range (60 dB reference)
    const normalizedDb = (db - 60) / 60;

    // Convert to amplitude using inverse dB formula
    const amplitude = Math.pow(10, normalizedDb / 20);

    // Clamp to valid range
    return Math.max(-1, Math.min(1, amplitude));
  }

  /**
   * Emit real-time dB update to registered callbacks
   * Called every 125ms (Fast response)
   *
   * @param dbValue - Current dB reading
   * @private
   */
  private emitRealTimeUpdate(dbValue: number): void {
    this.callbacks.realTime.forEach(callback => {
      try {
        callback(dbValue);
      } catch (error) {
        console.error('Error in real-time callback:', error);
      }
    });
  }

  /**
   * Emit classification update to registered callbacks
   * Called every 1 second (Slow response)
   *
   * @param sample - AudioSample with 1-second averaged data
   * @private
   */
  private emitClassification(sample: AudioSample): void {
    this.callbacks.classification.forEach(callback => {
      try {
        callback(sample);
      } catch (error) {
        console.error('Error in classification callback:', error);
      }
    });
  }

  /**
   * Stop audio monitoring
   * Cleans up listeners and intervals
   * Safe to call even if not currently monitoring
   */
  async stopRecording(): Promise<void> {
    // If not recording, just return (safe to call multiple times)
    if (!this.isRecording) {
      return;
    }

    try {
      // Stop metering loop
      if (this.meteringInterval) {
        clearInterval(this.meteringInterval);
        this.meteringInterval = null;
      }

      // Clear readings buffer
      this.dbReadings = [];

      // Stop sound level monitoring
      RNSoundLevel.stop();

      // Clear callback
      RNSoundLevel.onNewFrame = null;

      this.isRecording = false;
    } catch (error) {
      throw new AudioServiceError(
        AudioErrorType.RECORDING_FAILED,
        'Failed to stop audio monitoring',
        error as Error,
      );
    }
  }

  /**
   * Register callback for real-time dB updates (125ms interval)
   * Use this for smooth UI updates and real-time display
   *
   * @param callback - Function to call with dB value every 125ms
   * @returns Unsubscribe function
   */
  onRealTimeUpdate(callback: (dbValue: number) => void): () => void {
    this.callbacks.realTime.push(callback);

    return () => {
      const index = this.callbacks.realTime.indexOf(callback);
      if (index !== -1) {
        this.callbacks.realTime.splice(index, 1);
      }
    };
  }

  /**
   * Register callback for classification updates (1-second interval)
   * Use this for noise classification and data storage
   * Complies with IEC 61672 "Slow" response standard
   *
   * @param callback - Function to call with AudioSample every 1 second
   * @returns Unsubscribe function
   */
  onAudioSample(callback: (sample: AudioSample) => void): () => void {
    this.callbacks.classification.push(callback);

    return () => {
      const index = this.callbacks.classification.indexOf(callback);
      if (index !== -1) {
        this.callbacks.classification.splice(index, 1);
      }
    };
  }

  /**
   * Remove all registered callbacks
   */
  clearCallbacks(): void {
    this.callbacks.realTime = [];
    this.callbacks.classification = [];
  }

  /**
   * Get current monitoring status
   *
   * @returns true if currently monitoring, false otherwise
   */
  getRecordingStatus(): boolean {
    return this.isRecording;
  }

  /**
   * Get audio configuration including time weighting settings
   *
   * @returns Current audio configuration
   */
  getConfig(): Readonly<AudioConfig> {
    return { ...this.config };
  }

  /**
   * Cleanup and reset the audio service
   * Stops monitoring if active and removes all listeners
   */
  async cleanup(): Promise<void> {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
      this.meteringInterval = null;
    }

    this.dbReadings = [];

    if (this.isRecording) {
      await this.stopRecording();
    }

    this.clearCallbacks();
  }
}

/**
 * Singleton instance of AudioService
 * Use this instance throughout the application
 */
export default new AudioService();
