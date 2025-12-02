# User Testing Preparation Checklist - Phase 1

**Version:** 1.0.0
**Target Testing Date:** Week 5, Days 1-3
**Preparation Timeline:** 7-10 days before testing
**Status:** 📋 Planning

---

## 📅 Timeline

### Week 4, Day 6-7 (10-9 days before)
- [ ] **Recruit participants** (see Recruitment section)
- [ ] **Scout testing locations** (see Locations section)
- [ ] **Order gift cards** ($10 Starbucks x 10 participants)

### Week 5, Day -2 (2 days before first session)
- [ ] **Test app thoroughly** (see Technical Checklist)
- [ ] **Prepare devices** (see Device Setup)
- [ ] **Print materials** (see Materials section)
- [ ] **Confirm participants** (email/text reminders)

### Week 5, Day -1 (1 day before)
- [ ] **Final app test on all devices**
- [ ] **Charge all devices to 100%**
- [ ] **Visit testing locations** (confirm accessible)
- [ ] **Send 24-hour reminders** to participants

### Testing Day Morning
- [ ] **Charge devices again**
- [ ] **Pack testing kit** (see Materials Checklist)
- [ ] **Send 1-hour reminders** to participants
- [ ] **Arrive 15 min early** at first location

---

## 👥 Participant Recruitment

### Recruitment Timeline
**Start:** Week 4, Day 6 (10 days before testing)
**Target:** 8 confirmed participants (to get 5-6 completed sessions)

### Step 1: Create Recruitment Materials
- [ ] Write recruitment message (template in USER_TESTING_PLAN)
- [ ] Create Google Form for sign-ups
- [ ] Design flyer (if posting on campus)
- [ ] Create social media posts

**Google Form Questions:**
```
1. Name: ____________
2. Email: ____________
3. Phone: ____________
4. Age range: [dropdown]
5. GMU student? Yes/No
6. Study on campus regularly? Yes/No
7. Phone type? iOS/Android
8. Availability (select all):
   - Monday 10am / 11am / 2pm
   - Tuesday 10am / 11am / 2pm
   - Wednesday 10am / 11am / 2pm
9. Any accessibility needs? ____________
```

---

### Step 2: Post Recruitment
- [ ] **Campus Flyers** (3 locations minimum)
  - Fenwick Library bulletin board
  - Computer science building
  - Student union
- [ ] **Social Media** (3 platforms)
  - GMU subreddit
  - GMU Facebook groups
  - GMU Discord servers
- [ ] **Direct Outreach**
  - Classmates in INFS course
  - Friends/roommates who study on campus
  - Ask teammates to share

---

### Step 3: Manage Sign-ups
- [ ] Check Google Form daily
- [ ] Email confirmations within 24 hours:
```
Subject: Confirmed - Noise Monitor App Testing ($10 Gift Card)

Hi [Name],

Thank you for signing up to test our app! You're confirmed for:

Date: [Date]
Time: [Time]
Location: [Meeting spot]
Duration: 30 minutes
Reward: $10 Starbucks gift card

What to bring:
- Your phone (charged)
- Yourself ready for a short walk around campus

We'll meet at [specific location with map link], then walk to a few different spots to test the app.

I'll send you a reminder 24 hours before, and another 1 hour before.

Looking forward to meeting you!
Questions? Reply to this email or text: [Your phone]

Best,
[Your name]
[Team name]
```

- [ ] Create calendar invites for each participant
- [ ] Update tracking spreadsheet (USER_TESTING_RESULTS.md)

---

### Step 4: Send Reminders
**24 Hours Before:**
```
Subject: Reminder - Testing Tomorrow at [Time]

Hi [Name],

Just a reminder that your testing session is tomorrow:

⏰ Time: [Time]
📍 Location: [Place]
⏱ Duration: 30 min
🎁 Reward: $10 gift card

See you then!
[Your name]
```

**1 Hour Before:**
```
Text: Hi [Name]! Reminder: we're meeting in 1 hour at [location] for the app testing. See you soon!
```

---

## 📍 Location Scouting

### Week 4, Day 6-7: Visit & Confirm Locations

