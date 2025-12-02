# Final Plan Review - Campus Noise Monitor
**Date:** November 29, 2025
**Purpose:** Comprehensive review before implementation
**Goal:** Ensure all decisions made, no unknowns during coding

---

## 🎯 Project Scope Assessment

### **Semester Project Reality Check:**

| Aspect | Current Plan | Semester-Appropriate? | Adjustment Needed? |
|--------|--------------|----------------------|-------------------|
| **Core Features** | Audio monitoring, Firebase, Map | ✅ Good | None |
| **Timeline** | 4 phases | ✅ Realistic | None |
| **Complexity** | Medium-High | ⚠️ Ambitious but doable | Simplify if needed |
| **Demo-ability** | Real-time multi-device | ✅ Impressive | None |
| **Technical Risk** | Medium | ⚠️ Firebase dependency | Mitigation needed |

**Verdict:** ✅ **Appropriate for semester project** with proper planning

---

## 🏗️ Architecture Review

### **✅ SOUND Components:**

#### **1. Audio Monitoring (Phase 1A - DONE)**
- ✅ Library: `react-native-sound-level` (proven to work)
- ✅ Algorithm: IEC 61672 time weighting (implemented)
- ✅ Calibration: SPL = dBFS + 56 (tested and working)
- ✅ Classification: Quiet (<50), Normal (50-70), Noisy (>70)
- ✅ Status: **COMPLETE AND TESTED**

#### **2. Firebase Backend (Phase 1B - 60% DONE)**
- ✅ Services: Auth, Firestore (code written)
- ✅ Data model: NoiseReadingDocument (designed)
- ✅ Security rules: Public read, auth write (defined)
- ⚠️ Dependency: User must complete Firebase setup
- ⚠️ Risk: Firebase configuration issues

#### **3. React Native Framework**
- ✅ Framework: React Native (already working)
- ✅ State management: React Hooks (simple, sufficient)
- ✅ Navigation: @react-navigation/bottom-tabs (standard)
- ✅ Status: **PROVEN TECHNOLOGY**

---

### **⚠️ NEEDS VERIFICATION:**

#### **1. react-native-maps Heatmap Support**

**CRITICAL QUESTION:** Does react-native-maps actually have built-in heatmap support?

**Research Required:**
```bash
# Check npm package
npm info react-native-maps

# Check documentation
# https://github.com/react-native-maps/react-native-maps
```

**Contingency Plans:**

**Option A: react-native-maps has Heatmap component**
- ✅ Use built-in Heatmap
- Timeline: 2 days
- Risk: Low

**Option B: No built-in heatmap**
- Plan B1: Use colored Markers (one per reading)
  - Timeline: 1 day
  - Risk: Low
  - Limitation: Max ~100 markers for performance

- Plan B2: Use Circles with opacity
  - Timeline: 2 days
  - Risk: Low
  - Visual: Less impressive but functional

- Plan B3: Custom overlay (advanced)
  - Timeline: 5 days
  - Risk: High
  - Recommendation: **DON'T DO THIS** (overkill for semester project)

**DECISION NEEDED:** Research react-native-maps heatmap support NOW

#### **2. Google Maps API Key**

**Requirements:**
- Android Maps API key from Google Cloud Console
- Billing account (required even for free tier)
- API restrictions configured

**Setup Steps:**
```
1. Go to https://console.cloud.google.com/
2. Create project: "campus-noise-monitor-maps"
3. Enable Maps SDK for Android
4. Create API key (restrict to Android app)
5. Add key to android/app/src/main/AndroidManifest.xml:
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_API_KEY_HERE"/>
```

**Risk:** ⚠️ Requires credit card (even for free tier)
**Mitigation:** Use static map images if Maps API blocked

#### **3. Android Permissions**

**Required Permissions:**
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

**Status:** ⚠️ RECORD_AUDIO likely already added (Phase 1A)
**Action:** Verify and add location permissions

---

## 📊 Data Flow Verification

### **Upload Frequency Analysis:**

**Current Plan:** Upload every 1 second

**Analysis:**
| Metric | Value | Acceptable? |
|--------|-------|------------|
| **Writes/minute** | 60 | ✅ Yes |
| **Writes/hour** | 3,600 | ✅ Yes |
| **Writes/day (1 user)** | 86,400 | ⚠️ Exceeds free tier (20K) |
| **Demo writes (1 hour)** | 3,600 | ✅ Yes |
| **Battery impact** | ~3%/hour | ✅ Acceptable |
| **Network impact** | ~360KB/hour | ✅ Minimal |

