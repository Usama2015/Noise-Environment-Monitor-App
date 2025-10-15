# Noise Environment Monitor - Mobile App

**Version:** 0.0.1 (Phase 1 - Development)
**Framework:** React Native 0.82.0
**Language:** TypeScript 5.8.3

---

## Project Overview

Mobile application for measuring, classifying, and visualizing ambient noise levels on campus using smartphone microphones and GPS. Helps students find quiet study spaces.

### Key Features (Planned)
- Real-time noise level measurement (decibels)
- Intelligent noise classification (Quiet/Normal/Noisy)
- GPS location tagging
- Campus noise heatmap visualization
- Historical noise data tracking

### Current Status
**Phase 1, Step 1.1: React Native Setup** - COMPLETE
- React Native project initialized with TypeScript
- Testing framework configured (Jest + React Native Testing Library)
- Folder structure created
- Type definitions established

---

## Prerequisites

### Required Software
- **Node.js:** >= 20.0.0
- **npm:** >= 9.0.0
- **React Native CLI:** Latest
- **Git:** For version control

### For Android Development
- **Android Studio:** Latest version
- **JDK:** 17 or higher
- **Android SDK:** API Level 33+
- **Android Emulator** or physical device with USB debugging

### For iOS Development (macOS only)
- **Xcode:** 14.0 or higher
- **CocoaPods:** Latest
- **iOS Simulator** or physical device

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd INFS/mobile-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### 4. Android Setup
Ensure Android Studio is installed and configured.

---

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Integration Tests
```bash
npm run test:integration
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Performance Tests
```bash
npm run test:performance
```

### Coverage Goals
- **Unit Tests:** > 80%
- **Integration Tests:** > 60%
- **E2E Tests:** 100% of critical flows

---

## Linting

### Run Linter
```bash
npm run lint
```

### Fix Auto-fixable Issues
```bash
npm run lint -- --fix
```

---

## Project Structure

```
mobile-app/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen components (HomeScreen, MapScreen)
│   ├── services/          # Business logic (AudioService, LocationService)
│   ├── utils/             # Helper functions (DecibelCalculator, FFTProcessor)
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Images, icons, fonts
│
├── __tests__/             # Unit tests (co-located with source)
│   ├── services/
│   ├── utils/
│   └── components/
│
├── __integration__/       # Integration tests
├── e2e/                   # End-to-end tests (Detox)
├── __performance__/       # Performance tests
│
├── android/               # Android native code
├── ios/                   # iOS native code
│
├── App.tsx                # Root component
├── index.js               # App entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
└── README.md              # This file
```

---

## Development Workflow

### Git Branching
Currently on: `phase/1-core-app`

Follow the branching strategy in `GIT_STRATEGY.md`:
- Feature branches: `feature/audio-capture`
- Bug fixes: `bugfix/decibel-error`
- Experiments: `experiment/new-algorithm`

### Commit Convention
Use Conventional Commits format:
```
feat(audio): implement FFT processor
fix(gps): resolve null location crash
test(utils): add decibel calculator tests
docs: update installation instructions
```

---

## Next Steps (Development Roadmap)

### Phase 1: Core Mobile App (Current)
- **Step 1.1:** React Native Setup ✅ COMPLETE
- **Step 1.2:** Microphone Permission & Audio Capture (Next)
- **Step 1.3:** Decibel Calculation
- **Step 1.4:** Moving Average Filter
- **Step 1.5:** FFT Implementation
- **Step 1.6:** Threshold-Based Classification
- **Step 1.7:** Basic UI Implementation

### Phase 2: GPS & Mapping
- GPS integration and location tagging
- Map view with noise markers
- Heatmap visualization
- Historical data storage

### Phase 3: Machine Learning & Backend (Optional)
- ML-based classification model
- Backend API for data aggregation
- Multi-user heatmap

---

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Errors
```bash
# Clear cache and restart
npm start -- --reset-cache
```

#### 2. Android Build Failures
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

#### 3. iOS Build Failures
```bash
# Clean iOS build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### 4. TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

#### 5. Test Failures
```bash
# Clear Jest cache
npm test -- --clearCache
```

---

## Performance Targets

- **App Launch Time:** < 3 seconds
- **Audio Processing Latency:** < 500ms
- **Map Load Time:** < 2 seconds
- **Battery Consumption:** < 5% per hour
- **Memory Usage:** Stable (no leaks)

---

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

### Project Documentation
- **PROJECT_CONTEXT.md** - Complete project overview
- **PROJECT_PLAN.md** - Detailed development plan
- **TESTING_STRATEGY.md** - Testing approach and guidelines
- **GIT_STRATEGY.md** - Git workflow and conventions

---

## Team

**Group 4 (GMU)**
- Steve Sahayadarlin (jsahayad@gmu.edu)
- Kai Liu (kliu29@gmu.edu)
- Usama Sarfaraz Khan (ukhan26@gmu.edu)
- Abdulhamid Alhumaid (aalhuma@gmu.edu)

---

## License

Academic project for George Mason University.

---

## Support

For issues or questions:
1. Check `PROGRESS_REPORT.md` for current status
2. Review `DEVELOPMENT_LOG.md` for troubleshooting history
3. Contact team members via email
4. Create GitHub issue (if repository is set up)

---

**Last Updated:** 2025-10-15
**Status:** Phase 1, Step 1.1 Complete
