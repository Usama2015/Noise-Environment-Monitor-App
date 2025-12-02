# Phase 1 Code Map - File Locations & Interactions

**Purpose:** Visual map of every file created in Phase 1 with exact locations and purposes

---

## 📂 **Complete File Structure**

```
INFS/
├── mobile-app/                                    ← React Native app root
│   ├── index.js                                   ← APP STARTS HERE (entry point)
│   ├── App.tsx                                    ← Root component wrapper
│   ├── app.json                                   ← App configuration
│   ├── package.json                               ← Dependencies & scripts
│   │
│   ├── src/                                       ← Source code
│   │   ├── types/
│   │   │   └── index.ts                          ← TypeScript type definitions
│   │   │
│   │   ├── services/                             ← Business logic
│   │   │   ├── AudioService.ts                   ← Microphone & audio capture
│   │   │   └── NoiseClassifier.ts                ← Classification logic
│   │   │
│   │   ├── utils/                                ← Pure utility functions
│   │   │   ├── DecibelCalculator.ts              ← RMS to dB conversion
│   │   │   ├── MovingAverageFilter.ts            ← Spike smoothing
│   │   │   └── FFTProcessor.ts                   ← Frequency analysis
│   │   │
│   │   ├── components/                           ← Reusable UI components
│   │   │   ├── DecibelDisplay.tsx                ← Large dB number display
│   │   │   ├── ClassificationBadge.tsx           ← Category badge
│   │   │   ├── NoiseHistory.tsx                  ← Reading history list
│   │   │   └── index.ts                          ← Component exports
│   │   │
│   │   └── screens/                              ← App screens
│   │       └── HomeScreen.tsx                    ← Main app screen (integrates everything)
│   │
│   └── __tests__/                                ← Test files
│       ├── App.test.tsx                          ← App component tests
│       ├── AudioService.test.ts                  ← Audio service tests
│       ├── DecibelCalculator.test.ts             ← Calculator tests
│       ├── MovingAverageFilter.test.ts           ← Filter tests
│       ├── FFTProcessor.test.ts                  ← FFT tests
│       ├── NoiseClassifier.test.ts               ← Classifier tests
│       ├── components/
│       │   ├── DecibelDisplay.test.tsx           ← Display component tests
│       │   ├── ClassificationBadge.test.tsx      ← Badge component tests
│       │   └── NoiseHistory.test.tsx             ← History component tests
│       └── __integration__/
│           └── Phase1Integration.test.ts         ← End-to-end integration tests
│
├── docs/                                          ← Documentation
│   ├── testing/
│   │   ├── PHASE1_MANUAL_TESTING_GUIDE.md        ← Comprehensive testing guide
│   │   └── QUICK_TESTING_REFERENCE.md            ← Quick test reference
│   └── architecture/
│       └── PHASE1_CODE_MAP.md                    ← This file!
│
└── [Other project files...]
```

---

## 🎯 **What Each File Does**

### **📱 Entry Points (Start here)**

#### **1. `mobile-app/index.js`**
**Location:** Root of mobile-app folder
**Purpose:** Registers the app with React Native
**Key Code:**
```javascript
import App from './App';
AppRegistry.registerComponent('NoiseMonitor', () => App);
```
**When it runs:** When you launch the app on device
**Flow:** index.js → App.tsx → HomeScreen.tsx

---

#### **2. `mobile-app/App.tsx`**
**Location:** Root of mobile-app folder
**Purpose:** Root component, provides SafeArea wrapper
**Key Code:**
```typescript
function App() {
  return (
    <SafeAreaProvider>              // Handles notch/safe areas
      <StatusBar />                 // Green status bar
      <HomeScreen />                // Main screen
    </SafeAreaProvider>
  );
}
```
**What it does:**
- Sets up safe area context
- Renders green status bar
- Displays HomeScreen

---

### **🖥️ Main Screen**