**Recommendation:** ✅ **Keep 1-second interval**
- Reason: Demo is <2 hours, well within limits
- Firestore free tier: 20K writes/day (enough for demo)
- Real deployment: Could increase to 5-second interval

### **Firestore Document Size:**

**Per Reading:**
```json
{
  "userId": "k9x2LmPqR3...",        // ~30 bytes
  "deviceId": "android",            // ~10 bytes
  "timestamp": 1234567890,          // ~8 bytes
  "decibel": 42.5,                  // ~8 bytes
  "classification": "Quiet",        // ~10 bytes
  "location": {
    "latitude": 38.8304,            // ~8 bytes
    "longitude": -77.3078,          // ~8 bytes
    "building": "Fenwick Library",  // ~20 bytes
    "room": "3rd Floor"             // ~15 bytes
  },
  "sessionId": "uuid"               // ~40 bytes
}
```

**Total:** ~157 bytes per reading
**1 hour demo:** 3,600 readings × 157 bytes = **564 KB**
**Firestore free tier:** 1 GB storage

**Verdict:** ✅ **No storage concerns**

---

## 🧪 Testing Strategy Review

### **Current Testing Gaps:**

1. **No Mock/Stub for Firebase**
   - Problem: Can't test without Firebase setup
   - Solution: Add Firebase emulator OR mock services
   - Timeline: 1 day

2. **No Multi-device Test Plan**
   - Problem: Need 2 physical devices
   - Solution: Use 1 physical + 1 emulator OR 2 physical devices
   - Requirement: Confirm device availability

3. **No Heatmap Rendering Test**
   - Problem: Don't know if heatmap will work
   - Solution: Create test data generator
   - Timeline: 2 hours

**DECISION:** Do we need Firebase emulator for testing?

**Option A: Firebase Emulator Suite**
- ✅ Test locally without cloud
- ✅ Faster iteration
- ⚠️ Setup time: 1-2 hours
- Recommendation: **YES** if time permits

**Option B: Direct Firebase Testing**
- ✅ Simpler (no emulator setup)
- ⚠️ Requires internet
- ⚠️ Slower iteration
- Recommendation: **YES** for initial testing

**DECISION:** Use direct Firebase testing initially, add emulator if needed

---

## 🔧 Implementation Details - FINALIZED

### **Phase 1B: Firebase Integration**

#### **Step 1B-6: Firebase Setup (USER)**
**No coding - just configuration**
- Estimated time: 30 minutes
- Risk: Low (following guide)

#### **Step 1B-7: Refactor AudioService**

**EXACT CHANGES:**

```typescript
// 1. Add imports
import { v4 as uuidv4 } from 'uuid';
import authService from './AuthService';
import storageService from './StorageService';

// 2. Add properties
private currentSessionId: string | null = null;
private currentLocation: LocationData | null = null;

interface LocationData {
  latitude: number;
  longitude: number;
  building: string;
  room: string;
}

// 3. Add setLocation method
public setLocation(building: string, room: string, lat: number, lng: number): void {
  this.currentLocation = {
    latitude: lat,
    longitude: lng,
    building,
    room,
  };
}

// 4. Modify startRecording (ADD this)
async startRecording(): Promise<void> {
  this.currentSessionId = uuidv4(); // Generate session ID
  // ... existing code
}

// 5. Modify classification callback (ADD this)
// In the 1-second averaging section:
if (this.currentLocation && this.currentSessionId) {
  const reading: NoiseReading = {
    decibel: avgDb,
    classification: this.classify(avgDb),
    location: this.currentLocation,
    sessionId: this.currentSessionId,
  };

  // Upload to Firestore (fire-and-forget)
  storageService.saveReading(reading).catch(err => {
    console.error('[AudioService] Failed to upload:', err);
  });
}

// 6. Modify stopRecording (ADD this)
async stopRecording(): Promise<void> {
  this.currentSessionId = null; // Clear session
  // ... existing code
}
```

**Estimated time:** 1-2 hours
**Lines of code:** ~30 lines
**Risk:** Low (mostly additions)

#### **Step 1B-8: Location Picker UI**

**EXACT CHANGES:**

