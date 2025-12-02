# Phase 1 Manual Testing Plan

**Created:** 2025-11-01
**Purpose:** Step-by-step manual testing of all Phase 1 features
**Estimated Time:** 2-3 hours
**Requirements:** Android/iOS device, quiet/normal/noisy environments

---

## 📋 **Testing Checklist Overview**

- [ ] **Test 1:** Build and install app
- [ ] **Test 2:** Microphone permission handling
- [ ] **Test 3:** Audio capture and real-time decibel display
- [ ] **Test 4:** Quiet environment validation (<50dB)
- [ ] **Test 5:** Normal environment validation (50-70dB)
- [ ] **Test 6:** Noisy environment validation (>70dB)
- [ ] **Test 7:** Moving average filter smoothing
- [ ] **Test 8:** Classification accuracy
- [ ] **Test 9:** Noise history display
- [ ] **Test 10:** UI color changes
- [ ] **Test 11:** Start/Stop functionality
- [ ] **Test 12:** Performance and battery usage
- [ ] **Test 13:** Document results

---

## 🛠️ **PRE-TESTING SETUP**

### **Prerequisites**

**For Android:**
- Android phone with USB cable
- USB debugging enabled on phone
- Android SDK installed
- Metro bundler dependencies installed

**For iOS (Mac only):**
- iPhone with cable
- Xcode installed
- CocoaPods installed

### **Setup Commands**

```bash
# Navigate to project
cd D:\OtherDevelopment\INFS\mobile-app

# Install dependencies (if not already done)
npm install

# For iOS only:
cd ios && pod install && cd ..
```

---

## 📱 **TEST 1: Build and Install App**

### **Objective**
Successfully build and install the app on your physical device.

### **Steps - Android:**

```bash
# 1. Connect Android phone via USB
# 2. Enable USB debugging on phone:
#    Settings → About Phone → Tap "Build Number" 7 times
#    Settings → Developer Options → Enable USB Debugging

# 3. Verify device is connected
adb devices
# Expected: Should show your device ID

# 4. Build and install
npm run android
```

### **Steps - iOS:**

```bash
# Open in Xcode
open ios/NoiseMonitorApp.xcworkspace

# Connect iPhone via cable
# Select your device in Xcode
# Click "Run" button (▶️)
```

### **Expected Result:**
✅ Metro bundler starts in terminal
✅ App builds without errors
✅ App installs on device
✅ App launches and shows "Noise Monitor" screen

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| "Device not found" | Check USB cable, enable USB debugging |
| "Build failed" | Run `cd android && ./gradlew clean && cd ..` |
| "Metro bundler error" | Run `npm start -- --reset-cache` |
| "Permission denied" | Check Windows antivirus isn't blocking |

### **Pass/Fail:**
- [ ] Pass
- [ ] Fail (Document issue: __________________)

---

## 🎤 **TEST 2: Microphone Permission Handling**

### **Objective**
Verify app correctly requests and handles microphone permission.

### **Steps:**

**First Launch (Permission Not Granted):**
1. Fresh install or clear app data
2. Launch app
3. Tap "Start Monitoring" button

**Expected:**
- Permission dialog appears: "Allow Noise Monitor to record audio?"
- Two options: "Allow" / "Deny"

**Test 2A: Grant Permission**
1. Tap "Allow"
2. Observe app behavior

**Expected Result:**
✅ Permission granted
✅ Monitoring starts immediately
✅ Decibel display updates with live values

**Test 2B: Deny Permission**
1. Uninstall and reinstall app
2. Launch app
3. Tap "Start Monitoring"
4. Tap "Deny" on permission dialog

**Expected Result:**
✅ Error message shown: "Microphone permission is required"
✅ App doesn't crash
✅ Helpful message explaining how to enable permission in settings

**Test 2C: Permission Already Granted**
1. Close and reopen app
2. Tap "Start Monitoring"

**Expected Result:**
✅ No permission dialog (already granted)
✅ Monitoring starts immediately

### **Pass/Fail:**
- [ ] Pass (All scenarios work correctly)
- [ ] Fail (Document issue: __________________)

---

## 📊 **TEST 3: Audio Capture and Real-Time Decibel Display**

### **Objective**
Verify app captures audio and displays decibel readings in real-time.

### **Steps:**

1. Tap "Start Monitoring"
2. Observe the decibel display
3. Speak normally near the phone
4. Stop speaking
5. Clap your hands once
6. Observe changes

