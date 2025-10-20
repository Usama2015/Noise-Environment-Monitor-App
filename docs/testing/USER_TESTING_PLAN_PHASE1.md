# Phase 1 User Testing Plan - Noise Environment Monitor App

**Version:** 1.0.0
**Date:** 2025-10-20
**Phase:** Phase 1 - Core Mobile App
**Testing Period:** Week 5 (Before Phase 2 begins)
**Status:** Ready for Execution

---

## 📋 Executive Summary

### Purpose
Conduct structured user testing sessions with 5-8 real users to validate Phase 1 functionality (audio capture, noise measurement, and classification) before proceeding to Phase 2 (GPS & Mapping).

### Goals
1. Validate that users understand the app's purpose
2. Verify accuracy of noise classification in real-world scenarios
3. Identify usability issues and pain points
4. Gather qualitative feedback on UI/UX
5. Measure user satisfaction (target: 4+/5 stars)

### Success Criteria
- ✅ 5+ users complete testing sessions
- ✅ Average System Usability Scale (SUS) score ≥ 68 (above average)
- ✅ Classification accuracy validated in 3 environments (Quiet/Normal/Noisy)
- ✅ 90% of users complete all tasks without assistance
- ✅ Critical bugs identified and documented

---

## 👥 Participant Recruitment

### Target Users
**Primary:** GMU students aged 18-30 who study on campus

### Recruitment Criteria
**Include:**
- Own an Android or iOS smartphone
- Study on campus at least 2 days/week
- Willing to provide honest feedback
- Available for 30-minute testing session

**Exclude:**
- Team members involved in development
- Users with hearing impairments (may affect testing)
- Users who don't speak English fluently

### Recruitment Methods
1. **Campus Flyers:** Post in library, student union, computer science building
2. **Social Media:** Post in GMU student Facebook groups, Reddit, Discord
3. **Direct Outreach:** Ask classmates, friends, dormmates
4. **Incentive:** $10 Starbucks gift card OR extra credit (if approved by professor)

### Target Sample Size
- **Minimum:** 5 users
- **Target:** 8 users
- **Ideal:** 10 users (for better statistical validity)

### Recruitment Message Template
```
📱 PAID BETA TESTERS NEEDED ($10 Gift Card!) 📱

Help test a new campus app that finds quiet study spaces!

What: Test a mobile app that measures noise levels
Where: [Location on campus]
When: [Date range]
How long: 30 minutes
Reward: $10 Starbucks gift card

Requirements:
✓ GMU student
✓ Own Android/iOS phone
✓ Study on campus regularly

Sign up: [Google Form Link]
Questions: [Your email]

Spots limited - first come, first served!
```

---

## 📅 Testing Schedule

### Timeline
- **Week 4, Day 6-7:** Recruit participants
- **Week 5, Day 1-3:** Conduct testing sessions
- **Week 5, Day 4:** Analyze results
- **Week 5, Day 5:** Create summary report
- **Week 5, Day 6:** Present findings to team

### Session Schedule (Example)
```
Monday:
  10:00 AM - Participant 1
  11:00 AM - Participant 2
  2:00 PM  - Participant 3

Tuesday:
  10:00 AM - Participant 4
  11:00 AM - Participant 5
  2:00 PM  - Participant 6

Wednesday:
  10:00 AM - Participant 7
  11:00 AM - Participant 8
```

**Duration per session:** 30 minutes
- 5 min: Introduction & consent
- 15 min: Guided testing tasks
- 5 min: Feedback survey
- 5 min: Open discussion & questions

---

## 📍 Testing Locations

### Required Environments
Test the app in 3 different noise environments to validate classification:

#### 1. **Quiet Environment** (Target: <50 dB)
- **Location Options:**
  - Fenwick Library study room
  - Empty classroom
  - Quiet corner of student center (early morning)
- **Expected Classification:** "Quiet" (Green)

#### 2. **Normal Environment** (Target: 50-70 dB)
- **Location Options:**
  - Cafeteria during lunch
  - Student center main area
  - Outdoor courtyard with moderate activity
- **Expected Classification:** "Normal" (Yellow/Orange)

#### 3. **Noisy Environment** (Target: >70 dB)
- **Location Options:**
  - Near construction area
  - Busy road/parking lot
  - Gym during peak hours
  - Cafeteria at peak lunch time