```typescript
// HomeScreen.tsx

// 1. Add imports
import { Picker } from '@react-native-picker/picker';
import { CAMPUS_LOCATIONS, getRoomsForBuilding } from '../constants/locations';
import Geolocation from '@react-native-community/geolocation';

// 2. Add state
const [selectedBuilding, setSelectedBuilding] = useState<string>('');
const [selectedRoom, setSelectedRoom] = useState<string>('');
const [availableRooms, setAvailableRooms] = useState<string[]>([]);
const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

// 3. Add building selection handler
const handleBuildingChange = (building: string) => {
  setSelectedBuilding(building);
  setSelectedRoom(''); // Reset room
  const rooms = getRoomsForBuilding(
    CAMPUS_LOCATIONS.find(loc => loc.name === building)?.id || ''
  );
  setAvailableRooms(rooms);
};

// 4. Modify handleStartMonitoring
const handleStartMonitoring = async () => {
  // Validate location selected
  if (!selectedBuilding || !selectedRoom) {
    Alert.alert('Location Required', 'Please select building and room');
    return;
  }

  // Get GPS coordinates
  Geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setGpsCoords(coords);

      // Set location in AudioService
      audioService.setLocation(
        selectedBuilding,
        selectedRoom,
        coords.lat,
        coords.lng
      );

      // Start monitoring
      audioService.startRecording();
      setIsMonitoring(true);
    },
    (error) => {
      console.error('GPS error:', error);
      Alert.alert('GPS Error', 'Could not get location. Using default coordinates.');

      // Use default GMU coordinates
      audioService.setLocation(selectedBuilding, selectedRoom, 38.8304, -77.3078);
      audioService.startRecording();
      setIsMonitoring(true);
    }
  );
};

// 5. Add UI (replace existing "Start Monitoring" button section)
<View style={styles.locationSection}>
  <Text style={styles.label}>Building:</Text>
  <Picker
    selectedValue={selectedBuilding}
    onValueChange={handleBuildingChange}
    style={styles.picker}
  >
    <Picker.Item label="Select Building..." value="" />
    {CAMPUS_LOCATIONS.map(loc => (
      <Picker.Item key={loc.id} label={loc.name} value={loc.name} />
    ))}
  </Picker>

  <Text style={styles.label}>Room:</Text>
  <Picker
    selectedValue={selectedRoom}
    onValueChange={setSelectedRoom}
    enabled={availableRooms.length > 0}
    style={styles.picker}
  >
    <Picker.Item label="Select Room..." value="" />
    {availableRooms.map(room => (
      <Picker.Item key={room} label={room} value={room} />
    ))}
  </Picker>
</View>

{/* Existing dB display and button */}
```

**Estimated time:** 2-3 hours
**Lines of code:** ~80 lines
**Risk:** Low (standard UI components)

---

### **Phase 2: Map Visualization**

#### **CRITICAL DECISION: Heatmap Implementation**

**Research react-native-maps NOW:**

```bash
# Install and check
npm install react-native-maps
npm info react-native-maps

# Check GitHub for Heatmap component
# https://github.com/react-native-maps/react-native-maps/blob/master/docs/heatmap.md
```

**IF Heatmap exists:**
```typescript
import MapView, { Heatmap } from 'react-native-maps';

<MapView>
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
```

**IF Heatmap does NOT exist (FALLBACK):**
```typescript
import MapView, { Circle } from 'react-native-maps';

// Use colored circles
{readings.map(reading => (
  <Circle
    key={reading.sessionId}
    center={{
      latitude: reading.location.latitude,
      longitude: reading.location.longitude,
    }}
    radius={30} // 30 meters
    fillColor={getColorForDb(reading.decibel)}
    strokeColor="transparent"
  />
))}

function getColorForDb(db: number): string {
  if (db < 50) return 'rgba(0, 0, 255, 0.3)'; // Blue
  if (db < 70) return 'rgba(0, 255, 0, 0.3)'; // Green
  return 'rgba(255, 0, 0, 0.3)'; // Red
}
```

**Estimated time:**
- With Heatmap: 2 days
- With Circles: 1 day

**DECISION:** Research heatmap support before implementing

---

## 🚨 Risk Assessment & Mitigation

### **High Risk Items:**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Firebase quota exceeded** | Low | High | Monitor usage, increase interval if needed |
| **Google Maps API blocked** | Medium | Medium | Use static map with markers |
| **Heatmap not supported** | Medium | Low | Use Circle fallback (already planned) |
| **GPS too inaccurate** | High | Low | Manual location selection (already planned) |
| **Multi-device sync fails** | Low | High | Test early with 2 devices |
| **Audio permissions denied** | Low | Medium | Show clear permission request UI |

