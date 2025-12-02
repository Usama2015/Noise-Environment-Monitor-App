# Firebase Implementation Guide

**⚠️ For step-by-step execution, see [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)**

This guide provides code examples and detailed tutorials for Firebase integration.
Use this as reference material alongside the main workflow.

---

**Version:** 2.0 (Cloud-First Edition)
**Last Updated:** 2025-11-29
**Architecture:** Firebase Firestore + Anonymous Auth
**Status:** Reference Guide (formerly PROJECT_PLAN_FIREBASE.md)

---

## 📋 Project Overview

**What We're Building:**
A crowd-sourced "Waze for Noise" application where students contribute real-time noise measurements to help others find quiet study spots on campus.

**Key Features:**
- 🎤 Real-time noise monitoring (dB measurement)
- 🔐 Anonymous authentication (no account required)
- ☁️ Cloud-first storage (Firebase Firestore)
- 🗺️ Interactive heatmap (Google Maps)
- 🔄 Real-time sync across all users
- 🏢 Hybrid location (GPS + building/room selection)

---

## 🏗️ Technical Architecture

### **Stack:**
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React Native (TypeScript) | Cross-platform mobile app |
| **Backend** | Firebase Firestore | Real-time database |
| **Auth** | Firebase Anonymous | Frictionless authentication |
| **Audio** | react-native-sound-level | Native dB metering |
| **Maps** | react-native-maps | Google Maps integration |
| **Location** | react-native-geolocation | GPS coordinates |

### **Data Model:**
```typescript
NoiseReadingDocument {
  userId: string;              // Firebase Anonymous UID
  deviceId?: string;           // Device model (for debugging)
  timestamp: Timestamp;        // Server timestamp
  decibel: number;             // 0-120 dB
  classification: string;      // "Quiet" | "Normal" | "Noisy"
  location: {
    latitude: number;          // GPS coordinate
    longitude: number;         // GPS coordinate
    building: string;          // "Fenwick Library"
    room: string;              // "3rd Floor Quiet Zone"
  };
  sessionId: string;           // UUID (groups continuous readings)
}
```

---

## 🎯 Implementation Phases

### **Phase 1A: Core Audio Monitoring** ✅ COMPLETED
**Duration:** 2 weeks
**Status:** 100% Complete

**Deliverables:**
- ✅ AudioService with IEC 61672 compliance
- ✅ Accurate dB calibration (dBFS → SPL)
- ✅ NoiseClassifier (Quiet/Normal/Noisy)
- ✅ Real-time UI updates (125ms)
- ✅ 1-second averaging for classification

---

### **Phase 1B: Firebase Integration** 🔄 IN PROGRESS
**Duration:** 1 week
**Status:** 60% Complete (awaiting Firebase setup)

#### **Completed:**
- ✅ Firebase dependencies installed
- ✅ Type definitions updated for Firestore
- ✅ Campus locations constants created
- ✅ AuthService implemented
- ✅ StorageService implemented

#### **Pending:**
**User Tasks:**
1. Create Firebase project in console
2. Download `google-services.json`
3. Place in `android/app/google-services.json`
4. Enable Anonymous Authentication
5. Create Firestore database (test mode)
6. Set security rules

**Development Tasks:**
1. Refactor AudioService to upload readings
2. Add location picker UI to HomeScreen
3. Integrate GPS coordinates
4. Test end-to-end: Monitor → Upload → Firestore
5. Verify data appears in Firebase Console

---

### **Phase 2: Map Visualization** 🔲 NOT STARTED
**Duration:** 1 week
**Status:** 0%

#### **Tasks:**
1. **MapScreen Component**
   - Create new screen with react-native-maps
   - Display user's current location
   - Add map controls (zoom, compass)

2. **Real-time Data Subscription**
   - Subscribe to Firestore query (last 1 hour)
   - Update map when new readings arrive
   - Handle Firebase snapshots

