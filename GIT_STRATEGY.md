# Git Strategy - Campus Noise Monitor

**Project:** Campus Noise Monitor (Firebase Cloud-First Edition)
**Last Updated:** December 3, 2025
**Branching Model:** GitFlow (modified for academic project)
**Status:** PROJECT COMPLETE - v1.0.0 Released

---

## 🌳 Branch Structure

### **Permanent Branches**

#### **1. `main`** (Production)
- **Purpose:** Stable, demo-ready code
- **Protection:** Requires pull request + review
- **Deployments:** Final demo, presentation
- **Naming:** `main`
- **Merge From:** `develop` only
- **Status:** ✅ Contains v1.0.0 release

#### **2. `develop`** (Integration)
- **Purpose:** Integration branch for completed features
- **Protection:** Requires pull request
- **Testing:** All unit tests must pass
- **Naming:** `develop`
- **Merge From:** Phase branches
- **Status:** ✅ Synced with main

---

### **Temporary Branches**

#### **Phase Branches** (Feature Branches)
- **Purpose:** Major development phases
- **Lifetime:** Duration of phase (1-2 weeks)
- **Naming Convention:** `phase/<number>-<description>`

**Actual Implementation Note:**
For this project, all phases were consolidated into a single branch `phase/1-core-app` for efficiency. This simplified the workflow while maintaining proper commit history.

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
**Status:** Complete and merged

**Steps (as commits):**
```
✅ feat(audio): implement AudioService with react-native-sound-level
✅ fix(audio): correct dB calibration (dBFS → SPL with +110 offset)
✅ feat(audio): implement NoiseClassifier with IEC 61672 compliance
✅ feat(ui): add real-time dB display to HomeScreen
✅ test(audio): add unit tests for AudioService
```

---

### **Phase 1B: Firebase Integration** ✅ COMPLETED
**Branch:** `phase/1-core-app` (consolidated)
**Status:** Complete and merged

**Steps:**
```
✅ chore(deps): install Firebase dependencies
✅ refactor(types): update for Firestore (NoiseReadingDocument, etc.)
✅ feat(constants): add campus locations
✅ feat(firebase): implement AuthService with anonymous auth
✅ feat(firebase): implement StorageService with Firestore integration
✅ chore(firebase): add google-services.json configuration
✅ refactor(audio): integrate Firebase upload for noise readings
✅ feat(ui): add building/room location picker to HomeScreen
✅ fix(e2e): Phase 1B E2E testing fixes (crypto polyfill, auth, calibration)
```

---

### **Phase 2: Map Visualization** ✅ COMPLETED
**Branch:** `phase/1-core-app` (consolidated)
**Status:** Complete and merged

**Steps:**
```
✅ feat(map): create MapScreen component with Google Maps
✅ feat(map): implement colored circle markers based on dB level
✅ feat(map): add real-time Firestore subscription
✅ feat(nav): add bottom tab navigation (Monitor | Campus Map)
✅ feat(map): add legend showing noise level colors
```

---

### **Phase 3: Testing & Polish** ✅ COMPLETED
**Branch:** `phase/1-core-app` (consolidated)
**Status:** Complete and merged

**Steps:**
```
✅ feat(heatmap): add time decay system for noise data
✅ feat(ui): add time window slider (1-60 minutes)
✅ chore(scripts): add Firebase test data population script
✅ fix(map): replace heatmap with colored circles based on dB level
✅ style(ui): polish HomeScreen and MapScreen UI (Material Design)
✅ chore: code cleanup (remove console.logs, fix TypeScript warnings)
✅ docs: update README with Firebase setup instructions
```

---

### **Phase 4: Deployment & Demo** ✅ COMPLETED
**Branch:** `phase/1-core-app` → `develop` → `main`
**Status:** Complete - v1.0.0 Released

**Steps:**
```
✅ docs(demo): add demo script and preparation guide
✅ build: create release APK (68 MB)
✅ test: verify release build on physical device
✅ git tag v1.0.0: tag release version
✅ docs: final documentation updates
```

**Final Merge:**
```bash
# Merged phase/1-core-app → develop → main
git checkout develop
git merge phase/1-core-app
git checkout main
git merge develop
git tag -a v1.0.0 -m "v1.0.0 - Campus Noise Monitor Release"
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
git commit -m "fix(audio): correct dB calibration offset to +110"
git commit -m "test(audio): add unit tests for NoiseClassifier"
git commit -m "docs(readme): update installation instructions"

# Bad commits:
git commit -m "updates"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## 🔄 Final Workflow Diagram

```
main (production) ─────────────────────────────────────── v1.0.0 ✅
  │
  └─── develop (integration) ──────────────────────────── synced ✅
         │
         └─── phase/1-core-app (all phases consolidated) ─ complete ✅
                │
                ├─── Phase 1A: Core Audio Monitoring ✅
                │      ├─── AudioService implementation
                │      ├─── dB calibration (+110 offset)
                │      └─── NoiseClassifier (IEC 61672)
                │
                ├─── Phase 1B: Firebase Integration ✅
                │      ├─── AuthService (anonymous auth)
                │      ├─── StorageService (Firestore)
                │      └─── Location picker UI
                │
                ├─── Phase 2: Map Visualization ✅
                │      ├─── MapScreen with Google Maps
                │      ├─── Colored circle markers
                │      └─── Tab navigation
                │
                ├─── Phase 3: Testing & Polish ✅
                │      ├─── Time decay system
                │      ├─── Time window slider
                │      └─── UI polish (Material Design)
                │
                └─── Phase 4: Deployment & Demo ✅
                       ├─── Demo script
                       ├─── Release APK build
                       └─── v1.0.0 tag
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

**Planned Tags:**
- `v1.0-phase1a` - Phase 1A complete (Audio monitoring)
- `v2.0-firebase` - Phase 1B + 2 complete (Firebase + Map)
- `v3.0-beta` - Phase 3 complete (Testing & Polish)
- `v1.0.0-release` - Final demo version

**Actual Tags Created:**
- `v1.0.0` ✅ - Final release (all phases complete)

**Create Tags:**
```bash
git tag -a v1.0.0 -m "v1.0.0 - Campus Noise Monitor Release"
git push origin v1.0.0
```

---

## 📊 Final Status

### **Branches:**
```
main              → Production (v1.0.0) ✅
develop           → Integration (synced with main) ✅
phase/1-core-app  → All phases complete, merged ✅
```

### **Tags:**
```
v1.0.0            → Final release ✅
```

### **Key Commits (Recent):**
```
f9371e7 docs: add final session summary and update progress report
d142fb9 docs: mark project complete - v1.0.0 release
4513adf docs(demo): add demo script and preparation guide (Step 4-1)
9983ee7 docs: update main README with detailed setup instructions
4a96bb7 docs(workflow): mark Step 3-4 complete, Phase 3 done
```

---

## 🚀 Quick Commands (Reference)

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

## 📌 Project Complete

**Final Status:** PROJECT COMPLETE - v1.0.0 Released

**All Phases Complete:**
- ✅ Phase 1A: Core Audio Monitoring
- ✅ Phase 1B: Firebase Integration
- ✅ Phase 2: Map Visualization
- ✅ Phase 3: Testing & Polish
- ✅ Phase 4: Deployment & Demo

**All Branches Synced:**
- ✅ `phase/1-core-app` → `develop` → `main`

**Release Tag:**
- ✅ `v1.0.0` created and pushed

---

**Last Updated:** December 3, 2025
**Project Status:** COMPLETE
**Version:** v1.0.0
