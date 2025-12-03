# Campus Noise Monitor - Project Blueprint

**Version:** 2.0
**Last Updated:** December 3, 2025
**Status:** PROJECT COMPLETE - v1.0.0 Released
**Architecture:** Cloud-First with Firebase

---

## 🎯 Executive Summary

### **Vision**
Build a crowd-sourced mobile application that helps university students find quiet study spaces by providing real-time noise level data across campus—think "Waze for Noise."

### **Core Value Proposition**
- **Real-time:** Instant updates across all users via Firebase
- **Privacy-first:** No audio recording—only dB measurements
- **Frictionless:** No account creation required (Anonymous Auth)
- **Community-driven:** Crowd-sourced data benefits everyone

### **Success Criteria**
1. Multi-device real-time synchronization working
2. Accurate noise measurement (±3 dB)
3. Clear heatmap visualization on campus map
4. Sub-30-second time-to-first-use

---

## 🏗️ Technical Architecture

### **1. Technology Stack**

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Mobile Framework** | React Native (TypeScript) | Cross-platform (iOS/Android), large ecosystem, TypeScript for type safety |
| **Backend** | Firebase Firestore | Real-time sync, serverless, offline support, generous free tier |
| **Authentication** | Firebase Anonymous Auth | Zero-friction onboarding, user attribution without PII |
| **Audio Processing** | react-native-sound-level | Native dB metering, IEC 61672 compliant |
| **Maps** | react-native-maps | Standard Google Maps integration, heatmap support |
| **Location** | react-native-geolocation | GPS coordinates for map placement |
| **State Management** | React Hooks (useState, useEffect) | Built-in, simple, sufficient for app complexity |
| **Navigation** | @react-navigation/bottom-tabs | Industry standard, well-documented |

### **2. System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APPLICATION                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Monitor Tab │  │   Map Tab    │  │   Services   │      │
│  │  (Recording) │  │  (Heatmap)   │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  │ • Auth       │      │
│         │                  │          │ • Storage    │      │
│         │                  │          │ • Audio      │      │
│         │                  │          │ • Location   │      │
│         └──────────┬───────┘          └──────┬───────┘      │
│                    │                         │               │
└────────────────────┼─────────────────────────┼──────────────┘
                     │                         │
                     │        Firebase         │
                     ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND                          │
│                                                              │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │  Firestore DB   │         │  Anonymous Auth │           │
│  │                 │         │                 │           │
│  │  Collection:    │         │  No login UI    │           │
│  │  noise_readings │◄────────┤  Auto sign-in   │           │
│  │                 │         │  User UID only  │           │
│  └─────────────────┘         └─────────────────┘           │
│         │                                                    │
│         │ Real-time sync to all connected clients           │
│         └────────────────────────────────────────►          │
└─────────────────────────────────────────────────────────────┘
```

### **3. Data Flow**

```
User opens app
    ↓
[STEP 1] Auto sign-in with Anonymous Auth
    ↓ (Firebase assigns UID)
    ↓
[STEP 2] User selects location
    ├─ Building: "Fenwick Library" (dropdown)
    └─ Room: "3rd Floor Quiet Zone" (dropdown)
    ↓
[STEP 3] User taps "Start Monitoring"
    ├─ Get GPS coordinates (once)
    ├─ Generate session UUID
    └─ Start audio monitoring
    ↓
[STEP 4] Every 1 second:
    ├─ Measure dB level
    ├─ Classify (Quiet/Normal/Noisy)
    └─ Upload to Firestore:
        {
          userId: "anon_abc123",
          timestamp: SERVER_TIMESTAMP,
          decibel: 42.5,
          classification: "Quiet",
          location: {
            latitude: 38.8304,
            longitude: -77.3078,
            building: "Fenwick Library",
            room: "3rd Floor Quiet Zone"
          },
          sessionId: "uuid-xyz"
        }
    ↓
[STEP 5] All connected devices receive update
    ↓
[STEP 6] Maps update heatmap in real-time
```

---

## 📊 Data Model

### **Firestore Collection: `noise_readings`**

#### **Document Structure**
```typescript
interface NoiseReadingDocument {
  // User Attribution
  userId: string;                    // Firebase Anonymous UID
  deviceId?: string;                 // Platform: "android" | "ios"

  // Timestamp (Server-managed)
  timestamp: Timestamp;              // Firestore server timestamp

  // Measurement Data
  decibel: number;                   // 0-120 dB (calibrated SPL)
  classification: NoiseClassification; // "Quiet" | "Normal" | "Noisy"

  // Location (Hybrid Approach)
  location: {
    latitude: number;                // GPS for map placement
    longitude: number;               // GPS for map placement
    building: string;                // User-selected building
    room: string;                    // User-selected room/area
  };

