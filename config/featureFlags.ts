// Feature flags for enabling/disabling features during development

export const FEATURE_FLAGS = {
  // Authentication
  ENABLE_FIREBASE_AUTH: process.env.EXPO_PUBLIC_ENABLE_FIREBASE_AUTH === 'true',
  ENABLE_GOOGLE_AUTH: process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH === 'true',
  ENABLE_EMAIL_AUTH: process.env.EXPO_PUBLIC_ENABLE_EMAIL_AUTH === 'true',
  ENABLE_PASSWORD_RESET: process.env.EXPO_PUBLIC_ENABLE_PASSWORD_RESET === 'true',

  // Supabase Data
  ENABLE_SUPABASE_DATA: process.env.EXPO_PUBLIC_ENABLE_SUPABASE_DATA === 'true',

  // Features
  ENABLE_PROFILE_UPLOAD: process.env.EXPO_PUBLIC_ENABLE_PROFILE_UPLOAD === 'true',
  ENABLE_SKIN_SCAN: process.env.EXPO_PUBLIC_ENABLE_SKIN_SCAN === 'true',
  ENABLE_ONBOARDING: process.env.EXPO_PUBLIC_ENABLE_ONBOARDING === 'true',
};

// Check if all auth features are enabled
export const isAuthEnabled = () =>
  FEATURE_FLAGS.ENABLE_FIREBASE_AUTH ||
  FEATURE_FLAGS.ENABLE_EMAIL_AUTH ||
  FEATURE_FLAGS.ENABLE_GOOGLE_AUTH;
