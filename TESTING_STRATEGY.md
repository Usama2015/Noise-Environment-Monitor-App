# Testing Strategy - Campus Noise Monitor

**Project:** Campus Noise Monitor (Firebase Cloud-First Edition)
**Last Updated:** November 29, 2025
**Testing Philosophy:** Test at every level - Unit → Integration → E2E

---

## 🎯 Testing Hierarchy

```
┌─────────────────────────────────────────────┐
│          E2E Tests (Phase Level)            │
│  - Complete user journeys                   │
│  - Multi-device synchronization             │
│  - Real Firebase integration                │
├─────────────────────────────────────────────┤
│      Integration Tests (Step Level)         │
│  - Multiple components together             │
│  - Service interactions                     │
│  - Mock Firebase                            │
├─────────────────────────────────────────────┤
│         Unit Tests (Function Level)         │
│  - Individual functions/methods             │
│  - Pure logic testing                       │
│  - Mocked dependencies                      │
└─────────────────────────────────────────────┘
```

---

## 📐 Testing Levels

### **Level 1: Unit Tests** (Step Level)
**Purpose:** Test individual functions and methods in isolation
**When:** During step development, before merging to phase branch
**Tool:** Jest + TypeScript
**Coverage Target:** 80%+

### **Level 2: Integration Tests** (Phase Level)
**Purpose:** Test multiple components working together
**When:** After completing a phase, before merging to develop
**Tool:** Jest + React Native Testing Library
**Coverage Target:** 70%+

### **Level 3: End-to-End Tests** (Release Level)
**Purpose:** Test complete user journeys
**When:** Before merging develop to main
**Tool:** Manual testing + Detox (optional)
**Coverage Target:** All critical paths

---

## 🧪 Phase 1A: Core Audio Monitoring

### **Unit Tests (Step Level)**

#### **Step 1A-1: AudioService**
**File:** `__tests__/services/AudioService.test.ts`

```typescript
import { AudioService } from '../src/services/AudioService';

describe('AudioService', () => {
  let audioService: AudioService;

  beforeEach(() => {
    audioService = new AudioService();
  });

  describe('dB Calibration', () => {
    test('should convert dBFS to SPL correctly', () => {
      // dBFS = -56 → SPL = 0 dB
      expect(audioService.calibrate(-56)).toBe(0);

      // dBFS = -6 → SPL = 50 dB
      expect(audioService.calibrate(-6)).toBe(50);
    });

    test('should handle minimum dBFS value', () => {
      expect(audioService.calibrate(-120)).toBe(-64);
    });

    test('should handle maximum dBFS value', () => {
      expect(audioService.calibrate(0)).toBe(56);
    });
  });

  describe('Start/Stop Recording', () => {
    test('should start recording successfully', async () => {
      await expect(audioService.startRecording()).resolves.not.toThrow();
    });

    test('should stop recording gracefully', async () => {
      await audioService.startRecording();
      await expect(audioService.stopRecording()).resolves.not.toThrow();
    });

    test('should not throw when stopping without starting', async () => {
      await expect(audioService.stopRecording()).resolves.not.toThrow();
    });
  });

  describe('dB Averaging', () => {
    test('should average dB values logarithmically', () => {
      const values = [40, 50, 60]; // dB values
      const avg = audioService.averageDb(values);

      // Logarithmic average should be ~54 dB
      expect(avg).toBeCloseTo(54, 1);
    });

    test('should handle single value', () => {
      expect(audioService.averageDb([50])).toBe(50);
    });

    test('should handle zero values gracefully', () => {
      expect(audioService.averageDb([0, 0, 0])).toBe(0);
    });
  });
});
```

**Pass Criteria:** All tests pass
**Command:** `npm test AudioService.test.ts`

---

#### **Step 1A-3: NoiseClassifier**
**File:** `__tests__/services/NoiseClassifier.test.ts`

```typescript
import { NoiseClassifier } from '../src/services/NoiseClassifier';

describe('NoiseClassifier', () => {
  let classifier: NoiseClassifier;

  beforeEach(() => {
    classifier = new NoiseClassifier();
  });

  describe('Classification Thresholds', () => {
    test('should classify < 50 dB as Quiet', () => {
      expect(classifier.classify(30)).toBe('Quiet');
      expect(classifier.classify(49)).toBe('Quiet');
    });

    test('should classify 50-70 dB as Normal', () => {
      expect(classifier.classify(50)).toBe('Normal');
      expect(classifier.classify(60)).toBe('Normal');
      expect(classifier.classify(70)).toBe('Normal');
    });

    test('should classify > 70 dB as Noisy', () => {
      expect(classifier.classify(71)).toBe('Noisy');
      expect(classifier.classify(90)).toBe('Noisy');
    });
  });

  describe('Edge Cases', () => {
    test('should handle negative dB values', () => {
      expect(classifier.classify(-10)).toBe('Quiet');
    });

    test('should handle very high dB values', () => {
      expect(classifier.classify(120)).toBe('Noisy');
    });

    test('should handle decimal values', () => {
      expect(classifier.classify(49.5)).toBe('Quiet');
      expect(classifier.classify(50.5)).toBe('Normal');
      expect(classifier.classify(70.5)).toBe('Noisy');
    });
  });
});
```