  // Session Grouping
  sessionId: string;                 // UUID - groups continuous readings
}
```

#### **Classification Thresholds**
```typescript
type NoiseClassification =
  | 'Quiet'   // < 50 dB  (library quiet zones, study rooms)
  | 'Normal'  // 50-70 dB (common areas, hallways)
  | 'Noisy';  // > 70 dB  (food courts, construction)
```

#### **Example Document**
```json
{
  "userId": "k9x2LmPqR3...",
  "deviceId": "android",
  "timestamp": "2025-11-29T15:30:45.123Z",
  "decibel": 42.5,
  "classification": "Quiet",
  "location": {
    "latitude": 38.8304,
    "longitude": -77.3078,
    "building": "Fenwick Library",
    "room": "3rd Floor Quiet Zone"
  },
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 🔐 Security & Privacy

### **1. Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /noise_readings/{document=**} {
      // Public read (anyone can see the heatmap)
      allow read: if true;

      // Authenticated write only (prevents spam)
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.decibel >= 0
                    && request.resource.data.decibel <= 120;

      // No updates or deletes (append-only)
      allow update, delete: if false;
    }
  }
}
```

### **2. Privacy Principles**
- **No Audio Storage:** Only numeric dB values stored
- **No PII:** Anonymous UID only (not linked to email/name)
- **Public Data:** All readings are public (like Waze traffic data)
- **Consent:** Users aware data is crowd-sourced and public

---

## 🗺️ Location Strategy (Hybrid Approach)

### **Problem: Indoor GPS Inaccuracy**
GPS signals are weak indoors, often placing users 20-50 meters from actual location (e.g., in parking lot instead of library).

### **Solution: Hybrid System**
1. **GPS Coordinates:** Capture once at session start (for map placement)
2. **Manual Selection:** User selects specific building/room from dropdown
3. **Best of Both:** Map shows general area, but data is tagged with precise room

### **Campus Locations Configuration**
```typescript
// src/constants/locations.ts
export const CAMPUS_LOCATIONS = [
  {
    id: 'fenwick',
    name: 'Fenwick Library',
    rooms: [
      '1st Floor Lobby',
      '2nd Floor Quiet Zone',
      '3rd Floor Study Cells',
      '4th Floor Group Area',
    ],
  },
  {
    id: 'jc',
    name: 'Johnson Center',
    rooms: [
      'Food Court',
      'Ground Floor Library',
      'Dewberry Hall Hallway',
    ],
  },
  {
    id: 'horizon',
    name: 'Horizon Hall',
    rooms: [
      'Atrium',
      '2nd Floor Labs',
      '3rd Floor Breakout',
    ],
  },
];
```

---

## 🎨 User Interface

### **Screen 1: Monitor Tab**
```
┌─────────────────────────────────┐
│  🎤 Noise Monitor               │
├─────────────────────────────────┤
│                                 │
│  [📍 Select Building ▼]        │
│  Fenwick Library               │
│                                 │
│  [🚪 Select Room ▼]            │
│  3rd Floor Quiet Zone          │
│                                 │
│        ┌───────┐                │
│        │  42   │ dB             │
│        └───────┘                │
│        🟢 Quiet                 │
│                                 │
│     [▶ Start Monitoring]       │
│                                 │
└─────────────────────────────────┘
```

### **Screen 2: Map Tab**
```
┌─────────────────────────────────┐
│  🗺️ Campus Noise Map           │
├─────────────────────────────────┤
│                                 │
│    [  Google Maps View  ]      │
│                                 │
│    🟦 Quiet areas (blue)       │
│    🟩 Normal areas (green)     │
│    🟨 Moderate areas (yellow)  │
│    🟥 Noisy areas (red)        │
│                                 │
│    Real-time heatmap overlay   │
│    showing noise distribution  │
│                                 │
└─────────────────────────────────┘
```

---

## 🚀 Implementation Roadmap

### **Phase 1A: Core Audio** ✅ COMPLETED
- [x] AudioService (dB monitoring)
- [x] IEC 61672 time weighting
- [x] Accurate calibration (dBFS → SPL)
- [x] NoiseClassifier
- [x] Real-time UI

### **Phase 1B: Firebase Integration** 🔄 IN PROGRESS
- [x] Install Firebase dependencies
- [x] Create type definitions
- [x] Implement AuthService
- [x] Implement StorageService
- [ ] Firebase project setup
- [ ] Refactor AudioService for cloud upload
- [ ] Add location picker UI

### **Phase 2: Map Visualization** 📋 PENDING
- [ ] Create MapScreen
- [ ] Integrate react-native-maps
- [ ] Implement heatmap overlay
- [ ] Real-time Firestore subscription
- [ ] Bottom tab navigation

### **Phase 3: Testing & Polish** 📋 PENDING
- [ ] Multi-device testing
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Battery consumption testing

### **Phase 4: Demo Preparation** 📋 PENDING
- [ ] Demo script
- [ ] Backup device preparation
- [ ] Final testing
- [ ] Presentation materials

---

## 🧪 Testing Strategy

### **1. Unit Tests**
```typescript
// AudioService
✓ Should measure dB accurately
✓ Should classify noise levels correctly
✓ Should handle start/stop gracefully

