import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useOnboarding } from '@/hooks/use-onboarding';

import { OnboardingProgress } from '../components/onboarding-progress';

type GenderOption = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export default function GenderScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const cardBackground = useThemeColor(
    { light: 'rgba(0,0,0,0.04)', dark: 'rgba(255,255,255,0.08)' },
    'background'
  );
  const { completeOnboarding } = useOnboarding();

  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);

  const handleNext = async () => {
    if (selectedGender) {
      // Mark onboarding as complete
      await completeOnboarding();
      // Navigate to authentication
      router.replace('/auth');
    }
  };

  const genderOptions: { value: GenderOption; label: string; icon: string }[] = [
    { value: 'male', label: 'Male', icon: '👨' },
    { value: 'female', label: 'Female', icon: '👩' },
    { value: 'other', label: 'Other', icon: '🧑' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🔒' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <OnboardingProgress currentStep={5} totalSteps={5} />

          <View style={styles.form}>
            <ThemedText type="title" style={styles.title}>
              What's your gender?
            </ThemedText>
            <ThemedText style={styles.description}>
              This helps us provide personalized recommendations.
            </ThemedText>

            <View style={styles.optionsContainer}>
              {genderOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor:
                        selectedGender === option.value
                          ? tintColor + '20'
                          : cardBackground,
                      borderColor: selectedGender === option.value ? tintColor : 'transparent',
                      borderWidth: selectedGender === option.value ? 2 : 0,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => setSelectedGender(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${option.label}`}
                >
                  <ThemedText style={styles.optionIcon}>{option.icon}</ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.optionLabel,
                      {
                        color:
                          selectedGender === option.value
                            ? tintColor
                            : undefined,
                      },
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: selectedGender ? tintColor : '#CCCCCC',
                opacity: pressed && selectedGender ? 0.85 : 1,
              },
            ]}
            onPress={handleNext}
            disabled={!selectedGender}
            accessibilityRole="button"
            accessibilityLabel="Complete onboarding"
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Complete Setup
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  form: {
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    minHeight: 72,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionLabel: {
    fontSize: 18,
    flex: 1,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