### **Medium Risk Items:**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Battery drain** | Medium | Low | 1-second interval is acceptable |
| **Network latency** | Low | Low | Firebase is fast (<500ms) |
| **Device compatibility** | Low | Medium | Test on multiple devices |

### **Mitigation Actions (DO BEFORE CODING):**

1. **✅ MUST DO NOW:**
   - [ ] Research react-native-maps heatmap support
   - [ ] Verify @react-native-community/geolocation still works
   - [ ] Check @react-native-picker/picker compatibility
   - [ ] Confirm Google Maps API requirements

2. **⏳ DO BEFORE PHASE 2:**
   - [ ] Obtain Google Maps API key
   - [ ] Test with 2 physical devices
   - [ ] Create test data generator

3. **✅ DO DURING IMPLEMENTATION:**
   - [ ] Monitor Firestore quota daily
   - [ ] Test battery consumption
   - [ ] Verify real-time sync latency

---

## 📚 Library Verification

### **Dependencies to Verify NOW:**

```bash
# Check current versions
cd mobile-app
npm list react-native-sound-level
npm list @react-native-firebase/app
npm list @react-native-firebase/auth
npm list @react-native-firebase/firestore
npm list react-native-keep-awake
npm list uuid

# Check compatibility
npm outdated

# Libraries to add (verify exist):
npm info @react-native-picker/picker
npm info react-native-maps
npm info @react-native-community/geolocation
npm info @react-navigation/native
npm info @react-navigation/bottom-tabs
```

### **Potential Compatibility Issues:**

**React Native Version:** Check current version
```bash
npx react-native --version
```

**If RN version < 0.70:** May need different packages
**If RN version >= 0.70:** Should be compatible

**ACTION REQUIRED:** Run verification commands NOW

---

## 🎯 Minimum Viable Demo (MVD)

### **What MUST work for demo:**

1. ✅ **Audio Monitoring** (DONE)
   - Measure dB levels
   - Classify Quiet/Normal/Noisy
   - Display in real-time

2. ⏳ **Firebase Upload** (PENDING)
   - Upload readings to Firestore
   - Anonymous authentication

3. ⏳ **Location Selection** (PENDING)
   - Select building and room
   - Upload with location data

4. ⏳ **Map Visualization** (PENDING)
   - Show campus map
   - Display noise readings (colored markers)

5. ⏳ **Multi-Device Sync** (PENDING)
   - Phone A records → Phone B's map updates
   - <2 second latency

### **What's NICE TO HAVE:**

- ⭐ Smooth heatmap (vs. markers)
- ⭐ Tab navigation (vs. separate screens)
- ⭐ Loading indicators
- ⭐ Error handling UI
- ⭐ Keep screen awake

### **What to CUT if time runs short:**

1. **First to cut:** Smooth heatmap → Use colored markers
2. **Second to cut:** Tab navigation → Two separate apps
3. **Third to cut:** Real-time updates → Refresh button

---

## 🔄 Implementation Order (FINALIZED)

### **Week 1:**
- [x] Phase 1A: Audio Monitoring ✅ DONE
- [ ] Firebase project setup (30 min)
- [ ] Step 1B-7: Refactor AudioService (2 hours)
- [ ] Step 1B-8: Location Picker UI (3 hours)
- [ ] **Test:** Upload readings to Firestore
- [ ] **Checkpoint:** Can record and upload with location

### **Week 2:**
- [ ] Research react-native-maps heatmap (1 hour)
- [ ] Obtain Google Maps API key (1 hour)
- [ ] Step 2-1: Create MapScreen (4 hours)
- [ ] Step 2-2: Implement visualization (4 hours)
  - If heatmap exists: Use Heatmap component
  - If not: Use colored Circles
- [ ] **Test:** See readings on map
- [ ] **Checkpoint:** Map shows data

### **Week 3:**
- [ ] Step 2-4: Add tab navigation (2 hours)
- [ ] Multi-device testing (4 hours)
- [ ] UI polish (2 hours)
- [ ] **Test:** Full end-to-end flow
- [ ] **Checkpoint:** Demo-ready