#### **3. `mobile-app/src/screens/HomeScreen.tsx`**
**Location:** `src/screens/HomeScreen.tsx`
**Purpose:** Main app screen that integrates everything
**Lines of Code:** 399 lines
**Key Responsibilities:**
1. Initialize all services (AudioService, FFTProcessor, etc.)
2. Handle Start/Stop monitoring button
3. Process audio samples through pipeline
4. Update UI with results
5. Manage state (isMonitoring, currentDecibels, classification)

**Key Code Flow:**
```typescript
// Initialize services (runs once)
const audioService = new AudioService()
const movingAverage = new MovingAverageFilter(5)
const fftProcessor = new FFTProcessor(44100)
const classifier = new NoiseClassifier()

// When user taps "Start Monitoring":
startMonitoring() {
  1. Request microphone permission
  2. Subscribe to audio samples
  3. Start recording
}

// When audio sample arrives (every ~500ms):
processAudioSample(sample) {
  1. Calculate decibels → DecibelCalculator
  2. Apply smoothing → MovingAverageFilter
  3. Perform FFT → FFTProcessor
  4. Extract features → FFTProcessor
  5. Classify noise → NoiseClassifier
  6. Update UI
  7. Add to history
}
```

**Renders:**
- DecibelDisplay (big dB number)
- ClassificationBadge (category badge)
- Start/Stop button
- NoiseHistory (reading list)

---

### **🔧 Services (Business Logic)**

#### **4. `mobile-app/src/services/AudioService.ts`**
**Location:** `src/services/AudioService.ts`
**Purpose:** Capture audio from microphone
**Key Methods:**
- `requestPermission()` - Request mic permission
- `startRecording()` - Start capturing audio at 44.1kHz
- `stopRecording()` - Stop capturing
- `onAudioSample(callback)` - Subscribe to audio samples

**How it works:**
```typescript
import AudioRecord from 'react-native-audio-record';

// Configure recording
AudioRecord.init({
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  wavFile: 'audio.wav'
});

// Start recording
await AudioRecord.start();

// Every ~500ms, get audio data
const audioData = await AudioRecord.getData();
// Returns: Float32Array of audio samples
```

**Used by:** HomeScreen.tsx

---

#### **5. `mobile-app/src/services/NoiseClassifier.ts`**
**Location:** `src/services/NoiseClassifier.ts`
**Purpose:** Classify noise into Quiet/Normal/Noisy
**Key Methods:**
- `classifyEnhanced(db, features)` - Enhanced classification
- `classifySimple(db)` - Simple threshold classification
- `getCategoryColor(category)` - Get color for category
- `getCategoryIcon(category)` - Get icon for category
- `getCategoryDescription(category)` - Get description

**Classification Logic:**
```typescript
if (db < 50) {
  return {
    category: 'Quiet',
    color: '#4CAF50',
    icon: '🔇'
  };
} else if (db < 70) {
  return {
    category: 'Normal',
    color: '#FF9800',
    icon: '🔊'
  };
} else {
  return {
    category: 'Noisy',
    color: '#F44336',
    icon: '📢'
  };
}
```

**Used by:** HomeScreen.tsx

---

### **🛠️ Utils (Pure Functions)**

#### **6. `mobile-app/src/utils/DecibelCalculator.ts`**
**Location:** `src/utils/DecibelCalculator.ts`
**Purpose:** Convert audio samples to decibels (dB SPL)
**Key Function:**
```typescript
export function calculateDecibels(samples: Float32Array): number {
  // 1. Calculate RMS (Root Mean Square)
  const rms = Math.sqrt(
    samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length
  );

  // 2. Convert to decibels
  const reference = 20e-6;  // 20 micropascals
  const db = 20 * Math.log10(rms / reference);

  // 3. Calibrate for mobile devices
  return db + 94;  // Calibration offset
}
```

**Input:** Float32Array (audio samples)
**Output:** Number (decibels, e.g., 65.3)
**Used by:** HomeScreen.tsx → processAudioSample()

---

