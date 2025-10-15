/**
 * MovingAverageFilter - Smooth out noise in decibel readings
 *
 * TODO (Step 1.4):
 * - Implement sliding window filter
 * - Maintain buffer of last N readings
 * - Calculate average of buffer
 * - Handle buffer initialization
 *
 * Window size: 10 samples (adjustable)
 *
 * Use case:
 * - Smooth out sudden spikes (e.g., someone clapping)
 * - Provide stable readings for classification
 *
 * @see PROJECT_PLAN.md - Step 1.4: Moving Average Filter
 */

export class MovingAverageFilter {
  private buffer: number[] = [];
  private windowSize: number;

  constructor(windowSize: number = 10) {
    this.windowSize = windowSize;
  }

  /**
   * Add a new value and return the smoothed average
   * @param value - New decibel value
   * @returns Filtered (smoothed) value
   */
  add(value: number): number {
    // TODO: Implement moving average
    // 1. Add value to buffer
    // 2. Remove oldest value if buffer exceeds window size
    // 3. Calculate and return average
    throw new Error('Not implemented');
  }

  /**
   * Reset the filter buffer
   */
  reset(): void {
    this.buffer = [];
  }

  /**
   * Get current buffer state (for debugging)
   */
  getBuffer(): number[] {
    return [...this.buffer];
  }
}

/**
 * Simple helper function for applying moving average to array
 * @param data - Array of values
 * @param windowSize - Size of moving window
 * @returns Smoothed array
 */
export function applyMovingAverage(
  data: number[],
  windowSize: number
): number[] {
  // TODO: Implement array-based moving average
  throw new Error('Not implemented');
}
