import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/authContext';

const ONBOARDING_KEY = 'onboarding_completed';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleNavigation = async () => {
      if (loading) return; // Wait for auth to load

      try {
        const onboarded = await AsyncStorage.getItem(ONBOARDING_KEY);

        if (user) {
          // User is logged in
          router.replace('/(tabs)');
        } else if (onboarded === 'true') {
          // User completed onboarding but not logged in
          router.replace('/auth');
        } else {
          // New user
          router.replace('/onboarding/welcome');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        router.replace('/auth');
      }
    };

    handleNavigation();
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <ActivityIndicator size="large" color="#06b6d4" />
    </View>
  );
}
