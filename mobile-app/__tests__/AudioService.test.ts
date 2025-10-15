/**
 * Unit tests for AudioService
 * Tests microphone permission, audio recording, sample processing, and error handling
 *
 * @see src/services/AudioService.ts
 */

import { Platform, PermissionsAndroid } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {
  AudioService,
  AudioServiceError,
  AudioErrorType,
} from '../src/services/AudioService';
import { AudioSample } from '../src/types';

// Mock react-native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
    request: jest.fn(),
  },
}));

// Mock react-native-audio-record
jest.mock('react-native-audio-record', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    on: jest.fn(),
  },
}));

describe('AudioService', () => {
  let audioService: AudioService;
  let audioDataCallback: ((data: string) => void) | null = null;

  beforeEach(() => {
    // Create a new instance for each test
    audioService = new AudioService();

    // Reset all mocks
    jest.clearAllMocks();

    // Capture the audio data callback when AudioRecord.on is called
    (AudioRecord.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'data') {
        audioDataCallback = callback;
      }
    });
  });

  afterEach(async () => {
    // Cleanup after each test
    try {
      await audioService.cleanup();
    } catch {
      // Ignore cleanup errors in tests
    }
    audioDataCallback = null;
  });

  describe('requestPermission', () => {
    it('should request microphone permission on Android', async () => {
      (Platform.OS as string) = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.GRANTED,
      );

      const granted = await audioService.requestPermission();

      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        expect.objectContaining({
          title: 'Microphone Permission',
          message: expect.stringContaining('microphone'),
        }),
      );
      expect(granted).toBe(true);
    });

    it('should return false when permission is denied on Android', async () => {
      (Platform.OS as string) = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.DENIED,
      );

      const granted = await audioService.requestPermission();

      expect(granted).toBe(false);
    });

    it('should return true on iOS without requesting permission', async () => {
      (Platform.OS as string) = 'ios';

      const granted = await audioService.requestPermission();

      expect(PermissionsAndroid.request).not.toHaveBeenCalled();
      expect(granted).toBe(true);
    });

    it('should throw AudioServiceError on permission request failure', async () => {
      (Platform.OS as string) = 'android';
      (PermissionsAndroid.request as jest.Mock).mockRejectedValue(
        new Error('Permission error'),
      );

      await expect(audioService.requestPermission()).rejects.toThrow(
        AudioServiceError,
      );
      await expect(audioService.requestPermission()).rejects.toMatchObject({
        type: AudioErrorType.PERMISSION_DENIED,
      });
    });
  });

  describe('startRecording', () => {
    it('should initialize and start recording', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      await audioService.startRecording();

      expect(AudioRecord.init).toHaveBeenCalledWith({
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: 'audio.wav',
      });
      expect(AudioRecord.on).toHaveBeenCalledWith('data', expect.any(Function));
      expect(AudioRecord.start).toHaveBeenCalled();
      expect(audioService.getRecordingStatus()).toBe(true);
    });

    it('should not reinitialize if already initialized', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      // Start recording twice
      await audioService.startRecording();
      await audioService.stopRecording();

      jest.clearAllMocks();

      await audioService.startRecording();

      // init should not be called again
      expect(AudioRecord.init).not.toHaveBeenCalled();
      expect(AudioRecord.start).toHaveBeenCalled();
    });

    it('should throw error if already recording', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      await audioService.startRecording();

      await expect(audioService.startRecording()).rejects.toThrow(
        AudioServiceError,
      );
      await expect(audioService.startRecording()).rejects.toMatchObject({
        type: AudioErrorType.ALREADY_RECORDING,
      });
    });

    it('should handle permission denied error', async () => {
      (AudioRecord.start as jest.Mock).mockRejectedValue(
        new Error('Microphone permission denied'),
      );

      await expect(audioService.startRecording()).rejects.toThrow(
        AudioServiceError,
      );
      await expect(audioService.startRecording()).rejects.toMatchObject({
        type: AudioErrorType.PERMISSION_DENIED,
        message: expect.stringContaining('permission'),
      });
      expect(audioService.getRecordingStatus()).toBe(false);
    });

    it('should handle recording failure', async () => {
      (AudioRecord.start as jest.Mock).mockRejectedValue(
        new Error('Recording failed'),
      );

      await expect(audioService.startRecording()).rejects.toThrow(
        AudioServiceError,
      );
      await expect(audioService.startRecording()).rejects.toMatchObject({
        type: AudioErrorType.RECORDING_FAILED,
      });
      expect(audioService.getRecordingStatus()).toBe(false);
    });
  });

  describe('stopRecording', () => {
    it('should stop recording', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);
      (AudioRecord.stop as jest.Mock).mockResolvedValue('path/to/file.wav');

      await audioService.startRecording();
      await audioService.stopRecording();

      expect(AudioRecord.stop).toHaveBeenCalled();
      expect(audioService.getRecordingStatus()).toBe(false);
    });

    it('should throw error if not recording', async () => {
      await expect(audioService.stopRecording()).rejects.toThrow(
        AudioServiceError,
      );
      await expect(audioService.stopRecording()).rejects.toMatchObject({
        type: AudioErrorType.NOT_RECORDING,
      });
    });

    it('should handle stop recording failure', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);
      (AudioRecord.stop as jest.Mock).mockRejectedValue(
        new Error('Stop failed'),
      );

      await audioService.startRecording();

      await expect(audioService.stopRecording()).rejects.toThrow(
        AudioServiceError,
      );
      await expect(audioService.stopRecording()).rejects.toMatchObject({
        type: AudioErrorType.RECORDING_FAILED,
      });
    });
  });

  describe('onAudioSample', () => {
    it('should register and invoke audio sample callback', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      const mockCallback = jest.fn();
      audioService.onAudioSample(mockCallback);

      await audioService.startRecording();

      // Simulate audio data event with base64 encoded PCM data
      // Create a simple audio sample: 4 samples of 16-bit PCM
      const pcmData = new Int16Array([100, -100, 200, -200]);
      const uint8Array = new Uint8Array(pcmData.buffer);
      const base64Data = Buffer.from(uint8Array).toString('base64');

      audioDataCallback?.(base64Data);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          samples: expect.any(Float32Array),
          sampleRate: 44100,
          timestamp: expect.any(Date),
        }),
      );

      // Verify the samples are normalized correctly
      const receivedSample: AudioSample = mockCallback.mock.calls[0][0];
      expect(receivedSample.samples.length).toBe(4);
      expect(receivedSample.samples[0]).toBeCloseTo(100 / 32768, 5);
      expect(receivedSample.samples[1]).toBeCloseTo(-100 / 32768, 5);
    });

    it('should support multiple callbacks', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();

      audioService.onAudioSample(mockCallback1);
      audioService.onAudioSample(mockCallback2);

      await audioService.startRecording();

      // Simulate audio data
      const base64Data = Buffer.from(new Int16Array([100]).buffer).toString(
        'base64',
      );
      audioDataCallback?.(base64Data);

      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      const mockCallback = jest.fn();
      const unsubscribe = audioService.onAudioSample(mockCallback);

      await audioService.startRecording();

      // First event - callback should be called
      const base64Data = Buffer.from(new Int16Array([100]).buffer).toString(
        'base64',
      );
      audioDataCallback?.(base64Data);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();

      // Second event - callback should not be called
      audioDataCallback?.(base64Data);
      expect(mockCallback).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it('should handle errors in callback without crashing', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });
      const goodCallback = jest.fn();

      audioService.onAudioSample(errorCallback);
      audioService.onAudioSample(goodCallback);

      await audioService.startRecording();

      // Simulate audio data - should not throw despite error in callback
      const base64Data = Buffer.from(new Int16Array([100]).buffer).toString(
        'base64',
      );

      expect(() => {
        audioDataCallback?.(base64Data);
      }).not.toThrow();

      expect(errorCallback).toHaveBeenCalled();
      expect(goodCallback).toHaveBeenCalled();
    });
  });

  describe('base64ToFloat32Array conversion', () => {
    it('should correctly convert base64 PCM data to Float32Array', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      const mockCallback = jest.fn();
      audioService.onAudioSample(mockCallback);

      await audioService.startRecording();

      // Create known PCM samples
      // Max positive value: 32767, Max negative value: -32768
      const pcmData = new Int16Array([0, 16384, -16384, 32767, -32768]);
      const uint8Array = new Uint8Array(pcmData.buffer);
      const base64Data = Buffer.from(uint8Array).toString('base64');

      audioDataCallback?.(base64Data);

      const receivedSample: AudioSample = mockCallback.mock.calls[0][0];
      const samples = receivedSample.samples;

      expect(samples.length).toBe(5);
      expect(samples[0]).toBeCloseTo(0.0, 5); // 0 / 32768
      expect(samples[1]).toBeCloseTo(0.5, 2); // 16384 / 32768
      expect(samples[2]).toBeCloseTo(-0.5, 2); // -16384 / 32768
      expect(samples[3]).toBeCloseTo(1.0, 2); // 32767 / 32768 ≈ 1.0
      expect(samples[4]).toBe(-1.0); // -32768 / 32768 = -1.0
    });
  });

  describe('getRecordingStatus', () => {
    it('should return false initially', () => {
      expect(audioService.getRecordingStatus()).toBe(false);
    });

    it('should return true when recording', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      await audioService.startRecording();

      expect(audioService.getRecordingStatus()).toBe(true);
    });

    it('should return false after stopping', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);
      (AudioRecord.stop as jest.Mock).mockResolvedValue('path');

      await audioService.startRecording();
      await audioService.stopRecording();

      expect(audioService.getRecordingStatus()).toBe(false);
    });
  });

  describe('getConfig', () => {
    it('should return audio configuration', () => {
      const config = audioService.getConfig();

      expect(config).toEqual({
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16,
      });
    });

    it('should return immutable config', () => {
      const config1 = audioService.getConfig();
      const config2 = audioService.getConfig();

      expect(config1).not.toBe(config2); // Different objects
      expect(config1).toEqual(config2); // Same values
    });
  });

  describe('clearCallbacks', () => {
    it('should remove all registered callbacks', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);

      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();

      audioService.onAudioSample(mockCallback1);
      audioService.onAudioSample(mockCallback2);

      await audioService.startRecording();

      // Clear callbacks
      audioService.clearCallbacks();

      // Simulate audio data
      const base64Data = Buffer.from(new Int16Array([100]).buffer).toString(
        'base64',
      );
      audioDataCallback?.(base64Data);

      // Callbacks should not be invoked
      expect(mockCallback1).not.toHaveBeenCalled();
      expect(mockCallback2).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should stop recording and cleanup', async () => {
      (AudioRecord.start as jest.Mock).mockResolvedValue(undefined);
      (AudioRecord.stop as jest.Mock).mockResolvedValue('path');

      const mockCallback = jest.fn();
      audioService.onAudioSample(mockCallback);

      await audioService.startRecording();
      await audioService.cleanup();

      expect(AudioRecord.stop).toHaveBeenCalled();
      expect(audioService.getRecordingStatus()).toBe(false);

      // Callbacks should be cleared
      const base64Data = Buffer.from(new Int16Array([100]).buffer).toString(
        'base64',
      );
      audioDataCallback?.(base64Data);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should not throw if not recording', async () => {
      await expect(audioService.cleanup()).resolves.not.toThrow();
    });
  });

  describe('AudioServiceError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Original');
      const error = new AudioServiceError(
        AudioErrorType.PERMISSION_DENIED,
        'Test message',
        originalError,
      );

      expect(error.name).toBe('AudioServiceError');
      expect(error.type).toBe(AudioErrorType.PERMISSION_DENIED);
      expect(error.message).toBe('Test message');
      expect(error.originalError).toBe(originalError);
    });
  });
});
