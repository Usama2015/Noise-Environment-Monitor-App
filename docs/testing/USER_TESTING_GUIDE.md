# User Testing Guide - Noise Environment Monitor App

**Purpose:** Step-by-step guide for testing all implemented features of the Noise Environment Monitor application.

**Last Updated:** October 15, 2025
**Version:** 1.0
**Covers:** Phase 0 (Python Prototype) + Phase 1 Steps 1.1-1.2 (Mobile App)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Testing Phase 0: Python Prototype](#testing-phase-0-python-prototype)
4. [Testing Phase 1: Mobile App](#testing-phase-1-mobile-app)
5. [End-to-End Testing](#end-to-end-testing)
6. [Troubleshooting](#troubleshooting)
7. [Reporting Issues](#reporting-issues)

---

## Overview

This guide covers testing for:

| Component | Status | Description |
|-----------|--------|-------------|
| **Phase 0** | ✅ Complete | Python audio processing prototype + ML classifier |
| **Phase 1.1** | ✅ Complete | React Native mobile app setup |
| **Phase 1.2** | ✅ Complete | Microphone audio capture service |
| **Phase 1.3** | 🔄 In Progress | Decibel calculation |
| **Phase 1.4-1.7** | ⏳ Pending | Remaining mobile features |

### Testing Philosophy

- **Automated Tests:** Run via Jest (mobile) and pytest (Python)
- **Manual Tests:** Interactive verification of features
- **Integration Tests:** Test complete workflows
- **User Acceptance:** Verify real-world usability

---

## Prerequisites

### General Requirements

```bash
# Check Git installation
git --version
# Required: Git 2.x or higher

# Check repository status
cd D:\OtherDevelopment\INFS
git branch
# Should show: develop, main, phase/1-core-app
```

### For Phase 0 (Python Prototype)

```bash
# Check Python installation
python --version
# Required: Python 3.8 or higher

# Verify virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

### For Phase 1 (Mobile App)

```bash
# Check Node.js installation
node --version
# Required: Node.js 18.x or higher

# Check npm installation
npm --version
# Required: npm 8.x or higher

# Navigate to mobile app
cd mobile-app
npm list --depth=0
# Should show 850+ packages installed
```

---

## Testing Phase 0: Python Prototype

### Quick Start

```bash
cd D:\OtherDevelopment\INFS\research\prototypes

# Install dependencies
pip install -r requirements.txt

# Run all Phase 0 tests
python test_phase0.py
```

### Test 1: Audio Processor Validation

**What it tests:** Audio loading, decibel calculation, FFT, filtering, classification

**How to test:**

```bash
cd D:\OtherDevelopment\INFS\research\prototypes

# Run audio processor test
python audio_processor.py
```

**Expected Output:**

```
Testing Audio Processor...
============================================================

1. Testing with synthetic quiet audio (440 Hz tone)...
[OK] Loaded audio: test_quiet.wav
  Duration: 2.00 seconds
  Sample rate: 44100 Hz
  Samples: 88200

============================================================
AUDIO ANALYSIS RESULTS
============================================================
File: test_quiet.wav
Duration: 2.00 seconds

Decibel Statistics:
  Average: 48.0 dB
  Maximum: 50.2 dB
  Minimum: 45.8 dB
  Std Dev: 1.2 dB

Classification: Quiet

Spectral Features:
  Spectral Centroid: 1374.8 Hz
  Spectral Spread: 412.5 Hz
  Dominant Frequency: 440.0 Hz
  Spectral Flatness: 0.1371

Frequency Distribution:
  Low (<250 Hz): 5.2%
  Mid (250-4000 Hz): 89.3%
  High (>4000 Hz): 5.5%
============================================================

2. Testing with synthetic noisy audio (white noise)...
[... similar output for noisy audio ...]

[OK] Audio processor test completed!

Test Results:
  Quiet audio classified as: Quiet
  Noisy audio classified as: Noisy
```

**✅ Pass Criteria:**
- Both test files generate successfully
- Quiet audio classified as "Quiet" (< 50 dB)
- Noisy audio classified as "Noisy" (> 70 dB)
- Spectral features extracted without errors

**❌ Fail Indicators:**
- Import errors (missing dependencies)
- Incorrect classification (wrong categories)
- Negative or NaN decibel values
- Missing output files

---

### Test 2: Synthetic Audio Generation

**What it tests:** Audio sample generation for ML training

**How to test:**

```bash
cd D:\OtherDevelopment\INFS\research\prototypes

# Generate 30 audio samples
python generate_samples.py
```

**Expected Output:**

```
============================================================
SYNTHETIC AUDIO DATASET GENERATOR
Noise Environment Monitor - Phase 0
============================================================

Generating QUIET samples...
  [1/10] quiet_01.wav - Sine wave (100 Hz, 0.01 amp)
  [2/10] quiet_02.wav - Sine wave (220 Hz, 0.02 amp)
  [3/10] quiet_03.wav - Sine wave (440 Hz, 0.03 amp)
  [... 7 more ...]

Generating NORMAL samples...
  [1/10] normal_01.wav - Sine wave (440 Hz, 0.10 amp)
  [2/10] normal_02.wav - Sine wave (880 Hz, 0.12 amp)
  [... 8 more ...]

Generating NOISY samples...
  [1/10] noisy_01.wav - White noise (0.30 amp)
  [2/10] noisy_02.wav - White noise (0.35 amp)
  [... 8 more ...]

[OK] Generated 30 audio samples
[OK] Metadata saved to: ../audio-samples/metadata.csv

============================================================
GENERATION SUMMARY
============================================================
Total samples: 30
  - Quiet: 10
  - Normal: 10
  - Noisy: 10

Sample rate: 44100 Hz
Duration: 3.0 seconds
Output directory: ../audio-samples/
============================================================
```

**✅ Pass Criteria:**
- 30 WAV files created in `research/audio-samples/`
- 10 files per category (quiet, normal, noisy)
- metadata.csv created with all samples listed
- No error messages

**❌ Fail Indicators:**
- Less than 30 files generated
- Missing metadata.csv
- File size = 0 bytes (empty files)
- Permission errors

**Verification:**

```bash
# Check generated files
ls ../audio-samples/*.wav | wc -l
# Should output: 30

# Verify metadata
cat ../audio-samples/metadata.csv
# Should show: filename,category,description,amplitude,frequency
```

---

### Test 3: ML Classifier Training

**What it tests:** Feature extraction, model training, evaluation

**How to test:**

```bash
cd D:\OtherDevelopment\INFS\research\prototypes

# Train classifier on generated samples
python train_classifier.py
```

**Expected Output:**

```
============================================================
BASELINE ML CLASSIFIER TRAINING
Phase 0: Research & Prototyping
============================================================
Audio Samples Directory: D:\OtherDevelopment\INFS\research\audio-samples
Output Model Directory: D:\OtherDevelopment\INFS\ml-models\models
Model Filename: baseline_classifier.pkl
============================================================

[OK] Loaded metadata: 30 samples
     Categories: ['noisy' 'normal' 'quiet']

Extracting features from audio samples...
------------------------------------------------------------
  [ 1/30] quiet_01.wav       -> quiet    (avg_db=56.6)
  [ 2/30] quiet_02.wav       -> quiet    (avg_db=56.6)
  [... 28 more ...]
  [30/30] noisy_10.wav       -> noisy    (avg_db=79.7)
------------------------------------------------------------
[OK] Extracted features from 30 samples

Preparing data for training...
------------------------------------------------------------
Feature matrix shape: (30, 13)
Labels shape: (30,)
Classes: ['noisy' 'normal' 'quiet']

Label encoding:
  noisy -> 0
  normal -> 1
  quiet -> 2

Train/Test split:
  Training samples: 21
  Test samples: 9

Training Random Forest Classifier...
------------------------------------------------------------
[OK] Model training completed

============================================================
TEST SET EVALUATION
============================================================
Test Accuracy: 88.89%

Classification Report:
              precision    recall  f1-score   support

       noisy      1.000     0.667     0.800         3
      normal      0.750     1.000     0.857         3
       quiet      1.000     1.000     1.000         3

    accuracy                          0.889         9
   macro avg      0.917     0.889     0.886         9
weighted avg      0.917     0.889     0.886         9

Confusion Matrix:
           noisy  normal   quiet
    noisy      2       1       0
   normal      0       3       0
    quiet      0       0       3

============================================================
CROSS-VALIDATION EVALUATION
============================================================
5-Fold Cross-Validation Scores:
  Fold 1: 100.00%
  Fold 2: 100.00%
  Fold 3: 83.33%
  Fold 4: 83.33%
  Fold 5: 100.00%

Cross-Validation Results:
  Mean Accuracy: 93.33%
  Std Deviation: 8.16%
  Min Accuracy: 83.33%
  Max Accuracy: 100.00%

============================================================
FEATURE IMPORTANCE
============================================================
            feature  importance
             min_db    0.178432
             std_db    0.175321
             avg_db    0.162145
             max_db    0.161234
   high_freq_ratio    0.060123
   spectral_spread    0.046234
 spectral_flatness    0.042156
[... more features ...]

[OK] Model saved to: D:\OtherDevelopment\INFS\ml-models\models\baseline_classifier.pkl

============================================================
PHASE 0 EXIT CRITERIA CHECK
============================================================
Target Accuracy: >75%
Achieved Accuracy: 93.33%

[OK] PHASE 0 EXIT CRITERIA MET!
     The baseline classifier exceeds the 75% accuracy target.
     Ready to proceed to Phase 1 (Mobile App Development).
```

**✅ Pass Criteria:**
- All 30 samples processed without errors
- Cross-validation accuracy > 75% (target met)
- Model saved to `ml-models/models/baseline_classifier.pkl`
- Features CSV created: `research/audio-samples/extracted_features.csv`
- No misclassification of "quiet" samples (should be 100% precision)

**❌ Fail Indicators:**
- Accuracy < 75% (Phase 0 exit criteria not met)
- Model file not created
- Feature extraction errors
- All samples classified as same category

**Verification:**

```bash
# Verify model file exists
ls ../../ml-models/models/baseline_classifier.pkl
# Should exist and be > 0 bytes

# Verify features CSV
head ../audio-samples/extracted_features.csv
# Should show: filename,category,avg_db,max_db,min_db,...
```

---

### Test 4: Visualize Audio Analysis (Optional)

**What it tests:** FFT visualization and frequency analysis

**How to test:**

```bash
cd D:\OtherDevelopment\INFS\research\prototypes

# Visualize quiet sample
python visualize_fft.py ../audio-samples/quiet_01.wav

# Visualize noisy sample
python visualize_fft.py ../audio-samples/noisy_01.wav

# Compare multiple samples
python visualize_fft.py ../audio-samples/quiet_01.wav ../audio-samples/normal_01.wav ../audio-samples/noisy_01.wav
```

**Expected Output:**
- Matplotlib window opens with 4 panels:
  1. Decibel levels over time (line chart)
  2. FFT frequency spectrum (line chart)
  3. Frequency distribution (pie chart)
  4. Feature summary (text)

**✅ Pass Criteria:**
- Visualization window opens without errors
- Charts display data correctly
- Frequency spectrum shows expected peaks (e.g., 440 Hz for sine waves)
- Pie chart shows frequency distribution

**❌ Fail Indicators:**
- Matplotlib import error
- Empty charts
- Window doesn't open

---

### Phase 0 Summary Test

**Quick verification of all Phase 0 components:**

```bash
cd D:\OtherDevelopment\INFS\research\prototypes

# Run automated test suite (if available)
pytest test_phase0.py -v

# Or manual quick test
python -c "
from audio_processor import AudioProcessor
import os

# Test 1: Audio processor loads
processor = AudioProcessor()
print('✅ AudioProcessor loaded')

# Test 2: Generated samples exist
sample_count = len([f for f in os.listdir('../audio-samples') if f.endswith('.wav')])
assert sample_count == 30, f'Expected 30 samples, found {sample_count}'
print(f'✅ Found {sample_count} audio samples')

# Test 3: Model file exists
model_path = '../../ml-models/models/baseline_classifier.pkl'
assert os.path.exists(model_path), 'Model file not found'
print('✅ Model file exists')

print('\n✅ Phase 0 verification complete!')
"
```

---

## Testing Phase 1: Mobile App

### Quick Start

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Install dependencies (if not already done)
npm install

# Run all automated tests
npm test

# Run with coverage
npm run test:coverage
```

---

### Test 1: Project Setup Verification

**What it tests:** React Native installation, dependencies, configuration

**How to test:**

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Verify package installation
npm list --depth=0

# Check TypeScript compilation
npx tsc --noEmit

# Run linter
npm run lint
```

**Expected Output:**

```bash
# npm list --depth=0
NoiseMonitor@0.0.1 D:\OtherDevelopment\INFS\mobile-app
├── @react-native-community/cli@latest
├── @testing-library/jest-native@5.4.3
├── @testing-library/react-native@13.3.3
├── @types/jest@29.5.14
├── @types/node@24.7.2
├── react@19.1.1
├── react-native@0.82.0
├── react-native-audio-record@0.2.2
├── typescript@5.9.3
└── [... ~850 packages total ...]

# npx tsc --noEmit
# (No output = success)

# npm run lint
# (Should show no errors, may show warnings for TODO code)
```

**✅ Pass Criteria:**
- All packages installed (850+)
- TypeScript compiles without errors
- ESLint runs without errors
- No missing dependency warnings

**❌ Fail Indicators:**
- `npm ERR!` messages
- TypeScript compilation errors
- Missing peer dependencies
- ESLint errors (warnings are OK)

---

### Test 2: Unit Tests Execution

**What it tests:** All unit tests for implemented features

**How to test:**

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Run all tests
npm test

# Run specific test file
npm test -- AudioService.test.ts

# Run with coverage
npm run test:coverage

# Watch mode (for development)
npm run test:watch
```

**Expected Output:**

```
PASS __tests__/App.test.tsx
PASS __tests__/AudioService.test.ts
  AudioService
    requestPermission
      ✓ should request microphone permission on Android (2 ms)
      ✓ should return false when permission is denied on Android (1 ms)
      ✓ should return true on iOS without requesting permission
      ✓ should throw AudioServiceError on permission request failure (6 ms)
    startRecording
      ✓ should initialize and start recording (1 ms)
      ✓ should not reinitialize if already initialized
      ✓ should throw error if already recording (5 ms)
      ✓ should handle permission denied error
      ✓ should handle recording failure
    stopRecording
      ✓ should stop recording (1 ms)
      ✓ should throw error if not recording (1 ms)
      ✓ should handle stop recording failure
    onAudioSample
      ✓ should register and invoke audio sample callback (1 ms)
      ✓ should support multiple callbacks (1 ms)
      ✓ should return unsubscribe function
      ✓ should handle errors in callback without crashing (22 ms)
    base64ToFloat32Array conversion
      ✓ should correctly convert base64 PCM data to Float32Array (1 ms)
    [... 10 more tests ...]

Test Suites: 2 passed, 2 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        2.456 s
Ran all test suites.

--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   96.96 |    88.88 |     100 |   96.92 |
 AudioService.ts    |   96.96 |    88.88 |     100 |   96.92 | 189-191
--------------------|---------|----------|---------|---------|-------------------
```

**✅ Pass Criteria:**
- All test suites pass
- 27/27 tests passing (1 App test + 26 AudioService tests)
- Coverage > 80% for all metrics
- No test failures or errors

**❌ Fail Indicators:**
- Any failing tests
- Coverage below 80%
- Test timeout errors
- Module import errors

---

### Test 3: AudioService Manual Testing

**What it tests:** AudioService functionality in isolation

**Create test file:** `mobile-app/src/__manual__/testAudioService.ts`

```typescript
/**
 * Manual Test Script for AudioService
 * Run with: npx ts-node src/__manual__/testAudioService.ts
 */

import AudioService from '../services/AudioService';

async function testAudioService() {
  console.log('='.repeat(60));
  console.log('AUDIOSERVICE MANUAL TEST');
  console.log('='.repeat(60));

  try {
    // Test 1: Permission Request
    console.log('\nTest 1: Requesting microphone permission...');
    const hasPermission = await AudioService.requestPermission();
    console.log(`✅ Permission granted: ${hasPermission}`);

    if (!hasPermission) {
      console.log('❌ Cannot continue without microphone permission');
      return;
    }

    // Test 2: Start Recording
    console.log('\nTest 2: Starting audio recording...');
    await AudioService.startRecording();
    console.log('✅ Recording started');

    // Test 3: Register Callback
    console.log('\nTest 3: Registering audio sample callback...');
    let sampleCount = 0;
    const unsubscribe = AudioService.onAudioSample((sample) => {
      sampleCount++;
      console.log(`  Sample ${sampleCount}:`);
      console.log(`    - Timestamp: ${sample.timestamp.toISOString()}`);
      console.log(`    - Sample rate: ${sample.sampleRate} Hz`);
      console.log(`    - Samples: ${sample.samples.length}`);
      console.log(`    - First 10 values: [${sample.samples.slice(0, 10).join(', ')}]`);
    });
    console.log('✅ Callback registered');

    // Test 4: Record for 5 seconds
    console.log('\nTest 4: Recording for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(`✅ Received ${sampleCount} audio samples`);

    // Test 5: Unsubscribe
    console.log('\nTest 5: Unsubscribing from callbacks...');
    unsubscribe();
    console.log('✅ Unsubscribed');

    // Test 6: Stop Recording
    console.log('\nTest 6: Stopping recording...');
    await AudioService.stopRecording();
    console.log('✅ Recording stopped');

    // Test 7: Get Status
    console.log('\nTest 7: Checking recording status...');
    const isRecording = AudioService.getRecordingStatus();
    console.log(`✅ Recording status: ${isRecording} (should be false)`);

    // Test 8: Get Config
    console.log('\nTest 8: Getting audio configuration...');
    const config = AudioService.getConfig();
    console.log('✅ Audio configuration:');
    console.log(`    - Sample rate: ${config.sampleRate} Hz`);
    console.log(`    - Channels: ${config.channels}`);
    console.log(`    - Bits per sample: ${config.bitsPerSample}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    console.log('='.repeat(60));
  }
}

// Run tests
testAudioService();
```

**How to run:**

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Create manual test directory
mkdir -p src/__manual__

# Copy test script above to: src/__manual__/testAudioService.ts

# Run test (Note: This will fail on desktop, needs device/emulator)
npx ts-node src/__manual__/testAudioService.ts
```

**Expected Output (on device/emulator):**

```
============================================================
AUDIOSERVICE MANUAL TEST
============================================================

Test 1: Requesting microphone permission...
✅ Permission granted: true

Test 2: Starting audio recording...
✅ Recording started

Test 3: Registering audio sample callback...
✅ Callback registered

Test 4: Recording for 5 seconds...
  Sample 1:
    - Timestamp: 2025-10-15T20:30:45.123Z
    - Sample rate: 44100 Hz
    - Samples: 44100
    - First 10 values: [0.012, -0.008, 0.015, -0.003, ...]
  Sample 2:
    - Timestamp: 2025-10-15T20:30:46.123Z
    [... more samples ...]
✅ Received 5 audio samples

Test 5: Unsubscribing from callbacks...
✅ Unsubscribed

Test 6: Stopping recording...
✅ Recording stopped

Test 7: Checking recording status...
✅ Recording status: false (should be false)

Test 8: Getting audio configuration...
✅ Audio configuration:
    - Sample rate: 44100 Hz
    - Channels: 1
    - Bits per sample: 16

============================================================
✅ ALL TESTS PASSED
============================================================
```

**✅ Pass Criteria:**
- Permission granted
- Recording starts without errors
- Audio samples received (3-5 samples in 5 seconds)
- Samples contain Float32Array with ~44100 values
- Values in range [-1.0, 1.0]
- Recording stops cleanly

**❌ Fail Indicators:**
- Permission denied
- No audio samples received
- Samples contain NaN or undefined
- Recording doesn't stop
- Errors thrown

---

### Test 4: Mobile App on Device/Emulator

**What it tests:** Full app running on Android/iOS

**Prerequisites:**
- Android: Android Studio installed, Android device/emulator
- iOS: Xcode installed (Mac only), iOS simulator

**How to test on Android:**

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Start Metro bundler
npm start

# In another terminal, run on Android
npm run android

# Or with specific device
npx react-native run-android --deviceId=<device-id>
```

**How to test on iOS (Mac only):**

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS simulator
npm run ios

# Or with specific simulator
npx react-native run-ios --simulator="iPhone 14"
```

**Expected Output:**

1. **Metro Bundler:**
```
                ######                ######
              ###     ####        ####     ###
            ##          ###    ###          ##
            ##             ####             ##
            ##             ####             ##
            ##           ##    ##           ##
            ##         ###      ###         ##
              ###     ####        ####     ###
                ######                ######

               Welcome to React Native v0.82.0

   ✅ Successfully built bundle
   ✅ Server running on port 8081
```

2. **App Launch:**
- App icon appears on device/emulator
- App launches without crashing
- Default React Native welcome screen appears
- No red error screens

**✅ Pass Criteria:**
- Metro bundler starts successfully
- App installs on device/emulator
- App launches without crashes
- No red error overlay
- Logs show no errors

**❌ Fail Indicators:**
- Metro bundler errors
- Build failures
- App crashes on launch
- Red error screen
- "Unable to load script" errors

---

## End-to-End Testing

### E2E Test: Python Prototype → Mobile App Data Flow

**Scenario:** Verify that audio analysis algorithms from Python prototype match mobile implementation

**Test Plan:**

1. **Generate test audio in Python:**
```bash
cd D:\OtherDevelopment\INFS\research\prototypes
python generate_samples.py
```

2. **Analyze with Python prototype:**
```bash
python audio_processor.py ../audio-samples/normal_01.wav
```

3. **Copy audio to mobile app assets:**
```bash
cp ../audio-samples/normal_01.wav ../../mobile-app/src/assets/test_audio.wav
```

4. **Process in mobile app** (Step 1.3 implementation):
```typescript
// This will be implemented in Step 1.3
import { calculateDecibels } from './utils/DecibelCalculator';

// Load test audio and calculate dB
// Compare with Python output
```

5. **Compare results:**
- Python dB value vs Mobile dB value
- Should be within ±2 dB (accounting for processing differences)

**Expected:** Values match within acceptable tolerance

---

### E2E Test: Model Deployment Readiness

**Scenario:** Verify ML model can be loaded and used in mobile app

**Test Plan:**

1. **Export model metadata:**
```python
# In Python
import joblib
model_package = joblib.load('../../ml-models/models/baseline_classifier.pkl')
print("Feature columns:", model_package['feature_columns'])
print("Classes:", model_package['label_encoder'].classes_)
```

2. **Create mobile feature extractor** (Step 1.5 implementation)
3. **Verify feature extraction matches Python implementation**
4. **Test classification with known samples**

**Status:** Pending Step 1.5 (FFT Implementation)

---

## Troubleshooting

### Common Issues

#### Issue 1: Python Dependencies Not Installing

**Symptoms:**
```
ERROR: Could not find a version that satisfies the requirement librosa
```

**Solution:**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install with explicit versions
pip install numpy==1.24.0 scipy==1.11.0 librosa==0.10.0

# Or use conda
conda install -c conda-forge librosa scikit-learn
```

---

#### Issue 2: React Native Build Fails

**Symptoms:**
```
error Failed to build the app.
```

**Solution:**
```bash
# Clear cache
cd mobile-app
rm -rf node_modules
npm cache clean --force
npm install

# Clean build folders
cd android && ./gradlew clean && cd ..
cd ios && rm -rf build && cd ..

# Rebuild
npm run android  # or npm run ios
```

---

#### Issue 3: Audio Permission Denied

**Symptoms:**
```
AudioServiceError: Permission denied
```

**Solution:**

**Android:**
1. Open app settings on device
2. Enable "Microphone" permission manually
3. Restart app

**iOS:**
1. Go to Settings → Privacy → Microphone
2. Enable for "NoiseMonitor"
3. Restart app

---

#### Issue 4: Jest Tests Timing Out

**Symptoms:**
```
Timeout - Async callback was not invoked within the 5000ms timeout
```

**Solution:**
```bash
# Increase Jest timeout
npm test -- --testTimeout=10000

# Or update jest.config.js
module.exports = {
  testTimeout: 10000,
  // ...
};
```

---

#### Issue 5: TypeScript Compilation Errors

**Symptoms:**
```
error TS2307: Cannot find module 'react-native-audio-record'
```

**Solution:**
```bash
# Install missing type definitions
npm install --save-dev @types/react-native-audio-record

# Or add to tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true  // Skip checking declaration files
  }
}
```

---

## Reporting Issues

### Before Reporting

1. **Check existing issues:** Search GitHub issues
2. **Review logs:** Collect error messages and stack traces
3. **Try troubleshooting:** Use solutions above
4. **Verify environment:** Check prerequisites

### Issue Template

```markdown
## Description
Brief description of the issue

## Environment
- OS: [Windows 10 / macOS / Linux]
- Node.js: [version]
- Python: [version]
- React Native: [version]
- Device: [Android / iOS / Emulator]

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Error Logs
```
Paste error logs here
```

## Screenshots
[If applicable]

## Additional Context
Any other relevant information
```

### Where to Report

- **GitHub Issues:** https://github.com/Usama2015/Noise-Environment-Monitor-App/issues
- **Team Contact:** [Your contact method]

---

## Testing Checklist

Use this checklist to verify all implementations:

### Phase 0: Python Prototype
- [ ] Python dependencies installed
- [ ] Audio processor test passes
- [ ] 30 audio samples generated
- [ ] ML classifier trained (accuracy > 75%)
- [ ] Model file saved
- [ ] Visualization works (optional)

### Phase 1.1: Mobile App Setup
- [ ] Node.js dependencies installed (850+ packages)
- [ ] TypeScript compiles without errors
- [ ] ESLint runs without errors
- [ ] Default app test passes

### Phase 1.2: Audio Capture
- [ ] AudioService unit tests pass (26/26)
- [ ] Test coverage > 80%
- [ ] Android permissions configured
- [ ] iOS permissions configured
- [ ] App builds on Android/iOS
- [ ] Microphone permission requested
- [ ] Audio samples captured successfully

### Phase 1.3+: Future Tests
- [ ] Decibel calculation accuracy verified
- [ ] Moving average filter smooths data
- [ ] FFT produces correct frequencies
- [ ] Classification matches Python model
- [ ] UI displays real-time data

---

## Next Steps

After completing all tests:

1. **Report Results:** Document any issues found
2. **Performance Testing:** Measure battery usage, memory consumption
3. **User Acceptance Testing:** Test with real users
4. **Integration Testing:** Test full workflow end-to-end
5. **Regression Testing:** Ensure new features don't break old ones

---

**Document Maintained By:** Development Team
**Last Reviewed:** October 15, 2025
**Next Review:** After Phase 1.3 completion