// AuthService
✓ Should sign in anonymously
✓ Should return valid user ID
✓ Should handle auth state changes

// StorageService
✓ Should save readings to Firestore
✓ Should subscribe to heatmap data
✓ Should handle network errors
```

### **2. Integration Tests**
```
Test: End-to-end monitoring flow
  1. Open app → Auto sign-in
  2. Select location
  3. Start monitoring
  4. Make noise
  5. Stop monitoring
  Expected: Reading appears in Firestore
```

### **3. Multi-Device Test**
```
Setup: 2 phones (A and B)
Test:
  1. Phone B opens map (projector display)
  2. Phone A selects "Lecture Hall"
  3. Phone A starts monitoring
  4. Tester makes loud noise
  Expected: Phone B's map turns red instantly
```

---

## 📈 Success Metrics

### **Technical Performance**
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Anonymous Auth Success | 100% | Firebase Console: Auth → Users |
| Firestore Write Latency | <500ms | Timestamp diff (client vs server) |
| Map Update Latency | <2s | stopwatch (record → map update) |
| Battery Consumption | <5%/hour | Device battery stats |
| App Crash Rate | <1% | Firebase Crashlytics |

### **User Experience**
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time to First Use | <30s | Stopwatch (open → first reading) |
| Location Selection | <10s | User observation |
| Heatmap Clarity | Clear gradients | Visual inspection |
| Multi-device Sync | Instant (<2s) | Dual-phone test |

---

## 🎬 Demo Strategy

### **The Hook**
*"We built a Waze for Campus Noise—real-time, crowd-sourced noise maps to help students find quiet study spots."*

### **Demo Flow (3 minutes)**
1. **Setup (30s)**
   - Project Phone B on screen (showing empty map)
   - Hold Phone A in hand

2. **Introduction (30s)**
   - "Imagine you need a quiet place to study..."
   - "Our app shows real-time noise levels across campus"

3. **Live Demo (90s)**
   - Open app on Phone A → Auto-signs in
   - Select "Johnson Center" → "Food Court"
   - Tap "Start Monitoring"
   - **Make loud noise** (clap/yell)
   - Point to projector: **Map turns red instantly**
   - "This is crowd-sourced—every user contributes"

4. **Technical Highlight (30s)**
   - Show Firebase Console (real-time database updates)
   - Explain Anonymous Auth (no account needed)
   - Mention IEC 61672 compliance

### **Backup Plan**
- Pre-recorded video (if WiFi fails)
- Screenshots of working app
- Firebase Console with sample data

---

## 🔧 Technical Best Practices

### **1. Code Organization**
```
src/
├── constants/
│   └── locations.ts        // Campus buildings/rooms
├── screens/
│   ├── HomeScreen.tsx      // Monitor tab
│   └── MapScreen.tsx       // Heatmap tab
├── services/
│   ├── AudioService.ts     // dB monitoring
│   ├── AuthService.ts      // Firebase auth
│   ├── StorageService.ts   // Firestore wrapper
│   └── NoiseClassifier.ts  // Classification logic
└── types/
    └── index.ts            // TypeScript interfaces
```

### **2. Error Handling**
```typescript
// All service methods use try-catch
try {
  await storageService.saveReading(reading);
} catch (error) {
  console.error('[Monitor] Failed to save:', error);
  // Show user-friendly error message
  Alert.alert('Upload Failed', 'Check network connection');
}
```

### **3. Performance Optimization**
- Use `React.memo` for expensive components
- Debounce real-time updates (1-second minimum)
- Limit Firestore queries (last 1 hour only)
- Paginate map markers (cluster if >100 points)

---

## 📚 References

### **Standards Compliance**
- **IEC 61672-1:2013** - Sound level meters (time weighting)
- **ISO 1996** - Environmental noise measurement

### **Firebase Documentation**
- [Firestore Getting Started](https://firebase.google.com/docs/firestore)
- [Anonymous Authentication](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### **React Native Libraries**
- [react-native-sound-level](https://www.npmjs.com/package/react-native-sound-level)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- [@react-native-firebase](https://rnfirebase.io/)

---

## 📝 Appendix

### **A. Firestore Quota Limits (Free Tier)**
- Reads: 50K/day
- Writes: 20K/day
- Storage: 1 GB

**Estimate:** 100 users × 10 readings/session × 5 sessions/day = 5K writes/day ✓

### **B. Battery Consumption Analysis**
- GPS (one-time): <1% per session
- Audio monitoring: ~2-3% per hour
- Firestore uploads: <1% per hour
- **Total:** <5% per hour ✓

---

**Last Updated:** November 29, 2025
**Version:** 2.0 - Cloud-First Edition
**Status:** Implementation Phase 1B (60% complete)
**Next Milestone:** Firebase setup + AudioService integration
