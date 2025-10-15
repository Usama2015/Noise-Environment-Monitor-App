# Noise Environment Monitor App 📊🔊

[![Project Status](https://img.shields.io/badge/Status-In%20Planning-yellow)](PROGRESS_REPORT.md)
[![Phase](https://img.shields.io/badge/Phase-0%20Research-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A mobile application that helps students find quiet study spaces on campus by measuring, classifying, and visualizing noise levels in real-time.

**Team:** Group 4 (George Mason University)
**Course:** INFS Semester Project
**Academic Year:** 2025

---

## 🎯 Project Overview

The Noise Environment Monitor App uses smartphone sensors (microphone and GPS) to:
- **Measure** ambient noise levels in decibels (dB)
- **Classify** environments as Quiet (<50dB), Normal (50-70dB), or Noisy (>70dB)
- **Visualize** noise distribution across campus using interactive heatmaps
- **Track** historical noise patterns to identify optimal study times

---

## ✨ Key Features

### **Core Features (MVP)**
- 🎤 Real-time audio capture and noise measurement
- 🧮 FFT-based signal processing for frequency analysis
- 🤖 ML-powered noise classification
- 📍 GPS location tagging for every measurement
- 🗺️ Interactive campus heatmap showing noise levels
- 📊 Historical data tracking and visualization
- 💾 Offline-first architecture with local data storage

### **Advanced Features (Phase 3 - Optional)**
- ☁️ Backend API for multi-user data aggregation
- 🌍 Campus-wide crowdsourced heatmap
- 🔔 Push notifications for quiet spot alerts
- 📈 Time-based trend analysis and predictions
- 👥 Social features (share locations with friends)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│               (React Native - iOS/Android)                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │      UI      │  │   Services   │  │   Storage    │      │
│  │  Screens &   │◄─┤  Audio, GPS  │◄─┤ AsyncStorage │      │
│  │  Components  │  │  ML, FFT     │  │   (Local)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                                 │
│         ▼                  ▼                                 │
│  ┌──────────────────────────────────────┐                   │
│  │   Device Sensors (Mic + GPS)         │                   │
│  └──────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS (Phase 3 - Optional)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend Server (Node.js/Python)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  REST API    │  │  PostgreSQL  │  │  WebSockets  │      │
│  │  Endpoints   │◄─┤  + PostGIS   │◄─┤  Real-time   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### **Mobile App**
- **Framework:** React Native (TypeScript)
- **Audio:** expo-av / react-native-audio
- **Signal Processing:** Custom FFT / FFT.js
- **GPS:** expo-location / react-native-geolocation
- **Maps:** react-native-maps with heatmap overlay
- **State:** React Context API / Redux Toolkit
- **Storage:** AsyncStorage
- **Testing:** Jest + React Native Testing Library

### **Machine Learning**
- **Training:** Python + scikit-learn / TensorFlow
- **Inference:** TensorFlow Lite / ONNX Runtime (on-device)
- **Features:** Spectral analysis, MFCC, frequency domain features

### **Backend (Phase 3 - Optional)**
- **Server:** Node.js + Express OR Python + FastAPI
- **Database:** PostgreSQL with PostGIS extension
- **Real-time:** WebSockets (Socket.io / ws)
- **Deployment:** Railway / Render / AWS

---

## 📁 Project Structure

```
noise-environment-monitor/
├── docs/                       # Comprehensive documentation
│   ├── architecture/           # System design docs
│   ├── testing/                # Testing strategies
│   └── design/                 # UI/UX designs
│
├── mobile-app/                 # React Native application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── screens/            # App screens
│   │   ├── services/           # Business logic (audio, GPS, ML)
│   │   ├── utils/              # Helper functions
│   │   └── models/             # Data models
│   └── tests/                  # Unit and integration tests
│
├── ml-models/                  # Machine learning pipeline
│   ├── training/               # Model training scripts
│   ├── preprocessing/          # Audio preprocessing
│   └── models/                 # Trained model files
│
├── backend/                    # Backend API (Phase 3)
├── research/                   # Prototypes and experiments
│
├── PROJECT_CONTEXT.md          # 📌 START HERE - Master context
├── PROJECT_PLAN.md             # Detailed development plan
├── PROGRESS_REPORT.md          # Real-time progress tracking
├── GIT_STRATEGY.md             # Git workflow and conventions
└── README.md                   # This file
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js v16+ and npm
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-team/noise-environment-monitor.git
cd noise-environment-monitor

# Install dependencies for mobile app
cd mobile-app
npm install

# Install iOS dependencies (Mac only)
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS (Mac only)
npx react-native run-ios
```

### **Running Tests**

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run linter
npm run lint
```

---

## 📖 Documentation

Comprehensive documentation is available in the following files:

- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** - 📌 **START HERE** - Master context file with links to everything
- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Detailed 5-phase development plan with steps, testing, and metrics
- **[PROGRESS_REPORT.md](PROGRESS_REPORT.md)** - Live progress tracking (updated weekly)
- **[GIT_STRATEGY.md](GIT_STRATEGY.md)** - Git branching strategy and commit conventions

### **Technical Documentation**
- **[docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** - System architecture and data flow
- **[docs/testing/TESTING_STRATEGY.md](docs/testing/TESTING_STRATEGY.md)** - Testing approach and frameworks

---

## 🎯 Development Phases

| Phase | Duration | Goal | Status |
|-------|----------|------|--------|
| **Phase 0** | Week 1-2 | Research & Python prototype | 🔲 Not Started |
| **Phase 1** | Week 3-5 | Core mobile app (audio capture) | 🔲 Not Started |
| **Phase 2** | Week 6-8 | GPS integration & heatmap | 🔲 Not Started |
| **Phase 3** | Week 9-10 | ML classifier & backend (optional) | 🔲 Not Started |
| **Phase 4** | Week 11-12 | Testing & optimization | 🔲 Not Started |
| **Phase 5** | Week 13-14 | Deployment & presentation | 🔲 Not Started |

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed breakdown of each phase.

---

## 🧪 Testing

We follow a comprehensive testing strategy:

- **Unit Tests:** All services and utilities (target: >80% coverage)
- **Integration Tests:** Component interactions and data flow
- **End-to-End Tests:** Full user journeys
- **Manual Testing:** Real-world testing on campus locations

Run tests: `npm test`

See [TESTING_STRATEGY.md](docs/testing/TESTING_STRATEGY.md) for details.

---

## 🤝 Contributing

### **Git Workflow**

We use **Git Flow** with the following branch types:
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/<name>` - New features
- `bugfix/<name>` - Bug fixes
- `release/<version>` - Release preparation

### **Commit Convention**

We follow **Conventional Commits**:

```
feat(audio): implement FFT signal processing
fix(gps): handle null location gracefully
docs(readme): update installation instructions
```

See [GIT_STRATEGY.md](GIT_STRATEGY.md) for complete guidelines.

---

## 👥 Team

**Group 4 - George Mason University**

- **Steve Sahayadarlin** - [jsahayad@gmu.edu](mailto:jsahayad@gmu.edu)
- **Kai Liu** - [kliu29@gmu.edu](mailto:kliu29@gmu.edu)
- **Usama Sarfaraz Khan** - [ukhan26@gmu.edu](mailto:ukhan26@gmu.edu)
- **Abdulhamid Alhumaid** - [aalhuma@gmu.edu](mailto:aalhuma@gmu.edu)

---

## 📊 Project Metrics

### **Current Status**
- **Phase:** Research & Prototyping
- **Progress:** 0% (Planning Complete)
- **Test Coverage:** 0%
- **Features Complete:** 0/9

### **Success Metrics (Target)**
- Classification Accuracy: >85%
- Battery Consumption: <5% per hour
- GPS Accuracy: ±10m outdoors
- App Launch Time: <3 seconds

See [PROGRESS_REPORT.md](PROGRESS_REPORT.md) for detailed metrics.

---

## 📚 Resources

### **Learning Materials**
- [React Native Documentation](https://reactnative.dev/)
- [FFT Tutorial](https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/)
- [Audio Classification Papers](https://github.com/karolpiczak/ESC-50)

### **Related Projects**
- UrbanSound8K Dataset
- ESC-50 Environmental Sound Classification

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- George Mason University - INFS Department
- Course Instructor: [Name TBD]
- Academic Advisor: [Name TBD]

---

## 📞 Contact

For questions or support, please contact:
- **Project Lead:** To Be Decided
- **GitHub Issues:** [Report an issue](https://github.com/your-team/noise-environment-monitor/issues)

---

## 🔗 Quick Links

- 📌 [Project Context (START HERE)](PROJECT_CONTEXT.md)
- 📋 [Development Plan](PROJECT_PLAN.md)
- 📈 [Progress Report](PROGRESS_REPORT.md)
- 🌿 [Git Strategy](GIT_STRATEGY.md)
- 🏗️ [Architecture Docs](docs/architecture/ARCHITECTURE.md)
- 🧪 [Testing Strategy](docs/testing/TESTING_STRATEGY.md)

---

**🎓 Academic Project Notice:** This is a semester project for educational purposes at George Mason University. All work is original and completed by the team members listed above.

**Last Updated:** 2025-10-14
