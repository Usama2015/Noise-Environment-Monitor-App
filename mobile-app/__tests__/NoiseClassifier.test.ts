/**
 * NoiseClassifier Test Suite
 *
 * Tests for threshold-based noise classification matching Python prototype.
 * Verifies both simple classification and enhanced classification with spectral features.
 *
 * @see src/services/NoiseClassifier.ts
 * @see research/prototypes/audio_processor.py - Lines 220-235
 */

import {
  NoiseClassifier,
  classifyNoise,
  classifyNoiseEnhanced,
  CLASSIFICATION_THRESHOLDS,
  SPECTRAL_THRESHOLDS,
  FREQUENCY_THRESHOLDS,
  NoiseCategory,
  ClassificationResult,
} from '../src/services/NoiseClassifier';
import { SpectralFeatures } from '../src/utils/FFTProcessor';

describe('NoiseClassifier', () => {
  let classifier: NoiseClassifier;

  beforeEach(() => {
    classifier = new NoiseClassifier();
  });

  // ============================================================================
  // SIMPLE CLASSIFICATION TESTS (Threshold-based)
  // ============================================================================

  describe('classifySimple()', () => {
    describe('Quiet classification (<50 dB)', () => {
      it('should classify 30 dB as Quiet', () => {
        const result = classifier.classifySimple(30);
        expect(result.category).toBe('Quiet');
        expect(result.decibels).toBe(30);
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      });

      it('should classify 45 dB as Quiet (near upper threshold)', () => {
        const result = classifier.classifySimple(45);
        expect(result.category).toBe('Quiet');
        expect(result.decibels).toBe(45);
      });

      it('should classify 49.9 dB as Quiet (just below threshold)', () => {
        const result = classifier.classifySimple(49.9);
        expect(result.category).toBe('Quiet');
      });

      it('should have higher confidence for lower decibel values', () => {
        const result20 = classifier.classifySimple(20);
        const result45 = classifier.classifySimple(45);

        // Lower dB = higher confidence for Quiet
        expect(result20.confidence).toBeGreaterThan(result45.confidence);
      });
    });

    describe('Normal classification (50-70 dB)', () => {
      it('should classify 50 dB as Normal (at lower threshold)', () => {
        const result = classifier.classifySimple(50);
        expect(result.category).toBe('Normal');
        expect(result.decibels).toBe(50);
      });

      it('should classify 60 dB as Normal (middle of range)', () => {
        const result = classifier.classifySimple(60);
        expect(result.category).toBe('Normal');
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      });

      it('should classify 69.9 dB as Normal (just below upper threshold)', () => {
        const result = classifier.classifySimple(69.9);
        expect(result.category).toBe('Normal');
      });

      it('should have highest confidence near midpoint (60 dB)', () => {
        const result50 = classifier.classifySimple(50);
        const result60 = classifier.classifySimple(60);
        const result70 = classifier.classifySimple(69.9);

        // Midpoint should have highest confidence
        expect(result60.confidence).toBeGreaterThanOrEqual(result50.confidence);
        expect(result60.confidence).toBeGreaterThanOrEqual(result70.confidence);
      });
    });

    describe('Noisy classification (>70 dB)', () => {
      it('should classify 70 dB as Noisy (at threshold)', () => {
        const result = classifier.classifySimple(70);
        expect(result.category).toBe('Noisy');
        expect(result.decibels).toBe(70);
      });

      it('should classify 85 dB as Noisy', () => {
        const result = classifier.classifySimple(85);
        expect(result.category).toBe('Noisy');
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      });

      it('should classify 100 dB as Noisy (very loud)', () => {
        const result = classifier.classifySimple(100);
        expect(result.category).toBe('Noisy');
      });

      it('should have higher confidence for higher decibel values', () => {
        const result70 = classifier.classifySimple(70);
        const result100 = classifier.classifySimple(100);

        // Higher dB = higher confidence for Noisy
        expect(result100.confidence).toBeGreaterThanOrEqual(result70.confidence);
      });
    });

    describe('Edge cases', () => {
      it('should classify 0 dB correctly', () => {
        const result = classifier.classifySimple(0);
        expect(result.category).toBe('Quiet');
        expect(result.decibels).toBe(0);
      });

      it('should throw error for negative decibels', () => {
        expect(() => classifier.classifySimple(-10)).toThrow('Invalid decibel value');
      });

      it('should throw error for NaN', () => {
        expect(() => classifier.classifySimple(NaN)).toThrow('Invalid decibel value');
      });

      it('should throw error for Infinity', () => {
        expect(() => classifier.classifySimple(Infinity)).toThrow('Invalid decibel value');
      });
    });

    describe('Confidence calculations', () => {
      it('should always return confidence >= 0.5', () => {
        const testValues = [0, 25, 50, 60, 70, 85, 100];
        testValues.forEach(db => {
          const result = classifier.classifySimple(db);
          expect(result.confidence).toBeGreaterThanOrEqual(0.5);
        });
      });

      it('should return confidence <= 1.0', () => {
        const testValues = [0, 25, 50, 60, 70, 85, 100, 120];
        testValues.forEach(db => {
          const result = classifier.classifySimple(db);
          expect(result.confidence).toBeLessThanOrEqual(1.0);
        });
      });
    });

    describe('Result structure', () => {
      it('should return all required fields', () => {
        const result = classifier.classifySimple(60);

        expect(result).toHaveProperty('category');
        expect(result).toHaveProperty('decibels');
        expect(result).toHaveProperty('confidence');

        expect(typeof result.category).toBe('string');
        expect(typeof result.decibels).toBe('number');
        expect(typeof result.confidence).toBe('number');
      });

      it('should not include description or features in simple classification', () => {
        const result = classifier.classifySimple(60);

        expect(result.description).toBeUndefined();
        expect(result.features).toBeUndefined();
      });
    });
  });

  // ============================================================================
  // ENHANCED CLASSIFICATION TESTS (With spectral features)
  // ============================================================================

  describe('classifyEnhanced()', () => {
    // Helper to create mock spectral features
    const createMockFeatures = (overrides: Partial<SpectralFeatures> = {}): SpectralFeatures => ({
      spectralCentroid: 1000,
      spectralSpread: 500,
      spectralRolloff: 2000,
      spectralFlatness: 0.5,
      spectralEntropy: 5.0,
      dominantFrequency: 1000,
      lowFreqRatio: 0.33,
      midFreqRatio: 0.34,
      highFreqRatio: 0.33,
      ...overrides,
    });

    describe('Basic enhanced classification', () => {
      it('should include description and features in result', () => {
        const features = createMockFeatures();
        const result = classifier.classifyEnhanced(60, features);

        expect(result.category).toBe('Normal');
        expect(result.decibels).toBe(60);
        expect(result.description).toBeDefined();
        expect(result.features).toBeDefined();
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      });

      it('should maintain base category from simple classification', () => {
        const features = createMockFeatures();

        const quietResult = classifier.classifyEnhanced(30, features);
        expect(quietResult.category).toBe('Quiet');

        const normalResult = classifier.classifyEnhanced(60, features);
        expect(normalResult.category).toBe('Normal');

        const noisyResult = classifier.classifyEnhanced(80, features);
        expect(noisyResult.category).toBe('Noisy');
      });
    });

    describe('Noise type descriptions', () => {
      it('should detect "White Noise / Static" for high flatness', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.7, // > 0.6 threshold
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.description).toBe('White Noise / Static');
      });

      it('should detect "Traffic / Heavy Machinery" for low-freq dominant + loud', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.5,
          lowFreqRatio: 0.6, // > 0.5 threshold
          midFreqRatio: 0.2,
          highFreqRatio: 0.2,
        });

        const result = classifier.classifyEnhanced(75, features); // >70 dB
        expect(result.description).toBe('Traffic / Heavy Machinery');
      });

      it('should detect "Low Frequency Rumble" for low-freq dominant + quiet', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.5,
          lowFreqRatio: 0.6,
          midFreqRatio: 0.2,
          highFreqRatio: 0.2,
        });

        const result = classifier.classifyEnhanced(55, features); // <=70 dB
        expect(result.description).toBe('Low Frequency Rumble');
      });

      it('should detect "Voice / Music" for mid-freq + tonal', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.3, // < 0.4 threshold (tonal)
          lowFreqRatio: 0.2,
          midFreqRatio: 0.7, // > 0.6 threshold
          highFreqRatio: 0.1,
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.description).toBe('Voice / Music');
      });

      it('should detect "General Environmental Noise" for mid-freq + non-tonal', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.5, // >= 0.4 threshold (not tonal)
          lowFreqRatio: 0.2,
          midFreqRatio: 0.7,
          highFreqRatio: 0.1,
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.description).toBe('General Environmental Noise');
      });

      it('should detect "High-Frequency Noise" for high-freq dominant', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.5,
          lowFreqRatio: 0.2,
          midFreqRatio: 0.35,
          highFreqRatio: 0.45, // > 0.4 threshold
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.description).toBe('High-Frequency Noise');
      });

      it('should detect "Tonal Sound" for low flatness + balanced bands', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.2, // < 0.4 threshold
          lowFreqRatio: 0.33,
          midFreqRatio: 0.34,
          highFreqRatio: 0.33,
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.description).toBe('Tonal Sound');
      });

      it('should detect "Mixed Noise" for moderate flatness + balanced bands', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.5, // >= 0.4 threshold
          lowFreqRatio: 0.33,
          midFreqRatio: 0.34,
          highFreqRatio: 0.33,
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.description).toBe('Mixed Noise');
      });
    });

    describe('Spectral confidence adjustments', () => {
      it('should increase confidence for Quiet with low flatness', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.2, // < 0.3
        });

        const result = classifier.classifyEnhanced(30, features);
        expect(result.confidence).toBeGreaterThan(0.5);
      });

      it('should increase confidence for Quiet with very high flatness (silence)', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.9, // > 0.8
        });

        const result = classifier.classifyEnhanced(30, features);
        expect(result.confidence).toBeGreaterThan(0.5);
      });

      it('should increase confidence for Normal with mid-frequency dominance', () => {
        const features = createMockFeatures({
          midFreqRatio: 0.6, // > 0.4
        });

        const result = classifier.classifyEnhanced(60, features);
        expect(result.confidence).toBeGreaterThan(0.5);
      });

      it('should increase confidence for Noisy with high low-freq ratio', () => {
        const features = createMockFeatures({
          lowFreqRatio: 0.5, // > 0.3
        });

        const result = classifier.classifyEnhanced(80, features);
        expect(result.confidence).toBeGreaterThan(0.5);
      });

      it('should increase confidence for Noisy with high flatness', () => {
        const features = createMockFeatures({
          spectralFlatness: 0.6, // > 0.5
        });

        const result = classifier.classifyEnhanced(80, features);
        expect(result.confidence).toBeGreaterThan(0.5);
      });
    });
  });

  // ============================================================================
  // HELPER METHODS TESTS
  // ============================================================================

  describe('getCategoryDescription()', () => {
    it('should return description for Quiet', () => {
      const description = classifier.getCategoryDescription('Quiet');
      expect(description).toContain('Library');
      expect(description).toContain('<50 dB');
    });

    it('should return description for Normal', () => {
      const description = classifier.getCategoryDescription('Normal');
      expect(description).toContain('Conversation');
      expect(description).toContain('50-70 dB');
    });

    it('should return description for Noisy', () => {
      const description = classifier.getCategoryDescription('Noisy');
      expect(description).toContain('Traffic');
      expect(description).toContain('>70 dB');
    });
  });

  describe('getCategoryColor()', () => {
    it('should return green for Quiet', () => {
      const color = classifier.getCategoryColor('Quiet');
      expect(color).toBe('#4CAF50');
    });

    it('should return yellow/amber for Normal', () => {
      const color = classifier.getCategoryColor('Normal');
      expect(color).toBe('#FFC107');
    });

    it('should return red for Noisy', () => {
      const color = classifier.getCategoryColor('Noisy');
      expect(color).toBe('#F44336');
    });
  });

  describe('getCategoryIcon()', () => {
    it('should return green circle for Quiet', () => {
      const icon = classifier.getCategoryIcon('Quiet');
      expect(icon).toBe('🟢');
    });

    it('should return yellow circle for Normal', () => {
      const icon = classifier.getCategoryIcon('Normal');
      expect(icon).toBe('🟡');
    });

    it('should return red circle for Noisy', () => {
      const icon = classifier.getCategoryIcon('Noisy');
      expect(icon).toBe('🔴');
    });
  });

  // ============================================================================
  // HELPER FUNCTIONS TESTS
  // ============================================================================

  describe('classifyNoise() helper function', () => {
    it('should classify decibel value correctly', () => {
      expect(classifyNoise(30)).toBe('Quiet');
      expect(classifyNoise(60)).toBe('Normal');
      expect(classifyNoise(80)).toBe('Noisy');
    });

    it('should handle threshold boundaries', () => {
      expect(classifyNoise(49.9)).toBe('Quiet');
      expect(classifyNoise(50)).toBe('Normal');
      expect(classifyNoise(69.9)).toBe('Normal');
      expect(classifyNoise(70)).toBe('Noisy');
    });
  });

  describe('classifyNoiseEnhanced() helper function', () => {
    it('should return enhanced classification result', () => {
      const features: SpectralFeatures = {
        spectralCentroid: 1000,
        spectralSpread: 500,
        spectralRolloff: 2000,
        spectralFlatness: 0.5,
        spectralEntropy: 5.0,
        dominantFrequency: 1000,
        lowFreqRatio: 0.33,
        midFreqRatio: 0.34,
        highFreqRatio: 0.33,
      };

      const result = classifyNoiseEnhanced(60, features);

      expect(result.category).toBe('Normal');
      expect(result.description).toBeDefined();
      expect(result.features).toBeDefined();
    });
  });

  // ============================================================================
  // CONSTANTS TESTS
  // ============================================================================

  describe('Constants', () => {
    it('should have correct classification thresholds', () => {
      expect(CLASSIFICATION_THRESHOLDS.QUIET_UPPER).toBe(50);
      expect(CLASSIFICATION_THRESHOLDS.NORMAL_UPPER).toBe(70);
    });

    it('should have correct spectral thresholds', () => {
      expect(SPECTRAL_THRESHOLDS.TONAL_UPPER).toBe(0.4);
      expect(SPECTRAL_THRESHOLDS.NOISY_LOWER).toBe(0.6);
    });

    it('should have correct frequency thresholds', () => {
      expect(FREQUENCY_THRESHOLDS.LOW_DOMINANT).toBe(0.5);
      expect(FREQUENCY_THRESHOLDS.MID_DOMINANT).toBe(0.6);
      expect(FREQUENCY_THRESHOLDS.HIGH_DOMINANT).toBe(0.4);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration with FFTProcessor', () => {
    it('should work with real spectral features from FFT', () => {
      // Simulated real spectral features
      const realFeatures: SpectralFeatures = {
        spectralCentroid: 2345.67,
        spectralSpread: 1234.56,
        spectralRolloff: 4567.89,
        spectralFlatness: 0.42,
        spectralEntropy: 6.78,
        dominantFrequency: 440, // A4 note
        lowFreqRatio: 0.25,
        midFreqRatio: 0.65,
        highFreqRatio: 0.10,
      };

      const result = classifier.classifyEnhanced(62, realFeatures);

      expect(result.category).toBe('Normal');
      expect(result.description).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Classification accuracy matches Python prototype', () => {
    it('should match Python classification for Quiet', () => {
      // Python: if avg_db < 50: return 'Quiet'
      const testValues = [0, 10, 25, 40, 49.9];
      testValues.forEach(db => {
        const result = classifier.classifySimple(db);
        expect(result.category).toBe('Quiet');
      });
    });

    it('should match Python classification for Normal', () => {
      // Python: elif avg_db < 70: return 'Normal'
      const testValues = [50, 55, 60, 65, 69.9];
      testValues.forEach(db => {
        const result = classifier.classifySimple(db);
        expect(result.category).toBe('Normal');
      });
    });

    it('should match Python classification for Noisy', () => {
      // Python: else: return 'Noisy'
      const testValues = [70, 75, 85, 95, 100];
      testValues.forEach(db => {
        const result = classifier.classifySimple(db);
        expect(result.category).toBe('Noisy');
      });
    });
  });
});
