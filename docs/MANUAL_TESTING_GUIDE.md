# Phase 1 Manual Testing Guide

**Created:** 2025-10-28
**Purpose:** Test the app yourself to see how everything works
**Time Needed:** 30-45 minutes

---

## 🎯 **What You'll Do**

1. Build the app on your Android/iPhone
2. Grant microphone permission
3. Test in 3 different environments (quiet, normal, noisy)
4. Verify all features work correctly
5. Document any bugs you find

---

## 📱 **Step 1: Build and Install the App**

### **Option A: Android Device** (Recommended - easier)

#### **Prerequisites:**
- Android phone with USB cable
- USB debugging enabled on phone
- Android SDK installed (came with React Native setup)

#### **Build Command:**
```bash
# Navigate to mobile app folder
cd D:\OtherDevelopment\INFS\mobile-app

# Make sure dependencies are installed
npm install

# Connect your Android phone via USB
# Enable USB debugging in phone settings (Developer Options)

# Build and install
npm run android
```

**What happens:**
1. Metro bundler starts (JavaScript server)
2. App builds for Android
3. App automatically installs on your phone
4. App launches automatically

**If it works:**
- ✅ You'll see the Metro bundler running in terminal
- ✅ App will open on your phone
- ✅ You'll see "Noise Monitor" app

**Common issues:**
- **"ANDROID_HOME not set"** - Android SDK path not configured
- **"Device not found"** - Phone not connected or USB debugging off
- **Build fails** - Try: `cd android && ./gradlew clean` then try again

---

### **Option B: iOS Device** (Mac only)

```bash
cd D:\OtherDevelopment\INFS\mobile-app

# Install iOS dependencies
cd ios && pod install && cd ..

# Build and run
npm run ios
```

**Note:** This only works on Mac with Xcode installed.

---

### **Option C: Android Emulator** (If no physical device)

```bash
# Start an Android emulator first
# (Open Android Studio → AVD Manager → Start emulator)

# Then build
cd D:\OtherDevelopment\INFS\mobile-app
npm run android
```

**Note:** Emulator won't have real microphone input, so results will be limited.

---

## 🎤 **Step 2: First Launch - Grant Permission**

### **What You'll See:**

When you first open the app, it will ask for microphone permission:

**Android:**
```
┌─────────────────────────────────────┐
│  Allow Noise Monitor to record      │
│  audio?                             │
│                                     │
│  [Deny]    [Allow]                  │
└─────────────────────────────────────┘
```

**iOS:**
```
┌─────────────────────────────────────┐
│  "Noise Monitor" Would Like to     │
│  Access the Microphone              │
│                                     │
│  [Don't Allow]  [OK]                │
└─────────────────────────────────────┘
```

### **Action:**
✅ **Tap "Allow" or "OK"**

### **What to Check:**
- [ ] Permission dialog appears
- [ ] After granting, app doesn't crash
- [ ] You see the main screen

---

## 🏠 **Step 3: Understand the Main Screen**

### **You Should See:**

```
┌─────────────────────────────────────┐
│   Noise Environment Monitor    [i]  │ ← Title + info button
│                                     │
│   ┌───────────────────────────┐     │
│   │                           │     │
│   │        -- dB              │     │ ← Decibel display (empty)
│   │                           │     │
│   └───────────────────────────┘     │
│                                     │
│         Unknown                     │ ← Classification (not started)
│                                     │
│   [Start Monitoring]                │ ← Main button
│                                     │
│   Recent Readings:                  │
│   (No readings yet)                 │ ← History (empty)
│                                     │
└─────────────────────────────────────┘
```

### **What to Check:**
- [ ] App layout looks correct
- [ ] "Start Monitoring" button is visible
- [ ] No crash on launch
- [ ] UI is responsive (you can tap things)

---

## 🧪 **Step 4: Test in QUIET Environment**

### **Where to Test:**
- Quiet room
- Library study room
- Early morning bedroom
- Empty classroom

### **Steps:**

1. **Tap "Start Monitoring"**
   - Button should change to "Stop Monitoring"
   - You should see "Recording..." indicator

2. **Wait 2-3 seconds**
   - Decibel reading should appear
   - Classification should update

3. **Observe for 30 seconds**
   - Readings should update every second
   - Values should be relatively stable

### **Expected Results:**

```
┌─────────────────────────────────────┐
│   ┌───────────────────────────┐     │
│   │                           │     │
│   │        42.5 dB            │     │ ← Should be < 50 dB
│   │      ━━━━━━━━━━━━━         │     │ ← Green color bar
│   └───────────────────────────┘     │
│                                     │
│         🟢 Quiet                    │ ← Green badge
│                                     │
│   [Stop Monitoring]                 │
│                                     │
│   Recent Readings:                  │
│   • 42.5 dB - Quiet  (3:45 PM)      │
│   • 43.1 dB - Quiet  (3:44 PM)      │
│   • 41.8 dB - Quiet  (3:43 PM)      │
└─────────────────────────────────────┘
```

### **What to Check:**
- [ ] Decibel value is < 50 dB
- [ ] Classification shows "Quiet"
- [ ] Color is GREEN
- [ ] Icon is 🟢 (green circle)
- [ ] Readings update every ~1 second
- [ ] History list grows
- [ ] No app crashes

