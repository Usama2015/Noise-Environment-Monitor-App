/**
 * NoiseClassifier - Classify environmental noise levels
 *
 * This module provides noise classification based on decibel levels and
 * spectral features. It implements both simple threshold-based classification
 * (matching Python prototype) and enhanced feature-based classification.
 *
 * Classification categories:
 * - Quiet: <50 dB (library, quiet study areas)
 * - Normal: 50-70 dB (conversation, office, cafeteria)
 * - Noisy: >70 dB (traffic, construction, loud environments)
 *
 * @see PROJECT_PLAN.md - Step 1.6: Threshold-Based Classification
 * @see research/prototypes/audio_processor.py - Python implementation (lines 220-235)
 */

import { SpectralFeatures } from '../utils/FFTProcessor';

/**
 * Noise classification categories
 */
export type NoiseCategory = 'Quiet' | 'Normal' | 'Noisy';

/**
 * Classification thresholds (in dB SPL)
 * Matches Python prototype: audio_processor.py line 230-235
 */
export const CLASSIFICATION_THRESHOLDS = {
  /** Below this threshold: Quiet */
  QUIET_UPPER: 50,
  /** Below this threshold: Normal (above QUIET_UPPER) */
  NORMAL_UPPER: 70,
  /** Above NORMAL_UPPER: Noisy */
} as const;

/**
 * Spectral flatness thresholds for noise type detection
 * Flatness = 0: Pure tone (musical, speech)
 * Flatness = 1: White noise (broadband, random)
 */
export const SPECTRAL_THRESHOLDS = {
  /** Below this: Tonal (music, speech) */
  TONAL_UPPER: 0.4,
  /** Above this: Noisy (white noise, static) */
  NOISY_LOWER: 0.6,
} as const;

/**
 * Frequency band thresholds for sound type detection
 */
export const FREQUENCY_THRESHOLDS = {
  /** If low frequency ratio > this: Bass-heavy (traffic, rumble) */
  LOW_DOMINANT: 0.5,
  /** If mid frequency ratio > this: Voice/music dominant */
  MID_DOMINANT: 0.6,
  /** If high frequency ratio > this: High-frequency noise */
  HIGH_DOMINANT: 0.4,
} as const;

/**
 * Classification result with additional metadata
 */
export interface ClassificationResult {
  /** Primary classification category */
  category: NoiseCategory;
  /** Decibel level used for classification */
  decibels: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** Additional descriptive label (optional) */
  description?: string;
  /** Spectral features used (if available) */
  features?: SpectralFeatures;
}

/**
 * NoiseClassifier class for categorizing environmental noise
 *
 * @example
 * ```typescript
 * const classifier = new NoiseClassifier();
 *
 * // Simple classification (decibels only)
 * const result1 = classifier.classifySimple(45);
 * console.log(result1.category); // 'Quiet'
 *
 * // Enhanced classification (with spectral features)
 * const result2 = classifier.classifyEnhanced(65, spectralFeatures);
 * console.log(result2.category); // 'Normal'
 * console.log(result2.description); // 'Voice/Music'
 * ```
 */
