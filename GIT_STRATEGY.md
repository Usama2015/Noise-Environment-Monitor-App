# Git Strategy - Campus Noise Monitor

**Project:** Campus Noise Monitor (Firebase Cloud-First Edition)
**Last Updated:** November 29, 2025
**Branching Model:** GitFlow (modified for academic project)

---

## 🌳 Branch Structure

### **Permanent Branches**

#### **1. `main`** (Production)
- **Purpose:** Stable, demo-ready code
- **Protection:** Requires pull request + review
- **Deployments:** Final demo, presentation
- **Naming:** `main`
- **Merge From:** `develop` only

#### **2. `develop`** (Integration)
- **Purpose:** Integration branch for completed features
- **Protection:** Requires pull request
- **Testing:** All unit tests must pass
- **Naming:** `develop`
- **Merge From:** Phase branches

---

### **Temporary Branches**

#### **Phase Branches** (Feature Branches)
- **Purpose:** Major development phases
- **Lifetime:** Duration of phase (1-2 weeks)
- **Naming Convention:** `phase/<number>-<description>`
- **Examples:**
  - `phase/1-core-app` ✅ (Current - Phase 1A complete)
  - `phase/2-firebase-integration` (Phase 1B + 2)
  - `phase/3-testing-polish`
  - `phase/4-demo-prep`

**Workflow:**
```bash
# Create phase branch from develop
git checkout develop
git pull origin develop
git checkout -b phase/2-firebase-integration

# Work on phase...
git add .
git commit -m "feat(firebase): implement AuthService"

# Push to remote
git push -u origin phase/2-firebase-integration

# When phase complete, merge to develop
git checkout develop
git merge phase/2-firebase-integration
git push origin develop
```

#### **Step Branches** (Sub-feature Branches)
- **Purpose:** Individual implementation steps within a phase
- **Lifetime:** 1-3 days
- **Naming Convention:** `step/<phase>-<step-number>-<description>`
- **Examples:**
  - `step/1b-1-auth-service`
  - `step/1b-2-storage-service`
  - `step/2-1-map-screen`
  - `step/2-2-heatmap`

**Workflow:**
```bash
# Create step branch from phase branch
git checkout phase/2-firebase-integration
git checkout -b step/2-1-map-screen

# Work on specific step...
git add .
git commit -m "feat(map): create MapScreen component"

# Push to remote
git push -u origin step/2-1-map-screen

# When step complete, merge to phase branch
git checkout phase/2-firebase-integration
git merge step/2-1-map-screen
git push origin phase/2-firebase-integration

# Delete step branch
git branch -d step/2-1-map-screen
git push origin --delete step/2-1-map-screen
```

#### **Hotfix Branches**
- **Purpose:** Critical bug fixes
- **Lifetime:** Hours
- **Naming Convention:** `hotfix/<description>`
- **Branch From:** `develop` or `main`
- **Merge To:** `develop` and `main`

---

## 📋 Phase-Based Git Workflow

### **Phase 1A: Core Audio Monitoring** ✅ COMPLETED
**Branch:** `phase/1-core-app`
**Status:** Merged to develop

**Steps (as commits):**
```
✅ step/1a-1-audio-service → feat(audio): implement AudioService with react-native-sound-level
✅ step/1a-2-calibration → fix(audio): correct dB calibration (dBFS → SPL)
✅ step/1a-3-classifier → feat(audio): implement NoiseClassifier
✅ step/1a-4-ui → feat(ui): add real-time dB display to HomeScreen
✅ step/1a-5-testing → test(audio): add unit tests for AudioService
```

**Merge to develop:**
```bash
git checkout develop
git merge phase/1-core-app
git tag v1.0-phase1a
git push origin develop --tags
```

---

### **Phase 1B + 2: Firebase Integration & Map** 🔄 IN PROGRESS
**Branch:** `phase/2-firebase-integration`
**Status:** 60% complete

**Steps:**

