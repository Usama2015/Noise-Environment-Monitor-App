# Development Workflow - Campus Noise Monitor

**Project:** Campus Noise Monitor
**Last Updated:** November 29, 2025
**Purpose:** Automated workflow checklist for Claude Code

---

## 🤖 How Claude Should Follow This Workflow

**IMPORTANT:** At the start of EVERY development session, Claude should:
1. Read this file: `DEVELOPMENT_WORKFLOW.md`
2. Check current phase/step status
3. Follow the checklist for the current step
4. Update documentation when changes occur
5. Run tests before moving to next step

---

## 🎯 SDETeam Agent Integration

**Agent Location:** `D:\OtherDevelopment\SDETeam\agents\`

**IMPORTANT:** Claude should leverage SDETeam agents for specialized tasks when appropriate.

### **Available Agents for This Project:**

#### **Engineering Agents** (`engineering/`)
- **mobile-app-builder** - React Native mobile app development
- **frontend-developer** - UI/UX implementation
- **test-writer-fixer** - Unit and integration test creation
- **api-integrator** - Third-party service integration (Firebase)
- **rapid-prototyper** - MVP and prototype development
- **security-auditor** - Security vulnerability checks

#### **Testing Agents** (`testing/`)
- **api-tester** - API endpoint testing (Firebase)
- **performance-benchmarker** - Performance and battery testing
- **test-results-analyzer** - Test failure pattern analysis
- **workflow-optimizer** - Development workflow optimization

#### **Project Management Agents** (`project-management/`)
- **experiment-tracker** - Feature validation and A/B testing
- **project-shipper** - Launch and deployment coordination
- **studio-producer** - Sprint management and coordination

### **When to Use Agents (Step-by-Step):**

**Step 1B-7 (Refactor AudioService):**
```
[ ] Consider: @mobile-app-builder for React Native-specific refactoring
[ ] Consider: @api-integrator for Firebase integration patterns
[ ] Use: @test-writer-fixer to create/update tests after changes
```

**Step 1B-8 (Location Picker UI):**
```
[ ] Consider: @frontend-developer for UI component implementation
[ ] Consider: @mobile-app-builder for React Native Picker integration
[ ] Use: @test-writer-fixer for component testing
```

**Step 2-1 (MapScreen):**
```
[ ] Consider: @frontend-developer for map UI implementation
[ ] Consider: @mobile-app-builder for react-native-maps integration
[ ] Use: @test-writer-fixer for map component testing
```

**Step 2-2 (Heatmap):**
```
[ ] Consider: @frontend-developer for heatmap visualization
[ ] Consider: @api-integrator for Firebase real-time subscription
[ ] Use: @performance-benchmarker to test map performance
```

**Phase Completion Testing:**
```
[ ] Use: @test-results-analyzer to analyze test suite
[ ] Use: @performance-benchmarker for battery/performance tests
[ ] Use: @api-tester for Firebase integration testing
[ ] Use: @security-auditor before merging to develop
```

**Demo Preparation:**
```
[ ] Use: @project-shipper for deployment coordination
[ ] Use: @workflow-optimizer to streamline demo workflow
```

### **Agent Invocation Examples:**

**Explicit Agent Request:**
```bash
"@mobile-app-builder implement the location picker UI using React Native Picker"
"@api-integrator integrate Firebase Firestore real-time subscriptions"
"@test-writer-fixer create unit tests for AuthService"
"@security-auditor review Firebase security rules and data model"
```

**Parallel Agent Execution (3-4 max):**
```bash
# Run these in parallel when independent:
"@frontend-developer create MapScreen component"
"@test-writer-fixer write integration tests for Phase 1B"
"@api-tester test Firebase Firestore connections"
```

**Agent for Complex Coordination:**
```bash
# When multiple agents needed:
"@agent-orchestrator coordinate Phase 2 implementation: MapScreen + Heatmap + Tab Navigation"
```

### **Agent Decision Tree:**

```
Task Type?
├─ Complex Feature (multi-step) → @agent-orchestrator
├─ UI Component → @frontend-developer or @mobile-app-builder
├─ API Integration → @api-integrator
├─ Testing → @test-writer-fixer
├─ Performance → @performance-benchmarker
├─ Security Review → @security-auditor
└─ Simple Task → Claude (no agent needed)
```

### **When NOT to Use Agents:**

- Simple edits (changing a variable, fixing typo)
- Reading/understanding code
- Git operations
- Documentation updates
- Following existing checklists
- Tasks Claude can do directly

### **Agent Usage Protocol:**

```
1. Identify if task needs specialized expertise
2. Check which agent is most appropriate
3. Invoke agent explicitly: @agent-name [task]
4. Review agent's work
5. Integrate into workflow
6. Update documentation
```

---

## 📍 Current Status (Auto-Update This Section)

**Current Phase:** Phase 3 (Testing & Polish)
**Current Branch:** `phase/1-core-app`
**Current Step:** Phase 3 preparation
**Next Step:** Multi-device testing, UI polish

**Last Updated:** 2025-12-01
**Updated By:** Claude

**Phase 1B Complete:** ✅ Firebase Integration done - E2E testing PASSED
**Phase 2 Complete:** ✅ Map Visualization done - MapScreen + Heatmap + Tab Navigation

---

## ✅ Step-by-Step Workflow Checklist

### **STEP 0: Session Start (ALWAYS DO THIS FIRST)**

```
[ ] Read DEVELOPMENT_WORKFLOW.md (this file)
[ ] Read PROGRESS_REPORT.md for current status
[ ] Check current git branch: git branch
[ ] Check git status: git status
[ ] Identify current phase/step from checklist below
[ ] Ask user: "Continuing with [STEP X]?" or "Ready for next step?"
```

---

### **PRE-IMPLEMENTATION VERIFICATION (Before Coding Any Step)**

**Purpose:** Ensure all architectural decisions, library compatibility, and implementation details are confirmed before writing code.

**Reference Document:** [FINAL_PLAN_REVIEW.md](FINAL_PLAN_REVIEW.md)

```
[ ] Read FINAL_PLAN_REVIEW.md
[ ] Confirm all library versions are verified and compatible
[ ] Confirm heatmap support is validated (react-native-maps 1.26.18)
[ ] Confirm data flow and architecture are sound
[ ] Confirm scope is appropriate for semester project
[ ] Confirm all critical unknowns are resolved
[ ] Confirm exact code is available in IMPLEMENTATION_SPEC.md
```

**Verification Checklist:**
```
[✅] React Native 20.0.0 compatibility confirmed
[✅] @react-native-picker/picker 2.11.4 verified
[✅] react-native-maps 1.26.18 verified with Heatmap support
[✅] @react-native-community/geolocation 3.4.0 verified
[✅] Firebase Firestore data model validated
[✅] 1-second upload frequency acceptable
[✅] Battery impact estimated (~3%/hour)
[✅] All code specified in IMPLEMENTATION_SPEC.md
```

**⚠️ DO NOT START CODING until all items above are ✅**

**Code Reference Document:** [IMPLEMENTATION_SPEC.md](IMPLEMENTATION_SPEC.md)
- Contains exact, copy-paste ready code for all steps
- Includes line counts and time estimates
- Use this during implementation to avoid mistakes

---

### **PHASE 1B: Firebase Services**

#### **Step 1B-1: Install Firebase Dependencies** ✅ COMPLETED
```
Branch: phase/1-core-app (work was done here)
Status: DONE