- **Expected Classification:** "Noisy" (Red)

### Testing Flow
Each participant will:
1. Start at **Quiet location** (5 min)
2. Walk to **Normal location** (5 min)
3. Walk to **Noisy location** (5 min)
4. Return to quiet area for survey/discussion

---

## 📋 Testing Tasks

### Pre-Session Setup
**Moderator checklist:**
- [ ] Install latest app build on test device
- [ ] Charge device to 100%
- [ ] Clear app data (fresh start)
- [ ] Test microphone permission flow
- [ ] Prepare consent form
- [ ] Prepare feedback survey (printed or digital)
- [ ] Prepare incentive (gift card)

---

### Task 1: App Installation & First Launch
**Objective:** Test onboarding and permission flow

**Instructions to user:**
> "I'm going to share a link to install the app. Please download and open it."

**Steps:**
1. Moderator shares APK/TestFlight link
2. User installs app
3. User opens app for first time
4. User grants microphone permission when prompted

**What to observe:**
- Does user hesitate at permission request?
- Is the permission dialog clear?
- Does user understand why microphone is needed?

**Success criteria:**
- ✅ User successfully installs app
- ✅ User grants microphone permission
- ✅ No confusion about permission request

---

### Task 2: Start Monitoring in Quiet Environment
**Objective:** Test basic monitoring functionality in quiet space

**Instructions to user:**
> "We're in a quiet area. Tap the 'Start Monitoring' button and observe what happens for 30 seconds."

**What to observe:**
- Does button respond immediately?
- Do decibel readings update smoothly?
- Does classification show "Quiet"?
- Is the green color scheme clear?
- Does user understand the displayed information?

**Questions to ask:**
- "What does the number at the top represent?" (Answer: Decibel level)
- "What does the green badge mean?" (Answer: Quiet environment)
- "How confident are you that this reading is accurate?" (1-5 scale)

**Success criteria:**
- ✅ Monitoring starts without errors
- ✅ Decibel reading < 50 dB
- ✅ Classification shows "Quiet"
- ✅ User understands displayed information

---

### Task 3: Observe Noise Changes (Quiet → Normal)
**Objective:** Test responsiveness to changing noise levels

**Instructions to user:**
> "Now we're going to walk to a busier area. Keep the app running and watch how the readings change."

**What to observe:**
- Do readings update as environment changes?
- Does classification transition from "Quiet" to "Normal"?
- Is the color change noticeable?
- Does moving average smooth out walking noise?

**Questions to ask:**
- "Did you notice when the classification changed?"
- "Was the transition smooth or abrupt?"
- "Do the readings match what you're hearing?"

**Success criteria:**
- ✅ Classification transitions from "Quiet" to "Normal"
- ✅ Decibel readings increase appropriately (50-70 dB)
- ✅ Color changes to yellow/orange
- ✅ Changes feel responsive but not jittery

---

### Task 4: Extreme Noise Testing (Normal → Noisy)
**Objective:** Test in loudest environment available

**Instructions to user:**
> "Let's move to the noisiest area nearby. Observe how the app responds."

**What to observe:**
- Does app handle very loud noise correctly?
- Does classification show "Noisy"?
- Is red color/warning clear?
- Does app remain stable (no crashes)?

**Questions to ask:**
- "Would you trust this app to find a quiet place to study?"
- "Is the 'Noisy' classification helpful?"
- "What additional information would you want to see?"

**Success criteria:**
- ✅ Classification shows "Noisy"
- ✅ Decibel readings > 70 dB
- ✅ Red theme displayed clearly
- ✅ No app crashes or freezes

---

### Task 5: View Noise History
**Objective:** Test history feature usability

**Instructions to user:**
> "Scroll down to view your recent noise readings. What do you notice?"

**What to observe:**
- Does user understand the history list?
- Are timestamps clear?
- Is color coding consistent?
- Can user interpret the data?

**Questions to ask:**
- "What does this history show you?"
- "Is this information useful?"
- "Would you want to see more history (e.g., from yesterday)?"

**Success criteria:**
- ✅ User finds history section without help
- ✅ User understands what history shows
- ✅ Timestamps are accurate and clear

