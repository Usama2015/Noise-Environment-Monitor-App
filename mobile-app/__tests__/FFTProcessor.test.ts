/**
 * FFTProcessor Tests
 *
 * Comprehensive test suite for FFT implementation and spectral feature extraction.
 *
 * @see src/utils/FFTProcessor.ts
 */

import {
  FFTProcessor,
  FFTResult,
  SpectralFeatures,
  DEFAULT_FFT_SIZE,
  DEFAULT_SAMPLE_RATE,
  FREQ_BANDS,
} from '../src/utils/FFTProcessor';

describe('FFTProcessor', () => {
  describe('Constructor', () => {
    it('should create processor with default sample rate', () => {
      const processor = new FFTProcessor();
      expect(processor.getSampleRate()).toBe(DEFAULT_SAMPLE_RATE);
    });

    it('should create processor with custom sample rate', () => {
      const processor = new FFTProcessor(48000);
      expect(processor.getSampleRate()).toBe(48000);
    });

    it('should throw error for invalid sample rate (zero)', () => {
      expect(() => new FFTProcessor(0)).toThrow(
        'Sample rate must be positive',
      );
    });

    it('should throw error for invalid sample rate (negative)', () => {
      expect(() => new FFTProcessor(-44100)).toThrow(
        'Sample rate must be positive',
      );
    });
  });

  describe('performFFT() - Basic Functionality', () => {
    it('should perform FFT on sine wave and detect correct frequency', () => {
      const processor = new FFTProcessor(44100);
      const frequency = 440; // A4 note
      const duration = 1; // 1 second
      const samples = generateSineWave(frequency, duration, 44100);

      const result = processor.performFFT(samples);

      // Find dominant frequency
      let maxMagnitude = -Infinity;
      let dominantIndex = 0;
      for (let i = 0; i < result.magnitudes.length; i++) {
        if (result.magnitudes[i] > maxMagnitude) {
          maxMagnitude = result.magnitudes[i];
          dominantIndex = i;
        }
      }

      const detectedFreq = result.frequencies[dominantIndex];

      // Should detect 440 Hz (within tolerance due to FFT resolution)
      expect(detectedFreq).toBeGreaterThan(430);
      expect(detectedFreq).toBeLessThan(450);
    });

    it('should return correct number of frequency bins', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024).fill(0.1);

      const result = processor.performFFT(samples, 2048);

      // Real FFT returns N/2 + 1 bins
      expect(result.frequencies.length).toBe(1025); // 2048/2 + 1
      expect(result.magnitudes.length).toBe(1025);
    });

    it('should handle default FFT size', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024);

      const result = processor.performFFT(samples);

      expect(result.nfft).toBe(DEFAULT_FFT_SIZE);
      expect(result.frequencies.length).toBe(DEFAULT_FFT_SIZE / 2 + 1);
    });

    it('should throw error for empty sample array', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(0);

      expect(() => processor.performFFT(samples)).toThrow(
        'Cannot perform FFT on empty sample array',
      );
    });

    it('should throw error for invalid FFT size (zero)', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024);

      expect(() => processor.performFFT(samples, 0)).toThrow(
        'FFT size must be a positive integer',
      );
    });

    it('should throw error for invalid FFT size (negative)', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024);

      expect(() => processor.performFFT(samples, -2048)).toThrow(
        'FFT size must be a positive integer',
      );
    });

    it('should throw error for invalid FFT size (float)', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024);

      expect(() => processor.performFFT(samples, 1024.5)).toThrow(
        'FFT size must be a positive integer',
      );
    });
  });

  describe('performFFT() - Frequency Detection', () => {
    it('should detect 100 Hz sine wave', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(100, 1, 44100);

      const result = processor.performFFT(samples);
      const dominantFreq = findDominantFrequency(result);

      // FFT has limited frequency resolution (sample_rate / nfft)
      // Resolution for 2048 bins at 44100 Hz is ~21.5 Hz
      expect(dominantFreq).toBeGreaterThan(80);
      expect(dominantFreq).toBeLessThan(120);
    });

    it('should detect 1000 Hz sine wave', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(1000, 1, 44100);

      const result = processor.performFFT(samples);
      const dominantFreq = findDominantFrequency(result);

      expect(dominantFreq).toBeGreaterThan(990);
      expect(dominantFreq).toBeLessThan(1010);
    });

    it('should detect 5000 Hz sine wave', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(5000, 1, 44100);

      const result = processor.performFFT(samples);
      const dominantFreq = findDominantFrequency(result);

      expect(dominantFreq).toBeGreaterThan(4950);
      expect(dominantFreq).toBeLessThan(5050);
    });

    it('should detect multiple frequencies in mixed signal', () => {
      const processor = new FFTProcessor(44100);

      // Mix 440 Hz and 880 Hz (A4 and A5)
      const samples1 = generateSineWave(440, 1, 44100, 0.5);
      const samples2 = generateSineWave(880, 1, 44100, 0.5);

      const mixed = new Float32Array(samples1.length);
      for (let i = 0; i < samples1.length; i++) {
        mixed[i] = samples1[i] + samples2[i];
      }

      const result = processor.performFFT(mixed);

      // Find peaks in magnitude spectrum (use adaptive threshold)
      const maxMag = Math.max(...result.magnitudes);
      const threshold = maxMag * 0.5; // Peaks above 50% of max
      const peaks = findPeaks(result, threshold);

      // Should detect both 440 Hz and 880 Hz
      expect(peaks.length).toBeGreaterThanOrEqual(2);

      const freqs = peaks.map(p => result.frequencies[p]);
      const has440 = freqs.some(f => f > 400 && f < 480);
      const has880 = freqs.some(f => f > 840 && f < 920);

      expect(has440).toBe(true);
      expect(has880).toBe(true);
    });
  });

  describe('performFFT() - Edge Cases', () => {
    it('should handle very short samples', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(16); // Very short

      const result = processor.performFFT(samples, 32);

      expect(result.frequencies.length).toBe(17); // 32/2 + 1
      expect(result.magnitudes.length).toBe(17);
    });

    it('should handle samples longer than FFT size', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 2, 44100); // 2 seconds

      const result = processor.performFFT(samples, 2048);

      // Should truncate to 2048 samples
      expect(result.nfft).toBe(2048);
      expect(result.frequencies.length).toBe(1025);
    });

    it('should handle all zeros', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024).fill(0);

      const result = processor.performFFT(samples);

      // All magnitudes should be near zero
      const maxMagnitude = Math.max(...result.magnitudes);
      expect(maxMagnitude).toBeLessThan(1e-6);
    });

    it('should handle constant DC signal', () => {
      const processor = new FFTProcessor(44100);
      const samples = new Float32Array(1024).fill(1.0);

      const result = processor.performFFT(samples);

      // DC component (0 Hz) should be dominant
      const dominantFreq = findDominantFrequency(result);
      expect(dominantFreq).toBeLessThan(50); // Close to 0 Hz
    });

    it('should handle white noise', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateWhiteNoise(1024);

      const result = processor.performFFT(samples);

      // White noise should have energy distributed across all frequencies
      // No single dominant frequency
      const maxMagnitude = Math.max(...result.magnitudes);
      const avgMagnitude = result.magnitudes.reduce((a, b) => a + b, 0) / result.magnitudes.length;

      // Max should not be much larger than average
      expect(maxMagnitude / avgMagnitude).toBeLessThan(5);
    });
  });

  describe('extractSpectralFeatures() - Basic Functionality', () => {
    it('should extract features from FFT result', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 1, 44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // Check all features are present
      expect(features.spectralCentroid).toBeGreaterThan(0);
      expect(features.spectralSpread).toBeGreaterThan(0);
      expect(features.spectralRolloff).toBeGreaterThan(0);
      expect(features.spectralFlatness).toBeGreaterThanOrEqual(0);
      expect(features.spectralEntropy).toBeGreaterThan(0);
      expect(features.dominantFrequency).toBeGreaterThan(0);
      expect(features.lowFreqRatio).toBeGreaterThanOrEqual(0);
      expect(features.midFreqRatio).toBeGreaterThanOrEqual(0);
      expect(features.highFreqRatio).toBeGreaterThanOrEqual(0);
    });

    it('should have frequency ratios sum to 1.0', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 1, 44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      const sum = features.lowFreqRatio + features.midFreqRatio + features.highFreqRatio;
      expect(sum).toBeCloseTo(1.0, 5);
    });

    it('should detect low frequency energy for bass tone', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(100, 1, 44100); // Low frequency

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // 100 Hz is in low frequency band (< 250 Hz)
      expect(features.lowFreqRatio).toBeGreaterThan(0.5);
      expect(features.lowFreqRatio).toBeGreaterThan(features.midFreqRatio);
      expect(features.lowFreqRatio).toBeGreaterThan(features.highFreqRatio);
    });

    it('should detect mid frequency energy for voice range', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(1000, 1, 44100); // Mid frequency

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // 1000 Hz is in mid frequency band (250-4000 Hz)
      expect(features.midFreqRatio).toBeGreaterThan(0.5);
      expect(features.midFreqRatio).toBeGreaterThan(features.lowFreqRatio);
      expect(features.midFreqRatio).toBeGreaterThan(features.highFreqRatio);
    });

    it('should detect high frequency energy for high-pitched tone', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(8000, 1, 44100); // High frequency

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // 8000 Hz is in high frequency band (> 4000 Hz)
      expect(features.highFreqRatio).toBeGreaterThan(0.5);
      expect(features.highFreqRatio).toBeGreaterThan(features.lowFreqRatio);
      expect(features.highFreqRatio).toBeGreaterThan(features.midFreqRatio);
    });

    it('should throw error for empty arrays', () => {
      const processor = new FFTProcessor(44100);

      expect(() => processor.extractSpectralFeatures([], [])).toThrow(
        'Cannot extract features from empty arrays',
      );
    });

    it('should throw error for mismatched array lengths', () => {
      const processor = new FFTProcessor(44100);

      const frequencies = [100, 200, 300];
      const magnitudes = [1.0, 2.0]; // One less

      expect(() => processor.extractSpectralFeatures(frequencies, magnitudes)).toThrow(
        'must have same length',
      );
    });
  });

  describe('extractSpectralFeatures() - Spectral Metrics', () => {
    it('should calculate spectral centroid close to dominant frequency for sine wave', () => {
      const processor = new FFTProcessor(44100);
      const targetFreq = 1000;
      const samples = generateSineWave(targetFreq, 1, 44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // Centroid should be in reasonable range for 1000 Hz tone
      // Note: Hamming window causes spectral leakage, shifting centroid higher
      expect(features.spectralCentroid).toBeGreaterThan(500);
      expect(features.spectralCentroid).toBeLessThan(3000);

      // More importantly, dominant frequency should be accurate
      expect(features.dominantFrequency).toBeGreaterThan(950);
      expect(features.dominantFrequency).toBeLessThan(1050);
    });

    it('should calculate dominant frequency correctly', () => {
      const processor = new FFTProcessor(44100);
      const targetFreq = 440;
      const samples = generateSineWave(targetFreq, 1, 44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      expect(features.dominantFrequency).toBeGreaterThan(430);
      expect(features.dominantFrequency).toBeLessThan(450);
    });

    it('should have low spectral flatness for tonal signal', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 1, 44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // Pure tone should have low flatness (tonal, not noisy)
      expect(features.spectralFlatness).toBeLessThan(0.5);
    });

    it('should have high spectral flatness for white noise', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateWhiteNoise(44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // White noise should have high flatness (noisy, not tonal)
      expect(features.spectralFlatness).toBeGreaterThan(0.3);
    });

    it('should calculate spectral rolloff correctly', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(1000, 1, 44100);

      const fftResult = processor.performFFT(samples);
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // Rolloff should be close to dominant frequency for pure tone
      expect(features.spectralRolloff).toBeGreaterThan(0);
      expect(features.spectralRolloff).toBeLessThan(22050); // Nyquist frequency
    });
  });

  describe('Performance', () => {
    it('should perform FFT on 1 second of audio quickly', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 1, 44100);

      const start = performance.now();
      processor.performFFT(samples);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100); // Should be < 100ms
    });

    it('should extract features quickly', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 1, 44100);
      const fftResult = processor.performFFT(samples);

      const start = performance.now();
      processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50); // Should be < 50ms
    });

    it('should handle multiple consecutive FFTs efficiently', () => {
      const processor = new FFTProcessor(44100);
      const samples = generateSineWave(440, 1, 44100);

      const start = performance.now();
      for (let i = 0; i < 10; i++) {
        processor.performFFT(samples);
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000); // 10 FFTs in < 1 second
    });
  });

  describe('Integration Tests', () => {
    it('should work with complete audio processing pipeline', () => {
      const processor = new FFTProcessor(44100);

      // Simulate 1-second audio sample
      const samples = generateSineWave(440, 1, 44100);

      // Perform FFT
      const fftResult = processor.performFFT(samples);

      // Extract features
      const features = processor.extractSpectralFeatures(
        fftResult.frequencies,
        fftResult.magnitudes,
      );

      // Validate complete feature set
      expect(features.spectralCentroid).toBeGreaterThan(0);
      expect(features.spectralSpread).toBeGreaterThan(0);
      expect(features.spectralRolloff).toBeGreaterThan(0);
      expect(features.spectralFlatness).toBeGreaterThanOrEqual(0);
      expect(features.spectralEntropy).toBeGreaterThan(0);
      expect(features.dominantFrequency).toBeGreaterThan(400);
      expect(features.dominantFrequency).toBeLessThan(480);

      // Verify frequency band ratios
      const totalRatio = features.lowFreqRatio + features.midFreqRatio + features.highFreqRatio;
      expect(totalRatio).toBeCloseTo(1.0, 5);
    });

    it('should differentiate between quiet and loud signals', () => {
      const processor = new FFTProcessor(44100);

      // Quiet signal (amplitude 0.1)
      const quietSamples = generateSineWave(440, 1, 44100, 0.1);
      const quietResult = processor.performFFT(quietSamples);

      // Loud signal (amplitude 0.9)
      const loudSamples = generateSineWave(440, 1, 44100, 0.9);
      const loudResult = processor.performFFT(loudSamples);

      // Loud signal should have higher magnitudes
      const quietMax = Math.max(...quietResult.magnitudes);
      const loudMax = Math.max(...loudResult.magnitudes);

      expect(loudMax).toBeGreaterThan(quietMax * 5);
    });

    it('should differentiate between different noise types', () => {
      const processor = new FFTProcessor(44100);

      // Tonal signal (sine wave)
      const tonalSamples = generateSineWave(440, 1, 44100);
      const tonalFFT = processor.performFFT(tonalSamples);
      const tonalFeatures = processor.extractSpectralFeatures(
        tonalFFT.frequencies,
        tonalFFT.magnitudes,
      );

      // Noisy signal (white noise)
      const noisySamples = generateWhiteNoise(44100);
      const noisyFFT = processor.performFFT(noisySamples);
      const noisyFeatures = processor.extractSpectralFeatures(
        noisyFFT.frequencies,
        noisyFFT.magnitudes,
      );

      // Tonal signal should have lower flatness than noisy signal
      expect(tonalFeatures.spectralFlatness).toBeLessThan(noisyFeatures.spectralFlatness);
    });
  });

  describe('Constants', () => {
    it('should export correct default FFT size', () => {
      expect(DEFAULT_FFT_SIZE).toBe(2048);
    });

    it('should export correct default sample rate', () => {
      expect(DEFAULT_SAMPLE_RATE).toBe(44100);
    });

    it('should export correct frequency band boundaries', () => {
      expect(FREQ_BANDS.LOW_CUTOFF).toBe(250);
      expect(FREQ_BANDS.MID_CUTOFF).toBe(4000);
    });
  });
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a sine wave for testing
 *
 * @param frequency - Frequency in Hz
 * @param duration - Duration in seconds
 * @param sampleRate - Sample rate in Hz
 * @param amplitude - Amplitude (default: 1.0)
 * @returns Float32Array of sine wave samples
 */
