# Testing Strategy - Noise Environment Monitor App

**Version:** 1.0.0
**Last Updated:** 2025-10-15
**Owner:** Group 4 (GMU)

---

## 📋 Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Testing Levels](#testing-levels)
4. [Tools & Frameworks](#tools--frameworks)
5. [Phase-by-Phase Testing Plan](#phase-by-phase-testing-plan)
6. [Test Coverage Goals](#test-coverage-goals)
7. [CI/CD Integration](#cicd-integration)
8. [Testing Best Practices](#testing-best-practices)

---

## 🎯 Testing Philosophy

### **Core Principles**

1. **Test Early, Test Often** - Write tests alongside code, not after
2. **Automated Over Manual** - Automate repetitive tests, manual for exploratory
3. **Fast Feedback** - Tests should run quickly (<5 minutes for full suite)
4. **Maintainable Tests** - Tests are code, keep them clean and DRY
5. **Real-World Validation** - Synthetic tests + real device testing

### **Quality Gates**

**No code merges to `develop` without:**
- ✅ All tests passing
- ✅ Code coverage >80% for new code
- ✅ No critical linting errors
- ✅ Manual smoke test passed

---

## 🏗️ Testing Pyramid

```
           ╱╲
          ╱  ╲
         ╱ E2E ╲          ← Few, high-value (5%)
        ╱────────╲
       ╱          ╲
      ╱ Integration╲      ← Moderate coverage (25%)
     ╱──────────────╲
    ╱                ╲
   ╱   Unit Tests     ╲   ← Foundation (70%)
  ╱____________________╲
```

### **Distribution**

- **70% Unit Tests** - Fast, isolated, test individual functions/components
- **25% Integration Tests** - Test component interactions, API flows
- **5% E2E Tests** - Critical user journeys, expensive but realistic

---

## 🧪 Testing Levels

### **1. Unit Testing**

**What:** Test individual functions, components, utils in isolation

**Tools:** Jest, React Native Testing Library

**Scope:**
- Utility functions (DecibelCalculator, MovingAverageFilter, FFTProcessor)
- Service classes (AudioService, LocationService, Classifier)
- React components (DecibelDisplay, ClassificationLabel)
- Business logic (feature extraction, classification algorithms)

**Example:**
```typescript
// DecibelCalculator.test.ts
describe('DecibelCalculator', () => {
  it('should calculate correct dB for silent audio', () => {
    const silentSamples = new Float32Array(1024).fill(0)
    const dB = calculateDecibels(silentSamples)
    expect(dB).toBeLessThan(30)
  })

  it('should handle edge case: very loud audio', () => {
    const loudSamples = new Float32Array(1024).fill(0.99)
    const dB = calculateDecibels(loudSamples)
    expect(dB).toBeGreaterThan(80)
    expect(dB).toBeLessThan(120) // Should not exceed realistic max
  })

  it('should throw error for invalid input', () => {
    expect(() => calculateDecibels(null)).toThrow()
    expect(() => calculateDecibels(new Float32Array(0))).toThrow()
  })
})
```

**Coverage Target:** >80% for all utility and service code

---

### **2. Component Testing (React Native)**

**What:** Test React components in isolation with mocked dependencies

**Tools:** Jest, React Native Testing Library, @testing-library/react-native

**Scope:**
- Screen components (HomeScreen, MapScreen, HistoryScreen)
- UI components (DecibelDisplay, NoiseMarker, Heatmap)
- Component state management
- User interactions (button clicks, gestures)

**Example:**
```typescript
// DecibelDisplay.test.tsx
import { render, screen } from '@testing-library/react-native'
import DecibelDisplay from '../DecibelDisplay'

describe('DecibelDisplay', () => {
  it('should render decibel value', () => {
    render(<DecibelDisplay decibels={65} />)
    expect(screen.getByText('65 dB')).toBeTruthy()
  })

  it('should show green color for quiet environment', () => {
    const { getByTestId } = render(<DecibelDisplay decibels={45} />)
    const container = getByTestId('decibel-container')
    expect(container.props.style).toMatchObject({ backgroundColor: 'green' })
  })

  it('should show red color for noisy environment', () => {
    const { getByTestId } = render(<DecibelDisplay decibels={85} />)
    const container = getByTestId('decibel-container')
    expect(container.props.style).toMatchObject({ backgroundColor: 'red' })
  })

  it('should handle missing decibel value gracefully', () => {
    render(<DecibelDisplay decibels={null} />)
    expect(screen.getByText('-- dB')).toBeTruthy()
  })
})
```

**Coverage Target:** >75% for all React components

---

### **3. Integration Testing**

**What:** Test interactions between multiple components/services

**Tools:** Jest, Detox (for React Native E2E), Supertest (for API testing)

**Scope:**

#### **A. Mobile App Integration**
- Audio Service → Decibel Calculator → Classifier pipeline
- Location Service → Storage Service → Map component flow
- Complete audio processing pipeline (capture → FFT → classification)

**Example:**
```typescript
// AudioPipeline.integration.test.ts
describe('Audio Processing Pipeline', () => {
  it('should process audio from capture to classification', async () => {
    // Setup
    const audioService = new AudioService()
    const fftProcessor = new FFTProcessor()
    const classifier = new Classifier()

    // Simulate audio capture
    await audioService.startRecording()
    await new Promise(resolve => setTimeout(resolve, 1000))
    const samples = await audioService.getSamples()

    // Process through pipeline
    const db = calculateDecibels(samples)
    const fft = fftProcessor.performFFT(samples)
    const features = fftProcessor.extractFeatures(fft)
    const classification = classifier.classify({ db, features })

    // Assert
    expect(classification).toMatch(/Quiet|Normal|Noisy/)
    expect(db).toBeGreaterThan(0)
    expect(db).toBeLessThan(120)
  })
})
```

#### **B. Frontend-Backend API Flow (Phase 3)**
- Mobile app → API request → Backend processing → Response → UI update
- Offline queue → Network reconnection → Sync to backend
- Multi-user data → Heatmap aggregation

**Example:**
```typescript
// API.integration.test.ts
describe('Noise Reading Submission Flow', () => {
  it('should submit reading to backend and receive confirmation', async () => {
    const reading = {
      latitude: 38.83,
      longitude: -77.30,
      decibels: 65,
      classification: 'Normal',
      timestamp: new Date()
    }

    const response = await APIService.submitReading(reading)

    expect(response.status).toBe(201)
    expect(response.data.id).toBeDefined()
    expect(response.data.message).toBe('Reading saved successfully')
  })

  it('should handle offline queue when network unavailable', async () => {
    // Simulate offline mode
    jest.spyOn(NetInfo, 'fetch').mockResolvedValue({ isConnected: false })

    const reading = { /* ... */ }
    await APIService.submitReading(reading)

    // Verify reading queued locally
    const queue = await StorageService.getOfflineQueue()
    expect(queue).toHaveLength(1)
    expect(queue[0]).toMatchObject(reading)
  })

  it('should sync queued readings when network returns', async () => {
    // Add readings to offline queue
    await StorageService.addToQueue(reading1)
    await StorageService.addToQueue(reading2)

    // Simulate network reconnection
    jest.spyOn(NetInfo, 'fetch').mockResolvedValue({ isConnected: true })
    await APIService.syncOfflineQueue()

    // Verify queue is empty after sync
    const queue = await StorageService.getOfflineQueue()
    expect(queue).toHaveLength(0)
  })
})
```

**Coverage Target:** >60% for critical integration paths

---

### **4. End-to-End (E2E) Testing**

**What:** Test complete user journeys on real devices/emulators

**Tools:** Detox, Appium (alternative)

**Scope:**
- Critical user flows (onboarding → monitoring → viewing map)
- Permission flows (grant/deny microphone, location)
- Cross-screen navigation
- Real device testing (Android + iOS)

**Example:**
```typescript
// e2e/monitoring.e2e.test.ts
describe('Noise Monitoring Flow', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  it('should complete full monitoring workflow', async () => {
    // 1. Grant permissions
    await element(by.text('Grant Permissions')).tap()
    await expect(element(by.text('Permissions Granted'))).toBeVisible()

    // 2. Start monitoring
    await element(by.id('start-button')).tap()
    await expect(element(by.id('recording-indicator'))).toBeVisible()

    // 3. Wait for decibel reading
    await waitFor(element(by.id('decibel-value')))
      .toBeVisible()
      .withTimeout(5000)

    // 4. Verify classification appears
    await expect(
      element(by.id('classification-label'))
    ).toHaveText(expect.stringMatching(/Quiet|Normal|Noisy/))

    // 5. Stop monitoring
    await element(by.id('stop-button')).tap()
    await expect(element(by.id('recording-indicator'))).not.toBeVisible()

    // 6. Navigate to map
    await element(by.id('map-tab')).tap()
    await expect(element(by.id('map-view'))).toBeVisible()

    // 7. Verify reading appears on map
    await expect(element(by.id('noise-marker'))).toBeVisible()
  })
})
```

**Coverage:** Focus on 5-10 critical user journeys

---

### **5. Performance Testing**

**What:** Measure app performance metrics

**Tools:** React Native Performance, Android Profiler, Xcode Instruments

**Metrics:**
- App launch time: <3 seconds
- Audio processing latency: <500ms
- Map render time: <2 seconds
- Battery drain: <5% per hour
- Memory usage: stable (no leaks)

**Example:**
```typescript
// performance/audioLatency.perf.test.ts
describe('Audio Processing Performance', () => {
  it('should process audio in under 500ms', async () => {
    const audioSamples = generateTestAudio(44100) // 1 second of audio

    const startTime = performance.now()

    const db = calculateDecibels(audioSamples)
    const fft = performFFT(audioSamples)
    const features = extractFeatures(fft)
    const classification = classify({ db, features })

    const endTime = performance.now()
    const latency = endTime - startTime

    expect(latency).toBeLessThan(500) // Must be under 500ms
    console.log(`Processing latency: ${latency.toFixed(2)}ms`)
  })
})
```

---

### **6. Manual Testing**

**What:** Exploratory testing, UX validation, real-world scenarios

**When:**
- After each major feature completion
- Before each phase sign-off
- During beta testing period

**Checklist:**
- [ ] Test on multiple devices (2 Android, 2 iOS minimum)
- [ ] Test in different noise environments (quiet library, loud cafeteria)
- [ ] Test edge cases (very loud, very quiet, sudden spikes)
- [ ] Test permission denial scenarios
- [ ] Test offline mode
- [ ] Test with low battery (<20%)
- [ ] Test app backgrounding/foregrounding
- [ ] Test with phone calls interrupting recording

**Documentation:** Record findings in `docs/testing/TEST_CASES.md`

---

## 🛠️ Tools & Frameworks

### **Testing Stack**

| Tool | Purpose | Documentation |
|------|---------|--------------|
| **Jest** | Unit testing framework | https://jestjs.io/ |
| **React Native Testing Library** | Component testing | https://callstack.github.io/react-native-testing-library/ |
| **Detox** | E2E testing for React Native | https://wix.github.io/Detox/ |
| **Supertest** | API endpoint testing (Phase 3) | https://github.com/visionmedia/supertest |
| **Mock Service Worker (MSW)** | Mock API responses | https://mswjs.io/ |
| **@testing-library/jest-native** | Custom matchers for RN | https://github.com/testing-library/jest-native |
| **Faker.js** | Generate test data | https://fakerjs.dev/ |

### **Setup Commands**

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
npm install --save-dev detox detox-cli
npm install --save-dev supertest msw faker

# Initialize Detox for E2E testing
npx detox init

# Run tests
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e           # E2E tests
npm run test:coverage      # Coverage report
```

### **Test File Organization**

```
mobile-app/
├── __tests__/                    # Unit tests (co-located)
│   ├── services/
│   │   ├── AudioService.test.ts
│   │   ├── LocationService.test.ts
│   │   └── FFTProcessor.test.ts
│   ├── utils/
│   │   ├── DecibelCalculator.test.ts
│   │   └── MovingAverageFilter.test.ts
│   └── components/
│       ├── DecibelDisplay.test.tsx
│       └── ClassificationLabel.test.tsx
│
├── __integration__/              # Integration tests
│   ├── AudioPipeline.integration.test.ts
│   ├── LocationFlow.integration.test.ts
│   └── APIFlow.integration.test.ts (Phase 3)
│
├── e2e/                          # End-to-end tests
│   ├── monitoring.e2e.test.ts
│   ├── mapView.e2e.test.ts
│   ├── permissions.e2e.test.ts
│   └── config.json
│
└── __performance__/              # Performance tests
    ├── audioLatency.perf.test.ts
    └── memoryUsage.perf.test.ts
```

---

## 📅 Phase-by-Phase Testing Plan

### **Phase 0: Research & Prototyping**

**Testing Focus:** Validate algorithms work correctly

- [x] Unit tests for Python audio processor
- [x] Validate FFT produces correct frequencies (440Hz test)
- [x] Confirm decibel calculation accuracy
- [x] Test classifier with synthetic data (93.33% accuracy achieved)

---

### **Phase 1: Core Mobile App** (Week 3-5)

**Testing Strategy:** Build test suite alongside features

| Step | Unit Tests | Integration Tests | E2E Tests |
|------|-----------|------------------|----------|
| 1.1: React Native Setup | Setup test infrastructure | - | Hello World smoke test |
| 1.2: Audio Capture | AudioService tests | - | Permission flow test |
| 1.3: Decibel Calculation | DecibelCalculator tests | Audio→Decibel pipeline | - |
| 1.4: Moving Average Filter | Filter algorithm tests | Filter integration | - |
| 1.5: FFT Implementation | FFT accuracy tests | Audio→FFT→Features | - |
| 1.6: Classification | Classifier logic tests | Full audio pipeline | - |
| 1.7: UI Implementation | Component snapshot tests | UI data binding | Complete monitoring flow |

**Exit Criteria:**
- ✅ Unit test coverage >80%
- ✅ All integration tests passing
- ✅ E2E monitoring flow working on 2 devices
- ✅ No critical bugs found in manual testing

---

### **Phase 2: GPS & Mapping** (Week 6-8)

**Testing Strategy:** Focus on location accuracy and map rendering

| Step | Unit Tests | Integration Tests | E2E Tests |
|------|-----------|------------------|----------|
| 2.1: GPS Permission | LocationService tests | - | Location permission flow |
| 2.2: Data Model | NoiseReading model tests | Storage integration | - |
| 2.3: Map View | Map component tests | - | Map navigation test |
| 2.4: Noise Markers | Marker component tests | Readings→Map flow | Add reading→See on map |
| 2.5: Heatmap | Heatmap algorithm tests | Heatmap rendering | Toggle heatmap |
| 2.6: Location Labels | Label component tests | Label persistence | Add/edit label flow |
| 2.7: History View | History screen tests | Filter functionality | View history test |

**Exit Criteria:**
- ✅ Location accuracy ±20m validated
- ✅ Map performance <2s load time
- ✅ Data persistence tests passing
- ✅ E2E location flow working

---

### **Phase 3: ML & Backend** (Week 9-10) - Optional

**Testing Strategy:** Validate ML accuracy and API reliability

**ML Testing:**
- [ ] Model inference tests (latency <100ms)
- [ ] Classification accuracy tests (>85% on validation set)
- [ ] Edge case handling (very loud, very quiet)

**Backend API Testing:**
- [ ] Unit tests for all API endpoints
- [ ] Integration tests for database operations
- [ ] API contract tests (request/response schemas)
- [ ] Load testing (100 concurrent requests)

**Frontend-Backend Integration:**
- [ ] Mock API responses for offline development
- [ ] End-to-end API flow tests
- [ ] Error handling tests (network failures, timeouts)
- [ ] Authentication/authorization tests (if applicable)

**Example API Test:**
```typescript
// backend/__tests__/api/readings.test.ts
describe('POST /api/readings', () => {
  it('should save noise reading to database', async () => {
    const reading = {
      latitude: 38.83,
      longitude: -77.30,
      decibels: 65,
      classification: 'Normal',
      timestamp: new Date().toISOString()
    }

    const response = await request(app)
      .post('/api/readings')
      .send(reading)
      .expect(201)

    expect(response.body.id).toBeDefined()

    // Verify in database
    const saved = await db.readings.findById(response.body.id)
    expect(saved.decibels).toBe(65)
  })

  it('should reject invalid reading data', async () => {
    const invalidReading = { latitude: 'invalid' }

    await request(app)
      .post('/api/readings')
      .send(invalidReading)
      .expect(400)
  })
})
```

**Exit Criteria:**
- ✅ ML model >85% accuracy
- ✅ All API endpoints tested (>80% coverage)
- ✅ Load testing passed (100 concurrent users)
- ✅ Offline sync tested and working

---

### **Phase 4: Testing & Polish** (Week 11-12)

**Testing Strategy:** Comprehensive testing and bug fixing

**Week 11: Test Coverage & Automation**
- [ ] Achieve >80% code coverage across project
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Automated test runs on every PR
- [ ] Fix all failing tests

**Week 12: Performance & Stress Testing**
- [ ] Battery profiling (target: <5% per hour)
- [ ] Memory leak detection
- [ ] Stress testing (continuous 2-hour monitoring)
- [ ] Multi-device compatibility testing

**Beta Testing:**
- [ ] Recruit 10-15 beta testers
- [ ] Distribute via TestFlight (iOS) / Internal Testing (Android)
- [ ] Collect crash reports and feedback
- [ ] Iterate based on findings

**Exit Criteria:**
- ✅ >80% code coverage
- ✅ CI/CD pipeline running
- ✅ Performance targets met
- ✅ No critical bugs
- ✅ Beta testers satisfied (4+ star rating)

---

### **Phase 5: Deployment** (Week 13-14)

**Testing Strategy:** Final validation and regression testing

**Pre-Deployment Testing:**
- [ ] Full regression test suite
- [ ] Security audit (no sensitive data leaks)
- [ ] Accessibility testing (screen reader support)
- [ ] Final device compatibility check (5+ devices)

**Post-Deployment Monitoring:**
- [ ] Set up crash reporting (Firebase Crashlytics)
- [ ] Monitor performance metrics in production
- [ ] Track user feedback
- [ ] Hotfix process ready

---

## 🎯 Test Coverage Goals

### **Overall Coverage Targets**

| Component | Coverage Target | Current |
|-----------|----------------|---------|
| **Utils & Services** | >80% | TBD |
| **React Components** | >75% | TBD |
| **Integration Paths** | >60% | TBD |
| **Critical E2E Flows** | 100% | TBD |

### **Coverage Commands**

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html

# Check coverage thresholds
jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

### **Coverage Enforcement**

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

---

## 🚀 CI/CD Integration

### **GitHub Actions Workflow**

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:integration

  e2e-tests:
    runs-on: macos-latest  # For iOS simulator
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx detox build -c ios.sim.release
      - run: npx detox test -c ios.sim.release
```

### **Pre-Commit Hooks**

```javascript
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm test",
      "pre-push": "npm run test:integration"
    }
  }
}
```

---

## ✅ Testing Best Practices

### **1. Test Organization**

- ✅ **DO:** Co-locate unit tests with source files
- ✅ **DO:** Use descriptive test names (`it('should calculate dB for silent audio')`)
- ✅ **DO:** Follow AAA pattern (Arrange, Act, Assert)
- ❌ **DON'T:** Write tests that depend on other tests
- ❌ **DON'T:** Use real timers (use `jest.useFakeTimers()`)

### **2. Mocking**

```typescript
// Good: Mock external dependencies
jest.mock('react-native-audio', () => ({
  AudioRecorder: {
    requestAuthorization: jest.fn(() => Promise.resolve(true)),
    startRecording: jest.fn()
  }
}))

// Bad: Don't mock what you're testing
jest.mock('../DecibelCalculator') // Testing this, don't mock it!
```

### **3. Test Data**

```typescript
// Good: Use factories for test data
const createMockAudioSamples = (amplitude = 0.5, length = 1024) => {
  return new Float32Array(length).fill(amplitude)
}

// Bad: Hardcoded magic numbers
const samples = new Float32Array([0.1, 0.2, 0.3, ...]) // What does this represent?
```

### **4. Async Testing**

```typescript
// Good: Use async/await
it('should fetch readings from API', async () => {
  const readings = await APIService.getReadings()
  expect(readings).toHaveLength(10)
})

// Bad: Callback hell
it('should fetch readings', (done) => {
  APIService.getReadings().then(readings => {
    expect(readings).toHaveLength(10)
    done()
  })
})
```

### **5. Test Isolation**

```typescript
// Good: Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  AsyncStorage.clear()
})

// Bad: Tests affect each other
let globalCounter = 0 // Shared state between tests
```

---

## 📊 Test Metrics Dashboard

Track these metrics weekly:

| Metric | Target | Week 3 | Week 5 | Week 8 | Week 12 |
|--------|--------|--------|--------|--------|---------|
| Unit Test Coverage | >80% | - | - | - | - |
| Integration Coverage | >60% | - | - | - | - |
| E2E Tests Passing | 100% | - | - | - | - |
| Average Test Duration | <5 min | - | - | - | - |
| Flaky Tests | 0 | - | - | - | - |
| Critical Bugs | 0 | - | - | - | - |

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Detox E2E Guide](https://wix.github.io/Detox/docs/introduction/getting-started)

---

**Document Version:** 1.0.0
**Next Review:** End of Phase 1
**Maintained By:** Group 4 Testing Team

---

**🔗 Navigation:**
- ← [Back to Project Context](../../PROJECT_CONTEXT.md)
- → [View Test Cases](./TEST_CASES.md)
- → [Check Project Plan](../../PROJECT_PLAN.md)