---

### Task 6: Stop Monitoring
**Objective:** Test stopping functionality

**Instructions to user:**
> "Stop the monitoring when you're ready."

**What to observe:**
- Can user find stop button?
- Does app stop cleanly?
- Does UI update appropriately?

**Success criteria:**
- ✅ User stops monitoring successfully
- ✅ Button changes to "Start Monitoring"
- ✅ No errors or crashes

---

## 📊 Data Collection Methods

### Quantitative Metrics

#### 1. Task Completion Rate
Track for each task:
- **Success:** Completed without assistance
- **Success with help:** Completed after moderator guidance
- **Failure:** Could not complete

**Target:** >90% success rate without help

#### 2. Time on Task
Measure time to complete each task:
- Task 2: Start monitoring (target: <10 seconds)
- Task 5: Find history (target: <15 seconds)
- Task 6: Stop monitoring (target: <5 seconds)

#### 3. Classification Accuracy
Compare app classification vs. moderator observation:
```
Environment: Quiet Library
App Says: "Quiet" (42 dB)
Moderator: ✅ Correct

Environment: Cafeteria
App Says: "Normal" (63 dB)
Moderator: ✅ Correct

Environment: Construction
App Says: "Noisy" (78 dB)
Moderator: ✅ Correct
```

**Target:** >85% agreement with moderator assessment

#### 4. System Usability Scale (SUS)
10-question standardized usability questionnaire
**Target:** SUS score ≥ 68 (above average)

#### 5. Net Promoter Score (NPS)
"How likely are you to recommend this app to a friend?" (0-10)
**Target:** NPS ≥ 0 (more promoters than detractors)

---

### Qualitative Data

#### 1. Think-Aloud Protocol
Ask users to verbalize thoughts while testing:
- "What are you looking at?"
- "What are you thinking?"
- "What do you expect to happen?"

**Record:**
- Confusion points
- Delight moments
- Unexpected behaviors
- Suggestions

#### 2. Post-Session Interview
Open-ended questions:
1. "What was your overall impression of the app?"
2. "What did you like most?"
3. "What frustrated you?"
4. "Would you actually use this app to find study spaces? Why or why not?"
5. "What's missing that you expected to see?"
6. "If you could change one thing, what would it be?"

#### 3. Observation Notes
Moderator records:
- Facial expressions (confusion, delight, frustration)
- Hesitations and pauses
- Attempts before success
- Verbalized confusion
- Unsolicited feedback

---

## 📝 Feedback Survey

See complete survey in: `USER_FEEDBACK_SURVEY.md`

**Survey Structure:**
1. Demographics (5 questions)
2. Task Experience (6 questions)
3. Feature Satisfaction (10 questions)
4. Usability (10 questions - SUS)
5. Overall Satisfaction (3 questions)
6. Open Feedback (3 questions)

**Total time:** ~5 minutes

---

## 🎯 Analysis Framework

### Step 1: Organize Data (Day 4)
1. Compile all survey responses into spreadsheet
2. Transcribe observation notes
3. Compile task completion rates
4. Calculate metrics (SUS, NPS, accuracy)

### Step 2: Identify Patterns (Day 4)
Look for:
- **Common pain points** (mentioned by 3+ users)
- **Consistent successes** (praised by 3+ users)
- **Usability issues** (failed tasks, long times)
- **Classification errors** (app incorrect vs. reality)

### Step 3: Categorize Findings (Day 4)
**Critical (Must Fix):**
- Prevents core functionality
- Affects >50% of users
- Example: App crashes in noisy environment

**High Priority (Should Fix):**
- Significantly impacts usability
- Affects 25-50% of users
- Example: Unclear permission dialog

**Medium Priority (Nice to Have):**
- Minor usability issue
- Affects <25% of users
- Example: Button too small

**Low Priority (Future Enhancement):**
- Feature request
- Not blocking current use
- Example: "I wish it had themes"

### Step 4: Create Summary Report (Day 5)
Include:
- Executive summary (1 page)
- Key findings (2-3 pages)
- Quantitative metrics (1 page)
- User quotes (1 page)
- Prioritized recommendations (1-2 pages)
- Appendix: Raw data, full survey responses

---

## 📋 Testing Script for Moderator

