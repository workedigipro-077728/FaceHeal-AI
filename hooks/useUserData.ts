import { useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  uploadSkinScan,
  getSkinScans,
  saveOnboardingData,
  getOnboardingData,
  uploadUserPicture,
  getUserPictures,
} from '@/services/supabase';

export const useUserData = () => {
  const { user } = useAuth();
  const userId = user?.uid || '';

  // Profile functions
  const createProfile = useCallback(
    async (profileData: any) => {
      if (!userId) return { data: null, error: 'User not authenticated' };
      return createUserProfile(userId, profileData);
    },
    [userId]
  );

  const getProfile = useCallback(async () => {
    if (!userId) return { data: null, error: 'User not authenticated' };
    return getUserProfile(userId);
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: any) => {
      if (!userId) return { data: null, error: 'User not authenticated' };
      return updateUserProfile(userId, updates);
    },
    [userId]
  );

  // Scan functions
  const uploadScan = useCallback(
    async (imageFile: File, analysisData?: any) => {
      if (!userId) return { data: null, error: 'User not authenticated' };
      return uploadSkinScan(userId, imageFile, analysisData || {});
    },
    [userId]
  );

  const getScans = useCallback(async () => {
    if (!userId) return { data: null, error: 'User not authenticated' };
    return getSkinScans(userId);
  }, [userId]);

  // Onboarding functions
  const saveOnboarding = useCallback(
    async (data: any) => {
      if (!userId) return { data: null, error: 'User not authenticated' };
      return saveOnboardingData(userId, data);
    },
    [userId]
  );

  const getOnboarding = useCallback(async () => {
    if (!userId) return { data: null, error: 'User not authenticated' };
    return getOnboardingData(userId);
  }, [userId]);

  // Picture functions
  const uploadPicture = useCallback(
    async (imageFile: File, category: string) => {
      if (!userId) return { data: null, error: 'User not authenticated' };
      return uploadUserPicture(userId, imageFile, category);
    },
    [userId]
  );

  const getPictures = useCallback(
    async (category?: string) => {
      if (!userId) return { data: null, error: 'User not authenticated' };
      return getUserPictures(userId, category);
    },
    [userId]
  );

  return {
    // Profile
    createProfile,
    getProfile,
    updateProfile,
    // Scans
    uploadScan,
    getScans,
    // Onboarding
    saveOnboarding,
    getOnboarding,
    // Pictures
    uploadPicture,
    getPictures,
  };
};
