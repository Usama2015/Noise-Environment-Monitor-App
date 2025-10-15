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
├── DEVELOPMENT_LOG.md          → Detailed step-by-step development journal
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
- **[DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)** - Detailed development journal (commands, decisions, learnings)
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
3. Review [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md) to see what was done and how
4. Reference [PROJECT_PLAN.md](./PROJECT_PLAN.md) for next steps
5. Follow [GIT_STRATEGY.md](./GIT_STRATEGY.md) for version control
6. **Update [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)** after completing work

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
| 2025-10-15 | 1.1.0   | Added Git Workflow Protocol section  | Claude AI  |

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

---

## 🤖 SDETeam AI Agents Integration

**Location:** `D:\OtherDevelopment\SDETeam\agents\`

This project leverages the SDETeam framework - a collection of 40+ specialized AI agents for accelerated development. All agents are available in the SDETeam directory.

### **How to Use SDETeam Agents**

**At the start of EVERY Claude session:**
1. Read the available agents from `D:\OtherDevelopment\SDETeam\agents\README.md`
2. Understand which agents are available for each task
3. Use the appropriate agent via the Task tool for specialized work

**Agent Categories Available:**

| Category | Agents | When to Use |
|----------|--------|-------------|
| **Engineering** | rapid-prototyper, frontend-developer, backend-architect, mobile-app-builder, ai-engineer, devops-automator, test-writer-fixer | Mobile app development, API building, testing |
| **Design** | ui-designer, ux-researcher, brand-guardian, visual-storyteller, whimsy-injector | UI/UX design, component design |
| **Product** | sprint-prioritizer, trend-researcher, feedback-synthesizer | Feature planning, user research |
| **Testing** | api-tester, performance-benchmarker, test-results-analyzer | Testing, optimization |
| **Orchestration** | agent-orchestrator, shared-context, capability-matrix | Complex multi-step tasks |
| **Project Management** | project-shipper, studio-producer, experiment-tracker | Deployment, coordination |

### **Agent Usage Examples for This Project**

**Phase 1 (Mobile App):**
- Use `@mobile-app-builder` for React Native setup and scaffolding
- Use `@frontend-developer` for UI component implementation
- Use `@ui-designer` for screen layouts and design decisions
- Use `@test-writer-fixer` for unit test creation

**Phase 2 (GPS & Mapping):**
- Use `@mobile-app-builder` for GPS integration
- Use `@frontend-developer` for map component implementation
- Use `@ui-designer` for heatmap visualization design

**Phase 3 (ML & Backend):**
- Use `@ai-engineer` for ML model integration
- Use `@backend-architect` for API design and implementation
- Use `@devops-automator` for deployment setup

**Complex Tasks:**
- Use `@agent-orchestrator` for multi-step workflows requiring multiple agents
- Use Task tool with `general-purpose` agent for research and validation tasks

### **Best Practices for Agent Use**

1. **Always check agent availability** before starting work
2. **Use specialized agents** for their domain expertise
3. **Use agent-orchestrator** for coordinating multiple agents
4. **Document agent usage** in DEVELOPMENT_LOG.md
5. **Parallel execution** when tasks are independent (multiple Task calls in one message)

**Command to see all agents:**
```bash
ls D:\OtherDevelopment\SDETeam\agents\
cat D:\OtherDevelopment\SDETeam\agents\README.md
```

---

## 📝 Automatic Documentation Update Protocol

**IMPORTANT:** After completing ANY development iteration, the following files MUST be updated automatically by Claude:

### **Files to Update After Each Development Session**

#### **1. DEVELOPMENT_LOG.md** (MANDATORY - Always Update)

**When:** After EVERY coding session or task completion

**What to add:**
- New session entry with date/time
- Activity description with commands executed
- Files created/modified with purposes
- Decisions made with reasoning
- Issues encountered and solutions
- Code snippets for key implementations
- Performance metrics or test results
- Next steps

**Template:**
```markdown
## YYYY-MM-DD

### Session X: [Brief Title]

**Time:** [Morning/Afternoon/Evening]
**Phase:** [Phase number - description]
**Team Member:** [Who worked on this]

#### Activity X: [What was done]

**What was done:**
- Bullet points

**Commands executed:**
```bash
npm install package-name
```

**Files created/modified:**
- path/to/file.ts - Purpose and key features

**Decisions made:**
- Why choice X over Y