**Pass Criteria:** All tests pass
**Command:** `npm test NoiseClassifier.test.ts`

---

### **Integration Tests (Phase Level)**

#### **Phase 1A: Audio Monitoring Flow**
**File:** `__tests__/integration/Phase1A.test.ts`

```typescript
import { AudioService } from '../src/services/AudioService';
import { NoiseClassifier } from '../src/services/NoiseClassifier';

describe('Phase 1A: Audio Monitoring Integration', () => {
  let audioService: AudioService;
  let classifier: NoiseClassifier;

  beforeEach(() => {
    audioService = new AudioService();
    classifier = new NoiseClassifier();
  });

  test('should measure and classify noise in real-time', async () => {
    const readings: number[] = [];
    const classifications: string[] = [];

    // Subscribe to audio updates
    audioService.onDbUpdate((db) => {
      readings.push(db);
      classifications.push(classifier.classify(db));
    });

    // Start monitoring
    await audioService.startRecording();

    // Wait for 3 seconds of data
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Stop monitoring
    await audioService.stopRecording();

    // Verify we got readings
    expect(readings.length).toBeGreaterThan(0);
    expect(classifications.length).toEqual(readings.length);

    // Verify readings are in valid range
    readings.forEach(db => {
      expect(db).toBeGreaterThanOrEqual(-120);
      expect(db).toBeLessThanOrEqual(120);
    });

    // Verify classifications are valid
    classifications.forEach(c => {
      expect(['Quiet', 'Normal', 'Noisy']).toContain(c);
    });
  });

  test('should handle start/stop cycles correctly', async () => {
    // First cycle
    await audioService.startRecording();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await audioService.stopRecording();

    // Second cycle
    await audioService.startRecording();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await audioService.stopRecording();

    // Should not throw errors
    expect(true).toBe(true);
  });
});
```

**Pass Criteria:** All integration tests pass
**Command:** `npm test -- --testPathPattern=Phase1A`

---

## 🧪 Phase 1B + 2: Firebase Integration & Map

### **Unit Tests (Step Level)**

#### **Step 1B-4: AuthService**
**File:** `__tests__/services/AuthService.test.ts`

```typescript
import authService from '../src/services/AuthService';

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    signInAnonymously: jest.fn(() =>
      Promise.resolve({
        user: { uid: 'test-user-123' }
      })
    ),
    currentUser: { uid: 'test-user-123' },
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(),
  });
});

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Anonymous Sign-In', () => {
    test('should sign in anonymously and return user ID', async () => {
      const userId = await authService.signInAnonymously();
      expect(userId).toBe('test-user-123');
    });

    test('should cache user ID after sign-in', async () => {
      await authService.signInAnonymously();
      expect(authService.getUserId()).toBe('test-user-123');
    });
  });

  describe('User ID Management', () => {
    test('should return user ID if signed in', () => {
      const userId = authService.getUserId();
      expect(userId).toBe('test-user-123');
    });

    test('should return null if not signed in', () => {
      // Mock no current user
      // ... test implementation
    });
  });

  describe('Sign-Out', () => {
    test('should sign out successfully', async () => {
      await authService.signInAnonymously();
      await expect(authService.signOut()).resolves.not.toThrow();
    });

    test('should clear user ID after sign-out', async () => {
      await authService.signInAnonymously();
      await authService.signOut();
      // User ID should be null (need to mock properly)
    });
  });

  describe('Authentication State', () => {
    test('should return true when signed in', async () => {
      await authService.signInAnonymously();
      expect(authService.isSignedIn()).toBe(true);
    });
  });
});
```

**Pass Criteria:** All tests pass
**Command:** `npm test AuthService.test.ts`

---

#### **Step 1B-5: StorageService**
**File:** `__tests__/services/StorageService.test.ts`

