# User Testing Guide - Noise Environment Monitor App

**Purpose:** Step-by-step guide for testing all implemented features of the Noise Environment Monitor application.

**Last Updated:** October 15, 2025
**Version:** 2.0
**Covers:** Phase 0 (Python Prototype) + Phase 1 Complete (Steps 1.1-1.7)

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
| **Phase 1.3** | ✅ Complete | Decibel calculation |
| **Phase 1.4** | ✅ Complete | Moving average filter |
| **Phase 1.5** | ✅ Complete | FFT processor |
| **Phase 1.6** | ✅ Complete | Noise classifier |
| **Phase 1.7** | ✅ Complete | Basic UI implementation |

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

### Test 5: Complete Phase 1 App Manual Testing

**What it tests:** Full noise monitoring app with real-time audio processing, classification, and UI

**Prerequisites:**
- Phase 1.1-1.7 complete
- App installed on physical device or emulator
- Microphone permission granted
- Access to different noise environments

---

#### Test 5.1: App Launch and Permissions

**Objective:** Verify app launches and requests microphone permissions

**Steps:**

1. Launch the Noise Monitor app
2. Observe the home screen

**Expected Results:**
- App displays green header with "Noise Monitor" title
- Subtitle reads "Environmental Sound Analysis"
- Start Monitoring button is visible (green background)
- No error messages displayed
- Info section shows usage instructions

**Screenshot Description:**
```
┌─────────────────────────────┐
│  Noise Monitor              │  ← Green header
│  Environmental Sound...     │  ← Subtitle
├─────────────────────────────┤
│                             │
│    [Decibel Display]        │  ← Shows 0.0 dB initially
│         0.0 dB              │
│                             │
│    [Classification Badge]   │  ← Not visible until monitoring
│                             │
│  ┌───────────────────────┐ │
│  │  Start Monitoring     │ │  ← Green button
│  └───────────────────────┘ │
│                             │
│  How to use:                │
│  1. Tap "Start Monitoring"  │
│  2. Grant microphone...     │
│  3. See real-time...        │
│  4. View history...         │
└─────────────────────────────┘
```

3. Tap "Start Monitoring" button
4. If prompted, grant microphone permission

**Expected Results:**
- Permission dialog appears (first time only)
- "Allow" and "Deny" options shown
- After granting permission:
  - Button changes to red "Stop Monitoring"
  - Status indicator appears: "🟢 Monitoring active"
  - Decibel display starts updating in real-time
  - Classification badge appears

**✅ Pass Criteria:**
- App launches without crashes
- Permission requested (first time)
- Monitoring starts after permission granted
- UI updates to monitoring state

**❌ Fail Indicators:**
- App crashes on launch
- Permission dialog doesn't appear
- Error message: "Microphone permission denied"
- Button doesn't change state
- No decibel updates

---

#### Test 5.2: Quiet Environment Detection

**Objective:** Verify app correctly detects quiet environments

**Steps:**

1. Ensure monitoring is active
2. Move to a quiet environment:
   - Library
   - Silent room
   - Study area
   - Office (no one talking)
3. Wait for 5-10 seconds for readings to stabilize
4. Observe the UI

**Expected Results:**

