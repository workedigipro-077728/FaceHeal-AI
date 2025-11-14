import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useRootNavigationState } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import { RoutineProvider } from '@/context/RoutineContext';

const ONBOARDING_KEY = 'onboarding_completed';

export const unstable_settings = {
  anchor: 'onboarding/welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  // Check onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
        setIsOnboarded(completed === 'true');
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsOnboarded(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Navigate based on onboarding status when navigation is ready
  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (isOnboarded === null) return;

    setIsNavigationReady(true);

    // Small delay to ensure navigation stack is ready
    const timer = setTimeout(() => {
      if (isOnboarded) {
        router.replace('/auth');
      } else {
        router.replace('/onboarding/welcome');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [rootNavigationState?.key, isOnboarded]);

  return (
    <CustomThemeProvider>
      <RoutineProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="onboarding"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="auth"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="payment"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </RoutineProvider>
    </CustomThemeProvider>
  );
}
