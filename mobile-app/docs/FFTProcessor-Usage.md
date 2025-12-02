# FFTProcessor Usage Guide

## Overview

The `FFTProcessor` module provides Fast Fourier Transform (FFT) analysis and spectral feature extraction for audio signals. It implements the same algorithms as the Python prototype (`audio_processor.py`) to ensure consistency between prototype and production code.

## Installation

The module is located at: `mobile-app/src/utils/FFTProcessor.ts`

No additional dependencies required - uses custom FFT implementation.

## Why Use FFT?

FFT (Fast Fourier Transform) converts audio from time domain to frequency domain, revealing:

- **Which frequencies are present** - Distinguish speech from music from noise
- **Dominant frequencies** - Identify specific sounds (e.g., 440 Hz = A note)
- **Frequency distribution** - Low/mid/high frequency energy ratios
- **Spectral characteristics** - Tonality, complexity, spectral shape

This information is crucial for accurate noise classification beyond simple decibel levels.

## Classes and Interfaces

### FFTProcessor (Class)

Main processor for FFT analysis and feature extraction.

**Constructor:**
```typescript
constructor(sampleRate: number = 44100)
```

**Parameters:**
- `sampleRate` - Sample rate in Hz (default: 44100)

### FFTResult (Interface)

```typescript
interface FFTResult {
  frequencies: number[];   // Frequency bins in Hz
  magnitudes: number[];    // Magnitude values for each frequency
  nfft: number;           // FFT size used
}
```

### SpectralFeatures (Interface)

```typescript
interface SpectralFeatures {
  spectralCentroid: number;      // Weighted average frequency (Hz)
  spectralSpread: number;        // Frequency standard deviation (Hz)
  spectralRolloff: number;       // 85% energy frequency (Hz)
  spectralFlatness: number;      // Noisiness (0=tonal, 1=noisy)
  spectralEntropy: number;       // Spectral complexity (bits)
  dominantFrequency: number;     // Highest magnitude frequency (Hz)
  lowFreqRatio: number;          // Energy in 0-250 Hz
  midFreqRatio: number;          // Energy in 250-4000 Hz
  highFreqRatio: number;         // Energy in >4000 Hz
}
```

## Methods

### performFFT(samples, nfft)

Performs Fast Fourier Transform on audio samples.

**Signature:**
```typescript
performFFT(samples: Float32Array, nfft: number = 2048): FFTResult
```

**Parameters:**
- `samples` - Audio samples (normalized to [-1.0, 1.0])
- `nfft` - FFT size (default: 2048, should be power of 2)

**Returns:** FFTResult with frequencies and magnitudes

**Throws:** Error if samples array is empty or nfft is invalid

**Features:**
- Applies Hamming window to reduce spectral leakage
- Real FFT (rfft) for efficiency with real-valued signals
- Returns only positive frequencies (N/2 + 1 bins)
- Frequency resolution: sample_rate / nfft

**Example:**
```typescript
import { FFTProcessor } from './utils/FFTProcessor';

const processor = new FFTProcessor(44100);

audioService.onAudioSample((sample) => {
  // Perform FFT on 1 second of audio
  const fftResult = processor.performFFT(sample.samples);

  console.log(`Frequency bins: ${fftResult.frequencies.length}`);
  console.log(`Max frequency: ${fftResult.frequencies[fftResult.frequencies.length - 1]} Hz`);
});
```

### extractSpectralFeatures(frequencies, magnitudes)

Extracts 9 spectral features from FFT output.

**Signature:**
```typescript
extractSpectralFeatures(frequencies: number[], magnitudes: number[]): SpectralFeatures
```

**Parameters:**
- `frequencies` - Frequency bins in Hz
- `magnitudes` - Magnitude values for each frequency

**Returns:** SpectralFeatures object

**Throws:** Error if arrays are empty or have mismatched lengths

**Example:**
```typescript
const processor = new FFTProcessor(44100);

audioService.onAudioSample((sample) => {
  // Perform FFT
  const fftResult = processor.performFFT(sample.samples);

  // Extract features
  const features = processor.extractSpectralFeatures(
    fftResult.frequencies,
    fftResult.magnitudes
  );

  console.log(`Dominant frequency: ${features.dominantFrequency.toFixed(1)} Hz`);
  console.log(`Spectral centroid: ${features.spectralCentroid.toFixed(1)} Hz`);
  console.log(`Spectral flatness: ${features.spectralFlatness.toFixed(3)}`);

  // Interpret flatness
  if (features.spectralFlatness > 0.5) {
    console.log('Noisy signal (high flatness)');
  } else {
    console.log('Tonal signal (low flatness)');
  }
});
```

## Constants