**Decibel Display:**
- Shows value < 50 dB (typically 20-45 dB)
- Background color: Light green (#E8F5E9)
- Text color: Dark green (#2E7D32)
- Value updates every 1-2 seconds

**Classification Badge:**
- Icon: 🟢 (green circle)
- Category: "Quiet"
- Background color: Green (#4CAF50)
- Description: May show "Tonal Sound" if there's specific noise
- Confidence bar: Visible (typically 80-100%)

**Noise History:**
- Shows "Recent Readings" section
- Lists recent decibel values with green dots
- Timestamps show "Xs ago" or "Xm ago"
- All entries show "Quiet" category

**Example Reading:**
```
Recent Readings
┌─────────────────────────────────┐
│ 🟢  42.3 dB  Quiet    5s ago   │
│ 🟢  41.8 dB  Quiet    6s ago   │
│ 🟢  43.1 dB  Quiet    7s ago   │
└─────────────────────────────────┘
```

**✅ Pass Criteria:**
- Decibel reading < 50 dB
- Category shows "Quiet"
- Green color scheme throughout
- Confidence > 70%
- Readings relatively stable (low variance)

**❌ Fail Indicators:**
- Decibel reading > 50 dB in silent room
- Category shows "Normal" or "Noisy" incorrectly
- Values jump erratically (> 10 dB swings)
- No updates (frozen display)

---

#### Test 5.3: Normal Environment Detection

**Objective:** Verify app correctly detects normal conversational noise

**Steps:**

1. Ensure monitoring is active
2. Move to a normal environment:
   - Office with people talking
   - Cafeteria during lunch
   - Living room with TV on
   - Classroom during discussion
3. Wait for 5-10 seconds for readings to stabilize
4. Observe the UI

**Expected Results:**

**Decibel Display:**
- Shows value 50-70 dB (typically 55-65 dB)
- Background color: Light yellow/orange (#FFF3E0)
- Text color: Dark orange (#E65100)
- Value updates smoothly

**Classification Badge:**
- Icon: 🟡 (yellow circle)
- Category: "Normal"
- Background color: Yellow/Orange (#FFC107)
- Description: May show:
  - "Voice / Music" (if tonal)
  - "General Ambient Noise" (if broadband)
- Confidence bar: 70-95%

**Noise History:**
- Mix of yellow dots (🟡)
- Values in 50-70 dB range
- Category: "Normal"

**Example Reading:**
```
Recent Readings
┌─────────────────────────────────┐
│ 🟡  62.4 dB  Normal    3s ago   │
│ 🟡  58.9 dB  Normal    4s ago   │
│ 🟡  61.2 dB  Normal    5s ago   │
│ 🟡  59.7 dB  Normal    6s ago   │
└─────────────────────────────────┘
```

**✅ Pass Criteria:**
- Decibel reading 50-70 dB
- Category shows "Normal"
- Yellow/orange color scheme
- Confidence > 70%
- Descriptions reflect noise type

**❌ Fail Indicators:**
- Normal conversation classified as "Quiet" or "Noisy"
- Decibel values outside 50-70 dB range consistently
- Confidence < 50%

---

#### Test 5.4: Noisy Environment Detection

**Objective:** Verify app correctly detects noisy environments

**Steps:**

1. Ensure monitoring is active
2. Move to a noisy environment:
   - Street with heavy traffic
   - Construction site
   - Busy restaurant/bar
   - Loud music playing
3. Wait for 5-10 seconds for readings to stabilize
4. Observe the UI

**Expected Results:**

**Decibel Display:**
- Shows value > 70 dB (typically 75-90 dB)
- Background color: Light red (#FFEBEE)
- Text color: Dark red (#C62828)
- Value updates frequently

**Classification Badge:**
- Icon: 🔴 (red circle)
- Category: "Noisy"
- Background color: Red (#F44336)
- Description: May show:
  - "Traffic / Heavy Machinery" (if low-frequency dominant)
  - "White Noise / Static" (if broadband)
  - "Loud Music" (if tonal)
- Confidence bar: 80-100%

**Noise History:**
- Red dots (🔴)
- Values > 70 dB
- Category: "Noisy"

**Example Reading:**
```
Recent Readings
┌─────────────────────────────────┐
│ 🔴  78.2 dB  Noisy    2s ago   │
│ 🔴  81.5 dB  Noisy    3s ago   │
│ 🔴  79.8 dB  Noisy    4s ago   │
│ 🔴  77.4 dB  Noisy    5s ago   │
└─────────────────────────────────┘
```

**✅ Pass Criteria:**
- Decibel reading > 70 dB
- Category shows "Noisy"
- Red color scheme throughout
- Confidence > 70%
- Descriptions match noise type (traffic, music, etc.)

**❌ Fail Indicators:**
- Loud noise classified as "Normal" or "Quiet"
- Values capped at certain threshold
- App crashes in loud environments

---

#### Test 5.5: Moving Average Smoothing Verification

**Objective:** Verify moving average filter smooths sudden spikes

**Steps:**

1. Start monitoring in a quiet environment
2. Wait for 5-10 seconds (quiet readings should be stable)
3. Create a sudden loud noise (clap hands, shout, door slam)
4. Observe the decibel display and readings
5. Wait for 5-10 seconds after the noise

**Expected Results:**

**During Spike:**
- Decibel value increases but NOT to maximum instantly
- Spike is smoothed over 2-5 readings
- Classification may briefly change to "Normal" or "Noisy"
- UI animates the transition

**After Spike:**
- Values gradually return to quiet levels
- Takes 3-5 seconds to stabilize back to quiet
- Not an instant drop

**Example Sequence:**
```
Before spike:
  42.3 dB (Quiet)
  41.8 dB (Quiet)

[CLAP HANDS]

During/After spike:
  52.4 dB (Normal)    ← Smoothed, not full spike
  48.9 dB (Quiet)     ← Gradually decreasing
  45.2 dB (Quiet)
  43.7 dB (Quiet)
  42.1 dB (Quiet)     ← Back to baseline
```

**✅ Pass Criteria:**
- Spike is smoothed (not instant jump to maximum)
- Recovery is gradual (3-5 seconds)
- No erratic jumping between categories
- Moving average window = 5 samples (1-2 second smoothing)

**❌ Fail Indicators:**
- Instant jump to maximum value
- Instant drop back to quiet
- No smoothing visible
- Values freeze during spike

---

#### Test 5.6: Noise Type Description Accuracy

**Objective:** Verify enhanced classification detects specific noise types

**Steps:**

1. **Test Tonal Sound (Voice/Music):**
   - Play pure tone or music with melody
   - Speak or hum into microphone
   - Expected: Description shows "Voice / Music" or "Tonal Sound"

2. **Test White Noise:**
   - Play white noise from speaker
   - Turn on fan or air conditioner
   - Expected: Description shows "White Noise / Static"

3. **Test Low-Frequency Rumble:**
   - Play bass-heavy music
   - Record near traffic or heavy machinery
   - Expected: Description shows "Traffic / Heavy Machinery" or "Low-Frequency Rumble"

**Expected Results:**

**For Each Noise Type:**
- Description appears below category badge
- Description text color: Gray (#666)
- Font size: 13px
- Matches the actual noise source

**Spectral Features Being Used:**
- **Spectral Flatness:** < 0.5 = Tonal, > 0.5 = Noise-like
- **Low Frequency Ratio:** > 0.3 = Low-frequency dominant
- **Dominant Frequency:** Shown in description if tonal

**✅ Pass Criteria:**
- Pure tone detected as "Tonal Sound"
- White noise detected with high spectral flatness
- Traffic/rumble detected with high low-freq ratio
- Descriptions update with classification changes

**❌ Fail Indicators:**
- All noise shows same description
- Descriptions don't match actual sound
- Description field empty or undefined

---

#### Test 5.7: Confidence Indicator Validation

**Objective:** Verify confidence calculation reflects classification certainty

**Steps:**

1. Monitor in stable quiet environment
   - Expected: High confidence (90-100%)

2. Monitor in ambiguous environment (near threshold)
   - Play audio at ~50 dB (Quiet/Normal boundary)
   - Play audio at ~70 dB (Normal/Noisy boundary)
   - Expected: Lower confidence (60-80%)

3. Monitor in mixed environment
   - Quiet room with occasional talking
   - Expected: Varying confidence as sound changes

**Expected Results:**

**Confidence Bar:**
- Horizontal bar below category badge
- Width: Proportional to confidence (0-100%)
- Colors:
  - 80-100%: Green (#4CAF50)
  - 60-79%: Yellow (#FFC107)
  - 50-59%: Orange (#FF9800)
  - < 50%: Red (#F44336) - should be rare
- Percentage displayed on right side

**Confidence Levels:**
- **Stable Environment:** 90-100%
- **Near Threshold:** 60-80%
- **Transitioning:** 50-70%

**✅ Pass Criteria:**
- Confidence bar renders correctly
- Percentage matches bar width
- High confidence in stable environments
- Lower confidence near thresholds
- Minimum confidence >= 50% (design requirement)

**❌ Fail Indicators:**
- Confidence always 100%
- Confidence < 50% in stable environment
- Bar width doesn't match percentage
- Confidence bar missing

---

#### Test 5.8: History Display and Timestamps

**Objective:** Verify noise history displays correctly with accurate timestamps

**Steps:**

1. Start monitoring
2. Wait for 30 seconds to accumulate 5-10 readings
3. Scroll through history (if more than 10 readings)
4. Observe timestamps and formatting

**Expected Results:**

**History List:**
- Title: "Recent Readings"
- Maximum 10 readings displayed (newest first)
- Each reading shows:
  - Category dot (🟢🟡🔴)
  - Decibel value (XX.X dB)
  - Category name (Quiet/Normal/Noisy)
  - Timestamp (Xs ago, Xm ago, Xh ago)
  - Description (if available)

**Timestamp Formatting:**
- < 60s: "Xs ago" (e.g., "5s ago")
- < 60m: "Xm ago" (e.g., "3m ago")
- >= 60m: "Xh ago" (e.g., "2h ago")

**Scrolling:**
- Scrollable if > screen height
- Smooth scrolling
- No performance issues

**✅ Pass Criteria:**
- Newest reading at top
- Timestamps accurate (±2 seconds)
- Maximum 10 readings shown
- Older readings removed automatically
- Formatting consistent

**❌ Fail Indicators:**
- Oldest reading at top
- Timestamps incorrect or negative
- More than 10 readings displayed
- Duplicate timestamps
- Scrolling laggy

---

#### Test 5.9: Stop/Restart Monitoring

**Objective:** Verify stopping and restarting monitoring works correctly

**Steps:**

1. Start monitoring (green button → red button)
2. Let it run for 10-20 seconds
3. Tap "Stop Monitoring" button
4. Observe the UI
5. Wait 5 seconds
6. Tap "Start Monitoring" again
7. Observe the UI

**Expected Results:**

**After Stopping:**
- Button changes to green "Start Monitoring"
- Status indicator disappears (no "Monitoring active")
- Decibel display freezes at last value
- Classification badge remains visible
- History preserved (not cleared)
- No new readings added

**After Restarting:**
- Button changes to red "Stop Monitoring"
- Status indicator reappears
- Decibel display updates again
- History CLEARED (fresh start)
- New readings start from 0

**✅ Pass Criteria:**
- Stop button works immediately
- No more audio samples processed after stop
- Restart works without re-requesting permissions
- History cleared on restart (design choice)
- No memory leaks (can stop/start multiple times)

**❌ Fail Indicators:**
- Button doesn't respond
- Audio keeps processing after stop
- Permission requested again on restart
- App crashes on stop/restart

---

#### Test 5.10: Performance and Responsiveness

**Objective:** Verify app performs well under continuous use

**Steps:**

1. Start monitoring
2. Run for 5 minutes continuously
3. Monitor device performance:
   - Battery usage
   - CPU usage
   - Memory usage
   - UI responsiveness
4. Interact with UI during monitoring:
   - Scroll history
   - Tap buttons
   - Switch apps and return

**Expected Results:**

**Processing Performance:**
- Audio processing < 100ms per second (requirement)
- UI updates smoothly (60 fps)
- No lag or stuttering
- Decibel display animates smoothly

**Resource Usage:**
- CPU: Moderate (20-40% usage)
- Memory: Stable (no memory leaks)
- Battery: Reasonable for audio processing app

**UI Responsiveness:**
- Button taps respond immediately
- Scrolling smooth
- No frozen UI
- App resumes correctly after backgrounding

**✅ Pass Criteria:**
- Processing time < 100ms per second
- UI remains responsive
- No crashes after 5+ minutes
- Memory usage stable
- Can run continuously without issues

**❌ Fail Indicators:**
- Processing time > 100ms (fails performance requirement)
- UI freezes or lags
- Memory increases continuously
- App crashes after extended use
- Battery drains rapidly

---

#### Test 5.11: Error Handling

**Objective:** Verify app handles errors gracefully

**Test Scenarios:**

**1. Permission Denied:**
- Steps: Deny microphone permission when prompted
- Expected: Error message appears: "Microphone permission denied. Please enable it in settings."
- Expected: Button remains green (monitoring doesn't start)

**2. Restart After Permission Denial:**
- Steps: Grant permission in device settings, return to app, tap "Start Monitoring"
- Expected: Monitoring starts successfully without app restart

**3. Background App:**
- Steps: Start monitoring, switch to another app, return
- Expected: Monitoring continues (on Android) or shows appropriate state

**4. Airplane Mode:**
- Steps: Enable airplane mode (microphone should still work)
- Expected: App continues monitoring (doesn't require network)

**✅ Pass Criteria:**
- Error messages displayed clearly
- App doesn't crash on errors
- Recovery possible without restart
- Errors logged to console for debugging

**❌ Fail Indicators:**
- App crashes on permission denial
- No error message shown
- Cannot recover without app restart
- Silent failures

---

### Test 5 Summary Checklist

Use this checklist when testing the complete Phase 1 app:

- [ ] **Launch & Permissions:** App launches, permission requested
- [ ] **Quiet Detection:** < 50 dB, green theme, "Quiet" category
- [ ] **Normal Detection:** 50-70 dB, yellow theme, "Normal" category
- [ ] **Noisy Detection:** > 70 dB, red theme, "Noisy" category
- [ ] **Smoothing:** Spikes smoothed over 3-5 readings
- [ ] **Noise Types:** Tonal/white noise/rumble detected correctly
- [ ] **Confidence:** Appropriate confidence levels (usually > 70%)
- [ ] **History:** Recent readings displayed with timestamps
- [ ] **Stop/Restart:** Works correctly, history cleared on restart
- [ ] **Performance:** < 100ms processing, smooth UI
- [ ] **Error Handling:** Graceful error messages, no crashes

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

### Phase 1.3: Decibel Calculation
- [ ] DecibelCalculator unit tests pass (14/14)
- [ ] RMS calculation accuracy verified
- [ ] Decibel conversion correct (20 * log10(RMS))
- [ ] Test coverage > 95%

### Phase 1.4: Moving Average Filter
- [ ] MovingAverageFilter unit tests pass (17/17)
- [ ] Filter smooths spike data correctly
- [ ] Window size configurable (default: 5)
- [ ] Reset functionality works

### Phase 1.5: FFT Processor
- [ ] FFTProcessor unit tests pass (24/24)
- [ ] FFT produces correct frequencies
- [ ] Spectral features extracted (9 features)
- [ ] Peak detection works

### Phase 1.6: Noise Classifier
- [ ] NoiseClassifier unit tests pass (26/26)
- [ ] Simple classification works (Quiet/Normal/Noisy)
- [ ] Enhanced classification with features
- [ ] Confidence calculation accurate

### Phase 1.7: UI Components
- [ ] DecibelDisplay component tests pass (16/16)
- [ ] ClassificationBadge tests pass (20/20)
- [ ] NoiseHistory tests pass (22/22)
- [ ] HomeScreen integrates all components
- [ ] App builds and runs on device

### Phase 1 Integration Tests
- [ ] Complete pipeline integration tests pass (15+ tests)
- [ ] Processing time < 100ms per second
- [ ] Quiet/Normal/Noisy environments detected correctly
- [ ] Noise type detection works (white noise, tonal, rumble)

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
