/**
 * AudioService - Handles microphone audio capture
 *
 * Features:
 * - Request microphone permission (Android & iOS)
 * - Start/stop audio recording
 * - Extract raw audio samples (Float32Array) from PCM data
 * - Real-time audio sample streaming with 1-second chunks
 * - Handle permission denial gracefully
 * - Emit audio samples to registered listeners
 *
 * Technical Specifications:
 * - Sample rate: 44100 Hz (matches Python prototype requirements)
 * - Channels: 1 (mono)
 * - Bit depth: 16-bit PCM
 * - Chunk duration: 1 second (44100 samples)
 *
 * @see PROJECT_PLAN.md - Step 1.2: Microphone Permission & Audio Capture
 */

import { Platform, PermissionsAndroid } from 'react-native';
import AudioRecord from 'react-native-audio-record';
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
}

/**
 * AudioService class for managing microphone audio capture
 */
export class AudioService {
  private isRecording: boolean = false;
  private callbacks: Array<(sample: AudioSample) => void> = [];
  private isInitialized: boolean = false;
  private config: AudioConfig = {
    sampleRate: 44100, // 44.1kHz as specified in requirements
    channels: 1, // Mono audio
    bitsPerSample: 16, // 16-bit PCM
  };

  /**
   * Initialize the audio service
   * Must be called before starting recording
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      AudioRecord.init({
        sampleRate: this.config.sampleRate,
        channels: this.config.channels,
        bitsPerSample: this.config.bitsPerSample,
        audioSource: 6, // VOICE_RECOGNITION source (optimized for audio processing)
        wavFile: 'audio.wav', // Temporary file name (we don't actually use the file)
      });

      // Set up event listener for real-time audio data
      // The callback receives base64 string directly
      AudioRecord.on('data', this.handleAudioData.bind(this));

      this.isInitialized = true;
    } catch (error) {
      throw new AudioServiceError(
        AudioErrorType.INITIALIZATION_FAILED,
        'Failed to initialize audio recorder',
        error as Error,
      );
    }
  }

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
      } else {
        // iOS: Permission is handled automatically by the system
        // when we first try to access the microphone.
        // The Info.plist NSMicrophoneUsageDescription will be shown.
        // We'll verify permission when we try to start recording.
        return true;
      }
    } catch (error) {
      throw new AudioServiceError(
        AudioErrorType.PERMISSION_DENIED,
        'Failed to request microphone permission',
        error as Error,
      );
    }
  }

  /**
   * Start recording audio from microphone
   * Captures audio in 1-second chunks and emits to registered callbacks
   *
   * @throws AudioServiceError if recording fails or permissions not granted
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new AudioServiceError(
        AudioErrorType.ALREADY_RECORDING,
        'Audio recording is already in progress',
      );
    }

    try {
      // Initialize audio recorder if not already done
      this.initialize();

      // Start recording
      await AudioRecord.start();
      this.isRecording = true;
    } catch (error) {
      this.isRecording = false;

      // Check if error is due to permission denial
      const errorMessage = (error as Error).message || '';
      if (
        errorMessage.includes('permission') ||
        errorMessage.includes('denied')
      ) {
        throw new AudioServiceError(
          AudioErrorType.PERMISSION_DENIED,
          'Microphone permission denied. Please grant permission in settings.',
          error as Error,
        );
      }

      throw new AudioServiceError(
        AudioErrorType.RECORDING_FAILED,
        'Failed to start audio recording',
        error as Error,
      );
    }
  }

  /**
   * Stop recording audio
   *
   * @throws AudioServiceError if not currently recording
   */
  async stopRecording(): Promise<void> {
    if (!this.isRecording) {
      throw new AudioServiceError(
        AudioErrorType.NOT_RECORDING,
        'No audio recording in progress',
      );
    }

    try {
      await AudioRecord.stop();
      this.isRecording = false;
    } catch (error) {
      throw new AudioServiceError(
        AudioErrorType.RECORDING_FAILED,
        'Failed to stop audio recording',
        error as Error,
      );
    }
  }

  /**
   * Handle incoming audio data from the recorder
   * Converts base64 PCM data to Float32Array and emits to callbacks
   *
   * @param base64Data - Base64 encoded PCM audio data string
   */
  private handleAudioData(base64Data: string): void {
    try {
      // Convert base64 string to Float32Array
      const samples = this.base64ToFloat32Array(base64Data);

      // Create AudioSample object
      const audioSample: AudioSample = {
        samples,
        sampleRate: this.config.sampleRate,
        timestamp: new Date(),
      };

      // Emit to all registered callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(audioSample);
        } catch (error) {
          console.error('Error in audio sample callback:', error);
        }
      });
    } catch (error) {
      console.error('Error processing audio data:', error);
    }
  }

  /**
   * Convert base64 encoded PCM data to Float32Array
   * PCM 16-bit samples are in range [-32768, 32767]
   * Float32Array samples are normalized to range [-1.0, 1.0]
   *
   * @param base64Data - Base64 encoded PCM audio data
   * @returns Float32Array containing normalized audio samples
   */
  private base64ToFloat32Array(base64Data: string): Float32Array {
    // Decode base64 to binary string using Buffer (works in React Native)
    const buffer = Buffer.from(base64Data, 'base64');
    const bytes = new Uint8Array(buffer);

    // Convert bytes to 16-bit PCM samples
    const dataView = new DataView(bytes.buffer);
    const sampleCount = bytes.length / 2; // 2 bytes per 16-bit sample
    const float32Array = new Float32Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
      // Read 16-bit signed integer (little-endian)
      const pcmSample = dataView.getInt16(i * 2, true);

      // Normalize to [-1.0, 1.0] range
      float32Array[i] = pcmSample / 32768.0;
    }

    return float32Array;
  }

  /**
   * Register callback for audio samples
   * Callback will be invoked in real-time as audio data becomes available
   *
   * @param callback - Function to call when new audio sample is available
   * @returns Unsubscribe function to remove the callback
   */
  onAudioSample(callback: (sample: AudioSample) => void): () => void {
    this.callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Remove all registered audio sample callbacks
   */
  clearCallbacks(): void {
    this.callbacks = [];
  }

  /**
   * Get current recording status
   *
   * @returns true if currently recording, false otherwise
   */
  getRecordingStatus(): boolean {
    return this.isRecording;
  }

  /**
   * Get audio configuration
   *
   * @returns Current audio configuration (sample rate, channels, bit depth)
   */
  getConfig(): Readonly<AudioConfig> {
    return { ...this.config };
  }

  /**
   * Cleanup and reset the audio service
   * Stops recording if active and removes all listeners
   */
  async cleanup(): Promise<void> {
    if (this.isRecording) {
      await this.stopRecording();
    }

    // Note: react-native-audio-record doesn't have an off() method
    // The listener will be cleaned up when we stop recording
    this.clearCallbacks();
    this.isInitialized = false;
  }
}

/**
 * Singleton instance of AudioService
 * Use this instance throughout the application
 */
export default new AudioService();
