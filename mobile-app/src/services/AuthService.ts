/**
 * AuthService - Firebase Anonymous Authentication
 *
 * Handles silent login without requiring user credentials.
 * Users are automatically assigned a Firebase UID for data attribution.
 */

import auth from '@react-native-firebase/auth';

export class AuthService {
  private currentUserId: string | null = null;

  /**
   * Sign in anonymously
   * This is called automatically when the app starts
   *
   * @returns Promise<string> - Firebase UID
   * @throws Error if sign-in fails
   */
  async signInAnonymously(): Promise<string> {
    try {
      const userCredential = await auth().signInAnonymously();
      this.currentUserId = userCredential.user.uid;

      console.log('[AuthService] Signed in anonymously. User ID:', this.currentUserId);

      return this.currentUserId;
    } catch (error) {
      console.error('[AuthService] Anonymous sign-in failed:', error);
      throw new Error('Failed to sign in anonymously');
    }
  }

  /**
   * Get the current user ID
   *
   * @returns string | null - Firebase UID or null if not signed in
   */
  getUserId(): string | null {
    // Check if there's a cached user ID
    if (this.currentUserId) {
      return this.currentUserId;
    }

    // Otherwise, get from Firebase Auth
    const currentUser = auth().currentUser;
    if (currentUser) {
      this.currentUserId = currentUser.uid;
      return this.currentUserId;
    }

    return null;
  }

  /**
   * Check if user is signed in
   *
   * @returns boolean
   */
  isSignedIn(): boolean {
    return this.getUserId() !== null;
  }

  /**
   * Sign out (optional - mainly for testing)
   *
   * @returns Promise<void>
   */
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
      this.currentUserId = null;
      console.log('[AuthService] Signed out');
    } catch (error) {
      console.error('[AuthService] Sign-out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Listen to auth state changes
   *
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (userId: string | null) => void): () => void {
    return auth().onAuthStateChanged(user => {
      this.currentUserId = user ? user.uid : null;
      callback(this.currentUserId);
    });
  }
}

/**
 * Singleton instance of AuthService
 * Use this instance throughout the application
 */
export default new AuthService();