Checklist:
[✅] Install @react-native-firebase/app
[✅] Install @react-native-firebase/auth
[✅] Install @react-native-firebase/firestore
[✅] Install uuid, react-native-keep-awake
[✅] Commit: chore(deps): install Firebase dependencies
[✅] Push to remote
[✅] Update PROGRESS_REPORT.md
```

#### **Step 1B-2: Update Type Definitions** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE

Checklist:
[✅] Update src/types/index.ts
[✅] Add NoiseReadingDocument interface
[✅] Add NoiseReading interface
[✅] Add CampusLocation interface
[✅] Run: npm run type-check (if available)
[✅] Commit: refactor(types): update for Firestore
[✅] Push to remote
[✅] Update PROGRESS_REPORT.md
```

#### **Step 1B-3: Create Campus Locations** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE

Checklist:
[✅] Create src/constants/locations.ts
[✅] Add CAMPUS_LOCATIONS array
[✅] Add helper functions
[✅] Commit: feat(constants): add campus locations
[✅] Push to remote
[✅] Update PROGRESS_REPORT.md
```

#### **Step 1B-4: Create AuthService** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE

Checklist:
[✅] Create src/services/AuthService.ts
[✅] Implement signInAnonymously()
[✅] Implement getUserId()
[✅] Implement isSignedIn()
[✅] Add error handling
[✅] Add console logging
[✅] Create __tests__/services/AuthService.test.ts
[✅] Run unit tests: npm test AuthService.test.ts
[✅] All tests pass
[✅] Commit: feat(firebase): implement AuthService with anonymous auth
[✅] Push to remote
[✅] Update PROGRESS_REPORT.md
```