#### **Phase 1B: Firebase Services**
```
✅ step/1b-1-dependencies → chore(deps): install Firebase dependencies
✅ step/1b-2-types → refactor(types): update for Firestore
✅ step/1b-3-locations → feat(constants): add campus locations
✅ step/1b-4-auth → feat(firebase): implement AuthService
✅ step/1b-5-storage → feat(firebase): implement StorageService
⏳ step/1b-6-firebase-setup → chore(firebase): add google-services.json
⏳ step/1b-7-audio-refactor → refactor(audio): integrate Firebase upload
⏳ step/1b-8-location-picker → feat(ui): add building/room picker to HomeScreen
```

#### **Phase 2: Map Visualization**
```
⏳ step/2-1-map-screen → feat(map): create MapScreen component
⏳ step/2-2-heatmap → feat(map): implement heatmap overlay
⏳ step/2-3-realtime → feat(map): add real-time Firestore subscription
⏳ step/2-4-navigation → feat(nav): add bottom tab navigation
```

**Testing checkpoints:**
- After step/1b-7: Unit test AudioService Firebase upload
- After step/1b-8: Integration test full monitor flow
- After step/2-3: Multi-device sync test

**Merge to develop:**
```bash
git checkout develop
git merge phase/2-firebase-integration
git tag v2.0-firebase
git push origin develop --tags
```

---

### **Phase 3: Testing & Polish** 🔲 NOT STARTED
**Branch:** `phase/3-testing-polish`

**Steps:**
```
⏳ step/3-1-multi-device → test(integration): multi-device sync testing
⏳ step/3-2-ui-polish → style(ui): improve HomeScreen and MapScreen
⏳ step/3-3-error-handling → feat(ui): add error states and loading indicators
⏳ step/3-4-battery-test → test(perf): measure battery consumption
⏳ step/3-5-e2e → test(e2e): end-to-end user journey
```

**Merge to develop:**
```bash
git checkout develop
git merge phase/3-testing-polish
git tag v3.0-beta
git push origin develop --tags
```

---

### **Phase 4: Deployment & Demo** 🔲 NOT STARTED
**Branch:** `phase/4-demo-prep`

**Steps:**
```
⏳ step/4-1-demo-data → feat(demo): add demo mode with sample data
⏳ step/4-2-presentation → docs(demo): create presentation materials
⏳ step/4-3-rehearsal → test(demo): demo rehearsal and fixes
⏳ step/4-4-final-polish → style(ui): final UI tweaks
```

**Merge to main:**
```bash
git checkout main
git merge develop
git tag v1.0.0-release
git push origin main --tags
```

---

## 📝 Commit Message Convention

### **Format:**
```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### **Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring (no functional change)
- `style`: Formatting, styling (no code change)
- `test`: Adding or updating tests
- `docs`: Documentation only
- `chore`: Build process, dependencies, configs
- `perf`: Performance improvements

### **Scopes:**
- `audio`: AudioService, NoiseClassifier
- `firebase`: Auth, Storage, Firestore
- `ui`: HomeScreen, MapScreen, components
- `map`: Map, heatmap, location
- `nav`: Navigation, tabs
- `types`: TypeScript interfaces
- `deps`: Dependencies
- `test`: Testing files

### **Examples:**
```bash
# Good commits:
git commit -m "feat(firebase): implement AuthService with anonymous auth"
git commit -m "fix(audio): correct dB calibration offset to +56"
git commit -m "test(audio): add unit tests for NoiseClassifier"
git commit -m "docs(readme): update installation instructions"

# Bad commits:
git commit -m "updates"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## 🔄 Workflow Diagram

```
main (production)
  │
  └─── develop (integration)
         │
         ├─── phase/1-core-app ✅
         │      ├─── step/1a-1-audio-service
         │      ├─── step/1a-2-calibration
         │      └─── step/1a-3-classifier
         │
         ├─── phase/2-firebase-integration 🔄
         │      ├─── step/1b-1-dependencies ✅
         │      ├─── step/1b-2-types ✅
         │      ├─── step/1b-3-locations ✅
         │      ├─── step/1b-4-auth ✅
         │      ├─── step/1b-5-storage ✅
         │      ├─── step/1b-6-firebase-setup ⏳
         │      ├─── step/1b-7-audio-refactor ⏳
         │      ├─── step/2-1-map-screen ⏳
         │      └─── step/2-2-heatmap ⏳
         │
         ├─── phase/3-testing-polish 🔲
         │
         └─── phase/4-demo-prep 🔲
```

---

