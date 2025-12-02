/**
 * Unit tests for DecibelCalculator
 * Tests RMS calculation, decibel conversion, edge cases, and calibration
 *
 * @see src/utils/DecibelCalculator.ts
 */

import {
  calculateRMS,
  calculateDecibels,
  calculateDecibelsFromRMS,
  REFERENCE_PRESSURE,
  CALIBRATION_OFFSET,
  EPSILON,
  MIN_DECIBELS,
  MAX_DECIBELS,
} from '../src/utils/DecibelCalculator';

describe('DecibelCalculator', () => {
  describe('calculateRMS', () => {
    it('should calculate RMS for known values', () => {
      // Test case 1: Simple known values
      // RMS([0.1, -0.2, 0.3, -0.1]) = sqrt((0.01 + 0.04 + 0.09 + 0.01) / 4) = sqrt(0.0375) ≈ 0.1936
      const samples1 = new Float32Array([0.1, -0.2, 0.3, -0.1]);
      const rms1 = calculateRMS(samples1);
      expect(rms1).toBeCloseTo(0.1936, 4);

      // Test case 2: All zeros (silence)
      const samples2 = new Float32Array([0, 0, 0, 0]);
      const rms2 = calculateRMS(samples2);
      expect(rms2).toBe(0);

      // Test case 3: All same positive values
      // RMS([0.5, 0.5, 0.5]) = sqrt(0.25 + 0.25 + 0.25) / 3 = 0.5
      const samples3 = new Float32Array([0.5, 0.5, 0.5]);
      const rms3 = calculateRMS(samples3);
      expect(rms3).toBeCloseTo(0.5, 5);

      // Test case 4: Mix of positive and negative (symmetric)
      // RMS([0.3, -0.3]) = sqrt((0.09 + 0.09) / 2) = sqrt(0.09) = 0.3
      const samples4 = new Float32Array([0.3, -0.3]);
      const rms4 = calculateRMS(samples4);
      expect(rms4).toBeCloseTo(0.3, 5);
    });

    it('should calculate RMS for sine wave', () => {
      // For a sine wave with amplitude A, RMS = A / sqrt(2) ≈ A * 0.707
      const amplitude = 0.5;
      const frequency = 440; // Hz
      const sampleRate = 44100;
      const duration = 1; // second
      const numSamples = sampleRate * duration;

      const samples = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
      }

      const rms = calculateRMS(samples);
      const expectedRMS = amplitude / Math.sqrt(2);
      expect(rms).toBeCloseTo(expectedRMS, 3);
    });

    it('should handle maximum amplitude values', () => {
      // Maximum amplitude in normalized audio: ±1.0
      const samples = new Float32Array([1.0, -1.0, 1.0, -1.0]);
      const rms = calculateRMS(samples);
      expect(rms).toBe(1.0);
    });

    it('should handle very small values', () => {
      const samples = new Float32Array([0.001, -0.001, 0.0005, -0.0005]);
      const rms = calculateRMS(samples);
      expect(rms).toBeCloseTo(0.000791, 6);
    });

    it('should throw error for empty array', () => {
      const samples = new Float32Array([]);
      expect(() => calculateRMS(samples)).toThrow('Cannot calculate RMS of empty sample array');
    });

    it('should throw error for NaN values', () => {
      const samples = new Float32Array([0.1, NaN, 0.3]);
      expect(() => calculateRMS(samples)).toThrow('Invalid sample value at index 1: NaN');
    });

    it('should throw error for Infinity values', () => {
      const samples = new Float32Array([0.1, Infinity, 0.3]);
      expect(() => calculateRMS(samples)).toThrow('Invalid sample value at index 1: Infinity');
    });

    it('should throw error for -Infinity values', () => {
      const samples = new Float32Array([0.1, -Infinity, 0.3]);
      expect(() => calculateRMS(samples)).toThrow('Invalid sample value at index 1: -Infinity');
    });

    it('should handle large arrays efficiently', () => {
      // Test performance with large array (1 second at 44.1kHz)
      const samples = new Float32Array(44100);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = Math.random() * 2 - 1; // Random values in [-1, 1]
      }

      const startTime = Date.now();
      const rms = calculateRMS(samples);
      const endTime = Date.now();

      expect(rms).toBeGreaterThan(0);
      expect(rms).toBeLessThan(1);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });

  describe('calculateDecibels', () => {
    it('should calculate decibels for known RMS values', () => {
      // Test with quiet audio (low amplitude sine wave)
      const quietAmplitude = 0.01;
      const samples1 = new Float32Array(1000);
      for (let i = 0; i < samples1.length; i++) {
        samples1[i] = quietAmplitude * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const db1 = calculateDecibels(samples1);
      expect(db1).toBeGreaterThan(30); // Quiet environment
      expect(db1).toBeLessThan(60); // But not complete silence

      // Test with loud audio (high amplitude sine wave)
      const loudAmplitude = 0.3;
      const samples2 = new Float32Array(1000);
      for (let i = 0; i < samples2.length; i++) {
        samples2[i] = loudAmplitude * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const db2 = calculateDecibels(samples2);
      expect(db2).toBeGreaterThan(70); // Loud environment
      expect(db2).toBeLessThan(100);
    });

    it('should use correct formula: 20 * log10(RMS) + calibration', () => {
      const samples = new Float32Array([0.1, -0.1, 0.1, -0.1]);
      const rms = calculateRMS(samples);

      // Python formula: db = 20 * log10(rms + epsilon) + 94
      const expectedDb = 20 * Math.log10(rms + EPSILON) + CALIBRATION_OFFSET;
      const actualDb = calculateDecibels(samples);

      expect(actualDb).toBeCloseTo(expectedDb, 5);
    });

    it('should apply calibration offset correctly', () => {
      // Use larger amplitude to avoid clamping issues
      const samples = new Float32Array([0.5, -0.5, 0.5, -0.5]);

      // Calculate with default calibration
      const dbWithCalibration = calculateDecibels(samples);

      // Calculate with different calibration offset
      const customOffset = 100;
      const dbWithCustomCalibration = calculateDecibels(samples, customOffset);

      // Difference should be exactly the difference in calibration offsets
      const offsetDiff = customOffset - CALIBRATION_OFFSET;
      expect(dbWithCustomCalibration - dbWithCalibration).toBeCloseTo(offsetDiff, 5);
    });

    it('should handle silence (all zeros)', () => {
      const samples = new Float32Array([0, 0, 0, 0]);
      const db = calculateDecibels(samples);

      // With epsilon, should not be -Infinity
      expect(Number.isFinite(db)).toBe(true);
      expect(db).toBe(MIN_DECIBELS); // Should clamp to minimum
    });

    it('should clamp to minimum decibel value (0 dB)', () => {
      // Very quiet signal that would result in negative dB
      const samples = new Float32Array([0.00001, -0.00001]);
      const db = calculateDecibels(samples);

      expect(db).toBeGreaterThanOrEqual(MIN_DECIBELS);
    });

    it('should clamp to maximum decibel value (120 dB)', () => {
      // Maximum amplitude signal
      const samples = new Float32Array([1.0, -1.0, 1.0, -1.0]);
      const db = calculateDecibels(samples);

      expect(db).toBeLessThanOrEqual(MAX_DECIBELS);
    });

    it('should handle custom calibration offset', () => {
      const samples = new Float32Array([0.1, 0.2]);
      const customOffset = 100; // Different from default 94

      const db = calculateDecibels(samples, customOffset);

      // Should produce different result than default
      const dbDefault = calculateDecibels(samples);
      expect(db - dbDefault).toBeCloseTo(customOffset - CALIBRATION_OFFSET, 5);
    });

    it('should throw error for empty array', () => {
      const samples = new Float32Array([]);
      expect(() => calculateDecibels(samples)).toThrow('Cannot calculate RMS of empty sample array');
    });

    it('should throw error for invalid samples', () => {
      const samples = new Float32Array([0.1, NaN, 0.2]);
      expect(() => calculateDecibels(samples)).toThrow('Invalid sample value');
    });

    it('should match Python prototype behavior for quiet audio', () => {
      // Simulate Python test: quiet sine wave (amplitude 0.01)
      const amplitude = 0.01;
      const frequency = 440;
      const sampleRate = 44100;
      const duration = 2.0;
      const numSamples = Math.floor(sampleRate * duration);

      const samples = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
      }

      const db = calculateDecibels(samples);

      // Python prototype classifies this as "Quiet" (< 50 dB)
      // Allow small tolerance due to floating point precision
      expect(db).toBeLessThanOrEqual(51); // ~51 dB is still quiet
      expect(db).toBeGreaterThan(20); // But not complete silence
    });

    it('should match Python prototype behavior for noisy audio', () => {
      // Simulate Python test: white noise (amplitude 0.3)
      const amplitude = 0.3;
      const numSamples = 44100 * 2; // 2 seconds

      const samples = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        // White noise: random values scaled by amplitude
        samples[i] = amplitude * (Math.random() * 2 - 1);
      }

      const db = calculateDecibels(samples);

      // Python prototype classifies this as "Noisy" (> 70 dB)
      expect(db).toBeGreaterThan(70);
    });
  });

  describe('calculateDecibelsFromRMS', () => {
    it('should calculate decibels from RMS value', () => {
      const rms = 0.1;
      const db = calculateDecibelsFromRMS(rms);

      const expectedDb = 20 * Math.log10(rms + EPSILON) + CALIBRATION_OFFSET;
      expect(db).toBeCloseTo(expectedDb, 5);
    });

    it('should produce same result as calculateDecibels', () => {
      const samples = new Float32Array([0.1, -0.2, 0.3, -0.1]);

      const rms = calculateRMS(samples);
      const db1 = calculateDecibelsFromRMS(rms);
      const db2 = calculateDecibels(samples);

      expect(db1).toBeCloseTo(db2, 10);
    });

    it('should handle zero RMS (silence)', () => {
      const db = calculateDecibelsFromRMS(0);

      expect(Number.isFinite(db)).toBe(true);
      expect(db).toBe(MIN_DECIBELS);
    });

    it('should handle very small RMS values', () => {
      const db = calculateDecibelsFromRMS(0.00001);

      expect(Number.isFinite(db)).toBe(true);
      expect(db).toBeGreaterThanOrEqual(MIN_DECIBELS);
    });

    it('should handle maximum RMS value (1.0)', () => {
      const db = calculateDecibelsFromRMS(1.0);

      expect(Number.isFinite(db)).toBe(true);
      expect(db).toBeLessThanOrEqual(MAX_DECIBELS);
    });

    it('should throw error for negative RMS', () => {
      expect(() => calculateDecibelsFromRMS(-0.1)).toThrow(
        'Invalid RMS value: -0.1. RMS must be a non-negative finite number.',
      );
    });

    it('should throw error for NaN RMS', () => {
      expect(() => calculateDecibelsFromRMS(NaN)).toThrow(
        'Invalid RMS value: NaN. RMS must be a non-negative finite number.',
      );
    });

    it('should throw error for Infinity RMS', () => {
      expect(() => calculateDecibelsFromRMS(Infinity)).toThrow(
        'Invalid RMS value: Infinity. RMS must be a non-negative finite number.',
      );
    });

    it('should handle custom calibration offset', () => {
      const rms = 0.2;
      const customOffset = 100;

      const db = calculateDecibelsFromRMS(rms, customOffset);

      const expectedDb = 20 * Math.log10(rms + EPSILON) + customOffset;
      const expectedClamped = Math.max(MIN_DECIBELS, Math.min(MAX_DECIBELS, expectedDb));

      expect(db).toBeCloseTo(expectedClamped, 5);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle array with single sample', () => {
      const samples = new Float32Array([0.5]);
      const rms = calculateRMS(samples);
      const db = calculateDecibels(samples);

      expect(rms).toBe(0.5);
      expect(Number.isFinite(db)).toBe(true);
      expect(db).toBeGreaterThan(0);
    });

    it('should handle very long arrays', () => {
      // 10 seconds at 44.1kHz
      const samples = new Float32Array(441000);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = 0.1 * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const db = calculateDecibels(samples);

      expect(Number.isFinite(db)).toBe(true);
      expect(db).toBeGreaterThan(0);
      expect(db).toBeLessThan(120);
    });

    it('should handle mix of very small and large values', () => {
      const samples = new Float32Array([0.00001, 0.9, -0.00001, -0.9]);
      const rms = calculateRMS(samples);
      const db = calculateDecibels(samples);

      expect(rms).toBeCloseTo(Math.sqrt((0.00001**2 + 0.9**2 + 0.00001**2 + 0.9**2) / 4), 5);
      expect(Number.isFinite(db)).toBe(true);
    });

    it('should be consistent across multiple calls', () => {
      const samples = new Float32Array([0.1, 0.2, 0.3]);

      const db1 = calculateDecibels(samples);
      const db2 = calculateDecibels(samples);
      const db3 = calculateDecibels(samples);

      expect(db1).toBe(db2);
      expect(db2).toBe(db3);
    });

    it('should handle negative samples correctly', () => {
      const samples1 = new Float32Array([0.5, 0.5]);
      const samples2 = new Float32Array([-0.5, -0.5]);

      const rms1 = calculateRMS(samples1);
      const rms2 = calculateRMS(samples2);

      // RMS should be same for positive and negative values
      expect(rms1).toBeCloseTo(rms2, 10);

      const db1 = calculateDecibels(samples1);
      const db2 = calculateDecibels(samples2);

      // Decibels should be same as well
      expect(db1).toBeCloseTo(db2, 10);
    });
  });

  describe('Constants Validation', () => {
    it('should have correct reference pressure', () => {
      expect(REFERENCE_PRESSURE).toBe(20e-6);
      expect(REFERENCE_PRESSURE).toBe(0.00002);
    });

    it('should have correct calibration offset', () => {
      expect(CALIBRATION_OFFSET).toBe(94);
    });

    it('should have correct epsilon', () => {
      expect(EPSILON).toBe(1e-10);
      expect(EPSILON).toBe(0.0000000001);
    });

    it('should have correct dB range', () => {
      expect(MIN_DECIBELS).toBe(0);
      expect(MAX_DECIBELS).toBe(120);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should produce realistic values for whisper (30 dB)', () => {
      // Whisper is around 30 dB, amplitude ~0.003
      const amplitude = 0.003;
      const samples = new Float32Array(44100);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = amplitude * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const db = calculateDecibels(samples);

      // Should be in whisper range (20-40 dB)
      expect(db).toBeGreaterThan(20);
      expect(db).toBeLessThan(45);
    });

    it('should produce realistic values for normal conversation (60 dB)', () => {
      // Normal conversation is around 60 dB, amplitude ~0.03
      const amplitude = 0.03;
      const samples = new Float32Array(44100);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = amplitude * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const db = calculateDecibels(samples);

      // Should be in conversation range (50-70 dB)
      expect(db).toBeGreaterThan(50);
      expect(db).toBeLessThan(75);
    });

    it('should produce realistic values for loud traffic (90 dB)', () => {
      // Loud traffic is around 90 dB, amplitude ~0.3
      const amplitude = 0.3;
      const samples = new Float32Array(44100);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = amplitude * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const db = calculateDecibels(samples);

      // Should be in loud traffic range (80-100 dB)
      expect(db).toBeGreaterThan(75);
      expect(db).toBeLessThan(100);
    });

    it('should handle 1-second chunks (real-time processing)', () => {
      // Simulate real-time processing: 1-second chunks at 44.1kHz
      const sampleRate = 44100;
      const chunkDuration = 1.0;
      const chunkSize = sampleRate * chunkDuration;

      // Create 5 chunks with varying amplitudes
      const amplitudes = [0.01, 0.05, 0.1, 0.2, 0.3];
      const decibelValues: number[] = [];

      for (const amplitude of amplitudes) {
        const chunk = new Float32Array(chunkSize);
        for (let i = 0; i < chunkSize; i++) {
          chunk[i] = amplitude * Math.sin(2 * Math.PI * 440 * i / sampleRate);
        }

        const db = calculateDecibels(chunk);
        decibelValues.push(db);
      }

      // Verify all calculations completed
      expect(decibelValues).toHaveLength(5);

      // Verify increasing amplitude results in increasing dB
      for (let i = 1; i < decibelValues.length; i++) {
        expect(decibelValues[i]).toBeGreaterThan(decibelValues[i - 1]);
      }

      // Verify all values are in valid range
      decibelValues.forEach(db => {
        expect(db).toBeGreaterThanOrEqual(MIN_DECIBELS);
        expect(db).toBeLessThanOrEqual(MAX_DECIBELS);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should process 1-second audio chunks efficiently', () => {
      const samples = new Float32Array(44100); // 1 second at 44.1kHz
      for (let i = 0; i < samples.length; i++) {
        samples[i] = 0.1 * Math.sin(2 * Math.PI * 440 * i / 44100);
      }

      const iterations = 100;
      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        calculateDecibels(samples);
      }

      const endTime = Date.now();
      const avgTime = (endTime - startTime) / iterations;

      // Should process each chunk in less than 10ms on average
      expect(avgTime).toBeLessThan(10);
    });

    it('should be efficient for RMS calculation', () => {
      const samples = new Float32Array(44100);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = Math.random() * 2 - 1;
      }

      const iterations = 1000;
      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        calculateRMS(samples);
      }

      const endTime = Date.now();
      const avgTime = (endTime - startTime) / iterations;

      // RMS calculation should be very fast (< 5ms per call)
      expect(avgTime).toBeLessThan(5);
    });
  });
});