#### **7. `mobile-app/src/utils/MovingAverageFilter.ts`**
**Location:** `src/utils/MovingAverageFilter.ts`
**Purpose:** Smooth out decibel spikes with moving average
**How it works:**
```typescript
class MovingAverageFilter {
  private buffer: number[] = [];  // Circular buffer
  private windowSize: number = 5; // Average last 5 values

  add(value: number): number {
    this.buffer.push(value);
    if (this.buffer.length > this.windowSize) {
      this.buffer.shift();  // Remove oldest
    }

    // Return average of buffer
    return this.buffer.reduce((a, b) => a + b) / this.buffer.length;
  }

  reset() {
    this.buffer = [];
  }
}
```

**Example:**
```
Input:  [65, 88, 70, 67, 69]  (spike at 88)
Output: [65, 76, 74, 72, 71]  (smoothed)
```

**Used by:** HomeScreen.tsx → processAudioSample()

---

#### **8. `mobile-app/src/utils/FFTProcessor.ts`**
**Location:** `src/utils/FFTProcessor.ts`
**Purpose:** Perform FFT and extract spectral features
**Key Methods:**
- `performFFT(samples)` - Compute FFT
- `extractSpectralFeatures(frequencies, magnitudes)` - Extract features

**What it calculates:**
1. **Spectral Centroid** - "Center of mass" of frequencies
2. **Spectral Spread** - How spread out frequencies are
3. **Spectral Rolloff** - Frequency containing 85% of energy
4. **Spectral Flatness** - Noisiness measure (0=tonal, 1=noise)
5. **Frequency Band Energy** - Low/Mid/High frequency ratios

**Example Output:**
```typescript
{
  spectralCentroid: 1250.5,    // Hz
  spectralSpread: 320.8,       // Hz
  spectralRolloff: 3200.0,     // Hz
  spectralFlatness: 0.234,     // 0-1
  lowFreqRatio: 0.15,          // 15% low frequencies
  midFreqRatio: 0.75,          // 75% mid frequencies
  highFreqRatio: 0.10          // 10% high frequencies
}
```

**Used by:** HomeScreen.tsx → processAudioSample()

---

### **🎨 UI Components**

#### **9. `mobile-app/src/components/DecibelDisplay.tsx`**
**Location:** `src/components/DecibelDisplay.tsx`
**Purpose:** Display large decibel number with color coding
**Props:**
```typescript
interface Props {
  decibels: number;           // e.g., 65
  category: NoiseCategory;    // 'Quiet' | 'Normal' | 'Noisy'
  label?: string;             // Optional label
}
```

**What it looks like:**
```
┌──────────────────┐
│   Current Sound  │  ← label
│      65 dB       │  ← Large, color-coded
└──────────────────┘
```

**Used by:** HomeScreen.tsx

---

#### **10. `mobile-app/src/components/ClassificationBadge.tsx`**
**Location:** `src/components/ClassificationBadge.tsx`
**Purpose:** Show noise category with icon, color, and description
**Props:**
```typescript
interface Props {
  category: NoiseCategory;
  color: string;
  icon: string;
  description: string;
  confidence?: number;
  categoryInfo?: string;
}
```

**What it looks like:**
```
┌────────────────────────────┐
│  🔊 Normal                 │  ← Icon + Category
│  Moderate background noise │  ← Description
│  Confidence: 85%           │  ← Optional
└────────────────────────────┘
```

**Used by:** HomeScreen.tsx

---

#### **11. `mobile-app/src/components/NoiseHistory.tsx`**
**Location:** `src/components/NoiseHistory.tsx`
**Purpose:** Display list of recent noise readings
**Props:**
```typescript
interface Props {
  readings: NoiseReading[];
  maxReadings?: number;      // Default: 10
  showTimestamps?: boolean;  // Default: true
}

interface NoiseReading {
  decibels: number;
  category: NoiseCategory;
  timestamp: Date;
  description?: string;
}
```