```typescript
export const DEFAULT_FFT_SIZE = 2048;           // Default FFT size
export const DEFAULT_SAMPLE_RATE = 44100;       // Default sample rate (Hz)
export const FREQ_BANDS = {
  LOW_CUTOFF: 250,    // Low frequency cutoff (Hz)
  MID_CUTOFF: 4000,   // Mid frequency cutoff (Hz)
};
```

## Integration Examples

### Example 1: Complete Audio Analysis Pipeline

```typescript
import AudioService from './services/AudioService';
import { calculateDecibels } from './utils/DecibelCalculator';
import { MovingAverageFilter } from './utils/MovingAverageFilter';
import { FFTProcessor } from './utils/FFTProcessor';

// Initialize components
const audioService = new AudioService();
const filter = new MovingAverageFilter(10);
const fftProcessor = new FFTProcessor(44100);

// Process audio samples
audioService.onAudioSample((sample) => {
  // 1. Calculate decibels
  const rawDb = calculateDecibels(sample.samples);
  const smoothedDb = filter.add(rawDb);

  // 2. Perform FFT
  const fftResult = fftProcessor.performFFT(sample.samples);

  // 3. Extract spectral features
  const features = fftProcessor.extractSpectralFeatures(
    fftResult.frequencies,
    fftResult.magnitudes
  );

  // 4. Use features for classification
  const classification = classifyNoise(smoothedDb, features);

  console.log(`${smoothedDb.toFixed(1)} dB | ${classification}`);
  console.log(`Dominant: ${features.dominantFrequency.toFixed(0)} Hz`);
  console.log(`Centroid: ${features.spectralCentroid.toFixed(0)} Hz`);
});

await audioService.startRecording();
```

### Example 2: Frequency Analysis

```typescript
import { FFTProcessor } from './utils/FFTProcessor';

const processor = new FFTProcessor(44100);

audioService.onAudioSample((sample) => {
  const fftResult = processor.performFFT(sample.samples);

  // Find dominant frequency
  let maxMagnitude = -Infinity;
  let dominantIndex = 0;

  for (let i = 0; i < fftResult.magnitudes.length; i++) {
    if (fftResult.magnitudes[i] > maxMagnitude) {
      maxMagnitude = fftResult.magnitudes[i];
      dominantIndex = i;
    }
  }

  const dominantFreq = fftResult.frequencies[dominantIndex];

  // Identify sound type based on frequency
  let soundType;
  if (dominantFreq < 250) {
    soundType = 'Low frequency (bass, rumble)';
  } else if (dominantFreq < 4000) {
    soundType = 'Mid frequency (voice, music)';
  } else {
    soundType = 'High frequency (treble, high-pitched)';
  }

  console.log(`${dominantFreq.toFixed(0)} Hz - ${soundType}`);
});
```

### Example 3: Detecting Specific Sounds

```typescript
import { FFTProcessor } from './utils/FFTProcessor';

const processor = new FFTProcessor(44100);

function detectSoundType(features: SpectralFeatures): string {
  // Voice detection (mid frequencies dominant)
  if (features.midFreqRatio > 0.6 && features.spectralFlatness < 0.4) {
    return 'Human Voice';
  }

  // Music detection (tonal with distributed frequencies)
  if (features.spectralFlatness < 0.3 && features.spectralSpread > 500) {
    return 'Music';
  }

  // Traffic noise (low frequencies, noisy)
  if (features.lowFreqRatio > 0.4 && features.spectralFlatness > 0.5) {
    return 'Traffic/Rumble';
  }

  // High-frequency noise (AC, electronics)
  if (features.highFreqRatio > 0.4) {
    return 'High-Frequency Noise';
  }

  // White noise (flat spectrum)
  if (features.spectralFlatness > 0.7) {
    return 'White Noise';
  }

  return 'General Noise';
}

audioService.onAudioSample((sample) => {
  const fftResult = processor.performFFT(sample.samples);
  const features = processor.extractSpectralFeatures(
    fftResult.frequencies,
    fftResult.magnitudes
  );

  const soundType = detectSoundType(features);
  console.log(`Detected: ${soundType}`);
});
```

### Example 4: Frequency Visualization Data

```typescript
import { FFTProcessor } from './utils/FFTProcessor';

const processor = new FFTProcessor(44100);

audioService.onAudioSample((sample) => {
  const fftResult = processor.performFFT(sample.samples, 512); // Smaller FFT for visualization

  // Prepare data for frequency spectrum chart
  const chartData = {
    labels: fftResult.frequencies.slice(0, 100).map(f => `${f.toFixed(0)} Hz`),
    datasets: [{
      label: 'Magnitude Spectrum',
      data: fftResult.magnitudes.slice(0, 100),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  updateFrequencyChart(chartData);
});
```

