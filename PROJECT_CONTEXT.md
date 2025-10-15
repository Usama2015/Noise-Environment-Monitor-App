# Noise Environment Monitor App - Project Context

**Last Updated:** 2025-10-14
**Version:** 1.0.0
**Status:** Planning Phase

---

## 📋 Quick Overview

**Project Name:** Noise Environment Monitor App
**Team:** Group 4 (GMU)
**Team Members:**
- Steve Sahayadarlin (jsahayad@gmu.edu)
- Kai Liu (kliu29@gmu.edu)
- Usama Sarfaraz Khan (ukhan26@gmu.edu)
- Abdulhamid Alhumaid (aalhuma@gmu.edu)

**Primary Goal:** Develop a mobile application that helps students find quiet study spaces on campus by measuring, classifying, and visualizing noise levels in real-time using smartphone microphones and GPS.

---

## 🎯 Project Mission

Enable students to make informed decisions about where to study by providing:
1. Real-time noise level measurements (decibels)
2. Intelligent noise classification (Quiet, Normal, Noisy)
3. Localized noise heatmaps showing quiet and loud areas on campus
4. Historical noise trends to identify patterns throughout the day

---

## 📁 Project Structure

```
INFS/
├── PROJECT_CONTEXT.md          ← YOU ARE HERE (Master context file)
├── PROJECT_PLAN.md             → Comprehensive development plan
├── PROGRESS_REPORT.md          → Real-time progress tracking
├── GIT_STRATEGY.md             → Git branching and workflow
├── README.md                   → Project overview for repository
│
├── docs/                       → All documentation
│   ├── architecture/
│   │   ├── ARCHITECTURE.md     → System architecture and design
│   │   ├── API_SPEC.md         → API endpoint specifications
│   │   └── DATA_MODELS.md      → Database schemas and models
│   ├── testing/
│   │   ├── TESTING_STRATEGY.md → Testing approach and plans
│   │   └── TEST_CASES.md       → Detailed test scenarios
│   └── design/
│       ├── UI_MOCKUPS.md       → UI/UX designs and flows
│       └── USER_STORIES.md     → User stories and requirements
│
├── mobile-app/                 → React Native mobile application
│   ├── src/
│   │   ├── components/         → Reusable UI components
│   │   ├── screens/            → App screens
│   │   ├── services/           → Audio processing, GPS, API calls
│   │   ├── utils/              → Helper functions
│   │   └── models/             → Data models
│   ├── tests/                  → Mobile app tests
│   └── package.json
│
├── backend/                    → Backend API server (optional Phase 3)
│   ├── src/
│   │   ├── api/                → API routes
│   │   ├── services/           → Business logic
│   │   ├── models/             → Database models
│   │   └── utils/              → Utilities
│   ├── tests/                  → Backend tests
│   └── requirements.txt / package.json
│
├── ml-models/                  → Machine learning components
│   ├── training/               → Model training scripts
│   ├── preprocessing/          → Audio preprocessing
│   ├── models/                 → Trained model files
│   └── evaluation/             → Model performance metrics
│
└── research/                   → Research and prototypes
    ├── audio-samples/          → Collected audio samples
    ├── notebooks/              → Jupyter notebooks for exploration
    └── prototypes/             → Python proof-of-concept scripts

```

---

## 🔑 Key Documentation Files

### **1. Planning & Management**
- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Complete project roadmap with phases, steps, timelines
- **[PROGRESS_REPORT.md](./PROGRESS_REPORT.md)** - Live progress tracking (updated daily/weekly)
- **[GIT_STRATEGY.md](./GIT_STRATEGY.md)** - Git workflow, branching strategy, commit conventions

### **2. Technical Architecture**
- **[docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md)** - System design, data flow, component interaction
- **[docs/architecture/API_SPEC.md](./docs/architecture/API_SPEC.md)** - Backend API endpoints (Phase 3)
- **[docs/architecture/DATA_MODELS.md](./docs/architecture/DATA_MODELS.md)** - Database schemas, data structures

