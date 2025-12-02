/**
 * FFTProcessor - Fast Fourier Transform and spectral feature extraction
 *
 * This module provides FFT analysis and frequency-domain feature extraction for
 * audio signals. It implements the same algorithms as the Python prototype
 * (audio_processor.py) to ensure consistency.
 *
 * Features:
 * - Custom FFT implementation (Cooley-Tukey radix-2 algorithm)
 * - Hamming window for spectral leakage reduction
 * - Real FFT (rfft) for efficiency with real-valued signals
 * - Spectral feature extraction (9 features)
 * - Frequency band energy analysis
 *
 * @see PROJECT_PLAN.md - Step 1.5: FFT Implementation
 * @see research/prototypes/audio_processor.py - Python implementation (lines 137-218)
 */

/**
 * FFT result containing frequencies and their magnitudes
 */
export interface FFTResult {
  /** Frequency bins in Hz */
  frequencies: number[];
  /** Magnitude values for each frequency bin */
  magnitudes: number[];
  /** FFT size used */
  nfft: number;
}

/**
 * Spectral features extracted from FFT analysis
 * Matches Python prototype feature set
 */
export interface SpectralFeatures {
  /** Weighted average of frequencies (Hz) */
  spectralCentroid: number;
  /** Standard deviation of frequencies (Hz) */
  spectralSpread: number;
  /** Frequency below which 85% of energy is contained (Hz) */
  spectralRolloff: number;
  /** Measure of noisiness (0=tonal, 1=noisy) */
  spectralFlatness: number;
  /** Measure of spectral complexity (bits) */
  spectralEntropy: number;
  /** Frequency with highest magnitude (Hz) */
  dominantFrequency: number;
  /** Energy ratio in low frequencies (<250 Hz) */
  lowFreqRatio: number;
  /** Energy ratio in mid frequencies (250-4000 Hz) */
  midFreqRatio: number;
  /** Energy ratio in high frequencies (>4000 Hz) */
  highFreqRatio: number;
}

/**
 * Default FFT size (number of frequency bins)
 * Matches Python prototype: audio_processor.py line 137
 */
export const DEFAULT_FFT_SIZE = 2048;

/**
 * Default sample rate (Hz)
 * Matches AudioService configuration
 */
export const DEFAULT_SAMPLE_RATE = 44100;

/**
 * Frequency band boundaries (Hz)
 * Used for low/mid/high frequency energy analysis
 */
export const FREQ_BANDS = {
  LOW_CUTOFF: 250,    // Low: 0-250 Hz
  MID_CUTOFF: 4000,   // Mid: 250-4000 Hz
  // High: >4000 Hz
};

/**
 * Small epsilon to prevent division by zero and log(0) errors
 */
const EPSILON = 1e-10;

/**
 * FFT Processor class for frequency analysis and feature extraction
 *
 * @example
 * ```typescript
 * const processor = new FFTProcessor(44100);
 *
 * audioService.onAudioSample((sample) => {
 *   // Perform FFT
 *   const fftResult = processor.performFFT(sample.samples);
 *
 *   // Extract features
 *   const features = processor.extractSpectralFeatures(
 *     fftResult.frequencies,
 *     fftResult.magnitudes
 *   );
 *
 *   console.log(`Dominant frequency: ${features.dominantFrequency.toFixed(1)} Hz`);
 *   console.log(`Spectral centroid: ${features.spectralCentroid.toFixed(1)} Hz`);
 * });
 * ```
 */
export class FFTProcessor {
  private sampleRate: number;

  /**
   * Create a new FFT processor
   *
   * @param sampleRate - Sample rate in Hz (default: 44100)
   */
  constructor(sampleRate: number = DEFAULT_SAMPLE_RATE) {
    if (sampleRate <= 0) {
      throw new Error(`Sample rate must be positive, got: ${sampleRate}`);
    }
    this.sampleRate = sampleRate;
  }