#### Quiet Location (Target: <50 dB)
**Primary:** Fenwick Library study room
- [ ] Visit location during testing hours
- [ ] Test with decibel meter app (confirm <50 dB)
- [ ] Check room availability / reservation needed?
- [ ] Confirm WiFi / cell service works
- [ ] Take photos for reference

**Backup Options:**
- [ ] Empty classroom (Building: _____, Room: _____)
- [ ] Early morning student center (Time: _____)

---

#### Normal Location (Target: 50-70 dB)
**Primary:** [Cafeteria / Student Center]
- [ ] Visit during lunch time (busiest)
- [ ] Test with decibel meter app (confirm 50-70 dB)
- [ ] Identify specific spot to stand
- [ ] Check accessibility (crowded? seating?)
- [ ] Take photos for reference

**Backup Options:**
- [ ] Outdoor courtyard (Building: _____)
- [ ] Commons area (Location: _____)

---

#### Noisy Location (Target: >70 dB)
**Primary:** [Construction area / Parking lot / Road]
- [ ] Visit during testing hours
- [ ] Test with decibel meter app (confirm >70 dB)
- [ ] Check safety (not dangerous?)
- [ ] Verify noise is consistent (not sporadic)
- [ ] Take photos for reference

**Backup Options:**
- [ ] Gym during peak hours
- [ ] Different road/parking lot
- [ ] Near HVAC / loud equipment

---

### Create Walking Route
- [ ] Map route: Quiet → Normal → Noisy → Back to quiet
- [ ] Estimate walking time between locations (target: 5 min each)
- [ ] Identify landmarks for easy directions
- [ ] Save route to Google Maps
- [ ] Test walk yourself (time it)

**Route Summary:**
```
Start: [Quiet location]
  ↓ 5 min walk
Stop 2: [Normal location]
  ↓ 5 min walk
Stop 3: [Noisy location]
  ↓ 5 min walk
End: [Quiet location] (for survey/discussion)
```

---

## 🔧 Technical Preparation

### App Testing (Week 5, Day -2)

#### Comprehensive Testing Checklist
- [ ] **Install latest build** on test devices
- [ ] **Fresh install test** (uninstall → reinstall → test)
- [ ] **Test all 6 tasks** from script:
  - [ ] Task 1: Permission request works
  - [ ] Task 2: Monitoring starts successfully
  - [ ] Task 3: Readings update in real-time
  - [ ] Task 4: Classification changes appropriately
  - [ ] Task 5: History displays correctly
  - [ ] Task 6: Monitoring stops cleanly

- [ ] **Test in all 3 environments:**
  - [ ] Quiet: Shows <50 dB, "Quiet", green
  - [ ] Normal: Shows 50-70 dB, "Normal", yellow/orange
  - [ ] Noisy: Shows >70 dB, "Noisy", red

- [ ] **Test edge cases:**
  - [ ] Permission denied → Error message shows
  - [ ] Stop/restart multiple times → No crashes
  - [ ] Background app → Returns properly
  - [ ] Low battery → Works okay

- [ ] **Performance check:**
  - [ ] No freezes or lag
  - [ ] UI updates smoothly (not jittery)
  - [ ] No excessive battery drain
  - [ ] Processing time acceptable

---

### Critical Bug Check
**If ANY of these fail, do NOT proceed with testing:**

| Critical Issue | Status | Fix Required? |
|---------------|--------|---------------|
| App crashes on launch | ☐ Pass ☐ Fail | |
| Permission not working | ☐ Pass ☐ Fail | |
| No audio samples captured | ☐ Pass ☐ Fail | |
| Decibel reading stuck at 0 | ☐ Pass ☐ Fail | |
| Classification never changes | ☐ Pass ☐ Fail | |
| Stop button doesn't work | ☐ Pass ☐ Fail | |

**All must PASS before user testing begins!**

---

### Build Preparation

#### Option 1: Android APK
```bash
cd mobile-app/android

# Create release build
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk

# Test installation:
adb install app-release.apk

# Verify:
adb shell pm list packages | grep com.noisemonitor
```