```typescript
import storageService from '../src/services/StorageService';
import { NoiseReading } from '../src/types';

// Mock Firestore
jest.mock('@react-native-firebase/firestore', () => {
  return () => ({
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'doc-123' })),
      where: jest.fn(() => ({
        onSnapshot: jest.fn(),
        orderBy: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ forEach: jest.fn() })),
        })),
      })),
      limit: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ forEach: jest.fn() })),
      })),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(() => new Date()),
    },
  });
});

// Mock AuthService
jest.mock('../src/services/AuthService', () => ({
  getUserId: jest.fn(() => 'test-user-123'),
}));

describe('StorageService', () => {
  describe('Save Reading', () => {
    test('should save reading to Firestore', async () => {
      const reading: NoiseReading = {
        decibel: 45.5,
        classification: 'Quiet',
        location: {
          latitude: 38.8304,
          longitude: -77.3078,
          building: 'Fenwick Library',
          room: '3rd Floor Quiet Zone',
        },
        sessionId: 'session-123',
      };

      const docId = await storageService.saveReading(reading);
      expect(docId).toBe('doc-123');
    });

    test('should throw error if user not authenticated', async () => {
      // Mock no user
      jest.spyOn(require('../src/services/AuthService'), 'getUserId')
        .mockReturnValue(null);

      const reading: NoiseReading = {
        decibel: 45.5,
        classification: 'Quiet',
        location: {
          latitude: 38.8304,
          longitude: -77.3078,
          building: 'Fenwick Library',
          room: '3rd Floor',
        },
        sessionId: 'session-123',
      };

      await expect(storageService.saveReading(reading))
        .rejects.toThrow('User not authenticated');
    });
  });

  describe('Connection Test', () => {
    test('should test Firestore connection successfully', async () => {
      const result = await storageService.testConnection();
      expect(result).toBe(true);
    });
  });
});
```

**Pass Criteria:** All tests pass
**Command:** `npm test StorageService.test.ts`

---

### **Integration Tests (Phase Level)**

#### **Phase 1B: Firebase Integration**
**File:** `__tests__/integration/Phase1B.test.ts`

```typescript
import authService from '../src/services/AuthService';
import storageService from '../src/services/StorageService';
import { NoiseReading } from '../src/types';

describe('Phase 1B: Firebase Integration', () => {
  test('should authenticate and save reading end-to-end', async () => {
    // Step 1: Sign in anonymously
    const userId = await authService.signInAnonymously();
    expect(userId).toBeTruthy();

    // Step 2: Verify signed in
    expect(authService.isSignedIn()).toBe(true);

    // Step 3: Create reading
    const reading: NoiseReading = {
      decibel: 52.3,
      classification: 'Normal',
      location: {
        latitude: 38.8304,
        longitude: -77.3078,
        building: 'Johnson Center',
        room: 'Food Court',
      },
      sessionId: 'integration-test-session',
    };

    // Step 4: Save to Firestore
    const docId = await storageService.saveReading(reading);
    expect(docId).toBeTruthy();
  });

  test('should test Firestore connection', async () => {
    const isConnected = await storageService.testConnection();
    expect(isConnected).toBe(true);
  });
});
```

**Pass Criteria:** All integration tests pass
**Command:** `npm test -- --testPathPattern=Phase1B`

---

#### **Phase 2: Map Visualization**
**File:** `__tests__/integration/Phase2.test.ts`

```typescript
import storageService from '../src/services/StorageService';
import { NoiseReadingDocument } from '../src/types';

describe('Phase 2: Map Visualization Integration', () => {
  test('should subscribe to heatmap updates', (done) => {
    const unsubscribe = storageService.subscribeToHeatmap((readings) => {
      expect(Array.isArray(readings)).toBe(true);

      readings.forEach((reading: NoiseReadingDocument) => {
        expect(reading.userId).toBeTruthy();
        expect(reading.decibel).toBeGreaterThanOrEqual(0);
        expect(reading.location.latitude).toBeDefined();
        expect(reading.location.longitude).toBeDefined();
      });

      unsubscribe();
      done();
    });
  });

  test('should fetch building-specific readings', async () => {
    const readings = await storageService.getBuildingReadings('Fenwick Library', 10);

    expect(Array.isArray(readings)).toBe(true);
    readings.forEach(reading => {
      expect(reading.location.building).toBe('Fenwick Library');
    });
  });
});
```

**Pass Criteria:** All integration tests pass
**Command:** `npm test -- --testPathPattern=Phase2`

---

### **End-to-End Tests (Release Level)**

#### **E2E Test 1: Complete Monitoring Flow**
**Type:** Manual (with checklist)
**File:** `docs/testing/E2E_MONITORING_FLOW.md`

**Test Steps:**
```
1. Open App
   ✓ App launches without crashes
   ✓ Anonymous auth auto-signs in (check console logs)
   ✓ HomeScreen displays

2. Select Location
   ✓ Tap building dropdown
   ✓ Select "Fenwick Library"
   ✓ Room dropdown becomes enabled
   ✓ Select "3rd Floor Quiet Zone"

3. Start Monitoring
   ✓ Tap "Start Monitoring" button
   ✓ dB value updates in real-time (125ms)
   ✓ Classification updates every 1 second
   ✓ Console logs show Firebase uploads

4. Make Noise
   ✓ Clap hands / speak loudly
   ✓ dB value increases
   ✓ Classification changes to "Normal" or "Noisy"

5. Stop Monitoring
   ✓ Tap "Stop Monitoring" button
   ✓ dB updates stop
   ✓ No console errors

6. Verify Firestore
   ✓ Open Firebase Console → Firestore
   ✓ Collection "noise_readings" exists
   ✓ Documents contain correct data:
     - userId (anonymous UID)
     - timestamp (recent)
     - decibel (matches app)
     - classification (matches app)
     - location.building = "Fenwick Library"
     - location.room = "3rd Floor Quiet Zone"
     - sessionId (UUID format)
```

