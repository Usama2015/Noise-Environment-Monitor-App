# Revised Architecture - Complete Data Storage Strategy

**Created:** 2025-11-25
**Purpose:** Comprehensive plan including audio recording storage with timestamps and locations

---

## 🎯 **Problem Statement**

**Current Implementation (Phase 1):**
- ✅ Real-time audio monitoring
- ✅ dB calculation and classification
- ❌ NO audio file storage
- ❌ NO historical data persistence
- ❌ NO location tagging

**Required Functionality:**
1. **Record and store audio files** (not just dB values)
2. **Tag each recording** with timestamp + GPS location
3. **Persist data** for historical analysis
4. **Retrieve recordings** by time/location/classification
5. **Map recordings** to campus locations
6. **Analyze trends** over time

---

## 📊 **Complete Data Model**

```typescript
/**
 * Stored audio recording with full metadata
 * This is the core data model - everything revolves around this
 */
export interface NoiseRecording {
  // Identity
  id: string;                          // UUID

  // Audio File
  audioFilePath: string;               // Local file path (e.g., "recordings/2025-11-25_15-30-45.wav")
  duration: number;                    // Recording duration in seconds
  sampleRate: number;                  // 44100 Hz
  fileSize: number;                    // Bytes

  // Timestamp
  recordedAt: Date;                    // When was this recorded

  // Location Data
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;                  // GPS accuracy in meters
    locationName?: string;             // Optional manual label (e.g., "Library 4th Floor")
  };

  // Audio Analysis
  analysis: {
    decibelLevel: number;              // Average dB over the recording
    peakDecibel: number;               // Maximum dB spike
    classification: NoiseClassification; // Quiet/Normal/Noisy
    spectralFeatures?: AudioFeatures;  // Optional FFT features
  };

  // Metadata
  deviceInfo?: {
    model: string;                     // Phone model
    os: string;                        // Android/iOS version
  };

  // User Notes (optional)
  notes?: string;
  tags?: string[];                     // e.g., ["study session", "morning"]
}

/**
 * Recording session - multiple recordings grouped together
 * Useful for "I monitored the library for 30 minutes" scenarios
 */
export interface RecordingSession {
  id: string;
  startTime: Date;
  endTime: Date;
  recordingIds: string[];              // Array of NoiseRecording IDs
  locationName: string;
  averageDecibel: number;
  notes?: string;
}
```

---

## 🗄️ **Storage Architecture**

### **File System Structure**

```
mobile-app/
└── storage/
    ├── recordings/                   # Audio files
    │   ├── 2025-11-25/              # Organized by date
    │   │   ├── 15-30-45_uuid.wav    # Timestamp_ID.wav
    │   │   ├── 15-31-50_uuid.wav
    │   │   └── ...
    │   └── 2025-11-26/
    │       └── ...
    │
    └── database/
        └── noise_monitor.db          # SQLite database for metadata
```

### **Database Schema (SQLite)**

```sql
-- Main recordings table
CREATE TABLE recordings (
  id TEXT PRIMARY KEY,
  audio_file_path TEXT NOT NULL,
  duration REAL NOT NULL,
  sample_rate INTEGER NOT NULL,
  file_size INTEGER NOT NULL,
  recorded_at TIMESTAMP NOT NULL,

  -- Location
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  accuracy REAL NOT NULL,
  location_name TEXT,

  -- Analysis
  decibel_level REAL NOT NULL,
  peak_decibel REAL NOT NULL,
  classification TEXT NOT NULL,

  -- Metadata
  device_model TEXT,
  device_os TEXT,
  notes TEXT,

  -- Indexes for fast queries
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recorded_at ON recordings(recorded_at);
CREATE INDEX idx_location ON recordings(latitude, longitude);
CREATE INDEX idx_classification ON recordings(classification);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location_name TEXT NOT NULL,
  average_decibel REAL NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship
CREATE TABLE session_recordings (
  session_id TEXT NOT NULL,
  recording_id TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  PRIMARY KEY (session_id, recording_id),
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  FOREIGN KEY (recording_id) REFERENCES recordings(id)
);
```