## Spectral Features Explained

### 1. Spectral Centroid
**What it is:** Weighted average of frequencies (center of mass of spectrum)

**Interpretation:**
- **Low centroid** (~500 Hz): Bass-heavy sounds, rumble, low-frequency noise
- **Mid centroid** (~2000 Hz): Balanced sound, typical environmental noise
- **High centroid** (~5000+ Hz): Treble-heavy sounds, high-pitched noise

**Use case:** Distinguishing deep rumble from high-pitched noise

### 2. Spectral Spread
**What it is:** Standard deviation of frequencies around centroid

**Interpretation:**
- **Low spread** (<500 Hz): Pure tones, narrowband sounds
- **High spread** (>2000 Hz): Complex sounds, broadband noise

**Use case:** Identifying simple vs complex sounds

### 3. Spectral Rolloff
**What it is:** Frequency below which 85% of energy is contained

**Interpretation:**
- **Low rolloff** (<2000 Hz): Energy concentrated in low frequencies
- **High rolloff** (>8000 Hz): Energy spread across wide frequency range

**Use case:** Characterizing frequency distribution

### 4. Spectral Flatness
**What it is:** Ratio of geometric mean to arithmetic mean (0=tonal, 1=noisy)

**Interpretation:**
- **Low flatness** (<0.3): Tonal, musical, speech
- **Mid flatness** (0.3-0.7): Mixed tonal and noisy
- **High flatness** (>0.7): White noise, hiss, static

**Use case:** Distinguishing music/speech from pure noise

### 5. Spectral Entropy
**What it is:** Measure of spectral complexity

**Interpretation:**
- **Low entropy**: Simple spectrum (few frequencies)
- **High entropy**: Complex spectrum (many frequencies)

**Use case:** Measuring signal complexity

### 6. Dominant Frequency
**What it is:** Frequency with highest magnitude

**Interpretation:**
- **60 Hz**: Electrical hum
- **440 Hz**: A note (musical tone)
- **1000-3000 Hz**: Human voice range

**Use case:** Identifying specific sounds

### 7. Low/Mid/High Frequency Ratios
**What they are:** Energy distribution across frequency bands

**Bands:**
- **Low**: 0-250 Hz (bass, rumble, traffic)
- **Mid**: 250-4000 Hz (voice, music, most environmental sounds)
- **High**: >4000 Hz (treble, high-pitched sounds)

**Interpretation:**
- **High low ratio** (>0.5): Bass-heavy (traffic, machinery)
- **High mid ratio** (>0.6): Voice/music dominant
- **High high ratio** (>0.4): High-frequency noise (electronics, whistles)

**Use case:** Categorizing sound by frequency content

## Performance Characteristics

| Operation | Input Size | Time | Notes |
|-----------|-----------|------|-------|
| **performFFT()** | 44,100 samples | < 100ms | 1 second of audio |
| **performFFT()** | 2,048 samples | < 30ms | Single window |
| **extractSpectralFeatures()** | 1,025 bins | < 50ms | From FFT result |
| **Full pipeline** | 44,100 samples | < 150ms | FFT + features |
| **10 consecutive FFTs** | 44,100 samples each | < 1000ms | Batch processing |

**Recommendation:** FFT is suitable for real-time processing (< 500ms latency target).

## FFT Parameters

### FFT Size (nfft)

**Common values:**
- **512**: Fast, low resolution (~86 Hz bins at 44.1 kHz)
- **1024**: Balanced (~43 Hz bins)
- **2048** (default): Good resolution (~21.5 Hz bins)
- **4096**: High resolution (~10.7 Hz bins), slower

**Formula:** Frequency resolution = sample_rate / nfft

**Recommendation:** Use 2048 for general noise analysis. Use 4096 for detecting specific tones.

### Sample Rate

**Common values:**
- **44100 Hz** (default): CD quality, captures up to 22,050 Hz
- **48000 Hz**: Professional audio
- **16000 Hz**: Sufficient for speech

**Nyquist frequency:** sample_rate / 2 (maximum detectable frequency)

**Recommendation:** Match AudioService sample rate (44100 Hz).

## Common Patterns

### Pattern 1: Real-time Frequency Monitoring

```typescript
const processor = new FFTProcessor(44100);

audioService.onAudioSample((sample) => {
  const fftResult = processor.performFFT(sample.samples);
  const features = processor.extractSpectralFeatures(
    fftResult.frequencies,
    fftResult.magnitudes
  );

  // Update UI with frequency data
  updateDominantFrequency(features.dominantFrequency);
  updateSpectralCentroid(features.spectralCentroid);
  updateFrequencyBands(features.lowFreqRatio, features.midFreqRatio, features.highFreqRatio);
});
```

