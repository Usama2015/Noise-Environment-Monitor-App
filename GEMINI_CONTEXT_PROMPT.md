# Project Context Prompt for Gemini AI

**Copy this entire prompt to Gemini, then share REVISED_ARCHITECTURE.md for feedback**

---

## Project Overview

I'm building a **Noise Environment Monitor App** for a university project. The goal is to help students find quiet study spaces on campus by measuring ambient noise levels, classifying them, and visualizing the data on a map.

**Target Platform:** React Native (Android + iOS)
**Primary Use Case:** Students can measure noise in different campus locations, see historical data, and find quiet spots via a heatmap

---

## Technical Stack

- **Framework:** React Native (TypeScript)
- **Audio:** react-native-sound-level (native dB metering)
- **Platform:** Android 14 (Samsung S25 Ultra) + iOS
- **Standards:** IEC 61672 time weighting (125ms Fast + 1-second Slow)

---

## Current Implementation Status

### ✅ **Phase 1 Complete - Real-time Monitoring:**

**What's Working:**
1. **AudioService** - Captures microphone audio and calculates dB levels
   - Uses react-native-sound-level for native dB metering
   - Implements IEC 61672 standards (125ms Fast response for UI, 1-second Slow for classification)
   - Proper calibration: dBFS → SPL conversion (quiet room = 0-50 dB, not 93 dB)
   - Logarithmic dB averaging

2. **NoiseClassifier** - Categorizes environments
   - Quiet: < 50 dB
   - Normal: 50-70 dB
   - Noisy: > 70 dB

3. **Real-time UI** - HomeScreen displays:
   - Current dB level (updates every 125ms)
   - Classification badge (Quiet/Normal/Noisy)
   - Start/Stop monitoring controls

**Technology Details:**
```typescript
// AudioService architecture
Microphone → react-native-sound-level (125ms) → dB value → 1-sec buffer → Classification
         ↓
   Real-time UI updates (Fast - 125ms)
         ↓
   Classification storage (Slow - 1 second)
```

**Key Files:**
- `src/services/AudioService.ts` - Audio capture and dB calculation
- `src/services/NoiseClassifier.ts` - Classification logic
- `src/screens/HomeScreen.tsx` - Real-time monitoring UI
- `src/types/index.ts` - TypeScript type definitions

---

## Current Data Model

```typescript
export interface AudioSample {
  samples: Float32Array;      // PCM audio data
  sampleRate: number;         // 44100 Hz
  timestamp: Date;
  decibelLevel: number;       // Calibrated dB (0-120)
}

export interface NoiseReading {
  id: string;
  timestamp: Date;
  decibels: number;
  classification: NoiseClassification;
  latitude?: number;          // Not yet implemented
  longitude?: number;         // Not yet implemented
  locationName?: string;
}
```

---

## The Problem We Just Discovered

### **Critical Gap in Current Implementation:**

**What we have:**
- ✅ Real-time monitoring works perfectly
- ✅ dB calculation is accurate
- ✅ Classification works

**What's missing:**
- ❌ **NO audio recording storage** - We only display live data, nothing is saved
- ❌ **NO historical data** - When you restart the app, all data is lost
- ❌ **NO playback capability** - Can't review what was recorded
- ❌ **NO persistent storage** - No database, no file system storage
- ❌ **NO location tagging** - Can't tie recordings to specific locations yet

### **Why This Is a Problem:**

For the campus noise monitoring use case, we NEED to:
1. **Store recordings** with timestamps and locations
2. **Build historical data** over days/weeks
3. **Analyze trends** (e.g., "Library is quiet on Tuesday mornings")
4. **Map recordings** to campus locations
5. **Let users playback** old recordings

**Current flow (inadequate):**
```
User starts monitoring → Live dB display → User stops → DATA LOST
```

**Required flow:**
```
User starts monitoring →
  Every 1 second:
    - Capture audio
    - Get GPS location
    - Calculate dB
    - SAVE audio file (.wav)
    - SAVE metadata to database
  → User stops →
ALL DATA PERSISTED AND QUERYABLE
```