#### **Step 1B-5: Create StorageService** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE

Checklist:
[✅] Create src/services/StorageService.ts
[✅] Implement saveReading()
[✅] Implement subscribeToHeatmap()
[✅] Implement getSessionReadings()
[✅] Implement getBuildingReadings()
[✅] Implement testConnection()
[✅] Add error handling
[✅] Add console logging
[✅] Create __tests__/services/StorageService.test.ts
[✅] Run unit tests: npm test StorageService.test.ts
[✅] All tests pass
[✅] Commit: feat(firebase): implement StorageService with Firestore integration
[✅] Push to remote
[✅] Update PROGRESS_REPORT.md
```

#### **Step 1B-6: Firebase Project Setup** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE
Owner: User + Claude

User's Checklist:
[✅] Create Firebase project in console (SWE699Lec12)
[✅] Add Android app (package: com.noisemonitor)
[✅] Download google-services.json
[✅] Place in: D:\OtherDevelopment\INFS\mobile-app\android\app\google-services.json
[✅] Enable Anonymous Authentication
[✅] Create Firestore database (test mode)
[ ] Set Firestore security rules (optional - using test mode)

Claude's Actions:
[✅] Verify google-services.json exists
[✅] Add Google Services Gradle plugin to build.gradle files
[✅] Replace deprecated react-native-keep-awake with @sayem314/react-native-keep-awake
[✅] Verify Android build works
[✅] Commit: chore(firebase): add Firebase project configuration
[✅] Push to remote
[✅] Update DEVELOPMENT_WORKFLOW.md (mark as DONE, set next step)
```

#### **Step 1B-7: Refactor AudioService for Firebase Upload** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE
Dependencies: Step 1B-6 complete
Code Reference: IMPLEMENTATION_SPEC.md - Step 1B-7 (30 lines, 2 hours)

Implementation Checklist:
[✅] Read src/services/AudioService.ts
[✅] Import StorageService and classifyNoise
[✅] Import uuid for session IDs
[✅] Add currentSessionId property
[✅] Add LocationData interface and currentLocation property
[✅] Update startRecording(): Generate session UUID
[✅] Update 1-second classification callback:
    [✅] Create NoiseReading object
    [✅] Call storageService.saveReading()
    [✅] Handle upload errors (fire-and-forget with error logging)
    [✅] Add console logging
[✅] Update stopRecording(): Clear session ID
[✅] Add setLocation(building, room, lat, lng) method
[✅] Add clearLocation() method
[✅] Add getSessionId() method
[✅] Export AudioSample type from types/index.ts

Git Workflow:
[✅] Commit: refactor(audio): integrate Firebase upload for noise readings
[✅] Push to remote

Next Step: Step 1B-8 (Location Picker UI)
```

#### **Step 1B-8: Add Location Picker to HomeScreen** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE
Dependencies: Step 1B-7 complete
Code Reference: IMPLEMENTATION_SPEC.md - Step 1B-8 (80 lines, 3 hours)

Implementation Checklist:
[✅] Install @react-native-picker/picker and @react-native-community/geolocation
[✅] Import Picker component and Geolocation
[✅] Import CAMPUS_LOCATIONS from constants
[✅] Add state variables: selectedBuilding, selectedRoom, availableRooms
[✅] Add handleBuildingChange function
[✅] Add building Picker component
[✅] Add room Picker component (enabled only when building selected)
[✅] Handle building selection: Update availableRooms, Clear selected room
[✅] Get GPS coordinates when "Start Monitoring" pressed
[✅] Pass location to AudioService.setLocation()
[✅] Add GPS error handling with fallback to GMU default coordinates
[✅] Validate location selection before starting
[✅] Add location status indicator
[✅] Disable pickers while monitoring

Git Workflow:
[✅] Commit: feat(ui): add building/room location picker to HomeScreen
[✅] Push to remote

Phase 1B Integration Testing:
[✅] Manual E2E test: Monitor → Upload → Verify in Firestore Console
[✅] Fixes applied during E2E testing:
    - Added crypto polyfill for uuid (react-native-get-random-values)
    - Added anonymous auth on app startup
    - Adjusted dB calibration (+110 offset)
    - Fixed Picker UI styling (white background, proper height)
[✅] Commit: fix(e2e): Phase 1B E2E testing fixes and UI improvements
[✅] Push to remote

Next Step: Step 2-1 (Create MapScreen)
```