3. **Heatmap Overlay**
   - Convert readings to heatmap points
   - Configure gradient (blue → green → yellow → red)
   - Adjust radius and opacity
   - Test with multiple data points

4. **Tab Navigation**
   - Install `@react-navigation/bottom-tabs`
   - Create tab structure: Monitor | Map
   - Add icons and labels
   - Handle tab switching

---

### **Phase 3: Testing & Polish** 🔲 NOT STARTED
**Duration:** 1 week
**Status:** 0%

#### **Tasks:**
1. **Multi-device Testing**
   - Test on 2+ devices simultaneously
   - Verify Phone A records → Phone B's map updates
   - Test network edge cases (offline/online)

2. **UI/UX Polish**
   - Improve location picker styling
   - Add loading states
   - Error handling & user feedback
   - Keep screen awake during monitoring

3. **Performance Optimization**
   - Test battery consumption
   - Optimize Firestore queries
   - Test with 100+ data points

---

### **Phase 4: Deployment & Demo** 🔲 NOT STARTED
**Duration:** 3 days
**Status:** 0%

#### **Tasks:**
1. **Prepare Demo**
   - Create demo script
   - Test presentation flow
   - Prepare backup device

2. **Documentation**
   - Update README
   - Create user guide
   - Document deployment process

3. **Final Testing**
   - End-to-end walkthrough
   - Verify all features work
   - Test demo scenario

---

## 📐 Detailed Implementation Guide

### **Step 1: Firebase Setup (USER)**

#### **1.1 Create Project**
```
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: "campus-noise-monitor"
4. Disable Google Analytics
5. Click "Create project"
```

#### **1.2 Add Android App**
```
1. Click Android icon
2. Package name: "com.noisemonitor"
3. App nickname: "Noise Monitor"
4. Download google-services.json
5. Place in: android/app/google-services.json
```

#### **1.3 Enable Auth**
```
1. Firebase Console → Authentication
2. Click "Get started"
3. Sign-in methods → Anonymous
4. Enable toggle → Save
```

#### **1.4 Create Firestore**
```
1. Firebase Console → Firestore Database
2. Click "Create database"
3. Start in test mode
4. Location: us-east1
5. Click "Enable"
```

#### **1.5 Set Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /noise_readings/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

---

### **Step 2: Integrate AudioService with Firebase (DEV)**

#### **2.1 Add Session Management**
```typescript
// In AudioService.ts
private currentSessionId: string | null = null;

async startRecording(): Promise<void> {
  // Generate new session ID
  this.currentSessionId = uuid.v4();

  // Existing audio monitoring code...
}
```

#### **2.2 Upload Readings Every Second**
```typescript
// In AudioService.ts
import storageService from './StorageService';
import authService from './AuthService';

// In the 1-second classification callback:
const reading: NoiseReading = {
  decibel: avgDb,
  classification: this.classify(avgDb),
  location: {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    building: selectedBuilding,
    room: selectedRoom,
  },
  sessionId: this.currentSessionId!,
};

// Upload to Firestore
await storageService.saveReading(reading);
```

---

### **Step 3: Add Location Picker (DEV)**

#### **3.1 Update HomeScreen State**
```typescript
const [selectedBuilding, setSelectedBuilding] = useState<string>('');
const [selectedRoom, setSelectedRoom] = useState<string>('');
const [availableRooms, setAvailableRooms] = useState<string[]>([]);
```

#### **3.2 Add Picker UI**
```tsx
import { Picker } from '@react-native-picker/picker';
import { CAMPUS_LOCATIONS } from '../constants/locations';

<Picker
  selectedValue={selectedBuilding}
  onValueChange={(value) => {
    setSelectedBuilding(value);
    setAvailableRooms(getRoomsForBuilding(value));
  }}>
  <Picker.Item label="Select Building..." value="" />
  {CAMPUS_LOCATIONS.map(loc => (
    <Picker.Item key={loc.id} label={loc.name} value={loc.name} />
  ))}
</Picker>

<Picker
  selectedValue={selectedRoom}
  onValueChange={setSelectedRoom}
  enabled={availableRooms.length > 0}>
  <Picker.Item label="Select Room..." value="" />
  {availableRooms.map(room => (
    <Picker.Item key={room} label={room} value={room} />
  ))}
</Picker>
```