---

## Original Plan (Before We Realized the Gap)

**Phase 1:** Core audio monitoring ✅ DONE
**Phase 2:** GPS integration and mapping
**Phase 3:** ML classification (optional)
**Phase 4:** Testing and polish
**Phase 5:** Deployment

**Problem with original plan:** It didn't explicitly address data persistence and audio file storage. We would have gotten to Phase 2 (GPS) and realized we have nothing to map because we're not storing any data!

---

## Revised Architecture (Need Your Feedback!)

I've created a comprehensive revised architecture that adds a **Phase 1.5: Data Persistence** BEFORE GPS integration.

**Key additions:**

1. **StorageService** - New service to handle:
   - Saving audio files to disk (1-second WAV recordings)
   - SQLite database for metadata
   - CRUD operations for recordings
   - File system management

2. **Enhanced data model:**
```typescript
export interface NoiseRecording {
  id: string;
  audioFilePath: string;        // NEW: Path to .wav file
  duration: number;
  sampleRate: number;
  fileSize: number;
  recordedAt: Date;

  location: {                   // NEW: GPS data
    latitude: number;
    longitude: number;
    accuracy: number;
    locationName?: string;
  };

  analysis: {
    decibelLevel: number;
    peakDecibel: number;
    classification: NoiseClassification;
  };
}
```

3. **Storage architecture:**
```
storage/
├── recordings/
│   └── 2025-11-25/
│       ├── 15-30-45_uuid.wav  (1-second recordings)
│       └── 15-31-50_uuid.wav
└── database/
    └── noise_monitor.db        (SQLite metadata)
```

4. **New features:**
   - History tab to browse recordings
   - Playback capability
   - Storage management (auto-cleanup old files)
   - Queryable database (by date, location, classification)

---

## What I Need From You (Gemini)

I'm going to share the **REVISED_ARCHITECTURE.md** document with you next. Please review it and provide feedback on:

### **1. Architecture Review:**
- Is the storage architecture sound?
- SQLite + file system approach - good choice?
- Any better alternatives for React Native?

### **2. Data Model:**
- Is `NoiseRecording` interface comprehensive?
- Missing any critical fields?
- Should we store raw PCM samples or just the analyzed dB values?

### **3. Implementation Concerns:**
- Any performance issues with saving 1-second WAV files continuously?
- Storage limits - 100MB for 1000 recordings reasonable?
- Should we use compression (MP3 vs WAV)?

### **4. Phase Ordering:**
- Does Phase 1.5 (Persistence) → Phase 2 (GPS) make sense?
- Or should we implement GPS first and add storage later?

### **5. Missing Considerations:**
- Battery consumption when saving files continuously?
- Privacy concerns with storing audio?
- Sync to cloud (future phase)?
- Export/import functionality?

### **6. Alternative Approaches:**
- Should we store audio at all, or just store dB values + features?
- Pros/cons of different storage strategies?

---

## Technical Constraints

- **Device:** Android 14 (primary), iOS (secondary)
- **Storage:** Phone local storage (no backend yet)
- **Network:** Must work offline
- **Battery:** Target < 5% per hour
- **Users:** Single user for Phase 1, multi-user in Phase 3

---

## Questions to Consider

1. **Storage strategy:** Save every 1-second recording or aggregate?
2. **Audio format:** WAV (uncompressed) vs MP3 (smaller)?
3. **Database choice:** SQLite vs AsyncStorage vs Realm?
4. **File organization:** By date? By location? By session?
5. **Retention policy:** Auto-delete after 30 days?
6. **Memory management:** Load all recordings at once or paginate?

---

## Expected Output From You

Please provide:
1. ✅ **Validation** - Is the revised architecture solid?
2. ⚠️ **Red flags** - Any critical issues you see?
3. 💡 **Suggestions** - Better approaches or optimizations?
4. 📋 **Checklist** - Anything we're missing in the plan?
5. 🚀 **Priority** - What should we implement first?

---

**After you review this context, I'll share the full REVISED_ARCHITECTURE.md document for detailed feedback.**

Ready when you are! 🚀
