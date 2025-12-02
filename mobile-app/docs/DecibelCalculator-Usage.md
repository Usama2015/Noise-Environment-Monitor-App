# DecibelCalculator Usage Guide

## Overview

The `DecibelCalculator` module provides functions to calculate decibel (dB SPL) levels from audio samples. It implements the same formulas as the Python prototype (`audio_processor.py`) to ensure consistency.

## Installation

The module is located at: `mobile-app/src/utils/DecibelCalculator.ts`

## Functions

### calculateRMS(samples: Float32Array): number

Calculates the Root Mean Square (RMS) of audio samples.

**Formula:** `RMS = sqrt(mean(samples²))`

**Parameters:**
- `samples`: Float32Array of audio samples (normalized to [-1.0, 1.0])

**Returns:** RMS value (non-negative number)

**Throws:** Error if samples array is empty or contains invalid values (NaN, Infinity)

**Example:**
```typescript
import { calculateRMS } from './utils/DecibelCalculator';

const samples = new Float32Array([0.1, -0.2, 0.3, -0.1]);
const rms = calculateRMS(samples);
console.log(`RMS: ${rms.toFixed(4)}`); // RMS: 0.1936
```

### calculateDecibels(samples: Float32Array, calibrationOffset?: number): number

Calculates decibel level (dB SPL) from audio samples.

**Formula:** `dB = 20 × log10(RMS + epsilon) + calibration_offset`

**Parameters:**
- `samples`: Float32Array of audio samples (normalized to [-1.0, 1.0])
- `calibrationOffset`: Calibration offset in dB (default: 94)

**Returns:** Decibel level in range [0, 120] dB SPL

**Throws:** Error if samples array is empty or contains invalid values

**Example:**
```typescript
import { calculateDecibels } from './utils/DecibelCalculator';

// Quiet audio
const quietSamples = new Float32Array(1000).map((_, i) =>
  0.01 * Math.sin(2 * Math.PI * 440 * i / 44100)
);
const quietDb = calculateDecibels(quietSamples);
console.log(`Quiet: ${quietDb.toFixed(1)} dB`); // ~51 dB

// Loud audio
const loudSamples = new Float32Array(1000).map((_, i) =>
  0.3 * Math.sin(2 * Math.PI * 440 * i / 44100)
);
const loudDb = calculateDecibels(loudSamples);
console.log(`Loud: ${loudDb.toFixed(1)} dB`); // ~80 dB
```

### calculateDecibelsFromRMS(rms: number, calibrationOffset?: number): number

Calculates decibels from a pre-calculated RMS value.

**Formula:** `dB = 20 × log10(RMS + epsilon) + calibration_offset`

**Parameters:**
- `rms`: Pre-calculated RMS value
- `calibrationOffset`: Calibration offset in dB (default: 94)

**Returns:** Decibel level in range [0, 120] dB SPL

**Throws:** Error if RMS is negative, NaN, or Infinity

**Example:**
```typescript
import { calculateRMS, calculateDecibelsFromRMS } from './utils/DecibelCalculator';

const samples = new Float32Array([0.1, 0.2, 0.3]);
const rms = calculateRMS(samples);
const db = calculateDecibelsFromRMS(rms);
console.log(`Decibels: ${db.toFixed(1)} dB`);
```

## Constants

- `REFERENCE_PRESSURE = 20e-6` - Standard reference pressure (20 micropascals)
- `CALIBRATION_OFFSET = 94` - Calibration offset matching Python prototype
- `EPSILON = 1e-10` - Small value to prevent log(0) errors
- `MIN_DECIBELS = 0` - Minimum dB value (silence)
- `MAX_DECIBELS = 120` - Maximum dB value (hearing damage threshold)

## Integration with AudioService

The `DecibelCalculator` is designed to work with the `AudioService` from Step 1.2.

**Example: Real-time decibel monitoring**
```typescript
import AudioService from './services/AudioService';
import { calculateDecibels } from './utils/DecibelCalculator';

// Initialize audio service
const audioService = new AudioService();

// Request permission
const hasPermission = await audioService.requestPermission();
if (!hasPermission) {
  console.error('Microphone permission denied');
  return;
}

// Register callback to process audio samples
audioService.onAudioSample((audioSample) => {
  // Calculate decibels from 1-second audio chunk
  const db = calculateDecibels(audioSample.samples);

  console.log(`Current noise level: ${db.toFixed(1)} dB`);

  // Classify noise level
  let classification;
  if (db < 50) {
    classification = 'Quiet';
  } else if (db < 70) {
    classification = 'Normal';
  } else {
    classification = 'Noisy';
  }

  console.log(`Classification: ${classification}`);
});

// Start recording
await audioService.startRecording();

// Later: stop recording
// await audioService.stopRecording();
```

## Decibel Scale Reference

| dB SPL | Environment Example |
|--------|---------------------|
| 0-20   | Near silence, quiet library |
| 20-40  | Whisper, quiet room |
| 40-60  | Normal conversation, office |
| 60-80  | Busy traffic, restaurant |
| 80-100 | Loud music, motorcycle |
| 100-120 | Concert, car horn (close), hearing damage threshold |

## Classification Thresholds

Based on the Python prototype's simple classification:

```typescript
function classifyNoise(db: number): string {
  if (db < 50) return 'Quiet';
  if (db < 70) return 'Normal';
  return 'Noisy';
}
```

## Performance

The implementation is optimized for real-time processing:

- **RMS calculation:** < 5ms for 44,100 samples (1 second at 44.1kHz)
- **Decibel calculation:** < 10ms for 44,100 samples
- **Memory usage:** Minimal, uses typed arrays efficiently

## Edge Cases Handled

1. **Empty array:** Throws error with clear message
2. **Invalid values (NaN, Infinity):** Throws error with sample index
3. **Silence (all zeros):** Returns 0 dB (clamped to minimum)
4. **Very loud sounds:** Returns 120 dB (clamped to maximum)
5. **Negative samples:** Handled correctly (RMS uses squares)

## Testing

Comprehensive test suite with 44 test cases and 100% code coverage:

```bash
npm test -- DecibelCalculator.test.ts --coverage
```

Test categories:
- RMS calculation with known values
- Decibel conversion accuracy
- Edge cases (empty array, zeros, NaN, negative values)
- Calibration validation
- Comparison with Python prototype results
- Real-world scenarios (whisper, conversation, traffic)
- Performance tests

## Next Steps (Step 1.4)

The DecibelCalculator will be integrated with:
1. Real-time display UI component
2. Historical data storage
3. Location-based tracking
4. Classification visualization

## Troubleshooting

**Issue:** Getting unexpected dB values

**Solution:** Ensure audio samples are normalized to [-1.0, 1.0] range. The AudioService handles this automatically.

**Issue:** Performance issues with large arrays

**Solution:** Process audio in 1-second chunks (44,100 samples at 44.1kHz) as designed.

**Issue:** Values always at 0 dB or 120 dB

**Solution:** Check if samples are being clamped. Values outside the physical range are automatically limited to [0, 120] dB.

## References

- Python prototype: `research/prototypes/audio_processor.py`
- AudioService: `mobile-app/src/services/AudioService.ts`
- Types: `mobile-app/src/types/index.ts`
- Tests: `mobile-app/__tests__/DecibelCalculator.test.ts`
