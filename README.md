# Campus Noise Monitor App

A React Native mobile application that helps students find quiet study spaces on campus by measuring, classifying, and visualizing noise levels in real-time.

**Team:** Group 4 (George Mason University)
**Course:** INFS Semester Project
**Status:** Phase 3 Complete - Ready for Demo

---

## Features

- **Real-time Noise Monitoring** - Measure ambient noise levels in decibels (dB)
- **Noise Classification** - Automatically classify as Quiet (<40dB), Normal (40-60dB), Moderate (60-80dB), or Noisy (>80dB)
- **Campus Map Visualization** - View noise levels on an interactive Google Map with colored circles
- **Time Decay System** - Older readings fade out, showing only recent data
- **Firebase Cloud Sync** - Real-time data synchronization across devices
- **Building/Room Tagging** - Tag readings with specific campus locations

---

## Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| Node.js | >= 20.0.0 | [nodejs.org](https://nodejs.org/) |
| npm | >= 9.0.0 | Comes with Node.js |
| Android Studio | Latest | [developer.android.com](https://developer.android.com/studio) |
| JDK | 17+ | Included with Android Studio |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Step 1: Clone the Repository

```bash
git clone https://github.com/Usama2015/Noise-Environment-Monitor-App.git
cd Noise-Environment-Monitor-App
```

### Step 2: Install Dependencies

```bash
cd mobile-app
npm install
```

### Step 3: Firebase Setup (Required)

The app requires Firebase for authentication and data storage.

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the wizard
   - Name it something like "CampusNoiseMonitor"

2. **Add Android App**
   - In Firebase Console, click "Add app" → Android
   - Package name: `com.noisemonitor`
   - Download `google-services.json`

3. **Place Configuration File**
   ```bash
   # Copy the downloaded file to:
   mobile-app/android/app/google-services.json
   ```

4. **Enable Authentication**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Anonymous" authentication

5. **Create Firestore Database**
   - Go to Firebase Console → Firestore Database
   - Click "Create database"
   - Select "Start in test mode" (for development)
   - Choose your region (us-central recommended)

### Step 4: Android Setup

1. **Open Android Studio**
2. **Set ANDROID_HOME environment variable**
   - Windows: `C:\Users\<username>\AppData\Local\Android\Sdk`
   - macOS: `~/Library/Android/sdk`
   - Linux: `~/Android/Sdk`

3. **Add to PATH** (if not already):
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`

### Step 5: Run the App

**Option A: Physical Android Device (Recommended)**

1. Enable Developer Options on your phone:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging → ON
3. Connect phone via USB cable
4. Run:
   ```bash
   # Start Metro bundler
   npm start

   # In another terminal, build and install
   npx react-native run-android
   ```
5. If you see "Unable to load script" error:
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```
   Then shake phone → Reload

**Option B: Android Emulator**

1. Open Android Studio → AVD Manager
2. Create a virtual device (Pixel 4 recommended, API 33+)
3. Start the emulator
4. Run:
   ```bash
   npm start
   npx react-native run-android
   ```

---

## Using the App

### Monitor Tab
1. Select a **Building** from the dropdown
2. Select a **Room** from the dropdown
3. Tap **"Start Monitoring"**
4. Grant microphone and location permissions when prompted
5. View real-time noise levels and classification

### Campus Map Tab
1. View the Google Map centered on GMU campus
2. Colored circles show noise readings:
   - 🔵 **Blue** - Quiet (0-40 dB)
   - 🟢 **Green** - Normal (40-60 dB)
   - 🟡 **Yellow** - Moderate (60-80 dB)
   - 🔴 **Red** - Noisy (80+ dB)
3. Use the **time window slider** to filter by recency (1-60 minutes)
4. Older readings appear more transparent (time decay)

---

## Troubleshooting

### Common Issues

**"Unable to load script from assets" on phone**
```bash
adb reverse tcp:8081 tcp:8081
# Then shake phone and tap Reload
```

**Port 8081 already in use**
```bash
npx kill-port 8081
npm start
```

**Build fails with Gradle error**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**Metro bundler stuck**
```bash
npm start -- --reset-cache
```

**App crashes on startup**
- Ensure `google-services.json` is in `android/app/`
- Verify Firebase Anonymous Auth is enabled
- Check that Firestore database exists

---

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Monitor tab - noise recording
│   │   └── MapScreen.tsx      # Map tab - visualization
│   ├── services/
│   │   ├── AudioService.ts    # Microphone capture & dB calculation
│   │   ├── AuthService.ts     # Firebase anonymous auth
│   │   └── StorageService.ts  # Firestore read/write
│   ├── components/            # Reusable UI components
│   ├── utils/                 # FFT, filters, calculators
│   ├── constants/             # Campus locations
│   └── types/                 # TypeScript definitions
├── android/                   # Android native code
├── App.tsx                    # Root component with navigation
└── package.json
```

---

## Development Commands

```bash
# Start Metro bundler
npm start

# Start with cache reset
npm start -- --reset-cache

# Build and run on Android
npx react-native run-android

# Run tests
npm test

# Type check
npx tsc --noEmit

# Lint code
npm run lint
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.82 |
| Language | TypeScript 5.8 |
| Navigation | React Navigation (Bottom Tabs) |
| Maps | react-native-maps (Google Maps) |
| Backend | Firebase (Auth + Firestore) |
| Audio | react-native-sound-level |
| State | React Hooks |

---

## Team

**Group 4 - George Mason University**

- Steve Sahayadarlin - jsahayad@gmu.edu
- Kai Liu - kliu29@gmu.edu
- Usama Sarfaraz Khan - ukhan26@gmu.edu
- Abdulhamid Alhumaid - aalhuma@gmu.edu

---

## License

Academic project for George Mason University - INFS Course.

---

**Last Updated:** December 2, 2025