  /**
   * Perform Fast Fourier Transform on audio samples
   *
   * This method matches the Python prototype implementation:
   * ```python
   * def perform_fft(self, audio: np.ndarray, n_fft: int = 2048):
   *     window = np.hamming(len(audio))
   *     windowed_audio = audio * window
   *     fft_result = np.fft.rfft(windowed_audio, n=n_fft)
   *     magnitudes = np.abs(fft_result)
   *     frequencies = np.fft.rfftfreq(n_fft, 1/self.sample_rate)
   * ```
   *
   * @param samples - Audio samples (normalized to [-1.0, 1.0])
   * @param nfft - FFT size (default: 2048). Must be power of 2 for optimal performance.
   * @returns FFT result with frequencies and magnitudes
   * @throws Error if samples array is empty or nfft is invalid
   *
   * @example
   * ```typescript
   * const processor = new FFTProcessor(44100);
   * const samples = new Float32Array(44100); // 1 second of audio
   * const result = processor.performFFT(samples);
   *
   * console.log(`Frequency bins: ${result.frequencies.length}`);
   * console.log(`Max frequency: ${result.frequencies[result.frequencies.length - 1]} Hz`);
   * ```
   */
  performFFT(samples: Float32Array, nfft: number = DEFAULT_FFT_SIZE): FFTResult {
    // Validate inputs
    if (samples.length === 0) {
      throw new Error('Cannot perform FFT on empty sample array');
    }

    if (nfft <= 0 || !Number.isInteger(nfft)) {
      throw new Error(`FFT size must be a positive integer, got: ${nfft}`);
    }

    // Check if nfft is power of 2 (optimal for Cooley-Tukey algorithm)
    if ((nfft & (nfft - 1)) !== 0) {
      // Round up to next power of 2
      const nextPow2 = Math.pow(2, Math.ceil(Math.log2(nfft)));
      console.warn(`FFT size ${nfft} is not a power of 2. Using ${nextPow2} for better performance.`);
      nfft = nextPow2;
    }

    // Apply Hamming window to reduce spectral leakage
    const windowedSamples = this.applyHammingWindow(samples);

    // Pad or truncate to nfft size
    const paddedSamples = this.padSamples(windowedSamples, nfft);

    // Perform real FFT (more efficient for real-valued signals)
    const fftComplex = this.rfft(paddedSamples);

    // Calculate magnitude spectrum
    const magnitudes = this.calculateMagnitudes(fftComplex);

    // Calculate corresponding frequencies
    const frequencies = this.rfftfreq(nfft, 1 / this.sampleRate);

    return {
      frequencies: Array.from(frequencies),
      magnitudes: Array.from(magnitudes),
      nfft,
    };
  }

  /**
   * Extract spectral features from FFT output
   *
   * Implements the same features as Python prototype (audio_processor.py lines 163-218):
   * - Spectral centroid
   * - Spectral spread
   * - Spectral rolloff
   * - Spectral flatness
   * - Spectral entropy
   * - Dominant frequency
   * - Low/mid/high frequency energy ratios
   *
   * @param frequencies - Frequency bins in Hz
   * @param magnitudes - Magnitude values for each frequency
   * @returns Spectral features object
   * @throws Error if arrays are empty or have mismatched lengths
   *
   * @example
   * ```typescript
   * const fftResult = processor.performFFT(samples);
   * const features = processor.extractSpectralFeatures(
   *   fftResult.frequencies,
   *   fftResult.magnitudes
   * );
   *
   * if (features.spectralFlatness > 0.5) {
   *   console.log('Noisy signal (high flatness)');
   * } else {
   *   console.log('Tonal signal (low flatness)');
   * }
   * ```
   */
  extractSpectralFeatures(frequencies: number[], magnitudes: number[]): SpectralFeatures {
    // Validate inputs
    if (frequencies.length === 0 || magnitudes.length === 0) {
      throw new Error('Cannot extract features from empty arrays');
    }

    if (frequencies.length !== magnitudes.length) {
      throw new Error(`Frequency and magnitude arrays must have same length. Got ${frequencies.length} and ${magnitudes.length}`);
    }

    // Normalize magnitudes (sum to 1)
    const totalMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0);
    const magnitudesNorm = magnitudes.map(mag => mag / (totalMagnitude + EPSILON));