See complete script in: `USER_TESTING_SCRIPT.md`

**Key responsibilities:**
- Welcome participant warmly
- Explain consent and recording (if any)
- Give clear instructions for each task
- Avoid leading questions
- Observe without interrupting
- Record notes systematically
- Thank participant and provide incentive

---

## 📊 Results Tracking

See tracking template in: `USER_TESTING_RESULTS.md`

**Tracks:**
- Participant demographics
- Task completion (yes/no/time)
- Survey responses
- Observation notes
- Classification accuracy
- Issues encountered
- Quotes

---

## ⚠️ Risk Mitigation

### Potential Issues & Solutions

#### Issue 1: Not enough participants
**Mitigation:**
- Start recruiting early (Week 4)
- Offer compelling incentive
- Use multiple recruitment channels
- Ask team members to share
- Extend recruitment period if needed

#### Issue 2: App crashes during testing
**Mitigation:**
- Pre-test app thoroughly
- Have backup devices ready
- Document crash circumstances
- Continue with next task if possible
- Mark as critical bug

#### Issue 3: Participants don't show up
**Mitigation:**
- Send reminder email 24h before
- Send reminder text 1h before
- Overbook by 20% (e.g., schedule 10 for 8 target)
- Have walk-up backup plan

#### Issue 4: Testing locations too noisy/quiet
**Mitigation:**
- Scout locations beforehand
- Have 2-3 backup locations per category
- Be flexible with timing (cafeteria quieter at 2pm vs. noon)
- Use decibel meter app to pre-validate

#### Issue 5: Participant bias (trying to be nice)
**Mitigation:**
- Emphasize honesty: "We want real feedback, not nice feedback"
- Ask specific questions, not "Do you like it?"
- Use task-based testing (observe actions, not just ask)
- Assure anonymity in results

---

## ✅ Success Checklist

### Before Testing
- [ ] Recruited 5+ participants
- [ ] Scheduled testing sessions
- [ ] Scouted all 3 testing locations
- [ ] Prepared test devices with latest build
- [ ] Printed consent forms
- [ ] Prepared feedback surveys (digital or print)
- [ ] Purchased gift cards
- [ ] Prepared moderator script
- [ ] Set up note-taking system
- [ ] Tested app on all devices

### During Testing
- [ ] Welcomed participant
- [ ] Obtained consent
- [ ] Explained study purpose
- [ ] Guided through all 6 tasks
- [ ] Collected survey responses
- [ ] Conducted post-interview
- [ ] Thanked participant
- [ ] Provided incentive

### After Testing
- [ ] Organized all data
- [ ] Analyzed findings
- [ ] Categorized issues by priority
- [ ] Created summary report
- [ ] Presented to team
- [ ] Updated PROGRESS_REPORT.md
- [ ] Created GitHub issues for bugs

---

## 📄 Deliverables

### Required Documents
1. **User Testing Plan** (this document)
2. **Feedback Survey** (`USER_FEEDBACK_SURVEY.md`)
3. **Moderator Script** (`USER_TESTING_SCRIPT.md`)
4. **Results Tracking** (`USER_TESTING_RESULTS.md`)
5. **Summary Report** (`USER_TESTING_SUMMARY_REPORT.md` - after testing)

### Data to Collect
- Completed surveys (5+ responses)
- Task completion data
- Observation notes
- Classification accuracy data
- SUS scores
- NPS score
- Issue screenshots (if any)

---

## 📞 Contact & Resources

**Testing Coordinator:** [Team member name]
**Email:** [Email]
**Phone:** [Phone] (for day-of coordination)

**Participant Sign-up Form:** [Google Form URL]
**Testing Location Map:** [Google Maps links]
**Latest APK/Build:** [Download link]

---

## 🎓 Academic Considerations

### Learning Objectives
- Practice user research methods
- Gain experience with usability testing
- Learn to analyze qualitative feedback
- Develop professional testing documentation

### Documentation for Course
- Testing plan (submit to instructor)
- Results summary (include in progress report)
- User quotes (use in final presentation)
- Lessons learned (include in final report)

---

**Approved by:** Development Team
**Last Updated:** 2025-10-20
**Next Review:** After test session completion
**Status:** ✅ Ready for execution

---

