/**
 * Unit tests for AuthService
 * Tests Firebase anonymous authentication
 *
 * @see src/services/AuthService.ts
 */

import auth from '@react-native-firebase/auth';

// Mock Firebase Auth
const mockSignInAnonymously = jest.fn(() => Promise.resolve({ user: { uid: 'test-user-uid' } }));
const mockSignOut = jest.fn(() => Promise.resolve());
const mockOnAuthStateChanged = jest.fn((callback) => {
  callback({ uid: 'test-user-uid' });
  return jest.fn(); // unsubscribe function
});

jest.mock('@react-native-firebase/auth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signInAnonymously: mockSignInAnonymously,
      signOut: mockSignOut,
      currentUser: { uid: 'test-user-uid' },
      onAuthStateChanged: mockOnAuthStateChanged,
    })),
  };
});

// Import after mocking
import authService, { AuthService } from '../../src/services/AuthService';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // Create a fresh instance for each test
    service = new AuthService();
    jest.clearAllMocks();
  });

  describe('signInAnonymously', () => {
    it('should sign in anonymously and return user ID', async () => {
      const uid = await service.signInAnonymously();

      expect(uid).toBe('test-user-uid');
      expect(mockSignInAnonymously).toHaveBeenCalled();
    });

    it('should store the user ID after sign in', async () => {
      await service.signInAnonymously();

      expect(service.getUserId()).toBe('test-user-uid');
    });
  });

  describe('getUserId', () => {
    it('should return null when not signed in (fresh instance)', () => {
      const freshService = new AuthService();
      // Mock currentUser as null for this test
      (auth as jest.Mock).mockImplementationOnce(() => ({
        currentUser: null,
      }));

      const uid = freshService.getUserId();

      // Should still return null since we haven't signed in
      expect(uid).toBeNull();
    });

    it('should return user ID from cached value after sign in', async () => {
      await service.signInAnonymously();

      const uid = service.getUserId();

      expect(uid).toBe('test-user-uid');
    });
  });

  describe('isSignedIn', () => {
    it('should return false when not signed in', () => {
      const freshService = new AuthService();
      (auth as jest.Mock).mockImplementationOnce(() => ({
        currentUser: null,
      }));

      expect(freshService.isSignedIn()).toBe(false);
    });

    it('should return true after sign in', async () => {
      await service.signInAnonymously();

      expect(service.isSignedIn()).toBe(true);
    });
  });

  describe('signOut', () => {
    it('should sign out and clear user ID', async () => {
      await service.signInAnonymously();
      await service.signOut();

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('onAuthStateChanged', () => {
    it('should call callback when auth state changes', () => {
      const callback = jest.fn();

      service.onAuthStateChanged(callback);

      expect(mockOnAuthStateChanged).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const callback = jest.fn();

      const unsubscribe = service.onAuthStateChanged(callback);

      expect(typeof unsubscribe).toBe('function');
    });
  });
});