    // Spectral Centroid (weighted mean of frequencies)
    const spectralCentroid = frequencies.reduce((sum, freq, i) =>
      sum + freq * magnitudesNorm[i], 0
    );

    // Spectral Spread (standard deviation of frequency)
    const spectralSpread = Math.sqrt(
      frequencies.reduce((sum, freq, i) =>
        sum + Math.pow(freq - spectralCentroid, 2) * magnitudesNorm[i], 0
      )
    );

    // Spectral Rolloff (frequency below which 85% of energy is contained)
    let cumulativeEnergy = 0;
    let rolloffIndex = frequencies.length - 1;
    for (let i = 0; i < magnitudesNorm.length; i++) {
      cumulativeEnergy += magnitudesNorm[i];
      if (cumulativeEnergy >= 0.85) {
        rolloffIndex = i;
        break;
      }
    }
    const spectralRolloff = frequencies[rolloffIndex];

    // Spectral Flatness (measure of noisiness)
    // Ratio of geometric mean to arithmetic mean
    const geometricMean = Math.exp(
      magnitudes.reduce((sum, mag) =>
        sum + Math.log(mag + EPSILON), 0
      ) / magnitudes.length
    );
    const arithmeticMean = magnitudes.reduce((sum, mag) =>
      sum + mag, 0
    ) / magnitudes.length;
    const spectralFlatness = geometricMean / (arithmeticMean + EPSILON);

    // Spectral Entropy (measure of spectral complexity)
    const spectralEntropy = -magnitudesNorm.reduce((sum, normMag) =>
      sum + (normMag > 0 ? normMag * Math.log2(normMag + EPSILON) : 0), 0
    );

    // Dominant frequency (frequency with highest magnitude)
    let maxMagnitude = -Infinity;
    let dominantFreqIndex = 0;
    for (let i = 0; i < magnitudes.length; i++) {
      if (magnitudes[i] > maxMagnitude) {
        maxMagnitude = magnitudes[i];
        dominantFreqIndex = i;
      }
    }
    const dominantFrequency = frequencies[dominantFreqIndex];

    // Energy in different frequency bands
    let lowFreqEnergy = 0;
    let midFreqEnergy = 0;
    let highFreqEnergy = 0;

    for (let i = 0; i < frequencies.length; i++) {
      const freq = frequencies[i];
      const mag = magnitudes[i];

      if (freq < FREQ_BANDS.LOW_CUTOFF) {
        lowFreqEnergy += mag;
      } else if (freq < FREQ_BANDS.MID_CUTOFF) {
        midFreqEnergy += mag;
      } else {
        highFreqEnergy += mag;
      }
    }

    const totalEnergy = lowFreqEnergy + midFreqEnergy + highFreqEnergy + EPSILON;

