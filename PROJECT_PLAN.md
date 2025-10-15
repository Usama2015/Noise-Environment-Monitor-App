# Noise Environment Monitor App - Comprehensive Project Plan

**Version:** 1.0.0
**Last Updated:** 2025-10-14
**Project Duration:** 14 weeks
**Team:** Group 4 (GMU)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Goals & Objectives](#project-goals--objectives)
3. [Technical Architecture](#technical-architecture)
4. [Development Phases](#development-phases)
5. [Testing Strategy](#testing-strategy)
6. [Success Metrics](#success-metrics)
7. [Risk Management](#risk-management)
8. [Timeline & Milestones](#timeline--milestones)

---

## 📊 Executive Summary

### **What We're Building**
A mobile application that helps students find quiet study spaces on campus by:
- Measuring ambient noise levels using smartphone microphones
- Classifying environments as Quiet (<50dB), Normal (50-70dB), or Noisy (>70dB)
- Creating localized heatmaps showing noise distribution across campus
- Tracking historical noise patterns to identify optimal study times

### **How We'll Build It**
- **Platform:** React Native mobile app (iOS/Android)
- **Core Tech:** FFT signal processing, ML classification, GPS integration
- **Architecture:** Mobile-first with optional backend for multi-user features
- **Development:** Iterative 5-phase approach with continuous testing

### **Final Outcomes**
1. Functional mobile app deployed to test devices
2. Accurate noise classification (>85% accuracy)
3. Interactive campus noise heatmap
4. Historical trend visualization
5. Complete technical documentation
6. Academic presentation and demo

---

## 🎯 Project Goals & Objectives

### **Primary Objectives**
1. **Accurate Noise Measurement** - Measure sound levels in decibels (±3dB accuracy)
2. **Intelligent Classification** - Categorize environments with >85% accuracy
3. **Real-time Visualization** - Display noise levels with <500ms latency
4. **Location Awareness** - Tag measurements with GPS coordinates (±10m)
5. **User-Friendly Interface** - Intuitive UI requiring <30 seconds to learn

### **Secondary Objectives**
1. **Historical Analysis** - Store and visualize noise trends over time
2. **Battery Efficiency** - Consume <5% battery per hour
3. **Offline Capability** - Function without internet connectivity
4. **Data Privacy** - Process audio locally without uploading raw recordings
5. **Scalability** - Support multiple concurrent users (Phase 3)

### **Learning Objectives (Academic)**
1. Understand mobile sensor integration (microphone, GPS)
2. Learn signal processing techniques (FFT, filtering)
3. Implement machine learning classification
4. Practice mobile app development (React Native)
5. Apply software engineering best practices (testing, version control)

---

## 🏗️ Technical Architecture

### **System Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     UI      │  │   Services   │  │   Storage    │       │
│  │  Components │◄─┤  Audio/GPS   │◄─┤   Local DB   │       │
│  │   (React)   │  │  Processing  │  │ AsyncStorage │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│         │                │                                   │
│         ▼                ▼                                   │
│  ┌─────────────────────────────────┐                        │
│  │  Device Sensors (Mic + GPS)     │                        │
│  └─────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ (Optional Phase 3)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server (API)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  REST API    │  │   Database   │  │  WebSocket   │      │
│  │  Endpoints   │◄─┤  PostgreSQL  │◄─┤  Real-time   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

```
1. Microphone Capture (44.1kHz sampling)
         ↓
2. Convert to Decibels (dB SPL calculation)
         ↓
3. Apply Moving Average Filter (window size: 10 samples)
         ↓
4. Fast Fourier Transform (FFT with 2048 samples)
         ↓
5. Feature Extraction (frequency bins, spectral centroid, etc.)
         ↓
6. ML Classification Model (Quiet/Normal/Noisy)
         ↓
7. GPS Location Tagging (latitude, longitude, timestamp)
         ↓
8. Local Storage + Display on Map
         ↓
9. (Optional) Upload to Backend for Heatmap Aggregation
```

### **Key Technologies**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Mobile Framework** | React Native | Cross-platform iOS/Android |
| **Language** | TypeScript | Type-safe development |
| **Audio Capture** | expo-av / react-native-audio | Microphone access |
| **Signal Processing** | Custom FFT / FFT.js | Frequency analysis |
| **GPS** | expo-location | Location tracking |
| **Maps** | react-native-maps | Heatmap visualization |
| **Storage** | AsyncStorage | Local data persistence |
| **State Management** | React Context API | App-wide state |
| **Testing** | Jest + RTL | Unit and integration tests |
| **Backend (Phase 3)** | Node.js + Express | API server |
| **Database (Phase 3)** | PostgreSQL + PostGIS | Geospatial data |

---

## 🚀 Development Phases

---

### **PHASE 0: Research & Prototyping**
**Duration:** Week 1-2 (2 weeks)
**Goal:** Validate technical feasibility and establish baseline algorithms

#### **Step 0.1: Audio Processing Research**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Research FFT algorithms and libraries
- [ ] Study decibel calculation methods (dB SPL)
- [ ] Investigate mobile audio APIs (iOS vs Android differences)
- [ ] Review academic papers on environmental audio classification

**Deliverables:**
- Research document summarizing findings
- Recommendation for FFT implementation approach

**Testing:**
- N/A (research phase)

---

#### **Step 0.2: Python Proof-of-Concept**
**Duration:** 5 days
**Assignee:** TBD

**Tasks:**
- [ ] Set up Python development environment
- [ ] Implement audio file reader (WAV format)
- [ ] Calculate decibel levels from audio samples
- [ ] Implement moving average filter
- [ ] Perform FFT on audio signals
- [ ] Extract frequency features (spectral centroid, energy distribution)
- [ ] Visualize frequency spectrum using matplotlib

**Deliverables:**
- `prototype/audio_processor.py` - Audio processing script
- `prototype/visualize_fft.py` - FFT visualization
- Sample outputs showing frequency analysis

**Testing:**
```python
# Test with known audio files
def test_decibel_calculation():
    # Load silent audio - should be < 30 dB
    # Load loud audio - should be > 80 dB

def test_fft_output():
    # Verify FFT produces expected frequency bins
    # Check for dominant frequencies in test tones
```

---

#### **Step 0.3: Data Collection**
**Duration:** 4 days
**Assignee:** Entire team

**Tasks:**
- [ ] Record audio samples from 10+ campus locations
  - 3 quiet locations (library study rooms)
  - 4 normal locations (hallways, cafeteria during off-peak)
  - 3 noisy locations (student center, gym, construction areas)
- [ ] Label each sample with location and noise category
- [ ] Measure duration: 30 seconds per sample minimum
- [ ] Store in organized folder structure

**Folder Structure:**
```
research/audio-samples/
├── quiet/
│   ├── library_study_room_1.wav
│   ├── library_study_room_2.wav
│   └── ...
├── normal/
│   ├── hallway_fenwick.wav
│   └── ...
└── noisy/
    ├── student_center_lunch.wav
    └── ...
```

**Deliverables:**
- 30+ labeled audio samples (WAV format, 44.1kHz)
- CSV file with metadata (filename, location, timestamp, category, dB level)

**Testing:**
- Manual verification: Listen to samples and confirm labels are accurate
- Check audio format consistency (sample rate, bit depth)

---

#### **Step 0.4: Baseline Classification Model**
**Duration:** 4 days
**Assignee:** TBD

**Tasks:**
- [ ] Extract features from collected audio samples
- [ ] Create feature vectors (mean dB, spectral features, etc.)
- [ ] Split data: 70% training, 30% testing
- [ ] Train simple classifier (Decision Tree / Random Forest)
- [ ] Evaluate accuracy on test set
- [ ] Identify which features are most discriminative

**Deliverables:**
- `ml-models/training/baseline_classifier.py`
- Trained model file (`models/baseline_model.pkl`)
- Performance report (accuracy, confusion matrix)

**Testing:**
```python
def test_model_accuracy():
    assert accuracy > 0.75  # Baseline should exceed 75%

def test_prediction_speed():
    # Model should classify in < 100ms
    start = time.time()
    prediction = model.predict(features)
    assert (time.time() - start) < 0.1
```

**Exit Criteria:**
- ✅ Baseline model achieves >75% accuracy on test data
- ✅ All team members understand FFT and classification process
- ✅ Audio sample dataset is sufficient for training

---

### **PHASE 1: Core Mobile App Development**
**Duration:** Week 3-5 (3 weeks)
**Goal:** Build functional mobile app with audio capture and basic classification

#### **Step 1.1: React Native Setup**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Install Node.js, npm, React Native CLI
- [ ] Initialize React Native project with TypeScript
  ```bash
  npx react-native init NoiseMonitorApp --template react-native-template-typescript
  ```
- [ ] Set up folder structure (src/, components/, screens/, services/)
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository and initial commit
- [ ] Configure Android and iOS build environments
- [ ] Test "Hello World" app on emulator/device

**Deliverables:**
- Working React Native project
- README with setup instructions
- Successfully running app on test device

**Testing:**
```bash
# Verify app launches without errors
npm test
npx react-native run-android
npx react-native run-ios
```

---

#### **Step 1.2: Microphone Permission & Audio Capture**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Install audio library: `expo-av` or `react-native-audio`
- [ ] Request microphone permission (iOS + Android)
- [ ] Handle permission denial gracefully (show error message)
- [ ] Implement audio recording in 1-second chunks
- [ ] Extract raw audio samples (Float32Array)
- [ ] Display "Recording..." indicator in UI

**Code Structure:**
```typescript
// src/services/AudioService.ts
class AudioService {
  async requestPermission(): Promise<boolean>
  async startRecording(): Promise<void>
  async stopRecording(): Promise<void>
  onAudioSample(callback: (samples: Float32Array) => void)
}
```

**Deliverables:**
- `src/services/AudioService.ts` - Audio capture service
- UI component showing recording status
- Permission handling for iOS and Android

**Testing:**
```typescript
describe('AudioService', () => {
  it('should request microphone permission', async () => {
    const granted = await AudioService.requestPermission()
    expect(typeof granted).toBe('boolean')
  })

  it('should capture audio samples', async () => {
    await AudioService.startRecording()
    await new Promise(resolve => setTimeout(resolve, 1000))
    const samples = await AudioService.getSamples()
    expect(samples.length).toBeGreaterThan(0)
  })
})
```

---

#### **Step 1.3: Decibel Calculation**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Implement RMS (Root Mean Square) calculation
- [ ] Convert RMS to dB SPL (Sound Pressure Level)
  ```typescript
  dB = 20 * log10(RMS / reference)
  ```
- [ ] Calibrate reference value based on device testing
- [ ] Display real-time decibel value in UI (update every 500ms)
- [ ] Add visual indicator (color: green=quiet, yellow=normal, red=noisy)

**Deliverables:**
- `src/utils/DecibelCalculator.ts`
- Real-time dB display in app

**Testing:**
```typescript
describe('DecibelCalculator', () => {
  it('should calculate correct dB for silent audio', () => {
    const silentSamples = new Float32Array(1024).fill(0)
    const dB = calculateDecibels(silentSamples)
    expect(dB).toBeLessThan(30)
  })

  it('should calculate correct dB for loud audio', () => {
    const loudSamples = new Float32Array(1024).fill(0.8)
    const dB = calculateDecibels(loudSamples)
    expect(dB).toBeGreaterThan(80)
  })
})
```

---

#### **Step 1.4: Moving Average Filter**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Implement sliding window filter (window size: 10 samples)
- [ ] Apply filter to smooth out decibel readings
- [ ] Test with noisy input (e.g., someone clapping once)
- [ ] Visualize filtered vs. unfiltered data in UI (optional chart)

**Deliverables:**
- `src/utils/MovingAverageFilter.ts`
- Smoothed decibel display

**Testing:**
```typescript
describe('MovingAverageFilter', () => {
  it('should smooth out spikes', () => {
    const data = [50, 50, 90, 50, 50] // One spike
    const filtered = applyMovingAverage(data, 3)
    expect(filtered[2]).toBeLessThan(90) // Spike reduced
  })
})
```

---

#### **Step 1.5: FFT Implementation**
**Duration:** 4 days
**Assignee:** TBD

**Tasks:**
- [ ] Install FFT library: `fft.js` or implement custom FFT
- [ ] Convert audio samples to frequency domain
- [ ] Extract frequency bins (e.g., 20 bins from 0-20kHz)
- [ ] Calculate spectral features:
  - Spectral centroid (weighted average of frequencies)
  - Spectral energy distribution
  - Dominant frequency
- [ ] Store feature vectors for classification

**Code Example:**
```typescript
// src/services/FFTProcessor.ts
class FFTProcessor {
  performFFT(samples: Float32Array): FrequencyData {
    // Apply Hamming window
    // Perform FFT
    // Extract magnitude spectrum
    return { frequencies: [...], magnitudes: [...] }
  }

  extractFeatures(fftData: FrequencyData): FeatureVector {
    return {
      spectralCentroid: ...,
      energyDistribution: [...],
      dominantFrequency: ...
    }
  }
}
```

**Deliverables:**
- `src/services/FFTProcessor.ts`
- Feature extraction pipeline

**Testing:**
```typescript
describe('FFTProcessor', () => {
  it('should produce correct frequency bins', () => {
    // Generate 440Hz sine wave (A note)
    const samples = generateSineWave(440, 1024)
    const fft = FFTProcessor.performFFT(samples)
    const dominantFreq = findDominantFrequency(fft)
    expect(dominantFreq).toBeCloseTo(440, 10) // Within 10Hz
  })
})
```

---

#### **Step 1.6: Threshold-Based Classification**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Implement simple threshold classifier as temporary solution
  ```typescript
  if (dB < 50) return 'Quiet'
  else if (dB < 70) return 'Normal'
  else return 'Noisy'
  ```
- [ ] Display classification result in UI
- [ ] Add classification history (last 10 readings)
- [ ] Test with different audio environments

**Deliverables:**
- `src/services/Classifier.ts` (threshold version)
- UI displaying classification result

**Testing:**
```typescript
describe('Classifier', () => {
  it('should classify quiet environment', () => {
    const result = classify({ dB: 45, features: {...} })
    expect(result).toBe('Quiet')
  })

  it('should classify noisy environment', () => {
    const result = classify({ dB: 85, features: {...} })
    expect(result).toBe('Noisy')
  })
})
```

---

#### **Step 1.7: Basic UI Implementation**
**Duration:** 4 days
**Assignee:** TBD

**Tasks:**
- [ ] Design home screen layout (Figma or sketch)
- [ ] Create main components:
  - Header with app title
  - Real-time decibel display (large text + color indicator)
  - Classification label (Quiet/Normal/Noisy)
  - Start/Stop monitoring button
  - Settings icon
- [ ] Implement responsive design (phone + tablet)
- [ ] Add loading states and error messages
- [ ] Style with React Native StyleSheet

**Screen Layout:**
```
┌─────────────────────────────┐
│   Noise Monitor             │
│                             │
│      ┌─────────┐            │
│      │  72 dB  │  ← Large   │
│      └─────────┘            │
│                             │
│    🔴 Noisy Environment     │
│                             │
│   [Stop Monitoring]         │
│                             │
│   Last 10 readings:         │
│   • 70 dB - Normal          │
│   • 68 dB - Normal          │
│   • 73 dB - Noisy           │
│   ...                       │
└─────────────────────────────┘
```

**Deliverables:**
- `src/screens/HomeScreen.tsx`
- `src/components/DecibelDisplay.tsx`
- `src/components/ClassificationLabel.tsx`

**Testing:**
- Snapshot tests for UI components
- Manual testing on different screen sizes

---

#### **Phase 1 Integration Testing**
**Duration:** 2 days
**Assignee:** Entire team

**Tests:**
1. **End-to-End Audio Flow**
   - Start app → Grant permission → Start monitoring → See real-time dB values → Accurate classification

2. **Error Handling**
   - Deny microphone permission → Show helpful error message
   - Shake phone (sudden noise) → Filter smooths it out

3. **Performance**
   - Monitor for 5 minutes → Battery drain < 3%
   - Processing latency < 500ms

4. **Device Compatibility**
   - Test on 2 Android devices (different manufacturers)
   - Test on 2 iOS devices (iPhone)

**Exit Criteria:**
- ✅ App successfully captures audio on all test devices
- ✅ Decibel values are reasonable (validated against external sound meter app)
- ✅ Classification matches manual observation (>70% accuracy)
- ✅ No crashes or freezes during 10-minute monitoring session

---

### **PHASE 2: GPS Integration & Mapping**
**Duration:** Week 6-8 (3 weeks)
**Goal:** Add location awareness and heatmap visualization

#### **Step 2.1: GPS Permission & Location Access**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Install location library: `expo-location` or `react-native-geolocation`
- [ ] Request location permission (iOS + Android)
- [ ] Handle permission states (granted, denied, restricted)
- [ ] Get current location (latitude, longitude, accuracy)
- [ ] Display location coordinates in UI
- [ ] Test indoor vs outdoor accuracy

**Deliverables:**
- `src/services/LocationService.ts`
- Location permission handling

**Testing:**
```typescript
describe('LocationService', () => {
  it('should request location permission', async () => {
    const granted = await LocationService.requestPermission()
    expect(typeof granted).toBe('boolean')
  })

  it('should get current coordinates', async () => {
    const location = await LocationService.getCurrentLocation()
    expect(location).toHaveProperty('latitude')
    expect(location).toHaveProperty('longitude')
  })
})
```

---

#### **Step 2.2: Noise Data Model with Location**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Define NoiseReading data model:
  ```typescript
  interface NoiseReading {
    id: string
    timestamp: Date
    latitude: number
    longitude: number
    decibels: number
    classification: 'Quiet' | 'Normal' | 'Noisy'
    locationName?: string // Optional manual label
  }
  ```
- [ ] Implement local storage (AsyncStorage)
- [ ] Save readings with location metadata
- [ ] Implement CRUD operations (create, read, delete)

**Deliverables:**
- `src/models/NoiseReading.ts`
- `src/services/StorageService.ts`

**Testing:**
```typescript
describe('StorageService', () => {
  it('should save noise reading', async () => {
    const reading = { ... }
    await StorageService.saveReading(reading)
    const saved = await StorageService.getReading(reading.id)
    expect(saved).toEqual(reading)
  })

  it('should retrieve last 24 hours of data', async () => {
    const readings = await StorageService.getRecentReadings(24)
    expect(readings.length).toBeGreaterThan(0)
  })
})
```

---

#### **Step 2.3: Map View Integration**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Install `react-native-maps`
- [ ] Configure iOS and Android map providers
- [ ] Create MapScreen component
- [ ] Display user's current location on map
- [ ] Add map controls (zoom, compass)
- [ ] Test on physical devices (maps don't work well in emulators)

**Deliverables:**
- `src/screens/MapScreen.tsx`
- Working map view with user location

**Testing:**
- Manual testing: Verify map loads and shows current location
- Test map gestures (pan, zoom, rotate)

---

#### **Step 2.4: Noise Markers on Map**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Create custom map markers for noise readings
- [ ] Color-code markers:
  - 🟢 Green = Quiet (<50dB)
  - 🟡 Yellow = Normal (50-70dB)
  - 🔴 Red = Noisy (>70dB)
- [ ] Display markers for last 24 hours of data
- [ ] Add marker clustering (if too many markers)
- [ ] Tap marker → Show details (dB, time, location name)

**Deliverables:**
- `src/components/NoiseMarker.tsx`
- Map with visual noise data

**Testing:**
- Add test data → Verify markers appear in correct locations
- Test marker tap interaction

---

#### **Step 2.5: Heatmap Overlay**
**Duration:** 5 days
**Assignee:** TBD

**Tasks:**
- [ ] Research heatmap libraries (react-native-maps heatmap or custom implementation)
- [ ] Implement heatmap gradient:
  - Blue (quiet) → Green → Yellow → Red (noisy)
- [ ] Convert noise readings to heatmap points
- [ ] Adjust heatmap radius and opacity
- [ ] Allow toggle between markers and heatmap view
- [ ] Test with dense data (100+ readings)

**Deliverables:**
- `src/components/NoiseHeatmap.tsx`
- Visual heatmap overlay on map

**Testing:**
- Generate synthetic data in grid pattern
- Verify heatmap colors match noise levels
- Test performance with 500+ data points

---

#### **Step 2.6: Manual Location Labeling**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Add "Label Location" button
- [ ] Show text input dialog
- [ ] Save custom location names (e.g., "Fenwick Library - 2nd Floor")
- [ ] Display location name on markers
- [ ] Allow editing/deleting labels

**Deliverables:**
- Location labeling UI
- Storage for location names

**Testing:**
- Add label → Verify it's saved and displayed
- Edit label → Confirm changes persist

---

#### **Step 2.7: Historical Data Visualization**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Create history screen with list of past readings
- [ ] Show readings grouped by day
- [ ] Display location, time, dB level, classification
- [ ] Add filters (date range, location, classification)
- [ ] Implement "Export to CSV" feature (optional)

**Deliverables:**
- `src/screens/HistoryScreen.tsx`
- Data filtering and export

**Testing:**
- Generate 100 readings → Verify list displays correctly
- Test date filter → Confirm filtering works
- Export CSV → Validate file format

---

#### **Phase 2 Integration Testing**
**Duration:** 3 days
**Assignee:** Entire team

**Tests:**
1. **Location Accuracy**
   - Walk around campus → Verify GPS coordinates update
   - Go indoors → Check if location still works (may be less accurate)

2. **Data Persistence**
   - Close app → Reopen → Historical data still present
   - Add 50 readings → No performance degradation

3. **Map Functionality**
   - Zoom in/out → Heatmap updates smoothly
   - Tap markers → Details shown correctly
   - Toggle heatmap on/off → Visual changes work

4. **Real-World Testing**
   - Walk to 5 different campus locations
   - Take readings at each location
   - Verify map shows accurate noise distribution

**Exit Criteria:**
- ✅ GPS coordinates are captured with every noise reading
- ✅ Map displays user location accurately (±20m)
- ✅ Heatmap visually represents noise levels correctly
- ✅ Historical data persists across app restarts
- ✅ App functions without internet connection

---

### **PHASE 3: Machine Learning & Backend (Optional)**
**Duration:** Week 9-10 (2 weeks)
**Goal:** Improve classification accuracy and enable multi-user features

#### **Step 3.1: ML Model Training**
**Duration:** 4 days
**Assignee:** TBD

**Tasks:**
- [ ] Collect more training data (100+ samples per category)
- [ ] Engineer features from FFT output
- [ ] Train Random Forest or Neural Network classifier
- [ ] Evaluate on validation set (accuracy, precision, recall)
- [ ] Export model in format compatible with mobile (TensorFlow Lite / ONNX)
- [ ] Document feature importance

**Deliverables:**
- `ml-models/training/train_classifier.py`
- Trained model file (`models/noise_classifier.tflite`)
- Performance report (>85% accuracy target)

**Testing:**
```python
def test_model_accuracy():
    assert accuracy > 0.85
    assert precision > 0.80
    assert recall > 0.80
```

---

#### **Step 3.2: On-Device ML Inference**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Install TensorFlow Lite or ONNX Runtime for React Native
- [ ] Load trained model in app
- [ ] Replace threshold classifier with ML model
- [ ] Measure inference latency (should be <100ms)
- [ ] Test accuracy in real environments

**Deliverables:**
- `src/services/MLClassifier.ts`
- ML-based classification in app

**Testing:**
```typescript
describe('MLClassifier', () => {
  it('should load model successfully', async () => {
    const model = await MLClassifier.loadModel()
    expect(model).toBeDefined()
  })

  it('should classify in real-time', async () => {
    const features = extractFeatures(audioSamples)
    const start = performance.now()
    const classification = await model.predict(features)
    const latency = performance.now() - start
    expect(latency).toBeLessThan(100) // <100ms
  })
})
```

---

#### **Step 3.3: Backend API Setup (Optional)**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Set up Node.js + Express or Python + FastAPI
- [ ] Define API endpoints:
  - `POST /api/readings` - Submit noise reading
  - `GET /api/readings` - Get readings (with filters)
  - `GET /api/heatmap` - Get campus-wide heatmap data
- [ ] Set up PostgreSQL database with PostGIS extension
- [ ] Implement database schema for noise readings
- [ ] Deploy to Railway or Render

**Deliverables:**
- `backend/src/api/` - API routes
- Deployed backend server (URL)
- API documentation

**Testing:**
```bash
# Test API endpoints
curl -X POST http://api.example.com/api/readings \
  -H "Content-Type: application/json" \
  -d '{"latitude": 38.83, "longitude": -77.30, "decibels": 65}'
```

---

#### **Step 3.4: Backend Integration in App**
**Duration:** 4 days
**Assignee:** TBD

**Tasks:**
- [ ] Implement API client service
- [ ] Upload noise readings to backend (when online)
- [ ] Queue readings when offline (sync later)
- [ ] Fetch campus-wide heatmap data from server
- [ ] Display aggregated data from all users
- [ ] Handle authentication (if required)

**Deliverables:**
- `src/services/APIService.ts`
- Crowdsourced heatmap feature

**Testing:**
- Test with airplane mode → Verify offline queuing works
- Turn on internet → Confirm queued data syncs

---

#### **Phase 3 Integration Testing**
**Duration:** 2 days

**Tests:**
1. **ML Accuracy** - Test in 20 locations, compare ML vs threshold classification
2. **Backend Sync** - Submit 50 readings → Verify all appear in database
3. **Multi-User Heatmap** - Multiple devices → Heatmap shows combined data

**Exit Criteria:**
- ✅ ML model achieves >85% accuracy in real-world testing
- ✅ Backend API handles 100 concurrent requests without errors
- ✅ App seamlessly switches between online and offline modes

---

### **PHASE 4: Testing, Optimization & Polish**
**Duration:** Week 11-12 (2 weeks)
**Goal:** Ensure app is production-ready with comprehensive testing

#### **Step 4.1: Unit Testing (Full Coverage)**
**Duration:** 4 days
**Assignee:** Entire team

**Tasks:**
- [ ] Write unit tests for all services:
  - AudioService
  - LocationService
  - FFTProcessor
  - Classifier
  - StorageService
  - APIService
- [ ] Achieve >80% code coverage
- [ ] Set up continuous integration (GitHub Actions)

**Testing Commands:**
```bash
npm test -- --coverage
# Target: >80% coverage
```

---

#### **Step 4.2: Integration Testing**
**Duration:** 3 days
**Assignee:** TBD

**Test Scenarios:**
1. **Happy Path**
   - Launch app → Grant permissions → Monitor noise → See classification → View map → Check history

2. **Error Paths**
   - Deny permissions → Show error screen
   - No GPS signal → Fallback to manual location
   - No internet → Offline mode works
   - Low battery → Warning message

3. **Edge Cases**
   - Very loud noise (>100dB) → App doesn't crash
   - Very quiet (0dB) → Classification still works
   - Rapid location changes → Data stays consistent

---

#### **Step 4.3: Performance Optimization**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Profile app performance (React DevTools, Android Profiler)
- [ ] Optimize FFT computation (use Web Workers if needed)
- [ ] Reduce re-renders in UI components (React.memo)
- [ ] Implement lazy loading for historical data
- [ ] Optimize map rendering (limit markers, use clustering)
- [ ] Reduce battery consumption:
  - Lower audio sampling rate if possible
  - Batch GPS requests
  - Implement "Sleep mode" when phone is stationary

**Performance Targets:**
- App launch: <3 seconds
- Audio processing latency: <500ms
- Map load time: <2 seconds
- Battery drain: <5% per hour

**Testing:**
```bash
# Android performance testing
adb shell dumpsys batterystats --reset
# Use app for 1 hour
adb shell dumpsys batterystats | grep NoiseMonitorApp
```

---

#### **Step 4.4: UI/UX Polish**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Improve visual design (consistent colors, spacing, fonts)
- [ ] Add animations (fade-ins, transitions)
- [ ] Implement dark mode (optional)
- [ ] Add onboarding tutorial (first-time users)
- [ ] Improve error messages (user-friendly text)
- [ ] Add accessibility features (screen reader support, text scaling)
- [ ] Get design feedback from 5+ users

**UI Improvements:**
- Loading skeletons while fetching data
- Empty states (no data yet)
- Success/error toast messages
- Pull-to-refresh on history screen

---

#### **Step 4.5: Security & Privacy**
**Duration:** 2 days
**Assignee:** TBD

**Tasks:**
- [ ] Ensure raw audio is never uploaded (only features/dB levels)
- [ ] Implement data anonymization (no user IDs unless opted in)
- [ ] Add privacy policy screen
- [ ] Secure API communication (HTTPS, API keys)
- [ ] Handle sensitive data properly (location obfuscation option)
- [ ] Test for common vulnerabilities (SQL injection, XSS)

**Deliverables:**
- Privacy policy document
- Security audit report

---

#### **Step 4.6: Beta Testing**
**Duration:** 5 days
**Assignee:** Entire team

**Tasks:**
- [ ] Recruit 10-15 beta testers (students on campus)
- [ ] Distribute app via TestFlight (iOS) or internal testing (Android)
- [ ] Provide testing instructions and feedback form
- [ ] Monitor crash reports and errors
- [ ] Collect user feedback:
  - Is the app intuitive?
  - Is classification accurate?
  - Any bugs or issues?
- [ ] Iterate based on feedback

**Feedback Collection:**
- Google Form with questions
- In-app feedback button
- Direct messages with testers

---

#### **Phase 4 Integration Testing**
**Duration:** 2 days

**Final Tests:**
1. **Real-World Scenario**
   - Student uses app to find quiet study spot
   - Walks to 5 locations
   - Finds a quiet room based on heatmap
   - Success: Student satisfied with recommendation

2. **Stress Testing**
   - Monitor continuously for 2 hours
   - Generate 500+ readings
   - App remains responsive, no crashes

3. **Multi-Device Testing**
   - Test on 5 different devices (various OS versions)
   - All core features work correctly

**Exit Criteria:**
- ✅ No critical bugs or crashes
- ✅ Performance targets met on all devices
- ✅ Beta testers rate app 4+ stars
- ✅ Security and privacy requirements satisfied

---

### **PHASE 5: Deployment & Presentation**
**Duration:** Week 13-14 (2 weeks)
**Goal:** Finalize app, documentation, and prepare academic presentation

#### **Step 5.1: Documentation**
**Duration:** 4 days
**Assignee:** Entire team

**Deliverables:**
- [ ] User manual (how to use the app)
- [ ] Technical documentation (architecture, API docs)
- [ ] Developer guide (how to build and run)
- [ ] Testing report (test results, coverage)
- [ ] Final project report (academic paper style)

---

#### **Step 5.2: App Store Preparation**
**Duration:** 3 days
**Assignee:** TBD

**Tasks:**
- [ ] Create app icon and screenshots
- [ ] Write app store description
- [ ] Prepare promotional video (30-60 seconds)
- [ ] Submit to TestFlight / Google Play Internal Testing
- [ ] (Optional) Submit to public app stores

---

#### **Step 5.3: Final Presentation**
**Duration:** 4 days
**Assignee:** Entire team

**Tasks:**
- [ ] Create presentation slides (15-20 minutes)
- [ ] Include: Problem, Solution, Architecture, Demo, Results
- [ ] Prepare live demo script
- [ ] Practice presentation (rehearse 3+ times)
- [ ] Record demo video (backup if live demo fails)

**Presentation Outline:**
1. Problem Statement (2 min)
2. Technical Approach (3 min)
3. System Architecture (3 min)
4. **Live Demo** (5 min)
5. Results & Evaluation (3 min)
6. Challenges & Learnings (2 min)
7. Q&A (5 min)

---

#### **Step 5.4: Code Cleanup**
**Duration:** 2 days
**Assignee:** Entire team

**Tasks:**
- [ ] Remove unused code and comments
- [ ] Ensure consistent code style
- [ ] Update README with final instructions
- [ ] Tag final release version in Git
- [ ] Archive development artifacts

---

## 📊 Success Metrics

### **Technical Metrics**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Classification Accuracy** | >85% | Test on 100 labeled samples |
| **Audio Processing Latency** | <500ms | Measure time from capture to classification |
| **GPS Accuracy** | ±10m outdoors | Compare with Google Maps |
| **Battery Consumption** | <5% per hour | Android battery stats |
| **App Launch Time** | <3 seconds | Manual stopwatch |
| **Crash Rate** | <1% | Firebase Crashlytics |
| **Code Coverage** | >80% | Jest coverage report |
| **App Size** | <50 MB | Check APK/IPA size |

### **User Experience Metrics**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **User Onboarding Time** | <2 minutes | User testing observation |
| **Task Success Rate** | >90% | User completes "find quiet spot" task |
| **User Satisfaction** | 4+ stars | Post-test survey (1-5 scale) |
| **Feature Discoverability** | >80% | Users find all main features without help |
| **Error Recovery** | 100% | Users can recover from all errors |

### **Business Metrics (Optional)**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Beta Testers** | 15+ students | Recruitment count |
| **Daily Active Users** | 10+ (pilot phase) | Analytics tracking |
| **Data Quality** | 85% valid readings | Backend validation |
| **User Retention (7 days)** | >50% | Users open app 7 days after install |

---

## ⚠️ Risk Management

### **Technical Risks**

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Poor classification accuracy** | Medium | High | Collect more training data, try different algorithms |
| **Battery drain too high** | High | High | Optimize sampling rate, implement battery saver mode |
| **Indoor GPS inaccuracy** | High | Medium | Use WiFi positioning, allow manual location selection |
| **FFT performance issues** | Low | Medium | Use optimized library, reduce sample size |
| **Platform compatibility issues** | Medium | Medium | Test on multiple devices early, use Expo for consistency |
| **Audio API inconsistencies** | Medium | High | Abstract audio layer, test on iOS and Android separately |

### **Project Risks**

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Scope creep** | High | High | Stick to phased approach, defer non-MVP features to Phase 3 |
| **Team member unavailable** | Medium | Medium | Cross-train on all components, maintain documentation |
| **Timeline delays** | Medium | High | Build buffer time, prioritize core features |
| **Device availability** | Low | Medium | Use emulators, share physical devices |
| **App store rejection** | Low | Medium | Follow guidelines, submit early to TestFlight |

### **Academic Risks**

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Insufficient documentation** | Medium | High | Document throughout development, not at the end |
| **Demo failure during presentation** | Medium | High | Record backup video, test setup beforehand |
| **Unclear learning outcomes** | Low | Medium | Maintain development journal, reflect on learnings |

---

## 📅 Timeline & Milestones

### **Semester Schedule (14 Weeks)**

| Week | Phase | Major Deliverable | Status |
|------|-------|------------------|--------|
| 1-2 | Phase 0: Research | Python prototype + audio samples | 🔲 Pending |
| 3-5 | Phase 1: Core App | Functional mobile app with audio | 🔲 Pending |
| 6-8 | Phase 2: GPS & Maps | Heatmap visualization | 🔲 Pending |
| 9-10 | Phase 3: ML & Backend | ML classifier + API (optional) | 🔲 Pending |
| 11-12 | Phase 4: Testing | Production-ready app | 🔲 Pending |
| 13-14 | Phase 5: Deployment | Final presentation | 🔲 Pending |

### **Key Milestones**

```
Week 2:  ✓ Python prototype validates feasibility
Week 5:  ✓ Mobile app measures and classifies noise
Week 8:  ✓ Heatmap shows campus noise distribution
Week 10: ✓ ML model improves accuracy (optional)
Week 12: ✓ Beta testing complete, bugs fixed
Week 14: ✓ Final presentation delivered
```

---

## 🎯 Acceptance Criteria

### **Minimum Viable Product (MVP)**
Must have all of these to pass:
- ✅ App runs on both iOS and Android
- ✅ Captures audio and calculates decibels
- ✅ Classifies environment as Quiet/Normal/Noisy
- ✅ GPS tags each measurement
- ✅ Displays noise data on map
- ✅ Stores historical data (24 hours minimum)
- ✅ No critical bugs or crashes

### **Stretch Goals**
Nice to have, but not required:
- 🌟 ML-based classification (>85% accuracy)
- 🌟 Backend for multi-user heatmap
- 🌟 Push notifications for quiet spots
- 🌟 Published to app stores
- 🌟 50+ real users during beta

---

## 📚 Appendix

### **Glossary**
- **dB SPL:** Decibels Sound Pressure Level, a measure of loudness
- **FFT:** Fast Fourier Transform, converts time-domain signal to frequency domain
- **GPS:** Global Positioning System, provides location coordinates
- **Heatmap:** Visual representation of data where values are depicted by color
- **RMS:** Root Mean Square, a statistical measure used in audio processing

### **References**
- React Native Documentation: https://reactnative.dev/
- FFT Algorithm: https://en.wikipedia.org/wiki/Fast_Fourier_transform
- Sound Level Measurement: ISO 1996 standard
- Audio Classification Papers: ESC-50, UrbanSound8K datasets

---

**Document Version:** 1.0.0
**Next Review Date:** End of Phase 1
**Questions?** Contact: ukhan26@gmu.edu

---

**📍 Navigation:**
- ← [Back to Project Context](PROJECT_CONTEXT.md)
- → [Check Progress Report](PROGRESS_REPORT.md)
- → [Review Git Strategy](GIT_STRATEGY.md)