---

## 🏗️ **Revised System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Monitor Tab  │  │  History Tab │  │   Map Tab    │         │
│  │ (Real-time)  │  │  (Playback)  │  │  (Spatial)   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────────┐
│         │        SERVICES LAYER (Business Logic)                │
│         │                  │                  │                  │
│    ┌────▼─────┐      ┌────▼─────┐      ┌────▼─────┐           │
│    │  Audio   │      │ Storage  │      │ Location │           │
│    │ Service  │◄────►│ Service  │◄────►│ Service  │           │
│    └────┬─────┘      └────┬─────┘      └────┬─────┘           │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────────┐
│         │       PERSISTENCE LAYER                                │
│    ┌────▼─────────────┐   │             ┌────▼──────────┐      │
│    │ File System      │   │             │  SQLite DB    │      │
│    │ (Audio Files)    │   │             │  (Metadata)   │      │
│    │ .wav recordings  │   │             │  Fast queries │      │
│    └──────────────────┘   │             └───────────────┘      │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                 DEVICE SENSORS                                    │
│         ┌──────────────┐   │      ┌──────────────┐              │
│         │  Microphone  │◄──┘      │     GPS      │              │
│         └──────────────┘          └──────────────┘              │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Complete User Workflow**

### **1. Recording Flow**

```
User taps "Start Monitoring"
    ↓
[Request Permissions]
    ↓ microphone + location
[Create Recording Session]
    ↓
┌───────────────────────────────────────┐
│ Every 1 second (IEC 61672 "Slow"):   │
│                                       │
│ 1. Capture Audio (1-sec buffer)      │
│ 2. Get GPS Location                  │
│ 3. Calculate dB Level                │
│ 4. Classify (Quiet/Normal/Noisy)     │
│ 5. Save Audio File                   │
│ 6. Save Metadata to DB               │
│ 7. Update Real-time UI               │
│                                       │
│ Loop until user stops...             │
└───────────────────────────────────────┘
    ↓
User taps "Stop"
    ↓
[Finalize Session]
    ↓
[Show Summary]
```

### **2. History/Playback Flow**

```
User opens "History" tab
    ↓
[Query SQLite DB]
    ↓ Filter by: date, location, classification
[Display List of Recordings]
    ↓
User selects a recording
    ↓
[Load Recording Details]
    ↓
User taps "Play"
    ↓
[Load Audio File from storage]
    ↓
[Play audio + Show waveform]
```

### **3. Map View Flow**

```
User opens "Map" tab
    ↓
[Query All Recordings with GPS]
    ↓
[Plot Markers on Map]
    ↓ Color-coded by classification
[User taps marker]
    ↓
[Show Recording Details]
    ↓
[Option to play audio]
```

---

## 📱 **Service Implementation Plan**

### **1. StorageService (NEW)**

```typescript
// src/services/StorageService.ts
class StorageService {
  // Audio File Management
  async saveAudioFile(audioData: Float32Array, recordingId: string): Promise<string>
  async loadAudioFile(filePath: string): Promise<Float32Array>
  async deleteAudioFile(filePath: string): Promise<void>

  // Database Operations
  async saveRecording(recording: NoiseRecording): Promise<void>
  async getRecording(id: string): Promise<NoiseRecording | null>
  async getRecordingsByDateRange(start: Date, end: Date): Promise<NoiseRecording[]>
  async getRecordingsByLocation(lat: number, lon: number, radius: number): Promise<NoiseRecording[]>
  async getRecordingsByClassification(classification: NoiseClassification): Promise<NoiseRecording[]>
  async deleteRecording(id: string): Promise<void>

  // Session Management
  async createSession(session: RecordingSession): Promise<void>
  async getSessions(): Promise<RecordingSession[]>
  async getSessionRecordings(sessionId: string): Promise<NoiseRecording[]>

  // Storage Management
  async getTotalStorageUsed(): Promise<number>
  async cleanupOldRecordings(daysToKeep: number): Promise<void>
}
```

