# Quick Testing Checklist

**Quick Reference:** Use this while testing to track progress

---

## 📱 **BUILD & INSTALL**

```bash
cd D:\OtherDevelopment\INFS\mobile-app
npm run android
```

- [ ] App builds successfully
- [ ] App installs on device
- [ ] App launches without crashing

---

## ✅ **FEATURE TESTS**

### **1. Microphone Permission**
- [ ] Permission dialog appears
- [ ] "Allow" works → monitoring starts
- [ ] "Deny" shows error message (doesn't crash)

### **2. Audio Capture**
- [ ] Decibel value displays (within 1 second)
- [ ] Updates approximately every 1 second
- [ ] Format: "XX.X dB" (e.g., "65.3 dB")

### **3. Environment Tests**

**Quiet (<50dB):**
- [ ] Reading: 30-49 dB
- [ ] Label: "🟢 Quiet"
- [ ] Color: Green
- Actual: _____ dB

**Normal (50-70dB):**
- [ ] Reading: 50-70 dB
- [ ] Label: "🟡 Normal"
- [ ] Color: Yellow/Orange
- Actual: _____ dB

**Noisy (>70dB):**
- [ ] Reading: >70 dB
- [ ] Label: "🔴 Noisy"
- [ ] Color: Red
- Actual: _____ dB

### **4. Moving Average Filter**
- [ ] Clap test: Spike smooths gradually (not instant)
- [ ] No jittery values
- [ ] Stabilizes in 2-3 seconds

### **5. Classification Accuracy**
Test 8 locations, aim for 6/8 correct:
- [ ] Library silent: Quiet
- [ ] Library reading: Quiet/Normal
- [ ] Hallway empty: Quiet
- [ ] Hallway busy: Normal
- [ ] Cafeteria off-peak: Normal
- [ ] Cafeteria lunch: Noisy
- [ ] Traffic/outdoor: Noisy
- [ ] Gym: Noisy

**Score: ___ / 8 = ___%**

### **6. Noise History**
- [ ] Shows last 10 readings
- [ ] Each shows: dB + classification + time
- [ ] Newest at top
- [ ] After 11th reading, oldest removed

### **7. UI Color Changes**
- [ ] Green when quiet
- [ ] Yellow when normal
- [ ] Red when noisy
- [ ] Transitions smoothly

### **8. Start/Stop**
- [ ] "Start Monitoring" → starts capture
- [ ] Button changes to "Stop Monitoring"
- [ ] "Stop Monitoring" → freezes display
- [ ] Can restart multiple times

### **9. Performance (15 min test)**
- Battery at start: 100%
- Battery after 15 min: _____%
- Battery drain: _____%
- [ ] Drain <2% (acceptable)
- [ ] No lag/freezing
- [ ] No overheating

---

## 🐛 **ISSUES FOUND**

**Critical (App broken):**
1. _______________________________________________
2. _______________________________________________

**Major (Feature broken):**
1. _______________________________________________
2. _______________________________________________

**Minor (Usability):**
1. _______________________________________________
2. _______________________________________________

---

## 📊 **FINAL SCORE**

Tests Passed: ___ / 13
Pass Rate: ___%

**Ready for Phase 2?** ☐ Yes ☐ No (needs fixes)

---

## 🎯 **ACCEPTANCE CRITERIA**

- [ ] All 13 tests pass (or max 1 minor failure)
- [ ] No critical bugs
- [ ] Classification accuracy >75% (6/8)
- [ ] Battery drain <2% in 15 min
- [ ] Decibel readings within ±10 dB of reference

**Result:** ☐ PASS ☐ FAIL

---

**Date Tested:** _______________
**Tester:** _______________
**Device:** _______________
