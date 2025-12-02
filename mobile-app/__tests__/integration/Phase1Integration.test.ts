/**
 * Phase 1 Integration Tests
 *
 * End-to-end integration tests for the complete audio processing pipeline
 * from microphone capture through UI display.
 *
 * Tests the integration of:
 * - AudioService (Step 1.2)
 * - DecibelCalculator (Step 1.3)
 * - MovingAverageFilter (Step 1.4)
 * - FFTProcessor (Step 1.5)
 * - NoiseClassifier (Step 1.6)
 * - UI Components (Step 1.7)
 */

import { AudioService } from '../../src/services/AudioService';
import { calculateDecibels } from '../../src/utils/DecibelCalculator';
import { MovingAverageFilter } from '../../src/utils/MovingAverageFilter';
import { FFTProcessor } from '../../src/utils/FFTProcessor';
import { NoiseClassifier } from '../../src/services/NoiseClassifier';
import type { AudioSample } from '../../src/types';

// Test configuration
const SAMPLE_RATE = 44100;
const SAMPLES_PER_SECOND = 44100;

/**
 * Generate synthetic audio samples for testing
 */
function generateTestAudio(
  frequency: number,
  amplitude: number,
  durationSeconds: number,
  sampleRate: number = SAMPLE_RATE
): Float32Array {
  const sampleCount = Math.floor(durationSeconds * sampleRate);
  const samples = new Float32Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
  }

  return samples;
}

/**
 * Generate white noise
 */
function generateWhiteNoise(amplitude: number, sampleCount: number): Float32Array {
  const samples = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    samples[i] = amplitude * (Math.random() * 2 - 1);
  }
  return samples;
}