export class NoiseClassifier {
  /**
   * Classify noise level using simple threshold-based approach
   *
   * This method matches the Python prototype implementation exactly:
   * ```python
   * def classify_noise_simple(self, avg_db: float) -> str:
   *     if avg_db < 50:
   *         return 'Quiet'
   *     elif avg_db < 70:
   *         return 'Normal'
   *     else:
   *         return 'Noisy'
   * ```
   *
   * @param decibels - Decibel level (dB SPL)
   * @returns Classification result
   *
   * @example
   * ```typescript
   * const classifier = new NoiseClassifier();
   *
   * classifier.classifySimple(30); // { category: 'Quiet', ... }
   * classifier.classifySimple(60); // { category: 'Normal', ... }
   * classifier.classifySimple(85); // { category: 'Noisy', ... }
   * ```
   */
  classifySimple(decibels: number): ClassificationResult {
    // Validate input
    if (!isFinite(decibels) || decibels < 0) {
      throw new Error(`Invalid decibel value: ${decibels}. Must be non-negative finite number.`);
    }

    // Threshold-based classification (matches Python prototype)
    let category: NoiseCategory;
    let confidence: number;

    if (decibels < CLASSIFICATION_THRESHOLDS.QUIET_UPPER) {
      category = 'Quiet';
      // Confidence decreases as we approach threshold
      confidence = Math.max(0, 1 - decibels / CLASSIFICATION_THRESHOLDS.QUIET_UPPER);
    } else if (decibels < CLASSIFICATION_THRESHOLDS.NORMAL_UPPER) {
      category = 'Normal';
      // Confidence highest in the middle of the range
      const midpoint = (CLASSIFICATION_THRESHOLDS.QUIET_UPPER + CLASSIFICATION_THRESHOLDS.NORMAL_UPPER) / 2;
      const distance = Math.abs(decibels - midpoint);
      const maxDistance = (CLASSIFICATION_THRESHOLDS.NORMAL_UPPER - CLASSIFICATION_THRESHOLDS.QUIET_UPPER) / 2;
      confidence = Math.max(0, 1 - distance / maxDistance);
    } else {
      category = 'Noisy';
      // Confidence increases as we go further above threshold
      const excess = decibels - CLASSIFICATION_THRESHOLDS.NORMAL_UPPER;
      confidence = Math.min(1, excess / 30); // Max confidence at 100 dB
    }

    return {
      category,
      decibels,
      confidence: Math.max(0.5, confidence), // Minimum 50% confidence
    };
  }

  /**
   * Classify noise level using enhanced approach with spectral features
   *
   * This method uses both decibel level and spectral characteristics to provide
   * more accurate classification and descriptive labels.
   *
   * @param decibels - Decibel level (dB SPL)
   * @param features - Spectral features from FFT analysis
   * @returns Enhanced classification result with description
   *
   * @example
   * ```typescript
   * const classifier = new NoiseClassifier();
   * const features = fftProcessor.extractSpectralFeatures(freqs, mags);
   *
   * const result = classifier.classifyEnhanced(65, features);
   * console.log(result.category); // 'Normal'
   * console.log(result.description); // 'Voice/Music'
   * console.log(result.confidence); // 0.85
   * ```
   */
  classifyEnhanced(decibels: number, features: SpectralFeatures): ClassificationResult {
    // Start with simple classification
    const baseResult = this.classifySimple(decibels);

    // Add description based on spectral features
    const description = this.describeNoiseType(features, decibels);

    // Adjust confidence based on spectral features
    const spectralConfidence = this.calculateSpectralConfidence(features, baseResult.category);
    const combinedConfidence = (baseResult.confidence + spectralConfidence) / 2;

    return {
      ...baseResult,
      confidence: combinedConfidence,
      description,
      features,
    };
  }

  /**
   * Describe noise type based on spectral features
   *
   * @param features - Spectral features
   * @param decibels - Decibel level (for context)
   * @returns Descriptive label
   * @private
   */
  private describeNoiseType(features: SpectralFeatures, decibels: number): string {
    // Check spectral flatness (tonality vs noisiness)
    if (features.spectralFlatness > SPECTRAL_THRESHOLDS.NOISY_LOWER) {
      return 'White Noise / Static';
    }

    // Check frequency distribution
    if (features.lowFreqRatio > FREQUENCY_THRESHOLDS.LOW_DOMINANT) {
      if (decibels > 70) {
        return 'Traffic / Heavy Machinery';
      } else {
        return 'Low Frequency Rumble';
      }
    }

    if (features.midFreqRatio > FREQUENCY_THRESHOLDS.MID_DOMINANT) {
      if (features.spectralFlatness < SPECTRAL_THRESHOLDS.TONAL_UPPER) {
        return 'Voice / Music';
      } else {
        return 'General Environmental Noise';
      }
    }

    if (features.highFreqRatio > FREQUENCY_THRESHOLDS.HIGH_DOMINANT) {
      return 'High-Frequency Noise';
    }

    // Default based on flatness
    if (features.spectralFlatness < SPECTRAL_THRESHOLDS.TONAL_UPPER) {
      return 'Tonal Sound';
    } else {
      return 'Mixed Noise';
    }
  }

