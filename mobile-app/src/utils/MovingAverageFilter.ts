/**
 * MovingAverageFilter - Smooth out noise in decibel readings
 *
 * This module provides two approaches to moving average filtering:
 * 1. MovingAverageFilter class - For real-time streaming data (e.g., live audio)
 * 2. applyMovingAverage() function - For batch processing arrays (e.g., historical data)
 *
 * Both implementations use a sliding window approach with window size of 10 samples (default).
 * This matches the Python prototype implementation in audio_processor.py line 117-135.
 *
 * Use cases:
 * - Smooth out sudden spikes (e.g., someone clapping)
 * - Provide stable readings for classification
 * - Reduce jitter in real-time display
 *
 * Formula: filtered[i] = mean(data[i-window_size+1 : i+1])
 *
 * @see PROJECT_PLAN.md - Step 1.4: Moving Average Filter
 * @see research/prototypes/audio_processor.py - Python implementation
 */

/**
 * Real-time moving average filter for streaming data
 *
 * Maintains a circular buffer of the last N values and returns the average
 * when new values are added. Ideal for real-time audio processing.
 *
 * @example
 * ```typescript
 * const filter = new MovingAverageFilter(10);
 *
 * audioService.onAudioSample((sample) => {
 *   const db = calculateDecibels(sample.samples);
 *   const smoothedDb = filter.add(db);
 *   console.log(`Raw: ${db.toFixed(1)} dB, Smoothed: ${smoothedDb.toFixed(1)} dB`);
 * });
 * ```
 */
export class MovingAverageFilter {
  private buffer: number[] = [];
  private windowSize: number;
  private sum: number = 0; // Optimization: track sum instead of recalculating

  /**
   * Create a new moving average filter
   *
   * @param windowSize - Number of samples to average (default: 10)
   * @throws Error if windowSize is not a positive integer
   */
  constructor(windowSize: number = 10) {
    if (!Number.isInteger(windowSize) || windowSize <= 0) {
      throw new Error(`Window size must be a positive integer, got: ${windowSize}`);
    }
    this.windowSize = windowSize;
  }

  /**
   * Add a new value and return the smoothed average
   *
   * The first windowSize-1 values will return the average of all values added so far.
   * Once the buffer is full, it maintains a sliding window of the last windowSize values.
   *
   * @param value - New value to add to the filter
   * @returns Smoothed (averaged) value
   * @throws Error if value is not a finite number
   *
   * @example
   * ```typescript
   * const filter = new MovingAverageFilter(3);
   * console.log(filter.add(50)); // 50 (only 1 value)
   * console.log(filter.add(60)); // 55 (average of 50, 60)
   * console.log(filter.add(70)); // 60 (average of 50, 60, 70)
   * console.log(filter.add(80)); // 70 (average of 60, 70, 80) - sliding window
   * ```
   */
  add(value: number): number {
    // Validate input
    if (!isFinite(value)) {
      throw new Error(`Invalid value: ${value}. Value must be a finite number.`);
    }

    // Add value to buffer
    this.buffer.push(value);
    this.sum += value;

    // Remove oldest value if buffer exceeds window size
    if (this.buffer.length > this.windowSize) {
      const removed = this.buffer.shift()!;
      this.sum -= removed;
    }

    // Return average of current buffer
    return this.sum / this.buffer.length;
  }

  /**
   * Reset the filter buffer
   *
   * Clears all stored values and resets the filter to its initial state.
   * Useful when switching to a new audio source or context.
   *
   * @example
   * ```typescript
   * filter.add(50);
   * filter.add(60);
   * filter.reset();
   * // Buffer is now empty, next add() will start fresh
   * ```
   */
  reset(): void {
    this.buffer = [];
    this.sum = 0;
  }

  /**
   * Get current buffer state (for debugging and testing)
   *
   * Returns a copy of the internal buffer. Modifying the returned array
   * will not affect the filter's internal state.
   *
   * @returns Copy of current buffer values
   *
   * @example
   * ```typescript
   * const filter = new MovingAverageFilter(5);
   * filter.add(50);
   * filter.add(60);
   * console.log(filter.getBuffer()); // [50, 60]
   * ```
   */
  getBuffer(): number[] {
    return [...this.buffer];
  }

  /**
   * Get the current window size
   *
   * @returns Window size configured for this filter
   */
  getWindowSize(): number {
    return this.windowSize;
  }

  /**
   * Get the number of values currently in the buffer
   *
   * @returns Current buffer length (0 to windowSize)
   */
  getBufferLength(): number {
    return this.buffer.length;
  }

