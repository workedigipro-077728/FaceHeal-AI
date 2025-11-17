import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FEATURE_FLAGS } from "@/config/featureFlags";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC86nmWcJuhu7B871hLO3fJKNYCnenGYh0",
  authDomain: "healface-ai-pt.firebaseapp.com",
  projectId: "healface-ai-pt",
  storageBucket: "healface-ai-pt.firebasestorage.app",
  messagingSenderId: "867337291458",
  appId: "1:867337291458:web:e233d243c9fbae40f4dd5b",
};

// Initialize Firebase - Ensure this runs synchronously
let app;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
}

app = app || getApp();

try {
  auth = getAuth(app);
  // Set persistence to LOCAL for web
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn("Persistence setting error (this is OK):", error);
  });
} catch (error) {
  // Auth already initialized, this is OK
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);

// Helper function to handle errors
const getErrorMessage = (error: any): string => {
  const errorCode = error.code || "";
  const errorMap: { [key: string]: string } = {
    "auth/email-already-in-use": "Email is already in use",
    "auth/invalid-email": "Invalid email address",
    "auth/weak-password": "Password is too weak (minimum 6 characters)",
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-credential": "Invalid credentials",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/too-many-requests":
      "Too many failed login attempts. Try again later.",
    "auth/network-request-failed":
      "Network error. Check your internet connection.",
  };
  return errorMap[errorCode] || error.message || "An error occurred";
};

// Sign Up
export const signUp = async (email: string, password: string) => {
  if (!FEATURE_FLAGS.ENABLE_EMAIL_AUTH) {
    return { data: null, error: "Email authentication is currently disabled" };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { data: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { data: null, error: getErrorMessage(error) };
  }
};

// Sign In
export const signIn = async (email: string, password: string) => {
  if (!FEATURE_FLAGS.ENABLE_EMAIL_AUTH) {
    return { data: null, error: "Email authentication is currently disabled" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { data: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { data: null, error: getErrorMessage(error) };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error("Sign out error:", error);
    return { error: getErrorMessage(error) };
  }
};

// Reset Password
export const resetPassword = async (email: string) => {
  if (!FEATURE_FLAGS.ENABLE_PASSWORD_RESET) {
    return { error: "Password reset is currently disabled" };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { error: getErrorMessage(error) };
  }
};

// Google Sign In/Sign Up
export const signInWithGoogle = async () => {
  if (!FEATURE_FLAGS.ENABLE_GOOGLE_AUTH) {
    return { data: null, error: "Google authentication is currently disabled" };
  }

  try {
    const provider = new GoogleAuthProvider();

    // Configure scopes
    provider.addScope("profile");
    provider.addScope("email");

    // Set custom parameters for optimal UX
    provider.setCustomParameters({
      prompt: "consent", // Always show account selection
    });

    // Check if we're handling a redirect
    try {
      const redirectResult = await getRedirectResult(auth);
      if (redirectResult) {
        console.log("Google sign-in successful via redirect");
        return { data: redirectResult.user, error: null };
      }
    } catch (redirectError: any) {
      console.warn("Redirect result error:", redirectError);
      // Continue with popup attempt
    }

    // Try popup first (better UX for web)
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful via popup");
      return { data: result.user, error: null };
    } catch (popupError: any) {
      // Handle specific popup errors
      if (
        popupError.code === "auth/popup-blocked" ||
        popupError.code === "auth/popup-closed-by-user"
      ) {
        console.log("Popup blocked/closed, using redirect flow");
        await signInWithRedirect(auth, provider);
        // Redirect will reload the page, return null
        return { data: null, error: null };
      } else if (popupError.code === "auth/cancelled-popup-request") {
        return { data: null, error: "Sign-in was cancelled" };
      }
      throw popupError;
    }
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    return { data: null, error: getErrorMessage(error) };
  }
};

// Handle Google redirect result (call this on app startup/page load)
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Handling Google redirect result");
      return { data: result.user, error: null };
    }
    return { data: null, error: null };
  } catch (error: any) {
    console.error("Google redirect result error:", error);
    return { data: null, error: getErrorMessage(error) };
  }
};

// Register User (legacy)
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// Login User (legacy)
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout User (legacy)
export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// On Auth Change
export const onAuthChange = (callback: (user: User | null) => void) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  return unsubscribe;
};

// Save Scan Data and Generate Personalized Plan
export const saveScanDataAndGeneratePlan = async (
  userId: string,
  scanData: any,
  analysisData: any
) => {
  try {
    const { collection, doc, setDoc, Timestamp } = await import(
      "firebase/firestore"
    );

    const scanDocData = {
      userId,
      scanData: {
        skinType: analysisData?.skinType || scanData?.skinType,
        healthScore: analysisData?.healthScore || 0,
        detectedIssues: analysisData?.detectedIssues || [],
        hydration:
          scanData?.hydration || analysisData?.skinCondition?.hydration,
        acne: scanData?.acne || 0,
        oiliness: scanData?.oiliness || 0,
        ageEstimate: analysisData?.ageEstimate || 0,
        symmetryScore: analysisData?.symmetryScore || 0,
        recommendations: analysisData?.recommendations || {},
      },
      timestamp: Timestamp.now(),
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const scansRef = collection(db, "users", userId, "scans");
    const scanRef = doc(scansRef);
    await setDoc(scanRef, scanDocData);

    return {
      success: true,
      scanId: scanRef.id,
      data: scanDocData,
      error: null,
    };
  } catch (error: any) {
    console.error("Error saving scan data:", error);
    return {
      success: false,
      scanId: null,
      data: null,
      error: getErrorMessage(error),
    };
  }
};

export default app;
