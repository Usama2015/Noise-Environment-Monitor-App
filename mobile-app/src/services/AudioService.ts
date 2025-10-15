/**
 * AudioService - Handles microphone audio capture
 *
 * TODO (Step 1.2):
 * - Request microphone permission
 * - Start/stop audio recording
 * - Extract raw audio samples (Float32Array)
 * - Handle permission denial gracefully
 * - Emit audio samples to listeners
 *
 * Dependencies to install:
 * - expo-av OR react-native-audio
 *
 * @see PROJECT_PLAN.md - Step 1.2: Microphone Permission & Audio Capture
 */

import { AudioSample } from '../types';

export class AudioService {
  private isRecording: boolean = false;
  private callbacks: Array<(sample: AudioSample) => void> = [];

  /**
   * Request microphone permission from the user
   * @returns Promise<boolean> - true if granted, false otherwise
   */
  async requestPermission(): Promise<boolean> {
    // TODO: Implement permission request
    // Platform-specific: iOS vs Android
    throw new Error('Not implemented');
  }

  /**
   * Start recording audio from microphone
   */
  async startRecording(): Promise<void> {
    // TODO: Implement audio recording
    // - Configure audio settings (sample rate: 44.1kHz)
    // - Start capturing audio in chunks (1-second intervals)
    throw new Error('Not implemented');
  }

  /**
   * Stop recording audio
   */
  async stopRecording(): Promise<void> {
    // TODO: Implement stop recording
    this.isRecording = false;
  }

  /**
   * Register callback for audio samples
   * @param callback - Function to call when new audio sample is available
   */
  onAudioSample(callback: (sample: AudioSample) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * Get current recording status
   */
  getRecordingStatus(): boolean {
    return this.isRecording;
  }
}

export default new AudioService();