## 🧪 Testing at Each Level

### **Step-Level Testing (Unit Tests)**
- **When:** Before merging step branch to phase branch
- **Scope:** Individual functions/methods
- **Tool:** Jest
- **Example:**
  ```bash
  # On step/1b-4-auth branch
  npm test AuthService.test.ts
  # All tests pass → merge to phase branch
  ```

### **Phase-Level Testing (Integration Tests)**
- **When:** Before merging phase branch to develop
- **Scope:** Multiple components working together
- **Tool:** Jest + React Native Testing Library
- **Example:**
  ```bash
  # On phase/2-firebase-integration branch
  npm test -- --testPathPattern=integration
  # All integration tests pass → merge to develop
  ```

### **Develop-Level Testing (End-to-End Tests)**
- **When:** Before merging develop to main
- **Scope:** Complete user journeys
- **Tool:** Manual testing + Detox (optional)
- **Example:**
  ```bash
  # On develop branch
  npm run test:e2e
  # All E2E tests pass → merge to main
  ```

---

## 🎯 Pull Request Template

**Title:** `[PHASE X] <Description>`

**Template:**
```markdown
## Phase/Step
- [ ] Phase 1B: Firebase Integration
- [ ] Step: step/1b-4-auth

## What Changed
- Implemented AuthService with anonymous authentication
- Added signInAnonymously() method
- Added getUserId() and isSignedIn() helpers

## Testing Done
- [ ] Unit tests pass (npm test)
- [ ] Manual testing complete
- [ ] No console errors
- [ ] Tested on physical device

## Screenshots
[Add screenshots if UI changes]

## Checklist
- [ ] Code follows TypeScript best practices
- [ ] No hardcoded values (use constants)
- [ ] Error handling added
- [ ] Console logs added for debugging
- [ ] Documentation updated (if needed)

## Related Issues
Closes #X (if applicable)
```

---

## 🏷️ Tagging Strategy

### **Version Format:** `vX.Y.Z-<label>`

**Examples:**
- `v1.0-phase1a` - Phase 1A complete (Audio monitoring)
- `v2.0-firebase` - Phase 1B + 2 complete (Firebase + Map)
- `v3.0-beta` - Phase 3 complete (Testing & Polish)
- `v1.0.0-release` - Final demo version

**Create Tags:**
```bash
git tag -a v2.0-firebase -m "Phase 2 complete: Firebase integration and map visualization"
git push origin v2.0-firebase
```

---

## 📊 Current Status

### **Branches:**
```
main              → Production (stable)
develop           → Integration (latest stable features)
phase/1-core-app  → Completed, merged ✅
phase/2-firebase-integration → In progress 🔄 (60%)
```

### **Recent Commits:**
```
ddf8ab2 chore(deps): remove react-native-audio-recorder-player
fae14c2 chore(deps): add expo-av for audio recording
b4fbff5 fix(android): add Android 14 foreground service permissions
9d30fea docs: update all documentation for IEC 61672 compliance
94de710 feat(audio): implement IEC 61672 compliant 1-second classification window
```

---

## 🚀 Quick Commands

### **Start New Phase:**
```bash
git checkout develop
git pull origin develop
git checkout -b phase/X-description
git push -u origin phase/X-description
```

### **Start New Step:**
```bash
git checkout phase/X-description
git checkout -b step/X-Y-description
# Work on step...
git add .
git commit -m "feat(scope): description"
git push -u origin step/X-Y-description
```

### **Complete Step:**
```bash
# Run tests
npm test

# Merge to phase branch
git checkout phase/X-description
git merge step/X-Y-description
git push origin phase/X-description

# Delete step branch
git branch -d step/X-Y-description
git push origin --delete step/X-Y-description
```

### **Complete Phase:**
```bash
# Run integration tests
npm test -- --testPathPattern=integration

# Merge to develop
git checkout develop
git merge phase/X-description
git tag vX.0-label
git push origin develop --tags

# Delete phase branch (optional - keep for reference)
# git branch -d phase/X-description
# git push origin --delete phase/X-description
```

---

**Last Updated:** November 29, 2025
**Current Branch:** `phase/1-core-app` (completed)
**Next Branch:** `phase/2-firebase-integration` (to be created)