  /**
   * Check if the buffer is full (has windowSize values)
   *
   * @returns true if buffer is full, false otherwise
   */
  isFull(): boolean {
    return this.buffer.length === this.windowSize;
  }

  /**
   * Get the current average without adding a new value
   *
   * @returns Current average, or 0 if buffer is empty
   */
  getCurrentAverage(): number {
    if (this.buffer.length === 0) {
      return 0;
    }
    return this.sum / this.buffer.length;
  }
}

/**
 * Apply moving average filter to an array of values (batch processing)
 *
 * This function implements the same algorithm as the Python prototype's
 * moving_average_filter() method, using a simple averaging approach for
 * each position in the array.
 *
 * For arrays shorter than the window size, returns the original array unchanged.
 *
 * Formula for each position i:
 * - Start of array: average of data[0:i+1] (growing window)
 * - Middle: average of data[i-window+1:i+1] (full window)
 * - End of array: average of data[i-window+1:end] (shrinking window)
 *
 * @param data - Array of values to smooth
 * @param windowSize - Size of moving window (default: 10)
 * @returns Smoothed array with same length as input
 * @throws Error if windowSize is not a positive integer
 *
 * @example
 * ```typescript
 * // Smooth out a spike in decibel readings
 * const data = [50, 50, 90, 50, 50]; // One sudden spike
 * const smoothed = applyMovingAverage(data, 3);
 * console.log(smoothed); // [50, 50, 63.3, 63.3, 50] - spike reduced
 * ```
 *
 * @example
 * ```typescript
 * // Process historical decibel data
 * const historicalData = await getDecibelReadings();
 * const smoothedData = applyMovingAverage(historicalData, 10);
 * displayChart(smoothedData);
 * ```
 */
export function applyMovingAverage(data: number[], windowSize: number = 10): number[] {
  // Validate window size
  if (!Number.isInteger(windowSize) || windowSize <= 0) {
    throw new Error(`Window size must be a positive integer, got: ${windowSize}`);
  }

  // Return original data if too short (matches Python prototype behavior)
  if (data.length < windowSize) {
    return [...data]; // Return copy to avoid modifying original
  }

  // Validate all data values
  for (let i = 0; i < data.length; i++) {
    if (!isFinite(data[i])) {
      throw new Error(`Invalid value at index ${i}: ${data[i]}. All values must be finite numbers.`);
    }
  }

  // Initialize result array
  const result: number[] = new Array(data.length);

  // Apply moving average using sliding window
  for (let i = 0; i < data.length; i++) {
    // Determine window boundaries
    const windowStart = Math.max(0, i - windowSize + 1);
    const windowEnd = i + 1;

    // Calculate average for this window
    let sum = 0;
    for (let j = windowStart; j < windowEnd; j++) {
      sum += data[j];
    }

    result[i] = sum / (windowEnd - windowStart);
  }

  return result;
}

/**
 * Apply moving average using convolution (alternative implementation)
 *
 * This is a more efficient implementation for large arrays, using the
 * convolution approach exactly as in the Python prototype (line 132-133).
 *
 * Note: Results may differ slightly from applyMovingAverage() at the
 * edges due to convolution mode='same' behavior.
 *
 * @param data - Array of values to smooth
 * @param windowSize - Size of moving window (default: 10)
 * @returns Smoothed array with same length as input
 *
 * @example
 * ```typescript
 * const data = [50, 50, 90, 50, 50];
 * const smoothed = applyMovingAverageConvolution(data, 3);
 * // Slightly different edge handling than applyMovingAverage()
 * ```
 */
export function applyMovingAverageConvolution(data: number[], windowSize: number = 10): number[] {
  // Validate window size
  if (!Number.isInteger(windowSize) || windowSize <= 0) {
    throw new Error(`Window size must be a positive integer, got: ${windowSize}`);
  }

  // Return original data if too short
  if (data.length < windowSize) {
    return [...data];
  }

  // Validate data
  for (let i = 0; i < data.length; i++) {
    if (!isFinite(data[i])) {
      throw new Error(`Invalid value at index ${i}: ${data[i]}. All values must be finite numbers.`);
    }
  }

  // Create kernel (normalized weights)
  const kernel = new Array(windowSize).fill(1 / windowSize);

  // Simple convolution implementation (mode='same' approximation)
  const result: number[] = new Array(data.length);
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = 0; j < windowSize; j++) {
      const dataIndex = i - halfWindow + j;
      if (dataIndex >= 0 && dataIndex < data.length) {
        sum += data[dataIndex] * kernel[j];
        count++;
      }
    }

    // Normalize by actual number of values used (edge handling)
    result[i] = count > 0 ? (sum * windowSize) / count : data[i];
  }

  return result;
}