---

### **PHASE 2: Map Visualization**

#### **Step 2-1: Create MapScreen Component** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE
Dependencies: Phase 1B complete

Implementation Checklist:
[✅] Install react-native-maps: npm install react-native-maps
[✅] Install @react-native-community/geolocation (already installed)
[✅] Create src/screens/MapScreen.tsx
[✅] Import MapView from react-native-maps
[✅] Set initial region (GMU campus: 38.8304, -77.3078)
[✅] Add current location marker (showsUserLocation)
[✅] Add map controls (showsMyLocationButton)
[✅] Test on physical device

Testing Checklist:
[✅] Manual test: Map displays correctly
[✅] Manual test: Current location shows
[✅] Manual test: Zoom and pan work
[✅] No console errors

Git Workflow:
[✅] Committed with Phase 2 completion commit

Next Step: Step 2-2 (Heatmap Overlay)
```

#### **Step 2-2: Implement Heatmap Overlay** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE
Dependencies: Step 2-1 complete

Implementation Checklist:
[✅] Update MapScreen.tsx
[✅] Import Heatmap from react-native-maps
[✅] Add state for heatmapPoints
[✅] Subscribe to StorageService.subscribeToHeatmap()
[✅] Transform NoiseReadingDocument[] to heatmap points
[✅] Configure gradient (blue → green → yellow → red)
[✅] Set radius and opacity
[✅] Add cleanup on unmount (unsubscribe)
[✅] Add legend showing noise level colors
[✅] Add status bar showing data count

Testing Checklist:
[✅] Manual test: Map displays with "No noise data available" when empty
[✅] Manual test: Legend displays correctly
[✅] Heatmap ready for data (will show when monitoring generates data)

Git Workflow:
[✅] Committed with Phase 2 completion commit

Next Step: Step 2-3 (Real-time Subscription) - Already implemented
```

#### **Step 2-3: Real-time Firestore Subscription** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE (implemented as part of Step 2-2)
Dependencies: Step 2-2 complete

Note: Real-time subscription was implemented in MapScreen as part of Step 2-2.
The subscribeToHeatmap() method provides real-time Firestore updates.

Next Step: Step 2-4 (Tab Navigation)
```

#### **Step 2-4: Add Bottom Tab Navigation** ✅ COMPLETED
```
Branch: phase/1-core-app
Status: DONE
Dependencies: Steps 2-1, 2-2, 2-3 complete

Implementation Checklist:
[✅] Install: npm install @react-navigation/native @react-navigation/bottom-tabs
[✅] Install: npm install react-native-screens react-native-safe-area-context
[✅] Install: npm install react-native-vector-icons
[✅] Updated App.tsx with Tab.Navigator (no separate AppNavigator file)
[✅] Import createBottomTabNavigator
[✅] Create tab structure: Monitor | Campus Map
[✅] Add icons (mic for Monitor, map for Map) using MaterialIcons
[✅] Configure vector icons font in build.gradle
[✅] Fix safe area handling for Android navigation bar
[✅] Test tab switching

Testing Checklist:
[✅] Manual test: Tabs display correctly with proper icons
[✅] Manual test: Switch between tabs
[✅] Manual test: Monitor tab works
[✅] Manual test: Map tab works
[✅] No console errors

Git Workflow:
[✅] Committed: feat(map): implement Phase 2 map visualization with tab navigation

Phase 2 Completion:
[✅] Manual E2E testing passed
[✅] Tab navigation works
[✅] Map displays correctly
[✅] Heatmap ready for data

Documentation Updates:
[✅] Updated DEVELOPMENT_WORKFLOW.md (Phase 2 complete)
[ ] Update PROGRESS_REPORT.md (Phase 2 complete)

Next Phase: Phase 3 (Testing & Polish)
```

---

## 🔄 Automatic Updates Required

**Claude MUST update these files when:**

### **After Every Step Completion:**
```
[ ] DEVELOPMENT_WORKFLOW.md
    - Mark step as ✅ COMPLETED
    - Update "Current Step" in status section
    - Update "Last Updated" timestamp

