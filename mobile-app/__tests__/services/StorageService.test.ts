/**
 * Unit tests for StorageService
 * Tests Firestore operations for noise readings
 *
 * @see src/services/StorageService.ts
 */

// Mock dependencies before imports
const mockAdd = jest.fn(() => Promise.resolve({ id: 'test-doc-id' }));
const mockGet = jest.fn(() => Promise.resolve({ forEach: jest.fn() }));
const mockUnsubscribe = jest.fn();
const mockOnSnapshot = jest.fn((successCallback) => {
  successCallback({
    forEach: (fn: (doc: any) => void) => {
      fn({
        id: 'doc1',
        data: () => ({
          decibel: 65,
          classification: 'Normal',
          location: {
            latitude: 38.8304,
            longitude: -77.3078,
            building: 'Fenwick Library',
            room: '2nd Floor',
          },
          sessionId: 'session-1',
          userId: 'user-1',
          timestamp: { toDate: () => new Date() },
        }),
      });
    },
  });
  return mockUnsubscribe;
});

jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore: any = jest.fn(() => ({
    collection: jest.fn(() => ({
      add: mockAdd,
      where: jest.fn(() => ({
        onSnapshot: mockOnSnapshot,
        orderBy: jest.fn(() => ({
          get: mockGet,
          limit: jest.fn(() => ({
            get: mockGet,
          })),
        })),
      })),
      limit: jest.fn(() => ({
        get: mockGet,
      })),
    })),
  }));

  // Add FieldValue as a static property
  mockFirestore.FieldValue = {
    serverTimestamp: jest.fn(() => 'server-timestamp'),
  };

  return {
    __esModule: true,
    default: mockFirestore,
  };
});

jest.mock('../../src/services/AuthService', () => ({
  __esModule: true,
  default: {
    getUserId: jest.fn(() => 'test-user-uid'),
    isSignedIn: jest.fn(() => true),
    signInAnonymously: jest.fn(() => Promise.resolve('test-user-uid')),
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

// Import after mocking
import { StorageService } from '../../src/services/StorageService';
import { NoiseReading } from '../../src/types';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
    jest.clearAllMocks();
  });

  describe('saveReading', () => {
    it('should save a noise reading to Firestore', async () => {
      const reading: NoiseReading = {
        decibel: 65,
        classification: 'Normal',
        location: {
          latitude: 38.8304,
          longitude: -77.3078,
          building: 'Fenwick Library',
          room: '2nd Floor',
        },
        sessionId: 'test-session-id',
      };

      const docId = await service.saveReading(reading);

      expect(docId).toBe('test-doc-id');
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          decibel: 65,
          classification: 'Normal',
          sessionId: 'test-session-id',
          userId: 'test-user-uid',
        }),
      );
    });

    it('should include location data in the reading', async () => {
      const reading: NoiseReading = {
        decibel: 75,
        classification: 'Noisy',
        location: {
          latitude: 38.831,
          longitude: -77.308,
          building: 'Johnson Center',
          room: 'Food Court',
        },
        sessionId: 'session-123',
      };

      await service.saveReading(reading);

      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          location: {
            latitude: 38.831,
            longitude: -77.308,
            building: 'Johnson Center',
            room: 'Food Court',
          },
        }),
      );
    });

    it('should include server timestamp', async () => {
      const reading: NoiseReading = {
        decibel: 50,
        classification: 'Quiet',
        location: {
          latitude: 38.83,
          longitude: -77.31,
          building: 'Horizon Hall',
          room: 'Atrium',
        },
        sessionId: 'session-456',
      };

      await service.saveReading(reading);

      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: 'server-timestamp',
        }),
      );
    });
  });

  describe('subscribeToHeatmap', () => {
    it('should return unsubscribe function', () => {
      const callback = jest.fn();

      const unsubscribe = service.subscribeToHeatmap(callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should call callback with readings when data arrives', () => {
      const callback = jest.fn();

      service.subscribeToHeatmap(callback);

      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            decibel: 65,
            classification: 'Normal',
          }),
        ]),
      );
    });
  });

  describe('testConnection', () => {
    it('should return true when connection succeeds', async () => {
      const result = await service.testConnection();

      expect(result).toBe(true);
    });
  });
});
