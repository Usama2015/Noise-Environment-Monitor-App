# Campus Noise Monitor - Demo Script

**Duration:** 5-7 minutes
**Presenter:** [Team Member Name]
**Date:** December 2025

---

## Pre-Demo Checklist

Before starting the demo:
- [ ] Phone charged (>50%)
- [ ] App installed and working
- [ ] Firebase has test data populated
- [ ] Metro bundler running (`npm start`)
- [ ] ADB reverse set up (`adb reverse tcp:8081 tcp:8081`)
- [ ] Phone connected to same network as laptop (for live reload if needed)

---

## Demo Flow

### Part 1: Introduction (30 seconds)

**Say:**
> "Today we're demonstrating our Campus Noise Monitor app. This app helps students find quiet study spaces on campus by measuring noise levels in real-time and visualizing them on a map."

**Show:**
- App icon on phone
- Brief glimpse of both tabs

---

### Part 2: Monitor Tab - Recording Noise (2 minutes)

**Say:**
> "Let me show you how easy it is to record noise levels."

**Actions:**
1. Open the app (should be on Monitor tab)
2. Point out the UI:
   - "Here's our location selector - building and room"
   - "Below that, you'll see the decibel display"

3. Select location:
   - Tap Building dropdown → Select "Horizon Hall"
   - Tap Room dropdown → Select "Atrium"
   - "I've selected my current location"

4. Start monitoring:
   - Tap "Start Monitoring" button
   - "The app is now listening to ambient noise"

5. Show real-time updates:
   - "Watch the decibel meter update in real-time"
   - "It shows [X] decibels right now"
   - "The classification shows this is a [Quiet/Normal/Moderate/Noisy] environment"

6. Show the history:
   - Scroll down to show readings history
   - "Each reading is logged with timestamp and classification"

7. Stop monitoring:
   - Tap "Stop Monitoring"
   - "The data has been uploaded to our Firebase cloud database"

---

### Part 3: Campus Map Tab - Visualization (2 minutes)

**Say:**
> "Now let's see how this data appears on the campus map."

**Actions:**
1. Tap "Campus Map" tab
2. Show the map:
   - "This is a Google Map centered on GMU's Fairfax campus"
   - "Each colored circle represents a noise reading"

3. Explain the colors:
   - Point to the legend
   - "Blue means quiet - under 40 decibels, like a library"
   - "Green is normal conversation level - 40 to 60 decibels"
   - "Yellow is moderate - getting louder, 60 to 80 decibels"
   - "Red means noisy - over 80 decibels"

4. Show the time window slider:
   - "This slider lets me filter by time"
   - Slide from 60 minutes to 10 minutes
   - "Now I'm only seeing readings from the last 10 minutes"
   - "Older readings automatically fade out - that's our time decay system"

5. Show real-time sync:
   - "If someone else records noise right now, it would appear here automatically"
   - "All data syncs through Firebase in real-time"

---

### Part 4: Technical Highlights (1 minute)

**Say:**
> "Let me briefly mention some technical aspects:"

**Points to cover:**
- "We're using React Native for cross-platform development"
- "Audio processing follows IEC 61672 standards for accurate dB measurement"
- "Firebase provides anonymous authentication and real-time database sync"
- "The map uses Google Maps with custom circle overlays"
- "Time decay ensures you see relevant, recent data"

---

### Part 5: Use Case Scenario (1 minute)

**Say:**
> "Imagine you're a student looking for a quiet place to study."

**Scenario:**
1. Open the app
2. Go to Campus Map tab
3. "I can see that the library area has blue circles - it's quiet there"
4. "But this area near the food court is showing red and yellow - too noisy"
5. "Based on this, I'll head to the library for my study session"

---

### Part 6: Q&A (remaining time)

**Say:**
> "That's our Campus Noise Monitor app. Any questions?"

**Possible questions and answers:**

**Q: How accurate is the decibel measurement?**
> "We calibrated against standard sound level meters. It's within ±5 dB, which is acceptable for environmental monitoring."

**Q: Does it work offline?**
> "Currently it requires an internet connection for Firebase sync. Offline mode could be a future enhancement."

**Q: How does it handle battery consumption?**
> "Audio monitoring uses about 3-5% battery per hour. We recommend stopping monitoring when not actively measuring."

**Q: Can multiple users contribute data?**
> "Yes! Each user's data is uploaded to the shared Firebase database and appears on everyone's map in real-time."

---

## Backup Plan

If the live demo fails:

1. **App won't start:**
   - Show screenshots from phone gallery
   - Walk through the flow verbally

2. **No network/Firebase issues:**
   - The app still shows cached data
   - Explain that live sync is a feature but app works with cached data

3. **Phone issues:**
   - Have teammate's phone as backup
   - Pre-recorded screen recording as last resort

---

## Demo Data

Before the demo, run the test data script to populate Firebase:

```bash
cd mobile-app
node scripts/populate-test-data.js
```

This creates 15 sample readings across different buildings with varying noise levels and ages (for time decay demonstration).

---

## Post-Demo

- Thank the audience
- Share the GitHub repo URL if requested
- Mention future enhancements:
  - iOS support
  - Offline mode
  - Push notifications for quiet spaces
  - Historical trend analysis

---

**Last Updated:** December 2, 2025