    return {
      spectralCentroid,
      spectralSpread,
      spectralRolloff,
      spectralFlatness,
      spectralEntropy,
      dominantFrequency,
      lowFreqRatio: lowFreqEnergy / totalEnergy,
      midFreqRatio: midFreqEnergy / totalEnergy,
      highFreqRatio: highFreqEnergy / totalEnergy,
    };
  }

  /**
   * Apply Hamming window to reduce spectral leakage
   *
   * Hamming window formula: w(n) = 0.54 - 0.46 * cos(2π * n / (N-1))
   *
   * @param samples - Input samples
   * @returns Windowed samples
   */
  private applyHammingWindow(samples: Float32Array): Float32Array {
    const N = samples.length;
    const windowed = new Float32Array(N);

    for (let n = 0; n < N; n++) {
      const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
      windowed[n] = samples[n] * window;
    }

    return windowed;
  }

  /**
   * Pad or truncate samples to target length
   *
   * @param samples - Input samples
   * @param targetLength - Desired length
   * @returns Padded/truncated samples
   */
  private padSamples(samples: Float32Array, targetLength: number): Float32Array {
    if (samples.length === targetLength) {
      return samples;
    }

    const result = new Float32Array(targetLength);

    if (samples.length < targetLength) {
      // Pad with zeros
      result.set(samples);
    } else {
      // Truncate
      result.set(samples.subarray(0, targetLength));
    }

    return result;
  }

  /**
   * Real FFT (more efficient for real-valued signals)
   *
   * Computes only the positive frequencies since negative frequencies
   * are complex conjugates for real input.
   *
   * @param samples - Real-valued input samples
   * @returns Complex FFT result (array of [real, imag] pairs)
   */
  private rfft(samples: Float32Array): number[][] {
    const N = samples.length;

    // Convert to complex representation (imaginary part = 0)
    const complex: number[][] = new Array(N);
    for (let i = 0; i < N; i++) {
      complex[i] = [samples[i], 0];
    }

    // Perform full FFT
    const fftResult = this.fft(complex);

    // Return only positive frequencies (first N/2 + 1 bins)
    return fftResult.slice(0, Math.floor(N / 2) + 1);
  }

  /**
   * Fast Fourier Transform (Cooley-Tukey radix-2 algorithm)
   *
   * Implements the classic FFT algorithm with O(N log N) complexity.
   *
   * @param complex - Array of [real, imag] pairs
   * @returns FFT result as array of [real, imag] pairs
   */
  private fft(complex: number[][]): number[][] {
    const N = complex.length;

    // Base case
    if (N <= 1) {
      return complex;
    }

    // Divide
    const even: number[][] = [];
    const odd: number[][] = [];

    for (let i = 0; i < N; i++) {
      if (i % 2 === 0) {
        even.push(complex[i]);
      } else {
        odd.push(complex[i]);
      }
    }

    // Conquer
    const fftEven = this.fft(even);
    const fftOdd = this.fft(odd);

    // Combine
    const result: number[][] = new Array(N);

    for (let k = 0; k < N / 2; k++) {
      const angle = (-2 * Math.PI * k) / N;
      const twiddle = [Math.cos(angle), Math.sin(angle)]; // e^(-2πik/N)

      // Complex multiplication: twiddle * fftOdd[k]
      const [oddReal, oddImag] = fftOdd[k];
      const twiddleReal = twiddle[0] * oddReal - twiddle[1] * oddImag;
      const twiddleImag = twiddle[0] * oddImag + twiddle[1] * oddReal;

      // Butterfly operation
      const [evenReal, evenImag] = fftEven[k];

      result[k] = [
        evenReal + twiddleReal,
        evenImag + twiddleImag,
      ];

      result[k + N / 2] = [
        evenReal - twiddleReal,
        evenImag - twiddleImag,
      ];
    }

    return result;
  }

  /**
   * Calculate magnitude spectrum from complex FFT result
   *
   * Magnitude = sqrt(real² + imag²)
   *
   * @param complex - Array of [real, imag] pairs
   * @returns Magnitude values
   */
  private calculateMagnitudes(complex: number[][]): number[] {
    return complex.map(([real, imag]) =>
      Math.sqrt(real * real + imag * imag)
    );
  }

  /**
   * Calculate frequency bins for real FFT
   *
   * Matches numpy.fft.rfftfreq behavior
   *
   * @param nfft - FFT size
   * @param d - Sample spacing (1/sample_rate)
   * @returns Frequency bins in Hz
   */
  private rfftfreq(nfft: number, d: number): number[] {
    const n = Math.floor(nfft / 2) + 1;
    const frequencies = new Array(n);

    for (let i = 0; i < n; i++) {
      frequencies[i] = i / (nfft * d);
    }

    return frequencies;
  }

  /**
   * Get the configured sample rate
   *
   * @returns Sample rate in Hz
   */
  getSampleRate(): number {
    return this.sampleRate;
  }
}