### **3. Testing**
- **[docs/testing/TESTING_STRATEGY.md](./docs/testing/TESTING_STRATEGY.md)** - Testing approach, tools, frameworks
- **[docs/testing/TEST_CASES.md](./docs/testing/TEST_CASES.md)** - Detailed test scenarios and acceptance criteria

### **4. Design & UX**
- **[docs/design/UI_MOCKUPS.md](./docs/design/UI_MOCKUPS.md)** - Screen designs, user flows
- **[docs/design/USER_STORIES.md](./docs/design/USER_STORIES.md)** - User requirements and scenarios

---

## 🛠️ Technology Stack

### **Mobile App (Phase 1 & 2)**
- **Framework:** React Native (cross-platform iOS/Android)
- **Language:** TypeScript
- **Audio Processing:** react-native-audio, expo-av
- **Signal Processing:** Custom FFT implementation or Web Audio API
- **GPS/Location:** react-native-geolocation, expo-location
- **Maps/Heatmap:** react-native-maps, custom heatmap overlay
- **State Management:** React Context API / Redux Toolkit
- **Storage:** AsyncStorage (local data)
- **Testing:** Jest, React Native Testing Library

### **Backend (Phase 3 - Optional)**
- **Server:** Node.js + Express OR Python + FastAPI
- **Database:** PostgreSQL with PostGIS extension (for geospatial data)
- **Real-time:** WebSockets (Socket.io / ws)
- **Authentication:** JWT tokens
- **Deployment:** Railway, Render, or AWS

### **ML/Signal Processing**
- **FFT:** Custom implementation or FFT.js
- **Classification:** TensorFlow Lite / ONNX for on-device inference
- **Training:** Python (scikit-learn, TensorFlow) for model training
- **Feature Extraction:** MFCC, spectral features

---

## 🎯 Core Features

### **MVP Features (Phase 1 & 2)**
1. ✅ Microphone audio capture with permission handling
2. ✅ Real-time decibel measurement
3. ✅ Moving average filter for noise reduction
4. ✅ FFT-based frequency analysis
5. ✅ Noise classification (Quiet: <50dB, Normal: 50-70dB, Noisy: >70dB)
6. ✅ GPS location tagging
7. ✅ Simple map view with current location
8. ✅ Personal noise history (last 24 hours)
9. ✅ Manual location labeling (e.g., "Fenwick Library - 2nd Floor")

### **Advanced Features (Phase 3 - Optional)**
1. 🔄 Backend API for data aggregation
2. 🔄 Campus-wide noise heatmap (crowdsourced data)
3. 🔄 Historical trends (daily/weekly patterns)
4. 🔄 Push notifications ("Library is quiet now!")
5. 🔄 User contributions and ratings
6. 🔄 Social features (share locations with friends)

---

## 📊 Success Metrics

### **Technical Metrics**
- **Audio Sampling Rate:** 44.1 kHz
- **Processing Latency:** < 500ms from capture to classification
- **Battery Impact:** < 5% per hour of continuous monitoring
- **Classification Accuracy:** > 85% on validation dataset
- **GPS Accuracy:** ± 10m outdoors, ± 20m indoors (acceptable)
- **App Size:** < 50 MB

### **User Experience Metrics**
- **App Launch Time:** < 3 seconds
- **Noise Update Frequency:** Every 5-10 seconds
- **Map Load Time:** < 2 seconds
- **Crash Rate:** < 1% (production)

### **Business Metrics**
- **User Adoption:** 50+ students in pilot phase
- **Daily Active Users:** Target 20+ during exam periods
- **Data Quality:** 80%+ valid noise readings
- **User Satisfaction:** 4+ stars average rating

---

## 🚀 Development Phases

### **Phase 0: Research & Prototyping (Week 1-2)**
- Proof-of-concept Python script for audio processing
- Test FFT and classification algorithms
- Collect sample audio data from campus