### **Expected Result:**
✅ Decibel value displays immediately (within 1 second)
✅ Value updates approximately every 1 second
✅ Value increases when you speak/clap
✅ Value decreases when quiet
✅ Display shows format: "XX.X dB" (e.g., "65.3 dB")

### **Visual Check:**
The decibel number should be:
- **Large and prominent** (easy to read)
- **Updating smoothly** (not frozen)
- **Reasonable values** (30-90 dB range for typical indoor environments)

### **Pass/Fail:**
- [ ] Pass
- [ ] Fail (Document issue: __________________)

**Notes:**
Actual dB reading: _________
Does it update in real-time? Yes / No

---

## 🔇 **TEST 4: Quiet Environment Validation (<50dB)**

### **Objective**
Test accuracy in a quiet environment and verify "Quiet" classification.

### **Steps:**

1. Go to a quiet location:
   - Library study room
   - Empty classroom
   - Quiet bedroom
   - Car with engine off

2. Place phone on table (don't hold it to reduce handling noise)
3. Start monitoring
4. Observe readings for **2 minutes**
5. Record:
   - Typical dB reading: _________
   - Range (min to max): _________ to _________
   - Classification shown: _________

### **Expected Result:**
✅ Decibel readings: **30-49 dB** (typical quiet room)
✅ Classification badge shows: **"🟢 Quiet"**
✅ Display color: **Green**
✅ Readings are stable (small variations)

### **Validation:**
Compare with a reference sound meter app:
- **Download:** "Sound Meter" or "Decibel X" (free apps)
- **Compare:** Your app vs reference app
- **Acceptable difference:** ±5 dB

### **Pass/Fail:**
- [ ] Pass (dB values reasonable, classification correct)
- [ ] Fail (Document issue: __________________)

**Test Data:**
| Time | Your App | Reference App | Classification |
|------|----------|---------------|----------------|
| 0:00 | _____ dB | _____ dB      | _________      |
| 0:30 | _____ dB | _____ dB      | _________      |
| 1:00 | _____ dB | _____ dB      | _________      |
| 1:30 | _____ dB | _____ dB      | _________      |
| 2:00 | _____ dB | _____ dB      | _________      |

---

## 🔉 **TEST 5: Normal Environment Validation (50-70dB)**

### **Objective**
Test accuracy in a normal noise environment and verify "Normal" classification.

### **Steps:**

1. Go to a normal noise location:
   - Cafeteria during off-peak hours
   - Office with people talking
   - Hallway with foot traffic
   - Living room with TV on (moderate volume)

2. Start monitoring
3. Observe readings for **2 minutes**
4. Record:
   - Typical dB reading: _________
   - Range (min to max): _________ to _________
   - Classification shown: _________

### **Expected Result:**
✅ Decibel readings: **50-70 dB** (normal conversation level)
✅ Classification badge shows: **"🟡 Normal"**
✅ Display color: **Yellow/Orange**
✅ Readings vary with background activity

### **Pass/Fail:**
- [ ] Pass (dB values reasonable, classification correct)
- [ ] Fail (Document issue: __________________)

**Test Data:**
| Time | Your App | Reference App | Classification |
|------|----------|---------------|----------------|
| 0:00 | _____ dB | _____ dB      | _________      |
| 0:30 | _____ dB | _____ dB      | _________      |
| 1:00 | _____ dB | _____ dB      | _________      |
| 1:30 | _____ dB | _____ dB      | _________      |
| 2:00 | _____ dB | _____ dB      | _________      |

---

## 🔊 **TEST 6: Noisy Environment Validation (>70dB)**

### **Objective**
Test accuracy in a noisy environment and verify "Noisy" classification.

### **Steps:**

1. Go to a noisy location:
   - Cafeteria during lunch rush
   - Gym with music playing
   - Street with traffic
   - Student center during peak hours
   - Near construction/renovation

2. Start monitoring
3. Observe readings for **2 minutes**
4. Record:
   - Typical dB reading: _________
   - Range (min to max): _________ to _________
   - Classification shown: _________

### **Expected Result:**
✅ Decibel readings: **>70 dB** (loud conversation/music)
✅ Classification badge shows: **"🔴 Noisy"**
✅ Display color: **Red**
✅ Readings fluctuate with noise peaks

### **Pass/Fail:**
- [ ] Pass (dB values reasonable, classification correct)
- [ ] Fail (Document issue: __________________)

**Test Data:**
| Time | Your App | Reference App | Classification |
|------|----------|---------------|----------------|
| 0:00 | _____ dB | _____ dB      | _________      |
| 0:30 | _____ dB | _____ dB      | _________      |
| 1:00 | _____ dB | _____ dB      | _________      |
| 1:30 | _____ dB | _____ dB      | _________      |
| 2:00 | _____ dB | _____ dB      | _________      |

---

## 📉 **TEST 7: Moving Average Filter Smoothing**

### **Objective**
Verify moving average filter reduces sudden noise spikes.

### **Steps:**

1. Start monitoring in a quiet room
2. Observe steady baseline reading (e.g., 40 dB)
3. **Clap hands once loudly**
4. Observe how the reading changes
5. Wait for reading to return to baseline

### **Expected Behavior:**

**Without filter (raw data):**
- Spike jumps instantly to 85+ dB
- Drops back instantly to 40 dB
- Very jittery

**With filter (your app should do this):**
✅ Spike increases more gradually (40 → 55 → 70 → back to 40)
✅ Takes 2-3 seconds to stabilize
✅ Smooth transitions, not instant jumps

### **Visual Test:**
The decibel number should:
- Not jump wildly with every sound
- Change smoothly when environment noise changes
- Stabilize after a few seconds in consistent environment

### **Pass/Fail:**
- [ ] Pass (Smooth, gradual changes)
- [ ] Fail (Jittery, instant jumps)

**Observations:**
Before clap: _____ dB
During clap: _____ dB
After clap (2 sec): _____ dB
After clap (5 sec): _____ dB

---

## 🏷️ **TEST 8: Classification Accuracy**

### **Objective**
Verify app correctly classifies environments based on decibel levels.

### **Steps:**

Create a test matrix by visiting different locations and recording classifications:

| Location | Expected Class | Actual dB | Actual Class | Correct? |
|----------|----------------|-----------|--------------|----------|
| Library silent study room | Quiet | _____ dB | _________ | ☐ Yes ☐ No |
| Library reading area | Quiet/Normal | _____ dB | _________ | ☐ Yes ☐ No |
| Hallway (empty) | Quiet | _____ dB | _________ | ☐ Yes ☐ No |
| Hallway (people talking) | Normal | _____ dB | _________ | ☐ Yes ☐ No |
| Cafeteria (off-peak) | Normal | _____ dB | _________ | ☐ Yes ☐ No |
| Cafeteria (lunch rush) | Noisy | _____ dB | _________ | ☐ Yes ☐ No |
| Outdoor near traffic | Noisy | _____ dB | _________ | ☐ Yes ☐ No |
| Gym with music | Noisy | _____ dB | _________ | ☐ Yes ☐ No |

### **Classification Logic:**
```
dB < 50  → Quiet  (🟢 Green)
50-70 dB → Normal (🟡 Yellow)
dB > 70  → Noisy  (🔴 Red)
```

### **Pass Criteria:**
✅ At least **6 out of 8 locations** classified correctly
✅ Threshold boundaries (49-51 dB, 69-71 dB) handled correctly

### **Pass/Fail:**
- [ ] Pass (Accuracy: ___ / 8 = ___%)
- [ ] Fail (Document misclassifications: __________________)

---

## 📜 **TEST 9: Noise History Display**

### **Objective**
Verify app displays last 10 readings with timestamp and classification.

### **Steps:**

1. Start monitoring
2. Wait for 10+ readings to accumulate (about 10 seconds)
3. Scroll down to "Recent Readings" section
4. Verify history display

### **Expected Result:**
✅ Shows list of last 10 readings
✅ Each entry shows:
   - Decibel value (e.g., "65.3 dB")
   - Classification (Quiet/Normal/Noisy)
   - Timestamp or relative time (e.g., "2:30 PM" or "10 sec ago")
✅ Newest reading at top
✅ Oldest reading at bottom
✅ After 11th reading, oldest one is removed (keeps only 10)

### **Visual Check:**
```
Recent Readings:
• 65 dB - Normal (2:30 PM)  ← Newest
• 68 dB - Normal (2:29 PM)
• 71 dB - Noisy  (2:28 PM)
• 63 dB - Normal (2:27 PM)
• ...
• 58 dB - Normal (2:21 PM)  ← Oldest (10th)
```

### **Pass/Fail:**
- [ ] Pass (All elements visible, correct order)
- [ ] Fail (Document issue: __________________)

**Verification:**
Count of readings shown: _________
Newest reading matches current? Yes / No
Order is correct (newest → oldest)? Yes / No

---

## 🎨 **TEST 10: UI Color Changes Based on Noise Level**

### **Objective**
Verify UI color scheme changes correctly based on classification.

### **Steps:**

1. Test in quiet environment
2. Observe UI colors
3. Test in normal environment
4. Observe color changes
5. Test in noisy environment
6. Observe color changes

### **Expected Color Scheme:**

**Quiet (<50dB):**
✅ Decibel display: **Green** background/text
✅ Classification badge: **🟢 Green** with "Quiet" label
✅ Overall theme: Green/calming colors

**Normal (50-70dB):**
✅ Decibel display: **Yellow/Orange** background/text
✅ Classification badge: **🟡 Yellow** with "Normal" label
✅ Overall theme: Yellow/neutral colors

**Noisy (>70dB):**
✅ Decibel display: **Red** background/text
✅ Classification badge: **🔴 Red** with "Noisy" label
✅ Overall theme: Red/warning colors

### **Visual Test:**
Take screenshots in each environment:
- [ ] Screenshot 1: Quiet (green)
- [ ] Screenshot 2: Normal (yellow)
- [ ] Screenshot 3: Noisy (red)

### **Pass/Fail:**
- [ ] Pass (Colors change correctly, visually distinct)
- [ ] Fail (Document issue: __________________)

---

## ⏯️ **TEST 11: Start/Stop Monitoring Functionality**

### **Objective**
Verify start and stop buttons work correctly.

### **Steps:**

**Test 11A: Start Monitoring**
1. Launch app (not monitoring yet)
2. Observe "Start Monitoring" button
3. Tap button

**Expected Result:**
✅ Button text changes to "Stop Monitoring"
✅ Decibel display starts updating
✅ Audio capture begins
✅ No delay (starts within 1 second)

**Test 11B: Stop Monitoring**
1. While monitoring is active
2. Tap "Stop Monitoring" button

**Expected Result:**
✅ Button text changes to "Start Monitoring"
✅ Decibel display freezes (stops updating)
✅ Last reading remains visible
✅ Audio capture stops

**Test 11C: Multiple Start/Stop Cycles**
1. Start monitoring
2. Wait 5 seconds
3. Stop monitoring
4. Wait 2 seconds
5. Start monitoring again
6. Repeat 3 times

**Expected Result:**
✅ No crashes or errors
✅ Consistent behavior each time
✅ No memory leaks (app doesn't slow down)

### **Pass/Fail:**
- [ ] Pass (All scenarios work smoothly)
- [ ] Fail (Document issue: __________________)

---

## ⚡ **TEST 12: Performance and Battery Usage**

### **Objective**
Verify app performs well and doesn't drain battery excessively.

### **Setup:**
1. Charge phone to 100%
2. Close all other apps
3. Note starting battery: 100%
4. Note start time: __________

### **Test Procedure:**
1. Start monitoring
2. Leave app running for **15 minutes**
3. Don't interact with phone (let it run)
4. Note end time: __________
5. Note ending battery: __________%

### **Expected Result:**
✅ Battery drain: **<2% in 15 minutes** (equivalent to <8%/hour, target is <5%/hour for 1 hour)
✅ App remains responsive (no lag)
✅ No overheating
✅ Decibel updates remain consistent (doesn't slow down)

### **Performance Checklist:**
- [ ] App doesn't freeze or crash
- [ ] UI remains smooth (no stuttering)
- [ ] Phone doesn't get noticeably warm
- [ ] Battery drain is acceptable

### **Actual Results:**
Battery at start: 100%
Battery after 15 min: __________%
Battery drain: __________%
Acceptable? Yes / No

### **Pass/Fail:**
- [ ] Pass (Battery drain <2% in 15 min, no performance issues)
- [ ] Fail (Document issue: __________________)

---

## 📝 **TEST 13: Document All Results**

### **Objective**
Create comprehensive test report.

### **Summary Template:**

```markdown
# Phase 1 Manual Testing Results

**Date:** 2025-11-01
**Tester:** [Your Name]
**Device:** [Phone Model, OS Version]
**App Version:** Phase 1 (v1.0.0)

## Test Summary

Total Tests: 13
Passed: ___ / 13
Failed: ___ / 13
Pass Rate: ___%

## Test Results

| Test # | Test Name | Result | Notes |
|--------|-----------|--------|-------|
| 1 | Build and Install | ☐ Pass ☐ Fail | |
| 2 | Microphone Permission | ☐ Pass ☐ Fail | |
| 3 | Audio Capture | ☐ Pass ☐ Fail | |
| 4 | Quiet Environment | ☐ Pass ☐ Fail | |
| 5 | Normal Environment | ☐ Pass ☐ Fail | |
| 6 | Noisy Environment | ☐ Pass ☐ Fail | |
| 7 | Moving Average Filter | ☐ Pass ☐ Fail | |
| 8 | Classification Accuracy | ☐ Pass ☐ Fail | |
| 9 | Noise History | ☐ Pass ☐ Fail | |
| 10 | UI Color Changes | ☐ Pass ☐ Fail | |
| 11 | Start/Stop Functionality | ☐ Pass ☐ Fail | |
| 12 | Performance & Battery | ☐ Pass ☐ Fail | |
| 13 | Documentation | ☐ Pass ☐ Fail | |

## Issues Found

### Critical Issues (App Unusable)
1. [If any]

### Major Issues (Core Feature Broken)
1. [If any]

### Minor Issues (Usability/Polish)
1. [If any]

## Observations

### Decibel Accuracy
- Quiet: Avg _____ dB (Expected: 30-49 dB)
- Normal: Avg _____ dB (Expected: 50-70 dB)
- Noisy: Avg _____ dB (Expected: >70 dB)

### Classification Accuracy
- Correct classifications: ___ / 8 (___%)

### Performance
- Battery drain: ___% in 15 min
- App responsiveness: Good / Fair / Poor

## Recommendations

1. [Any improvements needed]
2. [Any bugs to fix]
3. [Ready for Phase 2? Yes/No]

## Conclusion

Phase 1 is: ☐ Ready for Production ☐ Needs Fixes ☐ Major Revisions Required
```

### **Save Results:**
Save your test report as:
```
docs/testing/PHASE1_MANUAL_TEST_RESULTS_[DATE].md
```

---

## 🎯 **ACCEPTANCE CRITERIA**

Phase 1 passes manual testing if:

✅ **All 13 tests pass** (or at most 1 minor failure)
✅ **No critical bugs** (crashes, permission failures)
✅ **Classification accuracy >75%** (6/8 locations correct)
✅ **Decibel readings within ±10 dB** of reference meter
✅ **Battery drain <2% in 15 minutes**
✅ **App performs smoothly** (no lag, freezing, overheating)

---

## 📊 **NEXT STEPS AFTER TESTING**

### **If All Tests Pass:**
1. ✅ Mark Phase 1 as complete
2. ✅ Merge `phase/1-core-app` to `develop`
3. ✅ Tag release: `v1.0.0-phase1`
4. ✅ Update PROGRESS_REPORT.md
5. ✅ Begin Phase 2 planning

### **If Tests Fail:**
1. Document all issues in detail
2. Prioritize fixes (critical → major → minor)
3. Fix critical issues first
4. Re-test after fixes
5. Repeat until all tests pass

---

## 📱 **QUICK REFERENCE: Test Commands**

```bash
# Build for Android
cd D:\OtherDevelopment\INFS\mobile-app
npm run android

# Check connected devices
adb devices

# View app logs (if issues occur)
npx react-native log-android

# Rebuild if needed
cd android && ./gradlew clean && cd ..
npm run android

# Check battery usage (Android)
adb shell dumpsys battery
```

---

## 🎬 **TESTING SCHEDULE SUGGESTION**

**Session 1 (1 hour):** Tests 1-3
- Build and install
- Permission handling
- Audio capture

**Session 2 (1 hour):** Tests 4-6
- Quiet environment
- Normal environment
- Noisy environment

**Session 3 (30 min):** Tests 7-11
- Filter smoothing
- Classification accuracy
- History display
- UI colors
- Start/Stop

**Session 4 (30 min):** Test 12-13
- Performance & battery
- Documentation

**Total Time:** ~3 hours

---

**Good luck with testing! 🚀**
**Document everything - your findings will be valuable for the final report!**