### **Try This:**
- **Clap your hands** → Should see spike in dB, then return to quiet
- **Talk loudly** → Should increase to 60-70 dB temporarily
- **Whisper** → Should stay in quiet range

---

## 🧪 **Step 5: Test in NORMAL Environment**

### **Where to Test:**
- Cafeteria during off-peak
- Hallway with people
- Office with background noise
- Outdoor courtyard

### **Steps:**

1. **Still have app running** (or restart monitoring)
2. **Walk to normal location**
3. **Observe readings change**

### **Expected Results:**

```
┌─────────────────────────────────────┐
│   ┌───────────────────────────┐     │
│   │                           │     │
│   │        62.3 dB            │     │ ← Should be 50-70 dB
│   │      ━━━━━━━━━━━━━         │     │ ← Yellow/orange bar
│   └───────────────────────────┘     │
│                                     │
│         🟡 Normal                   │ ← Yellow badge
│                                     │
│   [Stop Monitoring]                 │
│                                     │
│   Recent Readings:                  │
│   • 62.3 dB - Normal (3:50 PM)      │
│   • 61.7 dB - Normal (3:49 PM)      │
│   • 58.4 dB - Normal (3:48 PM)      │
│   • 42.5 dB - Quiet  (3:45 PM)      │ ← Old quiet readings
└─────────────────────────────────────┘
```

### **What to Check:**
- [ ] Decibel value is 50-70 dB
- [ ] Classification shows "Normal"
- [ ] Color is YELLOW or ORANGE
- [ ] Icon is 🟡 (yellow/orange circle)
- [ ] Transition from Quiet to Normal is smooth
- [ ] History shows both quiet and normal readings

---

## 🧪 **Step 6: Test in NOISY Environment**

### **Where to Test:**
- Busy cafeteria during lunch
- Near construction
- Parking lot with traffic
- Gym during peak hours
- Play loud music on computer

### **Steps:**

1. **Still have app running**
2. **Move to noisy location** (or play loud music)
3. **Observe readings change**

### **Expected Results:**

```
┌─────────────────────────────────────┐
│   ┌───────────────────────────┐     │
│   │                           │     │
│   │        78.9 dB            │     │ ← Should be > 70 dB
│   │      ━━━━━━━━━━━━━         │     │ ← Red bar
│   └───────────────────────────┘     │
│                                     │
│         🔴 Noisy                    │ ← Red badge
│                                     │
│   [Stop Monitoring]                 │
│                                     │
│   Recent Readings:                  │
│   • 78.9 dB - Noisy  (3:55 PM)      │
│   • 76.2 dB - Noisy  (3:54 PM)      │
│   • 73.1 dB - Noisy  (3:53 PM)      │
│   • 62.3 dB - Normal (3:50 PM)      │ ← Old normal readings
└─────────────────────────────────────┘
```

### **What to Check:**
- [ ] Decibel value is > 70 dB
- [ ] Classification shows "Noisy"
- [ ] Color is RED
- [ ] Icon is 🔴 (red circle)
- [ ] App handles loud noise without crashing
- [ ] Values don't exceed ~120 dB (physical maximum)

---

## 🔄 **Step 7: Test Edge Cases**

### **Test 1: Start/Stop Multiple Times**
```
1. Tap "Start Monitoring"
2. Wait 5 seconds
3. Tap "Stop Monitoring"
4. Repeat 5 times
```
**Expected:** No crashes, clean start/stop every time

---

### **Test 2: Permission Denied**
```
1. Uninstall app
2. Reinstall
3. When permission dialog appears, tap "Deny"
```
**Expected:**
- App shows error message
- Explains why permission is needed
- Doesn't crash

---

### **Test 3: Background the App**
```
1. Start monitoring
2. Press phone's home button (app goes to background)
3. Open another app
4. Return to Noise Monitor app
```
**Expected:**
- App resumes correctly
- Monitoring continues (or restarts gracefully)
- No crash

---