### **2. LocationService (NEW)**

```typescript
// src/services/LocationService.ts
class LocationService {
  async requestPermission(): Promise<boolean>
  async getCurrentLocation(): Promise<LocationCoordinates>
  async startLocationTracking(): Promise<void>
  async stopLocationTracking(): Promise<void>
  onLocationUpdate(callback: (location: LocationCoordinates) => void)
}
```

### **3. AudioService (UPDATED)**

```typescript
// src/services/AudioService.ts - Enhanced version
class AudioService {
  // Existing methods
  async requestPermission(): Promise<boolean>
  async startRecording(): Promise<void>
  async stopRecording(): Promise<void>
  onRealTimeUpdate(callback: (dbValue: number) => void): () => void
  onAudioSample(callback: (sample: AudioSample) => void): () => void

  // NEW: Recording storage
  async startRecordingSession(): Promise<string> // Returns session ID
  async stopRecordingSession(): Promise<void>
  onRecordingSaved(callback: (recording: NoiseRecording) => void): () => void
}
```

---

## 📋 **Revised Implementation Phases**

### **Phase 1.5: Data Persistence (CURRENT - Add to Phase 1)**
**Duration:** 1 week
**Goal:** Add recording storage before GPS

#### **Step 1.5.1: Storage Service Setup (2 days)**
- Install SQLite library: `react-native-sqlite-storage`
- Create database schema
- Implement `StorageService`
- Test CRUD operations

#### **Step 1.5.2: Audio File Storage (2 days)**
- Implement audio file saving (WAV format)
- Organize files by date
- Add file management (delete, cleanup)

#### **Step 1.5.3: Recording Integration (2 days)**
- Update `AudioService` to save recordings
- Save 1-second audio chunks
- Link audio files to database records
- Test end-to-end recording→storage→retrieval

#### **Step 1.5.4: History View (1 day)**
- Create `HistoryScreen.tsx`
- Display list of recordings
- Add playback capability
- Show recording details

**Exit Criteria:**
- ✅ Recordings are saved to disk with metadata
- ✅ Can retrieve and play back recordings
- ✅ History view shows all past recordings

---

### **Phase 2: GPS Integration (Modified)**
**Duration:** 2 weeks
**Goal:** Add location tagging to recordings

#### **Step 2.1: LocationService (2 days)**
- Implement GPS permission and access
- Get current location
- Test accuracy

#### **Step 2.2: Location Tagging (2 days)**
- Update `NoiseRecording` to include location
- Tag recordings with GPS coordinates
- Add location to history view

#### **Step 2.3: Map View (3 days)**
- Install `react-native-maps`
- Display recordings on map
- Color-coded markers

#### **Step 2.4: Heatmap (5 days)**
- Implement heatmap visualization
- Historical data aggregation

---

## 🎯 **Storage Limits & Management**

### **Storage Budget**
- **Max recordings:** 1000 recordings
- **Average file size:** 100 KB per 1-second recording
- **Total storage:** ~100 MB
- **Retention:** 30 days (configurable)

### **Automatic Cleanup**
- Delete recordings older than 30 days
- User can manually delete anytime
- Warn user when storage > 80% full

---

## ✅ **What This Fixes**

1. ✅ **Persistent Data:** No more losing data on app restart
2. ✅ **Historical Analysis:** Can review past recordings
3. ✅ **Playback:** Can listen to what was recorded
4. ✅ **Location Context:** Know where each recording was made
5. ✅ **Trend Analysis:** See patterns over time
6. ✅ **Mapping:** Visualize noise distribution spatially

---

## 🚀 **Immediate Next Steps**

1. **Install dependencies:**
   ```bash
   npm install react-native-sqlite-storage
   npm install react-native-fs  # For file management
   ```

2. **Implement StorageService** (most critical)
3. **Update AudioService** to save recordings
4. **Create History view** to see saved recordings
5. **THEN add GPS** (Phase 2)

---

**This revised plan ensures we have a solid data foundation before adding GPS and mapping features.**