- [ ] APK built successfully
- [ ] APK size reasonable (<50 MB)
- [ ] Test install on device
- [ ] App icon shows correctly
- [ ] App launches without errors

---

#### Option 2: iOS TestFlight (if testing on iOS)
```bash
cd mobile-app/ios

# Archive build
xcodebuild -workspace NoiseMonitor.xcworkspace \
  -scheme NoiseMonitor \
  -archivePath NoiseMonitor.xcarchive archive

# Upload to TestFlight
# (requires Apple Developer account)
```

- [ ] Build archived successfully
- [ ] Uploaded to TestFlight
- [ ] Invite testers via email
- [ ] Testers can install via TestFlight app

---

#### Option 3: Direct Device Install (Development)
**Android:**
```bash
cd mobile-app
npm run android
```

**iOS:**
```bash
cd mobile-app
npm run ios
```

- [ ] Development build installed
- [ ] App runs from device (not connected to computer)

---

### Device Setup

#### Primary Test Device
- [ ] **Device model:** _____________
- [ ] **OS version:** _____________
- [ ] **Charged to 100%**
- [ ] **App installed and tested**
- [ ] **All other apps closed**
- [ ] **Do Not Disturb mode ON**
- [ ] **Volume at comfortable level (50%)**
- [ ] **Screen brightness adequate**
- [ ] **Auto-lock set to 5 minutes**
- [ ] **Clear app data** (fresh start for each session)

#### Backup Test Device
- [ ] **Device model:** _____________
- [ ] **OS version:** _____________
- [ ] **Charged to 100%**
- [ ] **App installed and tested**
- [ ] **Ready in bag** (in case primary fails)

---

## 📦 Materials Checklist

### Week 5, Day -2: Print & Prepare Materials

#### Documents to Print (8 copies each)
- [ ] **Consent forms** (2 per participant - one for them, one for us)
  - Location: `docs/testing/CONSENT_FORM.pdf` (need to create)
  - Printed: ___ copies
  - Stored: Folder labeled "Consents"

- [ ] **Feedback surveys** (1 per participant)
  - Location: `USER_FEEDBACK_SURVEY.md`
  - Printed: ___ copies
  - Stored: Folder labeled "Surveys"

- [ ] **Moderator script** (1 copy)
  - Location: `USER_TESTING_SCRIPT.md`
  - Printed: ___ copy
  - Stored: In clipboard with script

---

### Physical Materials
- [ ] **Clipboard** (for holding script/taking notes)
- [ ] **Pens/pencils** (at least 3 working pens)
- [ ] **Notebook** (for observation notes)
- [ ] **Folder** for organizing papers
- [ ] **Gift cards** ($10 Starbucks x 8)
  - Purchased: ☐ Yes ☐ No
  - Codes recorded: ☐ Yes ☐ No
  - Stored safely: ☐ Yes ☐ No

---

### Technology
- [ ] **Primary test device** (charged, app installed)
- [ ] **Backup test device** (charged, app installed)
- [ ] **Personal phone** (for emergencies, timer, photos)
- [ ] **Portable charger** (fully charged)
- [ ] **Charging cables** (USB-C, Lightning as needed)
- [ ] **Laptop** (optional - for notes, if preferred)

---

### Other Items
- [ ] **Water bottles** (for you and participant)
- [ ] **Tissues** (just in case)
- [ ] **Watch or timer** (to track 30-minute sessions)
- [ ] **Umbrella** (if weather is uncertain)
- [ ] **Tote bag** to carry everything
- [ ] **Name tag** (optional - "Noise Monitor Team")

---

## 📝 Consent Form Creation

### Create Consent Form (Week 4, Day 7)

**File:** `docs/testing/CONSENT_FORM.md`

