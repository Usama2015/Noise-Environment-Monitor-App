/**
 * MovingAverageFilter Tests
 *
 * Comprehensive test suite for moving average filter implementation.
 * Tests both streaming (class) and batch (function) approaches.
 *
 * @see src/utils/MovingAverageFilter.ts
 */

import {
  MovingAverageFilter,
  applyMovingAverage,
  applyMovingAverageConvolution,
} from '../src/utils/MovingAverageFilter';

describe('MovingAverageFilter (Class)', () => {
  describe('Constructor', () => {
    it('should create filter with default window size', () => {
      const filter = new MovingAverageFilter();
      expect(filter.getWindowSize()).toBe(10);
    });

    it('should create filter with custom window size', () => {
      const filter = new MovingAverageFilter(5);
      expect(filter.getWindowSize()).toBe(5);
    });

    it('should throw error for invalid window size (zero)', () => {
      expect(() => new MovingAverageFilter(0)).toThrow(
        'Window size must be a positive integer',
      );
    });

    it('should throw error for invalid window size (negative)', () => {
      expect(() => new MovingAverageFilter(-5)).toThrow(
        'Window size must be a positive integer',
      );
    });

    it('should throw error for invalid window size (float)', () => {
      expect(() => new MovingAverageFilter(3.5)).toThrow(
        'Window size must be a positive integer',
      );
    });
  });

  describe('add() - Basic Functionality', () => {
    it('should return the value itself when only one value added', () => {
      const filter = new MovingAverageFilter(3);
      expect(filter.add(50)).toBe(50);
    });

    it('should calculate average of two values', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      expect(filter.add(60)).toBe(55); // (50 + 60) / 2
    });

    it('should calculate average of three values', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      expect(filter.add(70)).toBe(60); // (50 + 60 + 70) / 3
    });

    it('should implement sliding window after buffer is full', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50); // [50] -> avg = 50
      filter.add(60); // [50, 60] -> avg = 55
      filter.add(70); // [50, 60, 70] -> avg = 60
      expect(filter.add(80)).toBe(70); // [60, 70, 80] -> avg = 70
    });

    it('should maintain correct buffer size', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      filter.add(70);
      filter.add(80);
      expect(filter.getBufferLength()).toBe(3);
      expect(filter.getBuffer()).toEqual([60, 70, 80]);
    });

    it('should throw error for NaN value', () => {
      const filter = new MovingAverageFilter(3);
      expect(() => filter.add(NaN)).toThrow(
        'Invalid value: NaN. Value must be a finite number.',
      );
    });

    it('should throw error for Infinity value', () => {
      const filter = new MovingAverageFilter(3);
      expect(() => filter.add(Infinity)).toThrow(
        'Invalid value: Infinity. Value must be a finite number.',
      );
    });

    it('should handle negative values', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(-10);
      filter.add(-20);
      expect(filter.add(-30)).toBe(-20); // (-10 + -20 + -30) / 3
    });

    it('should handle zero values', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(0);
      filter.add(0);
      expect(filter.add(0)).toBe(0);
    });

    it('should handle mixed positive and negative values', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(-50);
      expect(filter.add(0)).toBe(0); // (50 + -50 + 0) / 3
    });
  });

  describe('add() - Real-world Scenarios', () => {
    it('should smooth out a spike in decibel readings', () => {
      const filter = new MovingAverageFilter(3);
      const raw = [50, 50, 90, 50, 50];
      const smoothed: number[] = [];

      for (const value of raw) {
        smoothed.push(filter.add(value));
      }

      // First value: 50
      expect(smoothed[0]).toBe(50);
      // Second value: (50 + 50) / 2 = 50
      expect(smoothed[1]).toBe(50);
      // Third value: (50 + 50 + 90) / 3 = 63.333...
      expect(smoothed[2]).toBeCloseTo(63.33, 2);
      // Fourth value: (50 + 90 + 50) / 3 = 63.333...
      expect(smoothed[3]).toBeCloseTo(63.33, 2);
      // Fifth value: (90 + 50 + 50) / 3 = 63.333...
      expect(smoothed[4]).toBeCloseTo(63.33, 2);

      // Spike is reduced from 90 to ~63
      expect(Math.max(...smoothed)).toBeLessThan(70);
    });

    it('should smooth gradual changes', () => {
      const filter = new MovingAverageFilter(5);
      const raw = [50, 52, 54, 56, 58, 60];
      const smoothed: number[] = [];

      for (const value of raw) {
        smoothed.push(filter.add(value));
      }

      // Last value should be close to 56 (average of 52, 54, 56, 58, 60)
      expect(smoothed[smoothed.length - 1]).toBe(56);
    });

    it('should handle constant values', () => {
      const filter = new MovingAverageFilter(5);
      const raw = [60, 60, 60, 60, 60, 60];
      const smoothed: number[] = [];

      for (const value of raw) {
        smoothed.push(filter.add(value));
      }

      // All smoothed values should be 60
      smoothed.forEach(value => {
        expect(value).toBe(60);
      });
    });

    it('should respond to sudden changes', () => {
      const filter = new MovingAverageFilter(5);

      // Start at 50 dB
      filter.add(50);
      filter.add(50);
      filter.add(50);
      filter.add(50);
      filter.add(50);

      // Sudden jump to 80 dB
      const after1 = filter.add(80); // [50, 50, 50, 50, 80] -> 56
      const after2 = filter.add(80); // [50, 50, 50, 80, 80] -> 62
      const after3 = filter.add(80); // [50, 50, 80, 80, 80] -> 68

      expect(after1).toBe(56);
      expect(after2).toBe(62);
      expect(after3).toBe(68);
    });
  });

  describe('reset()', () => {
    it('should clear buffer', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      filter.add(70);

      filter.reset();

      expect(filter.getBufferLength()).toBe(0);
      expect(filter.getBuffer()).toEqual([]);
    });

    it('should allow adding values after reset', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      filter.reset();

      expect(filter.add(100)).toBe(100);
      expect(filter.add(200)).toBe(150); // (100 + 200) / 2
    });
  });

  describe('getBuffer()', () => {
    it('should return copy of buffer', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);

      const buffer1 = filter.getBuffer();
      buffer1.push(999); // Modify copy

      const buffer2 = filter.getBuffer();
      expect(buffer2).toEqual([50, 60]); // Original unchanged
    });

    it('should return empty array for new filter', () => {
      const filter = new MovingAverageFilter(3);
      expect(filter.getBuffer()).toEqual([]);
    });
  });

  describe('isFull()', () => {
    it('should return false for empty buffer', () => {
      const filter = new MovingAverageFilter(3);
      expect(filter.isFull()).toBe(false);
    });

    it('should return false for partially filled buffer', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      expect(filter.isFull()).toBe(false);
    });

    it('should return true for full buffer', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      filter.add(70);
      expect(filter.isFull()).toBe(true);
    });

    it('should remain true after sliding window starts', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      filter.add(70);
      filter.add(80);
      expect(filter.isFull()).toBe(true);
    });
  });

  describe('getCurrentAverage()', () => {
    it('should return 0 for empty buffer', () => {
      const filter = new MovingAverageFilter(3);
      expect(filter.getCurrentAverage()).toBe(0);
    });

    it('should return current average without adding', () => {
      const filter = new MovingAverageFilter(3);
      filter.add(50);
      filter.add(60);
      filter.add(70);

      expect(filter.getCurrentAverage()).toBe(60);
      expect(filter.getBufferLength()).toBe(3); // No change
    });
  });

  describe('Performance', () => {
    it('should handle 1000 values efficiently', () => {
      const filter = new MovingAverageFilter(10);
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        filter.add(Math.random() * 100);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50); // Should be very fast
    });

    it('should handle large window size efficiently', () => {
      const filter = new MovingAverageFilter(100);
      const start = performance.now();

      for (let i = 0; i < 500; i++) {
        filter.add(Math.random() * 100);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});

describe('applyMovingAverage (Function)', () => {
  describe('Basic Functionality', () => {
    it('should return copy of data if shorter than window size', () => {
      const data = [50, 60];
      const result = applyMovingAverage(data, 5);

      expect(result).toEqual([50, 60]);
      expect(result).not.toBe(data); // Different array instance
    });

    it('should smooth data with window size 3', () => {
      const data = [50, 50, 90, 50, 50];
      const result = applyMovingAverage(data, 3);

      expect(result[0]).toBe(50); // avg([50])
      expect(result[1]).toBe(50); // avg([50, 50])
      expect(result[2]).toBeCloseTo(63.33, 2); // avg([50, 50, 90])
      expect(result[3]).toBeCloseTo(63.33, 2); // avg([50, 90, 50])
      expect(result[4]).toBeCloseTo(63.33, 2); // avg([90, 50, 50])
    });

    it('should smooth data with window size 5', () => {
      const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const result = applyMovingAverage(data, 5);

      // Middle values should be average of 5 consecutive values
      expect(result[4]).toBe(30); // avg([10, 20, 30, 40, 50])
      expect(result[5]).toBe(40); // avg([20, 30, 40, 50, 60])
      expect(result[6]).toBe(50); // avg([30, 40, 50, 60, 70])
    });

    it('should handle empty array', () => {
      const data: number[] = [];
      const result = applyMovingAverage(data, 5);
      expect(result).toEqual([]);
    });

    it('should handle single value', () => {
      const data = [50];
      const result = applyMovingAverage(data, 5);
      expect(result).toEqual([50]);
    });

    it('should throw error for invalid window size (zero)', () => {
      const data = [50, 60, 70];
      expect(() => applyMovingAverage(data, 0)).toThrow(
        'Window size must be a positive integer',
      );
    });

    it('should throw error for invalid window size (negative)', () => {
      const data = [50, 60, 70];
      expect(() => applyMovingAverage(data, -3)).toThrow(
        'Window size must be a positive integer',
      );
    });

    it('should throw error for invalid window size (float)', () => {
      const data = [50, 60, 70];
      expect(() => applyMovingAverage(data, 2.5)).toThrow(
        'Window size must be a positive integer',
      );
    });

    it('should throw error for NaN in data', () => {
      const data = [50, NaN, 70];
      expect(() => applyMovingAverage(data, 3)).toThrow(
        'Invalid value at index 1: NaN',
      );
    });

    it('should throw error for Infinity in data', () => {
      const data = [50, 60, Infinity];
      expect(() => applyMovingAverage(data, 3)).toThrow(
        'Invalid value at index 2: Infinity',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle all zeros', () => {
      const data = [0, 0, 0, 0, 0];
      const result = applyMovingAverage(data, 3);

      result.forEach(value => {
        expect(value).toBe(0);
      });
    });

    it('should handle negative values', () => {
      const data = [-10, -20, -30, -40, -50];
      const result = applyMovingAverage(data, 3);

      expect(result[2]).toBe(-20); // avg([-10, -20, -30])
      expect(result[3]).toBe(-30); // avg([-20, -30, -40])
    });

    it('should handle mixed positive and negative', () => {
      const data = [50, -50, 50, -50, 50];
      const result = applyMovingAverage(data, 3);

      expect(result[2]).toBeCloseTo(16.67, 2); // avg([50, -50, 50])
    });

    it('should handle very large values', () => {
      const data = [1e6, 2e6, 3e6, 4e6, 5e6];
      const result = applyMovingAverage(data, 3);

      expect(result[2]).toBe(2e6); // avg([1e6, 2e6, 3e6])
    });

    it('should handle very small values', () => {
      const data = [1e-6, 2e-6, 3e-6, 4e-6, 5e-6];
      const result = applyMovingAverage(data, 3);

      expect(result[2]).toBeCloseTo(2e-6, 10);
    });
  });

  describe('Comparison with Class Implementation', () => {
    it('should produce same results as streaming filter', () => {
      const data = [50, 55, 60, 65, 70, 75, 80];
      const windowSize = 3;

      // Batch processing
      const batchResult = applyMovingAverage(data, windowSize);

      // Streaming processing
      const filter = new MovingAverageFilter(windowSize);
      const streamResult = data.map(value => filter.add(value));

      // Results should match
      for (let i = 0; i < data.length; i++) {
        expect(batchResult[i]).toBeCloseTo(streamResult[i], 10);
      }
    });
  });

  describe('Real-world Scenarios', () => {
    it('should smooth decibel readings with spikes', () => {
      // Simulated decibel readings with occasional spikes
      const data = [60, 61, 59, 95, 62, 60, 58, 85, 61, 60];
      const result = applyMovingAverage(data, 5);

      // Spikes at index 3 and 7 should be smoothed
      expect(result[3]).toBeLessThan(90);
      expect(result[7]).toBeLessThan(80);
    });

    it('should preserve gradual trends', () => {
      // Gradual increase in noise level
      const data = [50, 52, 54, 56, 58, 60, 62, 64, 66, 68];
      const result = applyMovingAverage(data, 3);

      // Should maintain increasing trend
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
      }
    });
  });

  describe('Performance', () => {
    it('should handle large arrays efficiently', () => {
      const data = new Array(10000).fill(0).map(() => Math.random() * 100);

      const start = performance.now();
      applyMovingAverage(data, 10);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500); // Should complete in < 500ms
    });
  });
});

describe('applyMovingAverageConvolution (Function)', () => {
  describe('Basic Functionality', () => {
    it('should return copy of data if shorter than window size', () => {
      const data = [50, 60];
      const result = applyMovingAverageConvolution(data, 5);

      expect(result).toEqual([50, 60]);
      expect(result).not.toBe(data);
    });

    it('should smooth data similar to standard implementation', () => {
      const data = [50, 50, 90, 50, 50];
      const result = applyMovingAverageConvolution(data, 3);

      // Should reduce spike
      expect(Math.max(...result)).toBeLessThan(90);
    });

    it('should throw error for invalid window size', () => {
      const data = [50, 60, 70];
      expect(() => applyMovingAverageConvolution(data, 0)).toThrow(
        'Window size must be a positive integer',
      );
    });

    it('should throw error for NaN in data', () => {
      const data = [50, NaN, 70];
      expect(() => applyMovingAverageConvolution(data, 3)).toThrow(
        'Invalid value at index 1: NaN',
      );
    });
  });

  describe('Comparison with Standard Implementation', () => {
    it('should both smooth out spikes', () => {
      const data = [50, 50, 90, 50, 50];
      const windowSize = 3;

      const standard = applyMovingAverage(data, windowSize);
      const convolution = applyMovingAverageConvolution(data, windowSize);

      // Both should reduce the spike at index 2
      expect(standard[2]).toBeLessThan(90);
      expect(convolution[2]).toBeLessThan(90);

      // Both should produce smoothed values
      expect(Math.max(...standard)).toBeLessThan(90);
      expect(Math.max(...convolution)).toBeLessThan(90);
    });

    it('should both return arrays of same length', () => {
      const data = [50, 55, 60, 65, 70, 75, 80];
      const windowSize = 5;

      const standard = applyMovingAverage(data, windowSize);
      const convolution = applyMovingAverageConvolution(data, windowSize);

      expect(standard.length).toBe(data.length);
      expect(convolution.length).toBe(data.length);
    });

    it('should both handle constant values identically', () => {
      const data = [60, 60, 60, 60, 60];
      const windowSize = 3;

      const standard = applyMovingAverage(data, windowSize);
      const convolution = applyMovingAverageConvolution(data, windowSize);

      // For constant values, both should return all 60s
      standard.forEach(value => expect(value).toBeCloseTo(60, 5));
      convolution.forEach(value => expect(value).toBeCloseTo(60, 5));
    });
  });

  describe('Performance', () => {
    it('should handle large arrays efficiently', () => {
      const data = new Array(10000).fill(0).map(() => Math.random() * 100);

      const start = performance.now();
      applyMovingAverageConvolution(data, 10);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });
  });
});

describe('Integration Tests', () => {
  describe('With DecibelCalculator', () => {
    it('should smooth decibel values from audio samples', () => {
      // Simulated audio processing pipeline
      const sampleRate = 44100;
      const duration = 1; // 1 second

      // Generate 10 "chunks" of decibel readings
      const decibelReadings: number[] = [];
      for (let i = 0; i < 10; i++) {
        // Simulate varying noise levels with occasional spikes
        const baseLevel = 60;
        const spike = i === 5 ? 30 : 0; // Spike at index 5
        decibelReadings.push(baseLevel + Math.random() * 10 + spike);
      }

      // Apply filter
      const smoothed = applyMovingAverage(decibelReadings, 3);

      // Spike should be reduced
      expect(smoothed[5]).toBeLessThan(decibelReadings[5]);
      expect(smoothed[5]).toBeGreaterThan(60); // But still elevated
    });
  });

  describe('Real-time vs Batch Processing', () => {
    it('should produce equivalent results', () => {
      const data = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

      // Batch processing
      const batch = applyMovingAverage(data, 5);

      // Real-time processing
      const filter = new MovingAverageFilter(5);
      const realtime = data.map(value => filter.add(value));

      // Should be identical
      for (let i = 0; i < data.length; i++) {
        expect(batch[i]).toBe(realtime[i]);
      }
    });
  });
});