### **Week 4 (Buffer):**
- [ ] Fix bugs
- [ ] Battery testing
- [ ] Performance optimization
- [ ] Demo rehearsal
- [ ] Presentation slides

**Total estimated coding time:** 22 hours
**Total weeks:** 3 weeks (4 with buffer)

---

## ✅ Final Checklist - DO BEFORE CODING

### **Research & Verification (DO NOW):**

```
[ ] Research: react-native-maps heatmap support
    - Check GitHub docs
    - Check npm package features
    - Decide: Heatmap vs Circles

[ ] Verify: @react-native-picker/picker exists and works
    - npm info @react-native-picker/picker
    - Check React Native version compatibility

[ ] Verify: @react-native-community/geolocation works
    - npm info @react-native-community/geolocation
    - Check if deprecated (use alternative if needed)

[ ] Check: Current React Native version
    - npx react-native --version
    - Ensure >= 0.68

[ ] Confirm: Google Maps API requirements
    - Does it require credit card?
    - Can we use without billing?
    - Alternative: Static map?
```

### **Decisions to Make (DO NOW):**

```
[ ] Decision: Heatmap implementation
    - Option A: react-native-maps Heatmap (if exists)
    - Option B: Colored Circles (fallback)

[ ] Decision: Firebase testing approach
    - Option A: Firebase Emulator (better but setup time)
    - Option B: Direct Firebase (simpler)

[ ] Decision: GPS fallback coordinates
    - Default: GMU campus (38.8304, -77.3078)
    - Confirm this is acceptable

[ ] Decision: Upload frequency
    - Current: 1 second
    - Alternative: 5 seconds (if battery concern)
    - Recommendation: Keep 1 second for demo

[ ] Decision: Multi-device testing
    - Option A: 2 physical phones
    - Option B: 1 physical + 1 emulator
    - Confirm device availability
```

### **Environment Setup (DO BEFORE STEP 1B-7):**

```
[ ] Firebase project created and configured
[ ] google-services.json in android/app/
[ ] Anonymous Auth enabled
[ ] Firestore database created
[ ] Security rules set

[ ] Install missing packages:
    npm install @react-native-picker/picker
    npm install @react-native-community/geolocation
    npm install react-native-maps
    npm install @react-navigation/native
    npm install @react-navigation/bottom-tabs
    npm install react-native-screens
    npm install react-native-safe-area-context
```

### **Testing Preparation:**

```
[ ] 2 devices available for testing
[ ] Both devices on same WiFi
[ ] Both devices have permissions enabled
[ ] Test data generator script ready
```

---

## 🎯 Success Criteria (Semester Project)

### **Minimum for Passing Grade:**

1. ✅ App runs on Android
2. ✅ Measures dB levels accurately
3. ✅ Uploads to Firebase
4. ✅ Displays on map (even if just markers)
5. ✅ Demo works with 2 devices

### **For Excellent Grade:**

1. ✅ All minimum criteria
2. ✅ Real-time sync (<2s latency)
3. ✅ Smooth heatmap visualization
4. ✅ Professional UI with tab navigation
5. ✅ Comprehensive documentation
6. ✅ Testing suite

**Current Status:** On track for excellent grade ⭐

---

## 📊 Summary

### **Architecture: SOUND ✅**
- Proven libraries
- Clear data model
- Realistic scope

### **Implementation: DETAILED ✅**
- Exact code changes documented
- Small, safe chunks
- Clear timeline

### **Risks: MITIGATED ⚠️**
- Fallback plans ready
- Critical items identified
- Testing strategy defined

### **Semester Scope: APPROPRIATE ✅**
- 3-4 weeks of coding
- Impressive demo
- Not over-engineered

---

## 🚀 FINAL RECOMMENDATION

**Status:** ✅ **READY TO IMPLEMENT**

**Condition:** Complete the verification checklist above FIRST

**When ready:**
```
"Follow DEVELOPMENT_WORKFLOW.md"
```

**I will:**
1. Check current step (1B-6: Firebase setup)
2. Verify Firebase is configured
3. Move to Step 1B-7 (AudioService refactoring)
4. Follow exact implementation guide above
5. Code in small, tested chunks

**Confidence Level:** 🟢 **HIGH** (90%)
- Architecture is sound
- Libraries are proven
- Scope is appropriate
- Risks are identified
- Implementation is detailed

---

**Last Updated:** 2025-11-29
**Status:** Awaiting verification checklist completion
**Next Action:** Run library verification commands