### **Phase 1: Core Mobile App (Week 3-5)**
- React Native setup and scaffolding
- Microphone access and decibel measurement
- Basic audio processing and classification
- Simple UI with real-time display

### **Phase 2: GPS & Mapping (Week 6-8)**
- GPS integration and location tracking
- Map view with user location
- Local heatmap visualization
- Historical data storage (local)

### **Phase 3: Backend Integration (Week 9-10) - Optional**
- Backend API development
- Multi-user data aggregation
- Campus-wide heatmap
- Real-time updates

### **Phase 4: Testing & Polish (Week 11-12)**
- Comprehensive testing (unit, integration, E2E)
- Performance optimization
- UI/UX refinement
- Bug fixes and stability

### **Phase 5: Deployment (Week 13-14)**
- Beta testing with real users
- App store submission preparation
- Documentation finalization
- Final presentation preparation

---

## 📝 How to Use This Document

### **For New Team Members:**
1. Start here (PROJECT_CONTEXT.md) to understand the big picture
2. Read [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed development steps
3. Check [PROGRESS_REPORT.md](./PROGRESS_REPORT.md) to see current status
4. Review [GIT_STRATEGY.md](./GIT_STRATEGY.md) before committing code

### **For Claude AI Assistant:**
When starting a new session or needing project context:
1. Read this file (PROJECT_CONTEXT.md) first
2. Check [PROGRESS_REPORT.md](./PROGRESS_REPORT.md) for latest status
3. Reference [PROJECT_PLAN.md](./PROJECT_PLAN.md) for next steps
4. Follow [GIT_STRATEGY.md](./GIT_STRATEGY.md) for version control

### **For Code Reviews:**
1. Check that changes align with [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md)
2. Ensure tests are added per [TESTING_STRATEGY.md](./docs/testing/TESTING_STRATEGY.md)
3. Verify Git workflow follows [GIT_STRATEGY.md](./GIT_STRATEGY.md)

---

## 🔗 External Resources

### **Academic References**
- Original project proposal: `C:\Users\srkro\Downloads\annotated-Group_4_Project_Proposal.pdf`

### **Development Tools**
- React Native Docs: https://reactnative.dev/
- Expo Documentation: https://docs.expo.dev/
- FFT.js Library: https://github.com/indutny/fft.js
- React Native Maps: https://github.com/react-native-maps/react-native-maps

### **Research Papers & Resources**
- Audio Classification: ESC-50 dataset
- Urban Sound Analysis: UrbanSound8K
- FFT Basics: https://en.wikipedia.org/wiki/Fast_Fourier_transform

---

## 📞 Team Communication

### **Primary Channels**
- Email: Group mailing list (TBD)
- Git Issues: For bug tracking and feature requests
- Pull Requests: For code reviews

### **Meeting Schedule**
- Weekly Sprint Planning: TBD
- Daily Standups: TBD (optional)
- Sprint Reviews: End of each phase

---

## 🔄 Update Log

| Date       | Version | Changes                              | Updated By |
|------------|---------|--------------------------------------|------------|
| 2025-10-14 | 1.0.0   | Initial project context created      | Claude AI  |

---

## ⚡ Quick Start Commands

```bash
# Clone the repository
git clone <repository-url>
cd INFS

# Read the master plan
cat PROJECT_PLAN.md

# Check current progress
cat PROGRESS_REPORT.md

# Set up mobile app development
cd mobile-app
npm install
npx react-native run-android  # or run-ios

# Run tests
npm test

# Check Git strategy
cat GIT_STRATEGY.md
```

---

**Next Steps:**
1. Review [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed roadmap
2. Check [PROGRESS_REPORT.md](./PROGRESS_REPORT.md) to see what's been done
3. Set up development environment per Phase 0 instructions
4. Start with proof-of-concept Python prototype

---

**🎓 Academic Project Notice**
This is a semester project for George Mason University. All development should prioritize learning, documentation, and demonstrable results suitable for academic evaluation.