  /**
   * Calculate confidence score based on spectral features
   *
   * @param features - Spectral features
   * @param category - Classification category
   * @returns Confidence score (0-1)
   * @private
   */
  private calculateSpectralConfidence(features: SpectralFeatures, category: NoiseCategory): number {
    // Different features indicate different confidence levels
    let confidence = 0.5; // Base confidence

    // Quiet environments typically have low flatness (tonal) or very high flatness (silence)
    if (category === 'Quiet') {
      if (features.spectralFlatness < 0.3 || features.spectralFlatness > 0.8) {
        confidence += 0.3;
      }
    }

    // Normal environments typically have mid-frequency dominance
    if (category === 'Normal') {
      if (features.midFreqRatio > 0.4) {
        confidence += 0.3;
      }
    }

    // Noisy environments typically have high energy distribution
    if (category === 'Noisy') {
      if (features.lowFreqRatio > 0.3 || features.spectralFlatness > 0.5) {
        confidence += 0.3;
      }
    }

    return Math.min(1.0, confidence);
  }

  /**
   * Get human-readable description for a classification category
   *
   * @param category - Noise category
   * @returns Description string
   *
   * @example
   * ```typescript
   * const classifier = new NoiseClassifier();
   * console.log(classifier.getCategoryDescription('Quiet')); // 'Library, study room'
   * ```
   */
  getCategoryDescription(category: NoiseCategory): string {
    switch (category) {
      case 'Quiet':
        return 'Library, study room, quiet office (<50 dB)';
      case 'Normal':
        return 'Conversation, cafeteria, normal office (50-70 dB)';
      case 'Noisy':
        return 'Traffic, construction, loud environment (>70 dB)';
    }
  }

  /**
   * Get color code for a classification category (for UI display)
   *
   * @param category - Noise category
   * @returns Hex color code
   *
   * @example
   * ```typescript
   * const classifier = new NoiseClassifier();
   * console.log(classifier.getCategoryColor('Quiet')); // '#4CAF50' (green)
   * ```
   */
  getCategoryColor(category: NoiseCategory): string {
    switch (category) {
      case 'Quiet':
        return '#4CAF50'; // Green
      case 'Normal':
        return '#FFC107'; // Yellow/Amber
      case 'Noisy':
        return '#F44336'; // Red
    }
  }

  /**
   * Get emoji icon for a classification category
   *
   * @param category - Noise category
   * @returns Emoji string
   *
   * @example
   * ```typescript
   * const classifier = new NoiseClassifier();
   * console.log(classifier.getCategoryIcon('Quiet')); // '🟢'
   * ```
   */
  getCategoryIcon(category: NoiseCategory): string {
    switch (category) {
      case 'Quiet':
        return '🟢'; // Green circle
      case 'Normal':
        return '🟡'; // Yellow circle
      case 'Noisy':
        return '🔴'; // Red circle
    }
  }
}

/**
 * Helper function for simple classification (stateless)
 *
 * @param decibels - Decibel level
 * @returns Classification category
 *
 * @example
 * ```typescript
 * const category = classifyNoise(45); // 'Quiet'
 * ```
 */
export function classifyNoise(decibels: number): NoiseCategory {
  const classifier = new NoiseClassifier();
  return classifier.classifySimple(decibels).category;
}

/**
 * Helper function for enhanced classification (stateless)
 *
 * @param decibels - Decibel level
 * @param features - Spectral features
 * @returns Classification result
 *
 * @example
 * ```typescript
 * const result = classifyNoiseEnhanced(65, features);
 * console.log(result.category); // 'Normal'
 * console.log(result.description); // 'Voice/Music'
 * ```
 */
export function classifyNoiseEnhanced(
  decibels: number,
  features: SpectralFeatures,
): ClassificationResult {
  const classifier = new NoiseClassifier();
  return classifier.classifyEnhanced(decibels, features);
}
