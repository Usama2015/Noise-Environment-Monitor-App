# Phase 1 Manual Testing Guide - Noise Monitor App

**Version:** 1.0.0
**Date:** 2025-10-28
**Phase:** Phase 1 - Core Mobile App (Completed)
**Purpose:** Comprehensive manual testing guide for all Phase 1 features

---

## 📋 Table of Contents

1. [What We Built in Phase 1](#what-we-built-in-phase-1)
2. [App Architecture Overview](#app-architecture-overview)
3. [Code Entry Point & Flow](#code-entry-point--flow)
4. [Component Interaction Diagram](#component-interaction-diagram)
5. [How to Run the App](#how-to-run-the-app)
6. [Manual Testing Procedures](#manual-testing-procedures)
7. [Expected Results](#expected-results)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## 🎯 What We Built in Phase 1

### **Phase 1 Completed Steps**

✅ **Step 1.1: React Native Setup**
- React Native 0.82.0 project initialized
- TypeScript configured
- Project structure established
- Android & iOS build configurations

✅ **Step 1.2: Microphone Permission & Audio Capture**
- `AudioService.ts` - Real-time audio capture (44.1kHz)
- Permission handling (request, grant, deny)
- Audio sample streaming every ~500ms
- Uses `react-native-audio-record` library

✅ **Step 1.3: Decibel Calculation**
- `DecibelCalculator.ts` - RMS to dB SPL conversion
- Formula: `dB = 20 * log10(RMS / reference) + 94`
- Real-time decibel measurement
- Calibrated for mobile devices

✅ **Step 1.4: Moving Average Filter**
- `MovingAverageFilter.ts` - Circular buffer implementation
- Window size: 5 samples (configurable)
- Smooths out noise spikes
- Real-time filtering

✅ **Step 1.5: FFT Implementation**
- `FFTProcessor.ts` - Fast Fourier Transform
- 2048-sample FFT with proper windowing
- Spectral feature extraction:
  - Spectral Centroid
  - Spectral Spread
  - Spectral Rolloff
  - Spectral Flatness
  - Frequency band energy ratios

✅ **Step 1.6: Threshold-Based Classification**
- `NoiseClassifier.ts` - Enhanced classification
- Categories: Quiet (<50dB), Normal (50-70dB), Noisy (>70dB)
- Uses both dB levels and spectral features
- Confidence scoring

✅ **Step 1.7: Basic UI Implementation**
- `HomeScreen.tsx` - Main app screen
- `DecibelDisplay.tsx` - Real-time dB display
- `ClassificationBadge.tsx` - Category badge
- `NoiseHistory.tsx` - Last 10 readings
- Color-coded visual feedback
- Responsive design

---

## 🏗️ App Architecture Overview

### **Technology Stack**
```
React Native 0.82.0
├── TypeScript 5.8.3
├── react-native-audio-record (audio capture)
├── react-native-safe-area-context (UI safety)
└── Jest + React Native Testing Library (testing)
```

### **Project Structure**
```
mobile-app/
├── index.js                    ← Entry point (registers app)
├── App.tsx                     ← Root component
├── src/
│   ├── types/index.ts         ← TypeScript types
│   ├── services/              ← Business logic
│   │   ├── AudioService.ts        (Microphone, permissions)
│   │   └── NoiseClassifier.ts     (Classification logic)
│   ├── utils/                 ← Pure functions
│   │   ├── DecibelCalculator.ts   (dB calculation)
│   │   ├── MovingAverageFilter.ts (Smoothing)
│   │   └── FFTProcessor.ts        (FFT, features)
│   ├── components/            ← UI components
│   │   ├── DecibelDisplay.tsx     (dB display)
│   │   ├── ClassificationBadge.tsx (Category badge)
│   │   ├── NoiseHistory.tsx       (History list)
│   │   └── index.ts               (Exports)
│   └── screens/               ← App screens
│       └── HomeScreen.tsx         (Main screen)
└── __tests__/                 ← Test files
```

---

## 🔄 Code Entry Point & Flow

### **1. App Startup (index.js → App.tsx)**

```
index.js
  ↓
AppRegistry.registerComponent('NoiseMonitor', () => App)
  ↓
App.tsx
  ↓
<SafeAreaProvider>              ← Handles device notches/safe areas
  ↓
<HomeScreen />                  ← Main application screen
```

### **2. HomeScreen Initialization**

When `HomeScreen.tsx` mounts:

```typescript
// Services initialized once
const audioService = new AudioService()        // Audio capture
const movingAverage = new MovingAverageFilter(5)  // Smoothing
const fftProcessor = new FFTProcessor(44100)   // FFT analysis
const classifier = new NoiseClassifier()       // Classification

// State initialized
const [isMonitoring, setIsMonitoring] = useState(false)
const [currentDecibels, setCurrentDecibels] = useState(0)
const [classification, setClassification] = useState(null)
const [readings, setReadings] = useState([])
```

### **3. User Interaction Flow**

```
USER TAPS "Start Monitoring"
         ↓
startMonitoring() function called
         ↓
Request microphone permission
         ↓
Permission granted? ──NO──→ Show error message
         │
        YES
         ↓
audioService.startRecording()
         ↓
Every ~500ms: audioService emits AudioSample
         ↓
processAudioSample() callback triggered
         ↓
[Audio Processing Pipeline - See below]
         ↓
Update UI with new values
         ↓
Add to history
         ↓
Repeat until user taps "Stop Monitoring"
```

---

## 📊 Component Interaction Diagram

### **Audio Processing Pipeline**

```
┌─────────────────────────────────────────────────────────────┐
│                     USER TAPS START                          │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  AudioService (src/services/AudioService.ts)                 │
│  • Requests microphone permission                           │
│  • Starts recording at 44.1kHz                              │
│  • Captures audio in chunks (~500ms)                        │
│  • Emits AudioSample { samples: Float32Array }              │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  processAudioSample() - HomeScreen.tsx                      │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│ DecibelCalculator│          │  FFTProcessor    │
│ (utils/)         │          │  (utils/)        │
│                  │          │                  │
│ Input:           │          │ Input:           │
│ • Float32Array   │          │ • Float32Array   │
│                  │          │                  │
│ Process:         │          │ Process:         │
│ 1. Calculate RMS │          │ 1. Apply window  │
│ 2. Convert to dB │          │ 2. Perform FFT   │
│ 3. dB = 20*log10 │          │ 3. Extract       │
│    (RMS/ref)+94  │          │    features      │
│                  │          │                  │
│ Output:          │          │ Output:          │
│ • decibels: 65   │          │ • frequencies[]  │
└────────┬─────────┘          │ • magnitudes[]   │
         │                    │ • features: {    │
         │                    │   centroid,      │
         │                    │   spread,        │
         │                    │   rolloff,       │
         │                    │   flatness,      │
         │                    │   energy ratios  │
         │                    │  }               │
         │                    └────────┬─────────┘
         │                             │
         ↓                             │
┌──────────────────┐                  │
│ MovingAverage    │                  │
│ Filter (utils/)  │                  │
│                  │                  │
│ Input:           │                  │
│ • instant dB     │                  │
│                  │                  │
│ Process:         │                  │
│ • Add to buffer  │                  │
│ • Calculate avg  │                  │
│ • Window size: 5 │                  │
│                  │                  │
│ Output:          │                  │
│ • smoothed dB    │                  │
└────────┬─────────┘                  │
         │                             │
         └──────────┬──────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  NoiseClassifier (src/services/NoiseClassifier.ts)          │
│                                                              │
│  Input:                                                      │
│  • smoothed dB                                              │
│  • spectral features                                        │
│                                                              │
│  Process:                                                    │
│  1. Threshold check (dB < 50, 50-70, > 70)                 │
│  2. Feature validation (spectral characteristics)           │
│  3. Calculate confidence                                    │
│                                                              │
│  Output:                                                     │
│  • category: "Quiet" | "Normal" | "Noisy"                  │
│  • confidence: 0.85                                         │
│  • description: "Library-level quiet"                       │
│  • color: "#4CAF50"                                         │
│  • icon: "🔇"                                               │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  UI UPDATE - HomeScreen.tsx                                  │
│                                                              │
│  1. setCurrentDecibels(smoothedDb)                          │
│  2. setClassification(result)                               │
│  3. Add to readings history                                 │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ DecibelDisplay│ │Classification│ │ NoiseHistory │
│ (components/) │ │Badge         │ │ (components/)│
│              │ │ (components/)│ │              │
│ Shows:       │ │              │ │ Shows:       │
│ • 65 dB      │ │ Shows:       │ │ • Last 10    │
│ • Color:     │ │ • "Normal"   │ │   readings   │
│   Yellow     │ │ • Yellow     │ │ • Timestamps │
│ • Large text │ │ • Icon       │ │ • Scrollable │
└──────────────┘ │ • Description│ └──────────────┘
                 │ • Confidence │
                 └──────────────┘
```

---

## 🚀 How to Run the App

### **Prerequisites**
- Node.js v20+ installed
- React Native CLI installed
- Android Studio (for Android) OR Xcode (for Mac/iOS)
- Physical device OR emulator/simulator

### **Step 1: Install Dependencies**
```bash
cd mobile-app
npm install

# For iOS only (Mac):
cd ios && pod install && cd ..
```

### **Step 2: Start Metro Bundler**
```bash
npm start
# OR
npx react-native start
```

### **Step 3: Run on Device/Emulator**

**For Android:**
```bash
# In a new terminal
npx react-native run-android
```

**For iOS (Mac only):**
```bash
npx react-native run-ios
```

### **Step 4: Enable Permissions**

When the app launches:
1. Tap "Start Monitoring"
2. **GRANT** microphone permission when prompted
3. App should start showing real-time decibel readings

---

## 🧪 Manual Testing Procedures

### **Test 1: Installation & Launch**

**Objective:** Verify app installs and launches successfully

**Steps:**
1. Build and install app on device
2. Tap app icon to launch
3. Observe splash screen → HomeScreen

**Expected Result:**
- ✅ App launches without crashes
- ✅ Green header with "Noise Monitor" title
- ✅ "Start Monitoring" button visible
- ✅ Info section explaining how to use
- ✅ No error messages

**What to Verify:**
- App icon appears on home screen
- Launch time < 3 seconds
- UI renders correctly (no blank screens)
- No console errors

---

### **Test 2: Microphone Permission - Grant Scenario**

**Objective:** Test normal permission flow

**Steps:**
1. Launch app (first time or after clearing permissions)
2. Tap "Start Monitoring"
3. When permission dialog appears, tap "Allow" or "Grant"

**Expected Result:**
- ✅ Permission dialog appears
- ✅ After granting: "Monitoring active" status appears
- ✅ Green pulsing dot visible
- ✅ Decibel values start updating
- ✅ Classification badge appears

**What to Verify:**
- Permission request is clear and user-friendly
- App doesn't crash if permission granted
- Monitoring starts immediately after permission

---

### **Test 3: Microphone Permission - Deny Scenario**

**Objective:** Test error handling

**Steps:**
1. Launch app
2. Tap "Start Monitoring"
3. When permission dialog appears, tap "Deny" or "Don't Allow"

**Expected Result:**
- ✅ Red error banner appears
- ✅ Error message: "Microphone permission denied. Please enable it in settings."
- ✅ "Start Monitoring" button remains enabled
- ✅ App doesn't crash

**What to Verify:**
- Error message is helpful and actionable
- User can retry by going to settings
- App remains functional (not frozen)

---

### **Test 4: Real-Time Decibel Display**

**Objective:** Verify audio capture and dB calculation

**Steps:**
1. Start monitoring (with permission granted)
2. Stay silent for 5 seconds
3. Clap hands once
4. Talk normally for 5 seconds
5. Shout or play loud music
6. Return to silence

**Expected Result:**
- ✅ Silent: dB shows ~30-45 dB
- ✅ Clap: Brief spike visible, then returns to baseline
- ✅ Normal talk: ~50-65 dB
- ✅ Loud sound: ~70-85+ dB
- ✅ Values update every ~500ms
- ✅ Display is responsive (no freezing)

**What to Verify:**
- dB values are in reasonable range (20-100 dB)
- Updates are smooth, not jumpy
- Display responds to real-world sounds
- No negative or NaN values

---

### **Test 5: Moving Average Filter**

**Objective:** Verify smoothing reduces spikes

**Steps:**
1. Start monitoring
2. Make a sudden loud noise (clap, shout)
3. Observe the dB value

**Expected Result:**
- ✅ Spike is visible but smoothed
- ✅ Value doesn't jump from 40 → 90 → 40 instantly
- ✅ Gradual increase and decrease
- ✅ Filter window ~5 samples (~2.5 seconds)

**What to Verify:**
- Single spike doesn't dominate classification
- Values transition smoothly
- Filter doesn't introduce too much lag

---

### **Test 6: Noise Classification**

**Objective:** Test classification accuracy

**Test Scenarios:**

#### **A. Quiet Environment (< 50 dB)**
**Where:** Library, empty room, quiet bedroom at night
**Steps:**
1. Go to a quiet location
2. Start monitoring
3. Wait 10 seconds

**Expected Result:**
- ✅ Classification: "Quiet"
- ✅ Badge color: Green
- ✅ Icon: 🔇
- ✅ Description: "Library-level quiet" or similar
- ✅ dB reading: 30-49 dB

#### **B. Normal Environment (50-70 dB)**
**Where:** Cafeteria during off-peak, hallway, office
**Steps:**
1. Go to a moderately noisy location
2. Start monitoring
3. Talk normally, background chatter

**Expected Result:**
- ✅ Classification: "Normal"
- ✅ Badge color: Yellow/Orange
- ✅ Icon: 🔊
- ✅ Description: "Moderate background noise"
- ✅ dB reading: 50-70 dB

#### **C. Noisy Environment (> 70 dB)**
**Where:** Gym, construction area, loud music, crowded cafeteria
**Steps:**
1. Go to a loud location
2. Start monitoring
3. Play music, shout, or be near machinery

**Expected Result:**
- ✅ Classification: "Noisy"
- ✅ Badge color: Red
- ✅ Icon: 📢
- ✅ Description: "Disruptive noise levels"
- ✅ dB reading: 70-100 dB

**What to Verify:**
- Classification matches your perception
- Color coding is intuitive
- Transitions between categories are smooth
- Confidence score makes sense

---

### **Test 7: FFT and Spectral Features**

**Objective:** Verify FFT enhances classification

**Test with Different Sounds:**

1. **Pure Tone (whistle, tuning fork app)**
   - High spectral centroid
   - Narrow spread
   - Low flatness (tonal)

2. **White Noise (fan, air conditioner)**
   - Moderate spectral centroid
   - Wide spread
   - High flatness (noisy)

3. **Speech**
   - Varying centroid
   - Moderate spread
   - Mid-range frequencies dominant

**Expected Result:**
- ✅ Classification considers sound character, not just dB
- ✅ A 60dB whistle might be "Quiet" (pure tone)
- ✅ A 60dB HVAC might be "Normal" (broadband noise)

**What to Verify:**
- FFT is working (no crashes)
- Features influence classification
- Different sound types classified differently at same dB

---

### **Test 8: History Tracking**

**Objective:** Verify readings are stored and displayed

**Steps:**
1. Start monitoring
2. Move through 3 different environments (quiet → normal → noisy)
3. Spend 10 seconds in each
4. Observe history list

**Expected Result:**
- ✅ History shows last 10 readings
- ✅ Each entry has:
  - dB value
  - Category (Quiet/Normal/Noisy)
  - Timestamp (e.g., "2:34:56 PM")
  - Description
- ✅ Color-coded circles
- ✅ Most recent at top

**What to Verify:**
- Readings appear in chronological order
- Timestamps are accurate
- List scrolls if > 10 items
- No duplicate entries

---

### **Test 9: UI Responsiveness**

**Objective:** Test user interface

**Steps:**
1. Start monitoring
2. Scroll the screen
3. Tap buttons multiple times rapidly
4. Rotate device (if applicable)
5. Background/foreground the app

**Expected Result:**
- ✅ UI updates smoothly (60 FPS)
- ✅ No lag when scrolling
- ✅ Buttons respond immediately
- ✅ No crash when backgrounded
- ✅ Monitoring stops when app backgrounded

**What to Verify:**
- Animations are smooth
- Touch targets are large enough
- Text is readable
- Colors are accessible
- No UI glitches

---

### **Test 10: Error Handling**

**Objective:** Test edge cases

#### **A. Rapid Start/Stop**
**Steps:**
1. Tap "Start Monitoring"
2. Immediately tap "Stop Monitoring"
3. Repeat 5 times rapidly

**Expected Result:**
- ✅ No crashes
- ✅ State transitions correctly
- ✅ No orphaned audio sessions

#### **B. Phone Call Interruption**
**Steps:**
1. Start monitoring
2. Make/receive a phone call
3. End call

**Expected Result:**
- ✅ Monitoring pauses during call
- ✅ Resumes after call (or shows stopped state)
- ✅ No audio conflicts

#### **C. Low Battery**
**Steps:**
1. Test with battery < 20%
2. Start monitoring

**Expected Result:**
- ✅ App works normally
- ✅ No excessive battery drain
- ✅ Optional: Low battery warning

#### **D. Airplane Mode**
**Steps:**
1. Enable airplane mode
2. Start monitoring

**Expected Result:**
- ✅ App works (no network needed)
- ✅ Audio capture unaffected

---

### **Test 11: Performance Testing**

**Objective:** Measure app performance

#### **A. Audio Processing Latency**
**Steps:**
1. Start monitoring
2. Clap hands
3. Note time between clap and dB spike

**Expected Result:**
- ✅ Latency < 1 second (ideally ~500ms)
- ✅ No noticeable delay

#### **B. Battery Consumption**
**Steps:**
1. Fully charge device
2. Start monitoring
3. Let run for 1 hour
4. Check battery percentage

**Expected Result:**
- ✅ Battery drain < 5% per hour
- ✅ Device doesn't overheat

**How to Measure:**
- **Android:** Settings → Battery → App usage
- **iOS:** Settings → Battery → Battery usage by app

#### **C. Memory Usage**
**Steps:**
1. Monitor for 10 minutes
2. Check memory usage

**Expected Result:**
- ✅ Memory stable (no leaks)
- ✅ App size < 100 MB

**How to Check:**
- **Android:** Developer options → Running services
- **iOS:** Xcode → Debug navigator → Memory

---

## ✅ Expected Results Summary

### **Functional Requirements**
- ✅ App launches successfully
- ✅ Microphone permission requested and handled
- ✅ Real-time audio capture at 44.1kHz
- ✅ Accurate decibel calculation (±5dB tolerance)
- ✅ Smooth filtering with moving average
- ✅ FFT processing without crashes
- ✅ Classification works for all 3 categories
- ✅ UI updates in real-time
- ✅ History tracks last 10+ readings

### **Performance Requirements**
- ✅ Processing latency < 1 second
- ✅ Battery consumption < 5% per hour
- ✅ No memory leaks
- ✅ Smooth 60 FPS UI

### **UX Requirements**
- ✅ Intuitive interface (< 30 seconds to understand)
- ✅ Clear visual feedback
- ✅ Helpful error messages
- ✅ Responsive design

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Microphone permission denied" persists**
**Cause:** Permission denied in OS settings

**Solution:**
```bash
# Android
adb shell pm grant com.noisemonitor android.permission.RECORD_AUDIO

# iOS
Settings → NoiseMonitor → Microphone → Enable
```

### **Issue 2: dB values always 0 or very low**
**Cause:** Audio capture not working

**Troubleshooting:**
1. Check microphone physically works (test with voice recorder)
2. Check app has microphone permission
3. Check `react-native-audio-record` installed:
   ```bash
   npm list react-native-audio-record
   ```
4. Rebuild app:
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

### **Issue 3: App crashes on start**
**Cause:** Native module linking issue

**Solution:**
```bash
# Android
cd android && ./gradlew clean && cd ..
npm install
npx react-native run-android

# iOS
cd ios && rm -rf Pods && pod install && cd ..
npx react-native run-ios
```

### **Issue 4: Classification always "Normal"**
**Cause:** Threshold calibration or insufficient variation

**Troubleshooting:**
1. Test in extremely quiet environment (< 40 dB)
2. Test with very loud sound (> 80 dB)
3. Check console logs for actual dB values
4. Verify `NoiseClassifier` thresholds in code

### **Issue 5: UI freezing or laggy**
**Cause:** Processing too heavy for device

**Solution:**
1. Check device specs (older devices may struggle)
2. Reduce FFT frequency (edit sample rate)
3. Disable debug mode (use release build)
4. Check for infinite loops in useEffect

### **Issue 6: "Unable to resolve module" error**
**Cause:** Metro bundler cache issue

**Solution:**
```bash
# Clear cache
npx react-native start --reset-cache

# If persists:
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

---

## 📊 Testing Checklist

Use this checklist to track your testing:

### **Setup**
- [ ] Dependencies installed (`npm install`)
- [ ] App builds successfully
- [ ] App launches on device/emulator
- [ ] No console errors on launch

### **Permissions**
- [ ] Permission requested on first launch
- [ ] Grant permission works
- [ ] Deny permission shows error
- [ ] Can retry after denying

### **Audio Capture**
- [ ] Real-time audio capture works
- [ ] dB values update every ~500ms
- [ ] Values in reasonable range (20-100 dB)
- [ ] Responds to different sound levels

### **Processing**
- [ ] Moving average smooths spikes
- [ ] FFT runs without crashes
- [ ] Classification updates in real-time

### **Classification**
- [ ] Quiet environment → "Quiet"
- [ ] Normal environment → "Normal"
- [ ] Noisy environment → "Noisy"
- [ ] Color coding correct
- [ ] Icons display correctly

### **UI/UX**
- [ ] DecibelDisplay shows large readable text
- [ ] ClassificationBadge shows category
- [ ] History list shows readings
- [ ] Colors are intuitive
- [ ] Smooth animations

### **Error Handling**
- [ ] Permission denial handled
- [ ] Rapid start/stop works
- [ ] Phone call interruption handled
- [ ] Works in airplane mode

### **Performance**
- [ ] Latency < 1 second
- [ ] Battery drain < 5%/hour
- [ ] No memory leaks
- [ ] UI smooth (60 FPS)

---

## 📝 Test Results Template

Copy this template to document your findings:

```markdown
# Phase 1 Manual Test Results

**Tester:** [Your Name]
**Date:** [Date]
**Device:** [Device Model]
**OS Version:** [Android/iOS version]

## Test Environment
- Location: [Where tested]
- Ambient noise level: [Quiet/Normal/Noisy]
- Time of day: [Morning/Afternoon/Evening]

## Test Results

### Installation & Launch
- Status: [ ] Pass [ ] Fail
- Notes:

### Permission Flow
- Grant scenario: [ ] Pass [ ] Fail
- Deny scenario: [ ] Pass [ ] Fail
- Notes:

### Audio Capture
- Status: [ ] Pass [ ] Fail
- dB range observed: [min-max]
- Notes:

### Classification Accuracy
- Quiet test: [ ] Pass [ ] Fail
- Normal test: [ ] Pass [ ] Fail
- Noisy test: [ ] Pass [ ] Fail
- Notes:

### UI/UX
- Status: [ ] Pass [ ] Fail
- Issues found:

### Performance
- Latency: [measured value]
- Battery drain: [% per hour]
- Memory usage: [MB]
- Notes:

## Issues Found
1. [Issue description]
   - Severity: [Critical/High/Medium/Low]
   - Steps to reproduce:
   - Expected vs Actual:

## Overall Assessment
- [ ] Ready for Phase 2
- [ ] Needs fixes before proceeding
- Confidence: [1-5 stars]
- Comments:
```

---

## 🚀 Next Steps After Testing

1. **Document all findings** in test results template
2. **Report bugs** as GitHub issues
3. **Fix critical issues** before Phase 2
4. **Update PROGRESS_REPORT.md** with test results
5. **Proceed to Phase 2** if exit criteria met

---

**Questions?** Contact the team or check [PROJECT_PLAN.md](../../PROJECT_PLAN.md) for Phase 1 exit criteria.

**Good luck with testing!** 🎉
