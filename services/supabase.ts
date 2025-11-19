import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

let AsyncStorage: any = null;

// Only import AsyncStorage in React Native environments
try {
  if (Platform.OS !== 'web') {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  }
} catch (e) {
  // AsyncStorage not available
  AsyncStorage = null;
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug: Log initialization with key analysis
console.log('========== SUPABASE CONFIG DEBUG ==========');
console.log('URL:', SUPABASE_URL || 'NOT SET');
console.log('URL length:', SUPABASE_URL.length);

if (SUPABASE_ANON_KEY) {
  console.log('Key present: YES');
  console.log('Key length:', SUPABASE_ANON_KEY.length);
  console.log('Key preview:', `${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  console.log('Key starts with "ey":', SUPABASE_ANON_KEY.startsWith('ey'));
  console.log('Key has quotes:', SUPABASE_ANON_KEY.includes('"'));
  console.log('Key trim length:', SUPABASE_ANON_KEY.trim().length);
} else {
  console.log('Key present: NO');
}

console.log('Platform:', Platform.OS);
console.log('=========================================');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️  CRITICAL: SUPABASE ENV VARS MISSING!');
  console.error('Required in .env.local:');
  console.error('EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here');
  console.error('⚠️  Make sure there are NO quotes around the values!');
}

// In-memory fallback storage
const memoryStorage: Record<string, string> = {};

// Web localStorage support
const webStorage = typeof window !== 'undefined' ? window.localStorage : null;

// Custom storage adapter for Supabase
const createStorageAdapter = () => {
  return {
    getItem: async (key: string) => {
      try {
        // Try AsyncStorage first (React Native)
        if (AsyncStorage && Platform.OS !== 'web') {
          return await AsyncStorage.getItem(key);
        }
        // Try localStorage (web)
        if (webStorage) {
          return webStorage.getItem(key);
        }
        // Fallback to memory
        return memoryStorage[key] || null;
      } catch (error) {
        console.warn('Storage.getItem error:', error);
        return memoryStorage[key] || null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        // Try AsyncStorage first (React Native)
        if (AsyncStorage && Platform.OS !== 'web') {
          await AsyncStorage.setItem(key, value);
          return;
        }
        // Try localStorage (web)
        if (webStorage) {
          webStorage.setItem(key, value);
          return;
        }
      } catch (error) {
        console.warn('Storage.setItem error:', error);
      }
      // Always backup to memory
      memoryStorage[key] = value;
    },
    removeItem: async (key: string) => {
      try {
        // Try AsyncStorage first (React Native)
        if (AsyncStorage && Platform.OS !== 'web') {
          await AsyncStorage.removeItem(key);
          return;
        }
        // Try localStorage (web)
        if (webStorage) {
          webStorage.removeItem(key);
          return;
        }
      } catch (error) {
        console.warn('Storage.removeItem error:', error);
      }
      // Always cleanup memory
      delete memoryStorage[key];
    },
  };
};

const ExpoAsyncStorage = createStorageAdapter();

// Validate and format Supabase URL
const validateSupabaseUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove trailing slash
  url = url.trim().replace(/\/$/, '');
  
  // Ensure https
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  
  console.log('Final Supabase URL:', url);
  return url;
};

const validatedUrl = validateSupabaseUrl(SUPABASE_URL);

export const supabase = createClient(validatedUrl, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoAsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test connection to Supabase
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return { success: true };
  } catch (err: any) {
    console.error('❌ Supabase connection failed:', err.message);
    console.error('URL:', validatedUrl);
    console.error('Key set:', !!SUPABASE_ANON_KEY);
    return { success: false, error: err.message };
  }
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { data: null, error: 'Supabase configuration missing. Check environment variables.' };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    const errorMessage = error.message || 'Sign up failed';
    console.error('SignUp error:', errorMessage);
    
    // More helpful error messages
    if (errorMessage.includes('fetch')) {
      return { data: null, error: 'Network error. Check your internet connection and Supabase URL.' };
    }
    if (errorMessage.includes('401') || errorMessage.includes('invalid')) {
      return { data: null, error: 'Invalid credentials. Check your Supabase key.' };
    }
    
    return { data: null, error: errorMessage };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      const msg = 'Supabase not configured. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.local';
      console.error(msg);
      return { data: null, error: msg };
    }
    
    console.log('Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    console.log('Sign in successful');
    return { data, error: null };
  } catch (error: any) {
    const errorMessage = error.message || error.toString() || 'Sign in failed';
    console.error('❌ SignIn error details:');
    console.error('Message:', errorMessage);
    console.error('Full error:', error);
    console.error('Supabase URL:', SUPABASE_URL);
    console.error('API Key length:', SUPABASE_ANON_KEY.length);
    console.error('API Key preview:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
    
    // More helpful error messages
    if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
      return { 
        data: null, 
        error: `Connection failed. Supabase URL: ${SUPABASE_URL}. Check internet and URL validity.` 
      };
    }
    if (errorMessage.includes('401') || errorMessage.includes('invalid')) {
      return { data: null, error: 'Invalid email or password.' };
    }
    if (errorMessage.includes('network')) {
      return { data: null, error: 'Network error. Check your internet connection.' };
    }
    
    return { data: null, error: errorMessage };
  }
};

export const signOut = async () => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear all storage methods
    Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    
    if (webStorage) {
      try {
        webStorage.clear();
      } catch (e) {
        console.warn('localStorage clear warning:', e);
      }
    }
    
    if (AsyncStorage && Platform.OS !== 'web') {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.warn('AsyncStorage clear warning:', e);
      }
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('SignOut error:', error);
    return { error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.EXPO_PUBLIC_APP_URL || 'exp://localhost:8081'}/auth/reset`,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_URL || 'exp://localhost:8081'}/auth/callback`,
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// ==================== USER DATA FUNCTIONS ====================

// User Profile
export const createUserProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: userId,
        ...profileData,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Skin Scans
export const uploadSkinScan = async (userId: string, imageFile: File, analysisData: any) => {
  try {
    // Upload image to storage
    const fileName = `${userId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase
      .storage
      .from('skin-scans')
      .upload(fileName, imageFile, { upsert: false });
    
    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('skin-scans')
      .getPublicUrl(fileName);

    // Save scan record
    const { data, error } = await supabase
      .from('skin_scans')
      .insert([{
        user_id: userId,
        image_url: publicUrl,
        ...analysisData,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const getSkinScans = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('skin_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Onboarding Data
export const saveOnboardingData = async (userId: string, onboardingData: any) => {
  try {
    const { data, error } = await supabase
      .from('onboarding_data')
      .insert([{
        user_id: userId,
        ...onboardingData,
        completed_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const getOnboardingData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// User Pictures
export const uploadUserPicture = async (userId: string, imageFile: File, category: string) => {
  try {
    const fileName = `${userId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase
      .storage
      .from('user-pictures')
      .upload(fileName, imageFile, { upsert: false });
    
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage
      .from('user-pictures')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('user_pictures')
      .insert([{
        user_id: userId,
        picture_url: publicUrl,
        category,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const getUserPictures = async (userId: string, category?: string) => {
  try {
    let query = supabase
      .from('user_pictures')
      .select('*')
      .eq('user_id', userId);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};
