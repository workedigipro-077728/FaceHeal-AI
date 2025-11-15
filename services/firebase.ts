import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - Update with your Firebase project credentials
const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

// Firebase Auth handlers
let currentUser: any = null;

// Initialize auth state listener
const initializeAuthListener = (callback: (user: any) => void) => {
  // This will be replaced with actual Firebase implementation
  const user = AsyncStorage.getItem('firebase_user').then((data) => {
    if (data) {
      currentUser = JSON.parse(data);
      callback(currentUser);
    }
  });
};

// Sign Up
export const signUp = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return { data: null, error: data.error.message };
    }

    // Save user info
    const user = {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };

    await AsyncStorage.setItem('firebase_user', JSON.stringify(user));
    currentUser = user;

    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Sign In
export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return { data: null, error: data.error.message };
    }

    // Save user info
    const user = {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };

    await AsyncStorage.setItem('firebase_user', JSON.stringify(user));
    currentUser = user;

    return { data: user, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await AsyncStorage.removeItem('firebase_user');
    currentUser = null;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const userString = await AsyncStorage.getItem('firebase_user');
    if (userString) {
      currentUser = JSON.parse(userString);
      return { user: currentUser, error: null };
    }
    currentUser = null;
    return { user: null, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Reset Password
export const resetPassword = async (email: string) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_CONFIG.apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          requestType: 'PASSWORD_RESET',
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return { data: null, error: data.error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // For Expo, you would use expo-auth-session or similar
    // This is a placeholder that needs proper implementation
    return {
      data: null,
      error: 'Google Sign-In requires additional setup with expo-auth-session',
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export { FIREBASE_CONFIG, currentUser };