**What it looks like:**
```
Recent Readings
┌────────────────────────────┐
│ ● 68 dB Normal             │
│   2:34:56 PM               │
├────────────────────────────┤
│ ● 52 dB Normal             │
│   2:34:50 PM               │
├────────────────────────────┤
│ ● 38 dB Quiet              │
│   2:34:44 PM               │
└────────────────────────────┘
```

**Used by:** HomeScreen.tsx

---

### **📦 Configuration Files**

#### **12. `mobile-app/package.json`**
**Purpose:** Dependencies and scripts
**Key Dependencies:**
- `react-native: 0.82.0`
- `react: 19.1.1`
- `react-native-audio-record: 0.2.2`
- `typescript: 5.8.3`

**Key Scripts:**
```json
"scripts": {
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "start": "react-native start",
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

---

#### **13. `mobile-app/app.json`**
**Purpose:** App metadata
```json
{
  "name": "NoiseMonitor",
  "displayName": "NoiseMonitor"
}
```

---

### **🧪 Test Files**

All tests located in `mobile-app/__tests__/`

**Unit Tests:**
- `AudioService.test.ts` - Tests audio service
- `DecibelCalculator.test.ts` - Tests dB calculation
- `MovingAverageFilter.test.ts` - Tests filter
- `FFTProcessor.test.ts` - Tests FFT
- `NoiseClassifier.test.ts` - Tests classification
- `components/*.test.tsx` - Tests UI components

**Integration Tests:**
- `__integration__/Phase1Integration.test.ts` - Full pipeline test

**Run tests:**
```bash
npm test
npm run test:coverage
```

---

## 🔄 **Complete Data Flow**

### **From Microphone to UI (Step by Step)**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Action                                          │
│ User taps "Start Monitoring" button in HomeScreen.tsx       │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Permission Request (HomeScreen.tsx:107-117)         │
│ const hasPermission = await audioService.requestPermission()│
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Start Recording (AudioService.ts:60-75)             │
│ await AudioRecord.start()                                    │
│ Microphone captures audio at 44.1kHz                         │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Audio Sample Captured (every ~500ms)                │
│ AudioService emits: AudioSample {                            │
│   samples: Float32Array,  // Raw audio data                 │
│   timestamp: Date,        // When captured                  │
│   sampleRate: 44100       // Samples per second             │
│ }                                                            │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Process Sample (HomeScreen.tsx:66-103)              │
│ processAudioSample(sample)                                   │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│ STEP 6a:         │          │ STEP 6b:         │
│ Calculate dB     │          │ Perform FFT      │
│                  │          │                  │
│ File:            │          │ File:            │
│ DecibelCalculator│          │ FFTProcessor.ts  │
│ .ts              │          │                  │
│                  │          │ Input:           │
│ Input:           │          │ Float32Array     │
│ Float32Array     │          │                  │
│                  │          │ Process:         │
│ Process:         │          │ 1. Apply Hamming │
│ 1. Calculate RMS │          │    window        │
│ 2. Convert to dB │          │ 2. Run FFT       │
│ 3. Add offset    │          │ 3. Get freqs +   │
│                  │          │    magnitudes    │
│ Output:          │          │                  │
│ 65.3 dB          │          │ Output:          │
└────────┬─────────┘          │ frequencies: []  │
         │                    │ magnitudes: []   │
         │                    └────────┬─────────┘
         │                             │
         ↓                             ↓
┌──────────────────┐          ┌──────────────────┐
│ STEP 7:          │          │ STEP 8:          │
│ Apply Smoothing  │          │ Extract Features │
│                  │          │                  │
│ File:            │          │ File:            │
│ MovingAverage    │          │ FFTProcessor.ts  │
│ Filter.ts        │          │                  │
│                  │          │ Extracts:        │
│ Input: 65.3      │          │ • spectralCentroid│
│                  │          │ • spectralSpread │
│ Process:         │          │ • spectralRolloff│
│ Add to circular  │          │ • spectralFlatness│
│ buffer [63, 64,  │          │ • frequency      │
│ 65, 67, 65.3]    │          │   band energy    │
│                  │          │                  │
│ Output: 64.86 dB │          │ Output:          │
│ (smoothed)       │          │ features: {...}  │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         └──────────┬──────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: Classify Noise (NoiseClassifier.ts:50-90)           │
│                                                              │
│ Input:                                                       │
│ • smoothedDb: 64.86                                         │
│ • features: { spectralCentroid, ... }                       │
│                                                              │
│ Process:                                                     │
│ if (db < 50) → "Quiet"                                      │
│ else if (db < 70) → "Normal"  ← THIS ONE                    │
│ else → "Noisy"                                              │
│                                                              │
│ Output:                                                      │
│ ClassificationResult {                                       │
│   category: "Normal",                                        │
│   confidence: 0.85,                                         │
│   description: "Moderate background noise",                 │
│   color: "#FF9800",                                         │
│   icon: "🔊"                                                │
│ }                                                            │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: Update UI (HomeScreen.tsx:86-97)                   │
│                                                              │
│ setCurrentDecibels(64.86)                                   │
│ setClassification(result)                                   │
│ setReadings([...prev, newReading])                          │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ DecibelDisplay│ │Classification│ │ NoiseHistory │
│ shows:       │ │Badge shows:  │ │ shows:       │
│              │ │              │ │              │
│   64.86 dB   │ │ 🔊 Normal    │ │ • 64.86 dB   │
│  (yellow)    │ │ Moderate...  │ │   Normal     │
└──────────────┘ └──────────────┘ │   2:34:56 PM │
                                  └──────────────┘
```

---

## 📍 **Where to Find Things**

### **Need to change dB thresholds?**
→ `src/services/NoiseClassifier.ts:50-90`

### **Need to adjust smoothing?**
→ `src/utils/MovingAverageFilter.ts` (change `windowSize`)
→ `src/screens/HomeScreen.tsx:45` (pass different window size)

### **Need to change UI colors?**
→ `src/components/DecibelDisplay.tsx` (styles)
→ `src/services/NoiseClassifier.ts:150-180` (category colors)

### **Need to adjust audio capture settings?**
→ `src/services/AudioService.ts:20-40` (AudioRecord config)

### **Need to run tests?**
→ `cd mobile-app && npm test`

### **Need to add a new feature?**
→ Start in `HomeScreen.tsx` (main integration point)

---

## 🎯 **Key Line Numbers (Quick Reference)**

| File | Lines | Key Code |
|------|-------|----------|
| HomeScreen.tsx | 107-139 | startMonitoring() - User taps Start |
| HomeScreen.tsx | 66-103 | processAudioSample() - Audio pipeline |
| AudioService.ts | 60-75 | startRecording() - Mic capture |
| DecibelCalculator.ts | 10-25 | calculateDecibels() - Main function |
| MovingAverageFilter.ts | 15-30 | add() - Smoothing logic |
| FFTProcessor.ts | 30-60 | performFFT() - FFT computation |
| FFTProcessor.ts | 70-150 | extractSpectralFeatures() - Features |
| NoiseClassifier.ts | 50-90 | classifyEnhanced() - Classification |

---

## 🚀 **How to Navigate the Code**

### **Want to understand audio processing?**
1. Start: `HomeScreen.tsx:66` → processAudioSample()
2. Follow: DecibelCalculator → MovingAverage → FFTProcessor → NoiseClassifier
3. End: Update UI components

### **Want to add a new UI component?**
1. Create file in `src/components/YourComponent.tsx`
2. Export from `src/components/index.ts`
3. Import in `HomeScreen.tsx`
4. Add to render section

### **Want to change classification logic?**
1. Open `src/services/NoiseClassifier.ts`
2. Modify `classifyEnhanced()` method (line 50-90)
3. Adjust thresholds or add new categories

---

**This map should help you navigate the entire Phase 1 codebase!** 🗺️

For testing instructions, see [PHASE1_MANUAL_TESTING_GUIDE.md](../testing/PHASE1_MANUAL_TESTING_GUIDE.md)