---

### **Step 4: Create MapScreen (DEV)**

#### **4.1 Install Dependencies**
```bash
npm install react-native-maps
npm install @react-native-community/geolocation
npm install @react-navigation/native @react-navigation/bottom-tabs
```

#### **4.2 Basic MapScreen**
```typescript
import MapView, { Heatmap } from 'react-native-maps';
import storageService from '../services/StorageService';

export default function MapScreen() {
  const [heatmapPoints, setHeatmapPoints] = useState([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = storageService.subscribeToHeatmap(readings => {
      const points = readings.map(r => ({
        latitude: r.location.latitude,
        longitude: r.location.longitude,
        weight: r.decibel / 120, // Normalize 0-120 dB to 0-1
      }));
      setHeatmapPoints(points);
    });

    return unsubscribe;
  }, []);

  return (
    <MapView
      initialRegion={{
        latitude: 38.8304,
        longitude: -77.3078,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      <Heatmap
        points={heatmapPoints}
        radius={50}
        opacity={0.7}
        gradient={{
          colors: ['blue', 'green', 'yellow', 'red'],
          startPoints: [0.2, 0.4, 0.6, 1.0],
        }}
      />
    </MapView>
  );
}
```

---

## 🧪 Testing Strategy

### **Unit Tests**
```typescript
// Test AuthService
describe('AuthService', () => {
  it('should sign in anonymously', async () => {
    const userId = await authService.signInAnonymously();
    expect(userId).toBeTruthy();
  });
});

// Test StorageService
describe('StorageService', () => {
  it('should save reading to Firestore', async () => {
    const reading = { /* test data */ };
    const docId = await storageService.saveReading(reading);
    expect(docId).toBeTruthy();
  });
});
```

### **Integration Tests**
1. **End-to-End Flow**
   - Start monitoring → Select location → Make noise → Stop
   - Verify: Data appears in Firestore Console

2. **Multi-Device Sync**
   - Phone A: Start monitoring
   - Phone B: Open map
   - Verify: Phone B's map updates when Phone A records

---

## 📊 Success Metrics

### **Technical Metrics:**
- [ ] Anonymous auth success rate: 100%
- [ ] Firestore write latency: <500ms
- [ ] Map update latency: <2s
- [ ] Battery consumption: <5%/hour
- [ ] App crash rate: <1%

### **User Experience:**
- [ ] Time to first use: <30 seconds
- [ ] Location selection: <10 seconds
- [ ] Heatmap visibility: Clear color gradients
- [ ] Multi-device sync: Instant updates

---

## 🚀 Deployment Checklist

### **Pre-Demo:**
- [ ] Firebase project configured
- [ ] 2+ test devices ready
- [ ] Campus WiFi/data connection verified
- [ ] Demo script practiced

### **Demo Flow:**
1. Show empty map on projector (Phone B)
2. Open app on Phone A
3. Select "Lecture Hall"
4. Start monitoring
5. Make loud noise (clap/yell)
6. Watch map turn red instantly
7. Explain "Waze for Noise" concept

---

## 📝 Next Steps

**Immediate (Next Session):**
1. User completes Firebase setup
2. Test Anonymous Auth
3. Test Firestore write/read
4. Refactor AudioService
5. Add location picker

**This Week:**
1. Create MapScreen
2. Implement heatmap
3. Add tab navigation
4. Multi-device testing

**Next Week:**
1. UI polish
2. Performance optimization
3. Prepare demo
4. Final testing

---

**Last Updated:** 2025-11-29
**Status:** Ready for Firebase integration
**Next Milestone:** Firebase setup complete + AudioService refactor
