/**
 * Firebase Test Data Population Script
 *
 * This script populates Firebase Firestore with test noise readings
 * around Horizon Hall at GMU for heatmap visualization testing.
 *
 * Horizon Hall coordinates: 38.828536, -77.307352
 *
 * Usage:
 *   1. First install firebase-admin: npm install firebase-admin
 *   2. Download service account key from Firebase Console:
 *      - Go to Project Settings > Service Accounts
 *      - Click "Generate new private key"
 *      - Save as serviceAccountKey.json in this scripts folder
 *   3. Run: node scripts/populate-test-data.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Check for service account key
let serviceAccountPath;
try {
  serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  require(serviceAccountPath);
} catch (e) {
  console.error(`
ERROR: serviceAccountKey.json not found!

To fix this:
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project (SWE699Lec12)
3. Go to Project Settings (gear icon) > Service Accounts
4. Click "Generate new private key"
5. Save the downloaded file as:
   ${path.join(__dirname, 'serviceAccountKey.json')}
6. Run this script again
  `);
  process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Horizon Hall center coordinates
const HORIZON_HALL = {
  latitude: 38.828536,
  longitude: -77.307352,
};

// Rooms in Horizon Hall
const HORIZON_ROOMS = ['Atrium', '2nd Floor Labs', '3rd Floor Breakout'];

// Classification based on dB level
function classifyNoise(db) {
  if (db < 50) return 'quiet';
  if (db < 70) return 'normal';
  return 'noisy';
}

// Generate a random coordinate near the center point
function randomNearby(center, radiusMeters = 50) {
  // Approximate: 1 degree latitude = 111,000 meters
  // 1 degree longitude = 111,000 * cos(latitude) meters
  const latOffset = (Math.random() - 0.5) * 2 * (radiusMeters / 111000);
  const lngOffset =
    (Math.random() - 0.5) *
    2 *
    (radiusMeters / (111000 * Math.cos((center.latitude * Math.PI) / 180)));

  return {
    latitude: center.latitude + latOffset,
    longitude: center.longitude + lngOffset,
  };
}

// Generate test data scenarios
function generateTestScenarios() {
  const scenarios = [];
  const now = Date.now();

  console.log('\n--- Test Data Scenarios ---\n');

  // Scenario 1: Fresh data (last 2 minutes) - should show at full intensity
  console.log('Scenario 1: Fresh readings (0-2 min old) - Full intensity');
  for (let i = 0; i < 5; i++) {
    const coords = randomNearby(HORIZON_HALL, 30);
    const room = HORIZON_ROOMS[Math.floor(Math.random() * HORIZON_ROOMS.length)];
    const db = 60 + Math.random() * 30; // 60-90 dB (normal to noisy)
    const ageMinutes = Math.random() * 2; // 0-2 minutes old

    scenarios.push({
      decibel: Math.round(db * 10) / 10,
      classification: classifyNoise(db),
      location: {
        building: 'Horizon Hall',
        room: room,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      timestamp: admin.firestore.Timestamp.fromMillis(now - ageMinutes * 60 * 1000),
      userId: 'test-user-fresh',
      deviceId: 'test-device',
      sessionId: 'test-session-fresh',
    });
  }

  // Scenario 2: Decaying data (2-5 minutes) - should show with reduced intensity
  console.log('Scenario 2: Decaying readings (2-5 min old) - Reduced intensity');
  for (let i = 0; i < 5; i++) {
    const coords = randomNearby(HORIZON_HALL, 40);
    const room = HORIZON_ROOMS[Math.floor(Math.random() * HORIZON_ROOMS.length)];
    const db = 70 + Math.random() * 20; // 70-90 dB (noisy)
    const ageMinutes = 2 + Math.random() * 3; // 2-5 minutes old

    scenarios.push({
      decibel: Math.round(db * 10) / 10,
      classification: classifyNoise(db),
      location: {
        building: 'Horizon Hall',
        room: room,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      timestamp: admin.firestore.Timestamp.fromMillis(now - ageMinutes * 60 * 1000),
      userId: 'test-user-decay',
      deviceId: 'test-device',
      sessionId: 'test-session-decay',
    });
  }

  // Scenario 3: Old data (5-10 minutes) - should show very faint
  console.log('Scenario 3: Old readings (5-10 min old) - Very faint');
  for (let i = 0; i < 3; i++) {
    const coords = randomNearby(HORIZON_HALL, 50);
    const room = HORIZON_ROOMS[Math.floor(Math.random() * HORIZON_ROOMS.length)];
    const db = 80 + Math.random() * 15; // 80-95 dB (very noisy)
    const ageMinutes = 5 + Math.random() * 5; // 5-10 minutes old

    scenarios.push({
      decibel: Math.round(db * 10) / 10,
      classification: classifyNoise(db),
      location: {
        building: 'Horizon Hall',
        room: room,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      timestamp: admin.firestore.Timestamp.fromMillis(now - ageMinutes * 60 * 1000),
      userId: 'test-user-old',
      deviceId: 'test-device',
      sessionId: 'test-session-old',
    });
  }

  // Scenario 4: Quiet spot (for contrast)
  console.log('Scenario 4: Quiet spot - Low intensity reading');
  const quietCoords = randomNearby(HORIZON_HALL, 20);
  scenarios.push({
    decibel: 35,
    classification: 'quiet',
    location: {
      building: 'Horizon Hall',
      room: 'Atrium',
      latitude: quietCoords.latitude,
      longitude: quietCoords.longitude,
    },
    timestamp: admin.firestore.Timestamp.fromMillis(now - 1 * 60 * 1000), // 1 min old
    userId: 'test-user-quiet',
    deviceId: 'test-device',
    sessionId: 'test-session-quiet',
  });

  // Scenario 5: Hot spot (high noise)
  console.log('Scenario 5: Hot spot - Maximum intensity');
  const hotCoords = randomNearby(HORIZON_HALL, 10);
  scenarios.push({
    decibel: 95,
    classification: 'noisy',
    location: {
      building: 'Horizon Hall',
      room: '2nd Floor Labs',
      latitude: hotCoords.latitude,
      longitude: hotCoords.longitude,
    },
    timestamp: admin.firestore.Timestamp.fromMillis(now - 0.5 * 60 * 1000), // 30 sec old
    userId: 'test-user-hot',
    deviceId: 'test-device',
    sessionId: 'test-session-hot',
  });

  return scenarios;
}

// Main function
async function main() {
  console.log('\n========================================');
  console.log('  Firebase Test Data Population Script');
  console.log('========================================\n');

  console.log('Target: Horizon Hall, GMU');
  console.log(`Center: ${HORIZON_HALL.latitude}, ${HORIZON_HALL.longitude}\n`);

  const scenarios = generateTestScenarios();

  console.log(`\nTotal readings to insert: ${scenarios.length}\n`);

  // Use batch write for efficiency
  const batch = db.batch();
  const collectionRef = db.collection('noise_readings');

  for (const reading of scenarios) {
    const docRef = collectionRef.doc();
    batch.set(docRef, reading);
    console.log(
      `  + ${reading.location.room}: ${reading.decibel} dB (${reading.classification})`
    );
  }

  console.log('\nCommitting batch...');
  await batch.commit();

  console.log('\n========================================');
  console.log('  SUCCESS! Test data inserted.');
  console.log('========================================\n');

  console.log('Next steps:');
  console.log('1. Open the app on your device');
  console.log('2. Go to the "Campus Map" tab');
  console.log('3. Navigate to Horizon Hall area');
  console.log('4. Use the time window slider to see decay effects');
  console.log('   - 1 min: Only very fresh data');
  console.log('   - 5 min: Fresh + some decayed data');
  console.log('   - 10 min: All test data with varying intensity\n');

  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