**Issues encountered:**
- Error/problem
- How it was solved

### Session Summary
- Time spent
- Accomplishments
- Key learnings
- Next steps
```

---

#### **2. PROGRESS_REPORT.md** (Update Weekly or After Major Milestones)

**When:**
- End of each week
- After completing a phase
- After major milestone achievement

**What to update:**
- Current phase status in summary table
- Weekly progress log entry
- Current sprint backlog
- Metrics (features complete, test coverage, etc.)
- Blockers (if any)
- Test results summary

**Sections to update:**
1. Phase Status Summary table
2. Weekly Progress Log (add new week)
3. Current Sprint Details
4. Metrics & KPIs tables
5. Blockers & Issues (if applicable)

---

#### **3. README.md** (Update After Major Feature Additions)

**When:**
- New major feature implemented
- Tech stack changes
- Installation steps change
- New dependencies added

**What to update:**
- Features list (if new features added)
- Installation instructions (if dependencies changed)
- Quick start commands (if setup changed)
- Project status badges

---

#### **4. Git Commit & Branch** (MANDATORY After Each Session)

**When:** After completing any coding work

**What to do:**
1. Stage changes: `git add .`
2. Commit with conventional commit message:
   ```bash
   git commit -m "feat(audio): implement FFT processor"
   # or
   git commit -m "fix(gps): resolve null location crash"
   # or
   git commit -m "docs: update development log for session X"
   ```
3. Push to current branch: `git push origin <branch-name>`

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore

---

#### **5. Additional Files (Update As Needed)**

**docs/architecture/ARCHITECTURE.md:**
- When: System architecture changes
- What: Update diagrams, data flow, component descriptions

**docs/testing/TESTING_STRATEGY.md:**
- When: New testing approaches added
- What: Update test plans, add new test cases

**PROJECT_PLAN.md:**
- When: Timeline changes, phase adjustments
- What: Update milestones, deliverables, timelines

---

### **Automated Update Checklist (Copy This for Each Session)**

After completing development work, Claude should:

- [ ] **DEVELOPMENT_LOG.md** - Add session entry with all details
- [ ] **PROGRESS_REPORT.md** - Update if weekly or milestone reached
- [ ] **Git Commit** - Commit changes with conventional message
- [ ] **README.md** - Update if major features/deps changed
- [ ] **TODO List** - Update via TodoWrite tool
- [ ] **Architecture docs** - Update if system design changed
- [ ] **Testing docs** - Update if tests added

---

### **Quick Update Commands**

```bash
# After coding session:
git add .
git commit -m "type(scope): what was done"
git push origin <branch-name>

# Verify updates:
git log -1
git status
```

---

### **Documentation Quality Standards**

When updating documentation:
1. **Be specific** - Include exact commands, file paths, versions
2. **Explain why** - Not just what, but reasoning behind decisions
3. **Include outputs** - Show command results, error messages
4. **Link commits** - Reference git commit hashes where relevant
5. **Be chronological** - Maintain time-based order in logs
6. **Be complete** - Don't skip "obvious" steps

---

### **Example: Complete Update Flow**

**After implementing audio capture feature:**

1. **Update DEVELOPMENT_LOG.md:**
```markdown
## 2025-10-15
### Session 3: Audio Capture Implementation
**Commands:** npm install react-native-audio
**Files:** src/services/AudioService.ts
**Decisions:** Chose react-native-audio over expo-av for better control
```

2. **Update TODO list:**
```typescript
TodoWrite: Mark "Implement microphone audio capture" as completed
```

3. **Commit to Git:**
```bash
git add .
git commit -m "feat(audio): implement microphone capture with react-native-audio

- Add AudioService.ts for audio recording
- Request microphone permissions
- Extract audio samples as Float32Array
- Handle permission denial gracefully

Closes #5"
git push origin feature/audio-capture
```

4. **Update PROGRESS_REPORT.md** (if end of week):
```markdown
### Week 3
**Completed:**
- ✅ Audio capture implementation
**In Progress:**
- 🔄 Decibel calculation
```

---

**This ensures all documentation stays synchronized with development progress and provides complete traceability.**

---

## 🌿 Git Workflow Protocol

**MANDATORY:** All development work MUST follow the Git Flow workflow defined in [GIT_STRATEGY.md](./GIT_STRATEGY.md).

### **Critical Git Rules**

**NEVER commit directly to `main` or `develop` branches** (except for minor documentation fixes on develop).

**ALWAYS use feature branches** for ALL development work, including:
- Phase work (e.g., `phase/0-research`, `phase/1-core-app`)
- Features (e.g., `feature/audio-capture`, `feature/gps-integration`)
- Bug fixes (e.g., `bugfix/decibel-calculation-error`)
- Experiments (e.g., `experiment/new-fft-algorithm`)

### **Proper Workflow for Each Phase**

#### **Phase 0 Example:**
```bash
# Start Phase 0
git checkout develop
git pull origin develop
git checkout -b phase/0-research

