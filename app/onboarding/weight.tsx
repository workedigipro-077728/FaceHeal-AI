import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { OnboardingProgress } from '../components/onboarding-progress';

export default function WeightScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333' }, 'icon');

  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const handleNext = () => {
    const weightNum = parseFloat(weight);
    if (weightNum > 0) {
      // TODO: Save to profile/store
      router.push('/onboarding/gender');
    }
  };

  const isValid = () => {
    const weightNum = parseFloat(weight);
    if (unit === 'kg') {
      return weightNum >= 30 && weightNum <= 300;
    } else {
      return weightNum >= 66 && weightNum <= 660;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <OnboardingProgress currentStep={4} totalSteps={5} />

          <View style={styles.form}>
            <ThemedText type="title" style={styles.title}>
              What's your weight?
            </ThemedText>
            <ThemedText style={styles.description}>
              This helps us provide accurate health insights.
            </ThemedText>

            <View style={styles.unitSelector}>
              <Pressable
                style={({ pressed }) => [
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'kg' ? tintColor : 'transparent',
                    borderColor: tintColor,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => setUnit('kg')}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.unitText, { color: unit === 'kg' ? '#fff' : tintColor }]}
                >
                  kg
                </ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'lbs' ? tintColor : 'transparent',
                    borderColor: tintColor,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => setUnit('lbs')}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.unitText, { color: unit === 'lbs' ? '#fff' : tintColor }]}
                >
                  lbs
                </ThemedText>
              </Pressable>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F5F5',
                  color: textColor,
                  borderColor,
                },
              ]}
              placeholder={unit === 'kg' ? 'Enter weight in kg' : 'Enter weight in lbs'}
              placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
              value={weight}
              onChangeText={setWeight}
              autoFocus
              keyboardType="decimal-pad"
              returnKeyType="next"
              onSubmitEditing={handleNext}
              accessibilityLabel="Weight input"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: isValid() ? tintColor : '#CCCCCC',
                opacity: pressed && isValid() ? 0.85 : 1,
              },
            ]}
            onPress={handleNext}
            disabled={!isValid()}
            accessibilityRole="button"
            accessibilityLabel="Continue to gender"
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Continue
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 24,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  unitText: {
    fontSize: 16,
  },
  input: {
    fontSize: 18,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 56,
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