**Content to include:**
```markdown
# Research Participant Consent Form

## Study Title
User Testing for Noise Environment Monitor Mobile Application

## Researchers
[Your names]
[Course name]
[Institution]

## Purpose
You are invited to participate in a research study to evaluate the usability
and functionality of a mobile application designed to measure environmental
noise levels on campus.

## Procedures
If you agree to participate, you will:
- Test a mobile app for approximately 30 minutes
- Walk to 3 different campus locations
- Complete tasks guided by a researcher
- Fill out a short survey about your experience

## Risks & Benefits
- Minimal risk (similar to normal walking around campus)
- Benefit: $10 Starbucks gift card + early access to helpful campus app

## Confidentiality
- Your responses will be kept confidential
- Data will be stored securely
- Only aggregated, anonymized results will be published
- You will be assigned a participant ID (P001, P002, etc.)

## Voluntary Participation
- Participation is completely voluntary
- You may withdraw at any time without penalty
- You may skip any questions you're uncomfortable answering

## Contact Information
Questions about the study:
- Researcher: [Name], [Email], [Phone]
- Faculty Advisor: [Professor Name], [Email]

## Consent
I have read this consent form and agree to participate in this study.

Participant Signature: _____________  Date: _______
Participant Name (printed): _____________

Researcher Signature: _____________  Date: _______
Researcher Name (printed): _____________

Participant Copy: ☐  Researcher Copy: ☐
```

- [ ] Consent form created
- [ ] Reviewed by teammate
- [ ] Reviewed by professor (if required)
- [ ] Printed (16 copies - 2 per participant)

---

## 🎯 Final Pre-Testing Check

### Day Before Testing (Week 5, Day -1)

#### Technical
- [ ] All devices charged to 100%
- [ ] App tested on all devices (works perfectly)
- [ ] Backup APK/build available (on laptop/USB)
- [ ] Google Form / digital survey link works

#### Materials
- [ ] All printed materials packed
- [ ] Gift cards secured and counted (8 total)
- [ ] Pens/clipboard ready
- [ ] Water bottles filled

#### Logistics
- [ ] All participants confirmed (emailed back)
- [ ] Testing locations accessible
- [ ] Walking route mapped
- [ ] Weather forecast checked (bring umbrella?)
- [ ] Personal schedule clear (no conflicts)

#### Mental
- [ ] Read USER_TESTING_SCRIPT.md completely
- [ ] Practiced greeting/introduction
- [ ] Understand what you're testing (not defending the app)
- [ ] Ready to listen, observe, and learn

---

### Morning of Testing

**2 Hours Before First Session:**
- [ ] Charge devices one more time
- [ ] Clear app data on all devices
- [ ] Test app quickly (2-min smoke test)
- [ ] Pack testing kit
  - [ ] Devices + chargers
  - [ ] Printed materials
  - [ ] Gift cards
  - [ ] Pens/notebook
  - [ ] Water
  - [ ] Moderator script

**1 Hour Before:**
- [ ] Send 1-hour reminder texts to participants
- [ ] Leave for testing location (arrive 15 min early)
- [ ] Find meeting spot
- [ ] Do final device check
- [ ] Review script one more time

**Arrival (15 min before):**
- [ ] Set up at meeting location
- [ ] Turn phone to Do Not Disturb (except for participant calls)
- [ ] Have clipboard ready with script
- [ ] Have consent form + pen ready
- [ ] Deep breath - you got this! 😊

---

## ✅ Pre-Testing Sign-Off

**I confirm that:**
- [ ] I have recruited 5+ participants
- [ ] All testing locations are confirmed
- [ ] The app works perfectly (all tests passed)
- [ ] I have all printed materials ready
- [ ] I have all gift cards secured
- [ ] Devices are charged and ready
- [ ] I have read the moderator script thoroughly
- [ ] I understand my role (observe, don't defend)
- [ ] I am ready to conduct professional user testing

**Signed:** _____________
**Date:** _____________
**Time to first session:** ___ hours

---

## 📞 Emergency Contacts

**Technical Issues:**
- Developer: [Name], [Phone]

**Participant No-Shows:**
- Have backup recruitment message ready
- Can post "walk-up testing available now" on social media

**Location Issues:**
- Have backup locations identified for each category

**Personal Emergency:**
- Can teammate cover? [Name], [Phone]
- Reschedule participants: [Process]

---

**Good luck with your user testing! 🎉**

**Remember:**
- Be warm and friendly
- Stay neutral (don't defend the app)
- Listen more than you talk
- Every insight is valuable
- You're doing great research!

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-20
**Prepared By:** Development Team

