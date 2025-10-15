/**
 * DecibelCalculator - Convert audio samples to decibel (dB SPL)
 *
 * This module provides functions to calculate decibel levels from audio samples
 * using the same formulas as the Python prototype (audio_processor.py).
 *
 * Formulas:
 * - RMS = sqrt(mean(samples²))
 * - dB = 20 × log10(RMS / reference) + calibration_offset
 *
 * Reference value: 20e-6 (20 micropascals - standard for dB SPL)
 * Calibration offset: 94 dB (matches Python prototype)
 *
 * @see PROJECT_PLAN.md - Step 1.3: Decibel Calculation
 * @see research/prototypes/audio_processor.py - Python implementation
 */

/**
 * Standard reference pressure for dB SPL calculation
 * 20 micropascals (threshold of human hearing)
 *
 * Note: This value is defined for reference but not actually used in the calculation.
 * The Python prototype defines this but doesn't use it in the formula.
 * The calibration offset handles the conversion from normalized samples to dB SPL.
 */
export const REFERENCE_PRESSURE = 20e-6;

/**
 * Calibration offset to normalize dB values to typical environmental range (0-120 dB)
 * This matches the calibration used in the Python prototype (audio_processor.py line 112)
 *
 * The calibration offset is needed because:
 * 1. Raw audio samples are normalized to [-1.0, 1.0] range
 * 2. This normalization doesn't directly correspond to real-world pressure values
 * 3. The offset adjusts the calculated dB to match real-world SPL measurements
 * 4. Python formula: db = 20 * log10(rms + epsilon) + 94
 */
export const CALIBRATION_OFFSET = 94;

/**
 * Epsilon value to prevent log(0) errors
 * Added to RMS value before logarithm calculation
 */
export const EPSILON = 1e-10;

/**
 * Minimum valid decibel value (silence/quiet environment)
 */
export const MIN_DECIBELS = 0;

/**
 * Maximum valid decibel value (extremely loud - hearing damage threshold)
 */
export const MAX_DECIBELS = 120;

/**
 * Calculate Root Mean Square (RMS) of audio samples
 *
 * RMS provides a measure of the signal's power/amplitude.
 * Formula: RMS = sqrt(mean(samples²))
 *
 * This implementation matches the Python prototype:
 * ```python
 * def calculate_rms(self, audio: np.ndarray) -> float:
 *     return np.sqrt(np.mean(audio**2))
 * ```
 *
 * @param samples - Float32Array of audio samples (normalized to [-1.0, 1.0])
 * @returns RMS value (non-negative number)
 * @throws Error if samples array is empty or contains invalid values
 *
 * @example
 * ```typescript
 * const samples = new Float32Array([0.1, -0.2, 0.3, -0.1]);
 * const rms = calculateRMS(samples);
 * console.log(rms); // ~0.184
 * ```
 */
export function calculateRMS(samples: Float32Array): number {
  // Edge case: empty array
  if (samples.length === 0) {
    throw new Error('Cannot calculate RMS of empty sample array');
  }

  // Calculate sum of squares
  let sumOfSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];

    // Check for invalid values (NaN or Infinity)
    if (!isFinite(sample)) {
      throw new Error(
        `Invalid sample value at index ${i}: ${sample}. All samples must be finite numbers.`,
      );
    }

    sumOfSquares += sample * sample;
  }

  // Calculate mean of squares
  const meanSquare = sumOfSquares / samples.length;

  // Return square root of mean (RMS)
  return Math.sqrt(meanSquare);
}

/**
 * Calculate decibel level (dB SPL) from audio samples
 *
 * Converts RMS amplitude to decibels using calibration to match real-world measurements.
 *
 * Formula (matches Python prototype exactly):
 * dB = 20 × log10(RMS + epsilon) + calibration_offset
 *
 * This implementation matches the Python prototype:
 * ```python
 * rms = self.calculate_rms(window)
 * epsilon = 1e-10
 * db = 20 * np.log10(rms + epsilon)
 * db_normalized = db + 94  # Calibration offset
 * ```
 *
 * The result is clamped to the range [0, 120] dB:
 * - 0 dB: Silence/very quiet
 * - 30 dB: Whisper
 * - 60 dB: Normal conversation
 * - 90 dB: Loud traffic
 * - 120 dB: Painfully loud (hearing damage threshold)
 *
 * @param samples - Float32Array of audio samples (normalized to [-1.0, 1.0])
 * @param calibrationOffset - Calibration offset in dB (default: 94)
 * @returns Decibel level in range [0, 120] dB SPL
 * @throws Error if samples array is empty or contains invalid values
 *
 * @example
 * ```typescript
 * // Quiet sine wave (amplitude 0.01)
 * const quietSamples = new Float32Array(1000).map((_, i) =>
 *   0.01 * Math.sin(2 * Math.PI * 440 * i / 44100)
 * );
 * const quietDb = calculateDecibels(quietSamples);
 * console.log(quietDb); // ~40-50 dB (quiet)
 *
 * // Loud sine wave (amplitude 0.3)
 * const loudSamples = new Float32Array(1000).map((_, i) =>
 *   0.3 * Math.sin(2 * Math.PI * 440 * i / 44100)
 * );
 * const loudDb = calculateDecibels(loudSamples);
 * console.log(loudDb); // ~80-90 dB (loud)
 * ```
 */
export function calculateDecibels(
  samples: Float32Array,
  calibrationOffset: number = CALIBRATION_OFFSET,
): number {
  // Calculate RMS (throws error if samples invalid)
  const rms = calculateRMS(samples);

  // Add epsilon to prevent log(0) errors
  // This matches the Python prototype implementation
  const rmsWithEpsilon = rms + EPSILON;

  // Convert RMS to decibels
  // Note: Python formula does NOT divide by reference value
  // Formula: dB = 20 * log10(RMS + epsilon) + calibration_offset
  const db = 20 * Math.log10(rmsWithEpsilon);

  // Apply calibration offset to match real-world measurements
  const dbCalibrated = db + calibrationOffset;

  // Clamp to valid range [0, 120] dB
  // Values outside this range are either errors or extreme edge cases
  return Math.max(MIN_DECIBELS, Math.min(MAX_DECIBELS, dbCalibrated));
}

/**
 * Calculate decibels from RMS value directly
 *
 * Utility function for when RMS has already been calculated.
 * Uses the same formula as calculateDecibels() but skips RMS calculation.
 *
 * Formula: dB = 20 × log10(RMS + epsilon) + calibration_offset
 *
 * @param rms - Pre-calculated RMS value
 * @param calibrationOffset - Calibration offset in dB (default: 94)
 * @returns Decibel level in range [0, 120] dB SPL
 *
 * @example
 * ```typescript
 * const rms = calculateRMS(samples);
 * const db = calculateDecibelsFromRMS(rms);
 * ```
 */
export function calculateDecibelsFromRMS(
  rms: number,
  calibrationOffset: number = CALIBRATION_OFFSET,
): number {
  // Validate RMS
  if (!isFinite(rms) || rms < 0) {
    throw new Error(`Invalid RMS value: ${rms}. RMS must be a non-negative finite number.`);
  }

  // Add epsilon to prevent log(0) errors
  const rmsWithEpsilon = rms + EPSILON;

  // Convert to decibels with calibration (matches Python formula)
  const db = 20 * Math.log10(rmsWithEpsilon);
  const dbCalibrated = db + calibrationOffset;

  // Clamp to valid range
  return Math.max(MIN_DECIBELS, Math.min(MAX_DECIBELS, dbCalibrated));
}