describe('Phase 1 Integration Tests', () => {
  describe('Complete Audio Processing Pipeline', () => {
    it('should process quiet sine wave through entire pipeline', () => {
      // 1. Generate quiet audio (library environment)
      const samples = generateTestAudio(440, 0.003, 1.0); // Quiet 440Hz tone

      // 2. Calculate decibels
      const instantDb = calculateDecibels(samples);
      expect(instantDb).toBeGreaterThan(0);
      expect(instantDb).toBeLessThan(50); // Should be quiet

      // 3. Apply moving average filter
      const movingAvg = new MovingAverageFilter(5);
      const smoothedDb = movingAvg.add(instantDb);
      expect(smoothedDb).toBeCloseTo(instantDb, 1); // First sample

      // 4. Perform FFT
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      expect(fftResult.frequencies.length).toBeGreaterThan(0);
      expect(fftResult.magnitudes.length).toBeGreaterThan(0);

      // 5. Extract spectral features
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );
      expect(features.dominantFrequency).toBeGreaterThan(400);
      expect(features.dominantFrequency).toBeLessThan(480);
      expect(features.spectralFlatness).toBeLessThan(0.5); // Tonal

      // 6. Classify noise
      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(smoothedDb, features);
      expect(classification.category).toBe('Quiet');
      expect(classification.confidence).toBeGreaterThan(0.5);
      expect(classification.description).toBeDefined();
    });

    it('should process normal conversational audio through pipeline', () => {
      // 1. Generate normal-level audio (office/cafeteria)
      const samples = generateTestAudio(300, 0.01, 1.0); // Mid-frequency, moderate amplitude

      // 2. Calculate decibels
      const instantDb = calculateDecibels(samples);
      expect(instantDb).toBeGreaterThan(50);
      expect(instantDb).toBeLessThan(70);

      // 3. Apply smoothing
      const movingAvg = new MovingAverageFilter(5);
      const smoothedDb = movingAvg.add(instantDb);

      // 4. FFT and features
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );

      // 5. Classification
      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(smoothedDb, features);
      expect(classification.category).toBe('Normal');
      expect(classification.confidence).toBeGreaterThan(0.5);
    });

    it('should process noisy environment through pipeline', () => {
      // 1. Generate loud audio (traffic/construction)
      const samples = generateTestAudio(100, 0.12, 1.0); // Low frequency, high amplitude

      // 2. Calculate decibels
      const instantDb = calculateDecibels(samples);
      expect(instantDb).toBeGreaterThan(68);

      // 3. Apply smoothing
      const movingAvg = new MovingAverageFilter(5);
      const smoothedDb = movingAvg.add(instantDb);

      // 4. FFT and features
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );
      expect(features.lowFreqRatio).toBeGreaterThan(0.3); // Low-frequency dominant

      // 5. Classification
      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(smoothedDb, features);
      expect(classification.category).toBe('Noisy');
      expect(classification.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('Moving Average Filter Integration', () => {
    it('should smooth out spikes in decibel readings', () => {
      const classifier = new NoiseClassifier();
      const movingAvg = new MovingAverageFilter(5);
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);

      // Simulate sudden loud noise spike
      const quietSamples = generateTestAudio(440, 0.003, 1.0);
      const loudSamples = generateTestAudio(440, 0.02, 1.0);

      const readings: number[] = [];

      // Process 3 quiet samples
      for (let i = 0; i < 3; i++) {
        const db = calculateDecibels(quietSamples);
        const smoothed = movingAvg.add(db);
        readings.push(smoothed);
      }

      // Sudden spike
      const spikeDb = calculateDecibels(loudSamples);
      const smoothedSpike = movingAvg.add(spikeDb);
      readings.push(smoothedSpike);

      // Should be smoothed - spike impact reduced
      expect(smoothedSpike).toBeLessThan(spikeDb);
      expect(smoothedSpike).toBeGreaterThan(readings[2]);

      // Continue with quiet
      for (let i = 0; i < 3; i++) {
        const db = calculateDecibels(quietSamples);
        const smoothed = movingAvg.add(db);
        readings.push(smoothed);
      }

      // Verify smoothing effect
      const maxReading = Math.max(...readings);
      expect(maxReading).toBeLessThan(spikeDb); // Spike was smoothed
    });
  });

  describe('Noise Type Detection Integration', () => {
    it('should detect white noise/static', () => {
      const samples = generateWhiteNoise(0.2, SAMPLES_PER_SECOND);

      const db = calculateDecibels(samples);
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );

      // White noise should have high spectral flatness
      expect(features.spectralFlatness).toBeGreaterThan(0.5);

      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(db, features);
      expect(classification.description).toContain('White Noise');
    });

    it('should detect tonal sound (voice/music)', () => {
      // Pure tone simulating voice/music
      const samples = generateTestAudio(440, 0.006, 1.0);

      const db = calculateDecibels(samples);
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );

      // Tonal sound should have low spectral flatness
      expect(features.spectralFlatness).toBeLessThan(0.5);

      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(db, features);
      // Should detect as tonal
      expect(
        classification.description?.includes('Voice') ||
        classification.description?.includes('Music') ||
        classification.description?.includes('Tonal')
      ).toBe(true);
    });

    it('should detect low-frequency rumble (traffic)', () => {
      // Low frequency, loud (simulating traffic)
      const samples = generateTestAudio(80, 0.05, 1.0);

      const db = calculateDecibels(samples);
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );

      // Should have high low-frequency ratio
      expect(features.lowFreqRatio).toBeGreaterThan(0.4);

      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(db, features);

      if (db > 70) {
        expect(classification.description).toContain('Traffic');
      } else {
        expect(classification.description).toContain('Rumble');
      }
    });
  });

  describe('Real-time Processing Simulation', () => {
    it('should handle continuous audio stream', () => {
      const movingAvg = new MovingAverageFilter(5);
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const classifier = new NoiseClassifier();

      const results: Array<{
        db: number;
        category: string;
        confidence: number;
      }> = [];

      // Simulate 10 seconds of audio
      for (let i = 0; i < 10; i++) {
        // Generate 1 second of audio
        const amplitude = 0.002 + Math.random() * 0.006; // Varying amplitude (Quiet to Normal range)
        const samples = generateTestAudio(440, amplitude, 1.0);

        // Process through pipeline
        const db = calculateDecibels(samples);
        const smoothedDb = movingAvg.add(db);

        const fftResult = fftProcessor.performFFT(samples);
        const features = fftProcessor.extractSpectralFeatures(
          fftResult.frequencies,
          fftResult.magnitudes
        );

        const classification = classifier.classifyEnhanced(smoothedDb, features);

        results.push({
          db: smoothedDb,
          category: classification.category,
          confidence: classification.confidence,
        });
      }

      // Verify all samples processed successfully
      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(result.db).toBeGreaterThan(0);
        expect(result.db).toBeLessThan(120);
        expect(['Quiet', 'Normal', 'Noisy']).toContain(result.category);
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
        expect(result.confidence).toBeLessThanOrEqual(1.0);
      });
    });
  });

  describe('Classification Boundary Testing', () => {
    it('should correctly classify at threshold boundaries', () => {
      const classifier = new NoiseClassifier();
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);

      // Test around 50 dB threshold (Quiet/Normal boundary)
      const samples49 = generateTestAudio(440, 0.0029, 1.0); // ~49 dB
      const samples50 = generateTestAudio(440, 0.0032, 1.0); // ~50 dB

      const db49 = calculateDecibels(samples49);
      const db50 = calculateDecibels(samples50);

      const fftResult49 = fftProcessor.performFFT(samples49);
      const features49 = fftProcessor.extractSpectralFeatures(
        fftResult49.frequencies,
        fftResult49.magnitudes
      );

      const fftResult50 = fftProcessor.performFFT(samples50);
      const features50 = fftProcessor.extractSpectralFeatures(
        fftResult50.frequencies,
        fftResult50.magnitudes
      );

      const class49 = classifier.classifyEnhanced(db49, features49);
      const class50 = classifier.classifyEnhanced(db50, features50);

      // Verify threshold behavior
      if (db49 < 50) {
        expect(class49.category).toBe('Quiet');
      }
      if (db50 >= 50) {
        expect(class50.category).toBe('Normal');
      }
    });
  });

  describe('Performance Integration', () => {
    it('should process 1 second of audio in <100ms', () => {
      const samples = generateTestAudio(440, 0.006, 1.0);

      const start = performance.now();

      // Complete pipeline
      const db = calculateDecibels(samples);
      const movingAvg = new MovingAverageFilter(5);
      const smoothedDb = movingAvg.add(db);

      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const fftResult = fftProcessor.performFFT(samples);
      const features = fftProcessor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes
      );

      const classifier = new NoiseClassifier();
      const classification = classifier.classifyEnhanced(smoothedDb, features);

      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100); // <100ms requirement
      expect(classification).toBeDefined();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle empty audio samples gracefully', () => {
      const emptysamples = new Float32Array(0);

      expect(() => {
        calculateDecibels(emptysamples);
      }).toThrow();
    });

    it('should handle invalid decibel values in classification', () => {
      const classifier = new NoiseClassifier();

      expect(() => {
        classifier.classifySimple(-10);
      }).toThrow('Invalid decibel value');

      expect(() => {
        classifier.classifySimple(NaN);
      }).toThrow('Invalid decibel value');
    });

    it('should handle FFT with insufficient samples', () => {
      const fewSamples = new Float32Array(10); // Very few samples
      const fftProcessor = new FFTProcessor(SAMPLE_RATE);

      // Should still work but with limited accuracy
      const result = fftProcessor.performFFT(fewSamples);
      expect(result.frequencies.length).toBeGreaterThan(0);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain consistent results for same input', () => {
      const samples = generateTestAudio(440, 0.006, 1.0);

      const fftProcessor = new FFTProcessor(SAMPLE_RATE);
      const classifier = new NoiseClassifier();

      // Process twice
      const db1 = calculateDecibels(samples);
      const fftResult1 = fftProcessor.performFFT(samples);
      const features1 = fftProcessor.extractSpectralFeatures(
        fftResult1.frequencies,
        fftResult1.magnitudes
      );
      const class1 = classifier.classifyEnhanced(db1, features1);

      const db2 = calculateDecibels(samples);
      const fftResult2 = fftProcessor.performFFT(samples);
      const features2 = fftProcessor.extractSpectralFeatures(
        fftResult2.frequencies,
        fftResult2.magnitudes
      );
      const class2 = classifier.classifyEnhanced(db2, features2);

      // Results should be identical
      expect(db1).toBe(db2);
      expect(class1.category).toBe(class2.category);
      expect(class1.description).toBe(class2.description);
      expect(class1.confidence).toBeCloseTo(class2.confidence, 5);
    });
  });
});