### Pattern 2: Feature-Based Classification

```typescript
function classifyNoiseAdvanced(db: number, features: SpectralFeatures): string {
  // Use both dB level and spectral features
  if (db < 50) {
    return 'Quiet';
  }

  if (db > 80) {
    return 'Very Noisy';
  }

  // Use spectral features for mid-range classification
  if (features.midFreqRatio > 0.6 && features.spectralFlatness < 0.4) {
    return 'Voice/Music';
  }

  if (features.lowFreqRatio > 0.5) {
    return 'Traffic/Rumble';
  }

  return 'General Noise';
}
```

### Pattern 3: Frequency Band Visualization

```typescript
const processor = new FFTProcessor(44100);

audioService.onAudioSample((sample) => {
  const fftResult = processor.performFFT(sample.samples);
  const features = processor.extractSpectralFeatures(
    fftResult.frequencies,
    fftResult.magnitudes
  );

  // Visualize frequency bands as bar chart
  const bands = [
    { name: 'Low (<250 Hz)', value: features.lowFreqRatio * 100 },
    { name: 'Mid (250-4000 Hz)', value: features.midFreqRatio * 100 },
    { name: 'High (>4000 Hz)', value: features.highFreqRatio * 100 },
  ];

  updateBarChart(bands);
});
```

## Testing

Comprehensive test suite with 41 test cases and 96.8% code coverage:

```bash
npm test -- FFTProcessor.test.ts --coverage
```

Test categories:
- Constructor validation
- Basic FFT functionality (sine wave detection)
- Frequency detection (100 Hz, 1000 Hz, 5000 Hz)
- Multi-tone detection
- Edge cases (empty arrays, zeros, white noise)
- Spectral feature extraction
- Feature validation (ratios sum to 1.0)
- Frequency band detection
- Performance benchmarks
- Integration tests

## Comparison with Python Prototype

**Python Implementation (audio_processor.py lines 137-218):**
```python
def perform_fft(self, audio: np.ndarray, n_fft: int = 2048):
    window = np.hamming(len(audio))
    windowed_audio = audio * window
    fft_result = np.fft.rfft(windowed_audio, n=n_fft)
    magnitudes = np.abs(fft_result)
    frequencies = np.fft.rfftfreq(n_fft, 1/self.sample_rate)
    return frequencies, magnitudes

def extract_spectral_features(self, frequencies, magnitudes):
    # ... 9 features extracted ...
```

**TypeScript Implementation:**
- Same algorithm (Hamming window + rfft)
- Same features extracted
- Compatible results (within 5% due to floating-point differences)
- Both use Cooley-Tukey FFT algorithm

## Troubleshooting

### Issue: FFT takes too long

**Cause:** FFT size too large or inefficient implementation

**Solution:**
```typescript
// Use smaller FFT size
const result = processor.performFFT(samples, 1024); // Faster than 2048
```

### Issue: Can't detect specific frequency

**Cause:** FFT resolution too low

**Solution:**
```typescript
// Use larger FFT size for better resolution
const result = processor.performFFT(samples, 4096); // ~10 Hz resolution
```

### Issue: Spectral features seem wrong

**Cause:** Input samples not normalized or contain NaN

**Solution:**
```typescript
// Validate samples first
const samples = validateAndNormalize(rawSamples);
const result = processor.performFFT(samples);
```

### Issue: Frequency ratios don't sum to 1.0

**Explanation:** This is a bug. Frequency ratios should always sum to 1.0. Please report.

**Workaround:** Normalize manually
```typescript
const total = features.lowFreqRatio + features.midFreqRatio + features.highFreqRatio;
const normalized = {
  low: features.lowFreqRatio / total,
  mid: features.midFreqRatio / total,
  high: features.highFreqRatio / total,
};
```

## Next Steps (Step 1.6)

The FFTProcessor will be integrated with:
1. Classification system (Step 1.6) - Use spectral features for accurate classification
2. UI visualization - Display frequency spectrum and dominant frequencies
3. ML model (Phase 3) - Use features as input for machine learning
4. Sound event detection - Identify specific sound types

## References

- Python prototype: `research/prototypes/audio_processor.py` (lines 137-218)
- DecibelCalculator: `mobile-app/src/utils/DecibelCalculator.ts`
- MovingAverageFilter: `mobile-app/src/utils/MovingAverageFilter.ts`
- AudioService: `mobile-app/src/services/AudioService.ts`
- Tests: `mobile-app/__tests__/FFTProcessor.test.ts`

---

**Last Updated:** 2025-10-15
**Status:** Step 1.5 Complete