### **Test 4: Very Long Session**
```
1. Start monitoring
2. Let it run for 5+ minutes
```
**Expected:**
- Continues working smoothly
- No memory leaks or slowdown
- Battery doesn't drain excessively
- History list caps at 10 items (doesn't grow infinitely)

---

### **Test 5: Rapid Noise Changes**
```
1. Start monitoring in quiet room
2. Play loud music for 5 seconds
3. Pause music (back to quiet)
4. Play music again
5. Repeat several times
```
**Expected:**
- Readings follow the changes
- Moving average smooths transitions
- No crashes or glitches

---

## 📋 **Testing Checklist**

### **Core Functionality**
- [ ] App launches without crash
- [ ] Microphone permission requested
- [ ] Permission granted successfully
- [ ] Audio capture starts when "Start Monitoring" pressed
- [ ] Decibel values appear within 1-2 seconds
- [ ] Values update approximately every second
- [ ] Classification matches decibel level:
  - [ ] < 50 dB = Quiet
  - [ ] 50-70 dB = Normal
  - [ ] > 70 dB = Noisy

### **UI Components**
- [ ] Decibel display shows numeric value
- [ ] Color changes based on noise level (green/yellow/red)
- [ ] Classification badge displays correct label
- [ ] Badge icon matches classification
- [ ] History list shows last 10 readings
- [ ] History includes timestamp
- [ ] "Start/Stop Monitoring" button toggles correctly

### **Accuracy**
- [ ] Quiet room reads 30-50 dB
- [ ] Normal conversation reads 50-70 dB
- [ ] Loud music/noise reads 70-100+ dB
- [ ] Values seem reasonable compared to expectations
- [ ] Moving average filter smooths spikes

### **Stability**
- [ ] No crashes during 5-minute session
- [ ] Start/stop 10 times without issues
- [ ] Background/foreground works correctly
- [ ] Memory usage stays reasonable

### **Performance**
- [ ] UI updates smoothly (no lag)
- [ ] No freezing or stuttering
- [ ] Battery drain is acceptable
- [ ] Phone doesn't overheat

---

## 🐛 **Bug Reporting Template**

If you find issues, document them like this:

```markdown
### Bug #1: [Short Description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Do this
2. Then do this
3. Then this happens

**Expected Behavior:**
App should do X

**Actual Behavior:**
App does Y instead

**Environment:**
- Device: [e.g., Samsung Galaxy S21]
- OS: [e.g., Android 13]
- App Version: Phase 1

**Screenshots:** [If possible]

**Notes:** [Additional context]
```

---

## 📊 **Expected Decibel Ranges**

Use this as a reference:

| Environment | Expected dB | Classification |
|-------------|-------------|----------------|
| **Silence/Very Quiet** | 0-30 dB | Quiet |
| **Whisper/Library** | 30-40 dB | Quiet |
| **Quiet Office** | 40-50 dB | Quiet |
| **Normal Conversation** | 50-60 dB | Normal |
| **Busy Office/Restaurant** | 60-70 dB | Normal |
| **Loud Restaurant** | 70-80 dB | Noisy |
| **Traffic/Busy Street** | 80-90 dB | Noisy |
| **Loud Music/Concert** | 90-110 dB | Noisy |
| **Threshold of Pain** | 120+ dB | Noisy |

**Note:** Phone microphones may not be perfectly calibrated, so values might be ±10 dB off. That's okay for this project - we're looking for relative changes (quiet vs noisy).

---

## 🎯 **Success Criteria**

Phase 1 is successful if:

- ✅ App builds and installs on device
- ✅ Microphone permission works
- ✅ Audio capture works continuously
- ✅ Decibel calculation produces reasonable values
- ✅ Classification correctly identifies quiet/normal/noisy
- ✅ UI updates in real-time
- ✅ No major crashes or bugs
- ✅ User can monitor for 5+ minutes without issues

---

## 🚀 **After Manual Testing**

Once you've tested everything:

1. **Document bugs** in a new file: `BUGS_FOUND.md`
2. **Take screenshots** of the working app
3. **Write notes** about what worked well and what needs improvement
4. **Update DEVELOPMENT_LOG.md** with your testing session
5. **Decide:** Ready for Phase 2, or need to fix bugs first?

---

## 📞 **Troubleshooting**

### **App won't build**
```bash
# Try cleaning and rebuilding
cd mobile-app
cd android
./gradlew clean
cd ..
npm run android
```

### **Metro bundler errors**
```bash
# Reset Metro cache
npm start -- --reset-cache
```

### **App crashes on launch**
```bash
# Check logs
npx react-native log-android  # For Android
npx react-native log-ios      # For iOS
```

### **No audio readings**
- Check microphone permission in phone settings
- Try uninstalling and reinstalling app
- Make sure you granted permission when prompted

---

## 📝 **Testing Log Template**

Keep notes as you test:

```markdown
# Manual Testing Session - Phase 1

**Date:** 2025-10-28
**Tester:** [Your name]
**Device:** [Phone model]
**Duration:** [Time spent]

## Environment 1: Quiet
- Location: [Where you tested]
- Decibel range: [e.g., 35-45 dB]
- Classification: [Quiet/Normal/Noisy]
- Issues: [None / List issues]

## Environment 2: Normal
- Location: [Where you tested]
- Decibel range: [e.g., 55-65 dB]
- Classification: [Quiet/Normal/Noisy]
- Issues: [None / List issues]

## Environment 3: Noisy
- Location: [Where you tested]
- Decibel range: [e.g., 75-85 dB]
- Classification: [Quiet/Normal/Noisy]
- Issues: [None / List issues]

## Edge Cases Tested:
- [ ] Multiple start/stop
- [ ] Permission denied
- [ ] Background app
- [ ] Long session (5+ min)
- [ ] Rapid changes

## Bugs Found:
1. [Bug description]
2. [Bug description]

## Overall Assessment:
[Does it work? Ready for Phase 2? What needs fixing?]
```

---

**Ready to test? Start with Step 1: Build and Install!** 🚀

**Time estimate:** 30-45 minutes for complete testing

---

**Created:** 2025-10-28
**Purpose:** Self-testing Phase 1 implementation
**Status:** Ready to use