**Pass Criteria:** All checkboxes checked

---

#### **E2E Test 2: Multi-Device Synchronization**
**Type:** Manual
**File:** `docs/testing/E2E_MULTI_DEVICE.md`

**Setup:**
- Phone A (recorder)
- Phone B (viewer - connected to projector)
- Same WiFi network

**Test Steps:**
```
1. Phone B: Open Map Tab
   ✓ Map displays
   ✓ Current location shown
   ✓ Heatmap overlay visible (may be empty initially)

2. Phone A: Select Location
   ✓ Select "Johnson Center" → "Food Court"
   ✓ Tap "Start Monitoring"

3. Phone A: Generate Noise
   ✓ Make loud noise (clap/yell)
   ✓ Phone A shows high dB (>70)
   ✓ Phone A classification = "Noisy"

4. Phone B: Observe Map
   ✓ Map updates within 2 seconds
   ✓ Red marker/heatmap appears at Johnson Center
   ✓ No manual refresh required

5. Phone A: Stop Monitoring
   ✓ Tap "Stop Monitoring"
   ✓ Phone A stops uploading

6. Phone B: Verify Data Persistence
   ✓ Red marker remains on map (data persists)
   ✓ Heatmap shows readings from last 1 hour
```

**Pass Criteria:** Real-time sync works (<2 seconds latency)

---

#### **E2E Test 3: Battery Consumption**
**Type:** Manual
**File:** `docs/testing/E2E_BATTERY.md`

**Test Steps:**
```
1. Fully charge device to 100%
2. Restart device
3. Open app and start monitoring
4. Leave monitoring for 1 hour
5. Check battery level

Expected: Battery consumption < 5% per hour
```

**Pass Criteria:** <5% battery per hour

---

## 📊 Testing Matrix

| Phase | Unit Tests | Integration Tests | E2E Tests | Pass Criteria |
|-------|-----------|-------------------|-----------|---------------|
| **Phase 1A** | AudioService, NoiseClassifier | Audio monitoring flow | - | All tests pass |
| **Phase 1B** | AuthService, StorageService | Firebase auth + storage | Complete monitoring → Firestore | All tests pass + manual verification |
| **Phase 2** | MapScreen (if complex logic) | Heatmap subscription | Multi-device sync | All tests pass + <2s sync |
| **Phase 3** | - | - | Battery, UI/UX, Full journey | <5% battery, smooth UX |

---

## 🚀 Running Tests

### **Run All Unit Tests:**
```bash
cd mobile-app
npm test
```

### **Run Specific Test File:**
```bash
npm test AudioService.test.ts
```

### **Run Integration Tests Only:**
```bash
npm test -- --testPathPattern=integration
```

### **Run Tests with Coverage:**
```bash
npm test -- --coverage
```

### **Watch Mode (during development):**
```bash
npm test -- --watch
```

---

## 📝 Test File Structure

```
mobile-app/
├── __tests__/
│   ├── services/
│   │   ├── AudioService.test.ts
│   │   ├── AuthService.test.ts
│   │   ├── StorageService.test.ts
│   │   └── NoiseClassifier.test.ts
│   ├── integration/
│   │   ├── Phase1A.test.ts
│   │   ├── Phase1B.test.ts
│   │   └── Phase2.test.ts
│   └── e2e/
│       └── (Detox tests - optional)
├── docs/
│   └── testing/
│       ├── E2E_MONITORING_FLOW.md
│       ├── E2E_MULTI_DEVICE.md
│       └── E2E_BATTERY.md
└── jest.config.js
```

---

## ✅ Definition of Done (DoD)

### **Step Complete:**
- [ ] Code written
- [ ] Unit tests written and passing
- [ ] No console errors
- [ ] Code reviewed (self-review)
- [ ] Committed with proper message

### **Phase Complete:**
- [ ] All steps complete
- [ ] Integration tests written and passing
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Ready to merge to develop

### **Release Ready:**
- [ ] All phases complete
- [ ] E2E tests passing
- [ ] Performance metrics met
- [ ] Demo script practiced
- [ ] Ready to merge to main

---

**Last Updated:** November 29, 2025
**Next Testing Milestone:** Phase 1B integration tests after Firebase setup
