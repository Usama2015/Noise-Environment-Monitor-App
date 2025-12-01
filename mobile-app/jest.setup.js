// Jest setup file for React Native Testing Library
// Built-in matchers are now included in @testing-library/react-native v12.4+

// Global test timeout
jest.setTimeout(10000);

// Mock react-native-sound-level
jest.mock('react-native-sound-level', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  onNewFrame: null,
}));

// Mock @react-native-community/geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: {
        latitude: 38.8304,
        longitude: -77.3078,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    })
  ),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  return {
    Picker: ({ children, ...props }) => React.createElement('Picker', props, children),
  };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock Firebase modules
jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    signInAnonymously: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
    currentUser: { uid: 'test-uid' },
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: 'test-uid' });
      return jest.fn();
    }),
  }),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    collection: jest.fn(() => ({
      add: jest.fn(() => Promise.resolve({ id: 'test-doc-id' })),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            onSnapshot: jest.fn((callback) => {
              callback({ docs: [] });
              return jest.fn();
            }),
          })),
        })),
      })),
    })),
  }),
  FirebaseFirestoreTypes: {
    Timestamp: {
      now: jest.fn(() => ({ toDate: () => new Date() })),
    },
  },
}));
