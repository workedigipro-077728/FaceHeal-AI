import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Custom storage for Supabase auth using AsyncStorage
const ExpoAsyncStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoAsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear AsyncStorage manually to ensure all session data is removed
    await AsyncStorage.removeItem('sb-' + SUPABASE_URL.split('/')[2] + '-auth-token');
    
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