[ ] PROGRESS_REPORT.md
    - Update phase progress percentage
    - Mark step as complete in checklist
    - Update metrics
    - Update "Last Updated"

[ ] SESSION_SUMMARY_2025-11-29.md (if major changes)
    - Add to work completed section
```

### **When Plan Changes:**
```
[ ] DEVELOPMENT_WORKFLOW.md
    - Update affected step checklists
    - Add/remove steps if needed
    - Update dependencies

[ ] PROJECT_BLUEPRINT.md
    - Update architecture if changed
    - Update data model if changed
    - Update roadmap

[ ] FIREBASE_IMPLEMENTATION_GUIDE.md
    - Update implementation steps
    - Update code examples

[ ] IMPLEMENTATION_SPEC.md
    - Update exact code if implementation changes
    - Update line counts and time estimates
    - Ensure all code is copy-paste ready

[ ] FINAL_PLAN_REVIEW.md
    - Update if architectural decisions change
    - Update if library versions change
    - Re-verify if scope changes

[ ] GIT_STRATEGY.md
    - Update branch structure if changed
    - Update workflow if changed

[ ] TESTING_STRATEGY.md
    - Update test cases if changed
    - Add new tests if needed
```

---

## 🤖 Claude's Automatic Workflow

### **At Start of Every Session:**
```typescript
async function sessionStart() {
  // 1. Read workflow
  await read('DEVELOPMENT_WORKFLOW.md');
  await read('PROGRESS_REPORT.md');

  // 2. Check git status
  await bash('git branch');
  await bash('git status');

  // 3. Identify current step from workflow
  const currentStep = identifyCurrentStep();

  // 4. Ask user
  await askUser(`Continue with ${currentStep.name}?`);

  // 5. Load step checklist
  const checklist = loadStepChecklist(currentStep);

  // 6. Follow checklist
  await followChecklist(checklist);
}
```

### **After Step Completion:**
```typescript
async function stepComplete(stepName: string) {
  // 1. Run tests
  await runStepTests(stepName);

  // 2. Git operations
  await gitCommit(stepName);
  await gitMergeToPhase();

  // 3. Update documentation
  await updateWorkflow(stepName, 'COMPLETED');
  await updateProgress(stepName);

  // 4. Identify next step
  const nextStep = getNextStep(stepName);

  // 5. Inform user
  await informUser(`Step ${stepName} complete. Next: ${nextStep}`);
}
```

### **When Plan Changes:**
```typescript
async function planChanged(changedFiles: string[]) {
  // 1. Identify affected components
  const affected = analyzeImpact(changedFiles);

  // 2. Update all related documentation
  for (const doc of affected.documents) {
    await updateDocument(doc);
  }

  // 3. Update workflow checklists
  await updateWorkflowChecklists(affected.steps);

  // 4. Notify user
  await notifyUser(`Updated: ${affected.documents.join(', ')}`);
}
```

---

## 📝 Quick Reference Commands

### **Claude's Internal Checklist (Every Session):**
```
1. Read DEVELOPMENT_WORKFLOW.md ← THIS FILE
2. Check git status
3. Identify current step
4. Follow step checklist
5. Run tests before merging
6. Update documentation after completion
7. Move to next step
```

### **User's Reminder to Claude:**
When starting a session, user should say:
> "Follow DEVELOPMENT_WORKFLOW.md and continue with the current step"

Or:
> "Check workflow and tell me what step we're on"

---

## 🎯 Success Criteria

**Workflow is being followed correctly when:**
- ✅ Every step has a git branch
- ✅ Every step has tests that pass
- ✅ Every step has a commit with proper message
- ✅ Documentation is updated after every step
- ✅ Current status is always accurate
- ✅ Next step is always clear

---

**Last Updated:** 2025-12-01 (Claude should update this automatically)
**Current Phase:** Phase 2 (Map Visualization)
**Current Step:** 2-1 (Create MapScreen)
**Next Step:** 2-2 (Heatmap Overlay)

---

## 📌 REMINDER FOR CLAUDE

**ALWAYS DO THIS AT SESSION START:**
1. Read this file first
2. Check current status section above
3. Find current step checklist
4. Ask user: "Ready to continue with [STEP X]?"
5. Follow checklist exactly
6. Update documentation when complete
7. Set next step

**NEVER SKIP:**
- Testing before merging
- Git commit messages
- Documentation updates
- Asking user before major changes