# Do all Phase 0 work in this branch
# - Create prototypes
# - Generate samples
# - Train classifier
# Commit frequently with conventional commits

# When Phase 0 is complete
git checkout develop
git merge phase/0-research
git push origin develop
git branch -d phase/0-research  # Delete local branch
```

#### **Phase 1 Example (with feature branches):**
```bash
# Start Phase 1
git checkout develop
git checkout -b phase/1-core-app

# For each step in Phase 1, create feature branch
git checkout -b feature/audio-capture  # From phase/1-core-app

# Work on feature
git add .
git commit -m "feat(audio): implement microphone capture"
git push origin feature/audio-capture

# Merge feature back to phase branch
git checkout phase/1-core-app
git merge feature/audio-capture
git branch -d feature/audio-capture

# Repeat for other features...

# When Phase 1 complete
git checkout develop
git merge phase/1-core-app
git push origin develop
```

### **Commit Message Requirements**

**ALWAYS use Conventional Commits format:**

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

**Examples:**
```bash
git commit -m "feat(audio): implement FFT processor"
git commit -m "fix(gps): handle null location gracefully"
git commit -m "docs: update development log for session 3"
git commit -m "test(classifier): add unit tests for classification"
git commit -m "chore(deps): update react-native to 0.72.5"
```

### **Before Starting ANY New Work**

**Checklist:**
1. **Check current branch:** `git branch` (should NOT be on main/develop)
2. **Read GIT_STRATEGY.md:** Review branching strategy
3. **Create appropriate branch:**
   - For new phase: `git checkout -b phase/X-name`
   - For feature: `git checkout -b feature/name`
   - For bugfix: `git checkout -b bugfix/name`
4. **Verify you're on correct branch:** `git status`

### **After Completing Work**

**Checklist:**
1. **Stage changes:** `git add .` or `git add <specific-files>`
2. **Commit with conventional message:** `git commit -m "type(scope): description"`
3. **Push to remote:** `git push origin <branch-name>`
4. **Update DEVELOPMENT_LOG.md** with session details
5. **Merge to parent branch** when feature/phase is complete

### **Quick Reference Commands**

```bash
# Check current branch
git branch

# See all branches
git branch -a

# Check working directory status
git status

# Create and switch to new branch
git checkout -b <branch-name>

# Switch to existing branch
git checkout <branch-name>

# Commit with message
git commit -m "type(scope): description"

# Push to remote
git push origin <branch-name>

# Merge branch
git checkout target-branch
git merge source-branch

# Delete branch (after merge)
git branch -d <branch-name>
```

### **Common Mistakes to Avoid**

❌ **DON'T:**
- Commit directly to `main` or `develop`
- Use vague commit messages ("fix bug", "update code")
- Skip branch creation for new features
- Force push to shared branches
- Commit without testing

✅ **DO:**
- Create feature/phase branches for all work
- Write descriptive conventional commit messages
- Test before committing
- Push regularly to backup work
- Merge completed work back to develop

### **Git Safety Net**

If you realize you're on the wrong branch:
```bash
# DON'T PANIC!
# Check what branch you're on
git branch

# If you haven't committed yet, stash changes
git stash

# Switch to correct branch
git checkout correct-branch

# Apply stashed changes
git stash pop
```

### **Enforcement**

Claude AI Assistant MUST:
1. **Check current Git branch** before starting work
2. **Create appropriate branch** if not already on one
3. **Use conventional commits** for ALL commits
4. **Document Git operations** in DEVELOPMENT_LOG.md
5. **Follow Git Flow workflow** as defined in GIT_STRATEGY.md

**Failure to follow Git workflow will result in messy history and difficulty tracking changes.**

---

**For complete Git workflow details, see [GIT_STRATEGY.md](./GIT_STRATEGY.md).**