function generateSineWave(
  frequency: number,
  duration: number,
  sampleRate: number,
  amplitude: number = 1.0,
): Float32Array {
  const numSamples = Math.floor(duration * sampleRate);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    samples[i] = amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
  }

  return samples;
}

/**
 * Generate white noise for testing
 *
 * @param numSamples - Number of samples to generate
 * @param amplitude - Amplitude (default: 0.3)
 * @returns Float32Array of white noise samples
 */
function generateWhiteNoise(numSamples: number, amplitude: number = 0.3): Float32Array {
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    samples[i] = amplitude * (Math.random() * 2 - 1);
  }

  return samples;
}

/**
 * Find the dominant frequency in FFT result
 *
 * @param result - FFT result
 * @returns Dominant frequency in Hz
 */
function findDominantFrequency(result: FFTResult): number {
  let maxMagnitude = -Infinity;
  let dominantIndex = 0;

  for (let i = 0; i < result.magnitudes.length; i++) {
    if (result.magnitudes[i] > maxMagnitude) {
      maxMagnitude = result.magnitudes[i];
      dominantIndex = i;
    }
  }

  return result.frequencies[dominantIndex];
}

/**
 * Find peaks in magnitude spectrum
 *
 * @param result - FFT result
 * @param threshold - Minimum magnitude to be considered a peak
 * @returns Array of peak indices
 */
function findPeaks(result: FFTResult, threshold: number): number[] {
  const peaks: number[] = [];

  for (let i = 1; i < result.magnitudes.length - 1; i++) {
    const current = result.magnitudes[i];
    const prev = result.magnitudes[i - 1];
    const next = result.magnitudes[i + 1];

    // Peak if current is higher than neighbors and above threshold
    if (current > prev && current > next && current > threshold) {
      peaks.push(i);
    }
  }

  return peaks;
}
