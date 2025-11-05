# Phase 1 Quick Testing Reference

**Purpose:** Quick-start guide for immediate manual testing

---

## 🚀 **Quick Start (5 Minutes)**

### **1. Run the App**
```bash
cd mobile-app
npm start

# New terminal:
npx react-native run-android  # or run-ios
```

### **2. Basic Test Flow**
1. **Launch app** → See green header "Noise Monitor"
2. **Tap "Start Monitoring"** → Grant microphone permission
3. **Stay silent** → Should show ~30-45 dB, "Quiet" (green)
4. **Talk normally** → Should show ~50-65 dB, "Normal" (yellow)
5. **Shout or clap** → Should show ~70-85 dB, "Noisy" (red)
6. **Check history** → Last 10 readings visible at bottom

### **3. What to Check**
✅ Values update every ~500ms
✅ Colors match noise level (green/yellow/red)
✅ No crashes or freezes
✅ History accumulates readings

---

## 📱 **What We Built - At a Glance**

### **Code Entry Point**
```
index.js (registers app)
  ↓
App.tsx (root component)
  ↓
HomeScreen.tsx (main screen)
  ↓
[All components render here]
```

### **Audio Processing Flow**
```
Microphone (44.1kHz)
  ↓
AudioService.ts → captures audio samples
  ↓
DecibelCalculator.ts → converts to dB
  ↓
MovingAverageFilter.ts → smooths spikes
  ↓
FFTProcessor.ts → extracts frequency features
  ↓
NoiseClassifier.ts → categorizes as Quiet/Normal/Noisy
  ↓
HomeScreen.tsx → updates UI
```

### **Key Components**
- **AudioService** (`src/services/AudioService.ts`) - Audio capture
- **DecibelCalculator** (`src/utils/DecibelCalculator.ts`) - dB calculation
- **MovingAverageFilter** (`src/utils/MovingAverageFilter.ts`) - Smoothing
- **FFTProcessor** (`src/utils/FFTProcessor.ts`) - Frequency analysis
- **NoiseClassifier** (`src/services/NoiseClassifier.ts`) - Classification
- **HomeScreen** (`src/screens/HomeScreen.tsx`) - Main UI
- **Components** (`src/components/`) - UI pieces

---

## 🧪 **Essential Tests**

### **Test 1: Permission Flow (2 min)**
- Tap "Start Monitoring"
- **Grant** permission → Should start monitoring
- Kill app, relaunch, tap "Start"
- **Deny** permission → Should show error message

### **Test 2: Real-Time Audio (3 min)**
- Stay silent → 30-45 dB (green "Quiet")
- Talk normally → 50-65 dB (yellow "Normal")
- Shout/clap → 70-85+ dB (red "Noisy")
- Verify smooth transitions

### **Test 3: Classification Accuracy (5 min)**
| Location | Expected dB | Expected Category |
|----------|-------------|-------------------|
| Library/quiet room | 30-49 | Quiet (green) |
| Hallway/cafeteria | 50-70 | Normal (yellow) |
| Gym/construction | 70-100 | Noisy (red) |

### **Test 4: History (1 min)**
- Monitor for 1 minute
- Check bottom of screen
- Should see list of readings with timestamps

### **Test 5: Error Handling (2 min)**
- Tap Start/Stop rapidly 5 times
- Make a phone call while monitoring
- Both should work without crashes

---

## 🎯 **Expected Behavior**

### **Visual Indicators**
```
Quiet (<50dB):
  Color: Green (#4CAF50)
  Icon: 🔇
  Description: "Library-level quiet"

Normal (50-70dB):
  Color: Yellow/Orange (#FF9800)
  Icon: 🔊
  Description: "Moderate background noise"

Noisy (>70dB):
  Color: Red (#F44336)
  Icon: 📢
  Description: "Disruptive noise levels"
```

### **Performance**
- **Update frequency:** Every ~500ms
- **Latency:** < 1 second from sound to display
- **Battery:** < 5% drain per hour
- **Memory:** Stable, no leaks

---

## 🐛 **Common Issues**

### **Problem:** dB always shows 0
**Fix:** Check microphone permission in device settings

### **Problem:** App crashes on Start
**Fix:**
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### **Problem:** Classification always "Normal"
**Fix:** Test in more extreme environments (very quiet or very loud)

### **Problem:** Metro bundler error
**Fix:**
```bash
npx react-native start --reset-cache
```

---

## 📊 **Quick Verification Checklist**

- [ ] App launches successfully
- [ ] Permission dialog appears
- [ ] dB values update in real-time
- [ ] Classification changes with noise level
- [ ] Colors match categories (green/yellow/red)
- [ ] History shows readings
- [ ] No crashes or freezes
- [ ] Performance feels smooth

---

## 📝 **Log Your Results**

```
Device: [Model]
OS: [Android/iOS version]
Date: [Date]

✅ Works | ❌ Broken | ⚠️ Issues

[ ] Audio capture
[ ] dB display
[ ] Classification
[ ] History
[ ] Performance

Notes:
_______________________________
```

---

## 🚀 **Ready for Phase 2?**

Phase 1 is complete when:
- ✅ All tests pass
- ✅ No critical bugs
- ✅ Classification accuracy > 70%
- ✅ Performance meets targets

**Next:** GPS & Mapping (Phase 2)

---

For detailed testing, see [PHASE1_MANUAL_TESTING_GUIDE.md](./PHASE1_MANUAL_TESTING_GUIDE.md)
