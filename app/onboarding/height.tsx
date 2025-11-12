import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { OnboardingProgress } from '../components/onboarding-progress';

export default function HeightScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333' }, 'icon');

  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');

  const handleNext = () => {
    const heightNum = parseFloat(height);
    if (heightNum > 0) {
      // TODO: Save to profile/store
      router.push('/onboarding/weight');
    }
  };

  const isValid = () => {
    const heightNum = parseFloat(height);
    if (unit === 'cm') {
      return heightNum >= 100 && heightNum <= 250;
    } else {
      return heightNum >= 3 && heightNum <= 8.5;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <OnboardingProgress currentStep={3} totalSteps={5} />

          <View style={styles.form}>
            <ThemedText type="title" style={styles.title}>
              What's your height?
            </ThemedText>
            <ThemedText style={styles.description}>
              This helps us calculate health metrics.
            </ThemedText>

            <View style={styles.unitSelector}>
              <Pressable
                style={({ pressed }) => [
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'cm' ? tintColor : 'transparent',
                    borderColor: tintColor,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => setUnit('cm')}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.unitText, { color: unit === 'cm' ? '#fff' : tintColor }]}
                >
                  cm
                </ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'ft' ? tintColor : 'transparent',
                    borderColor: tintColor,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => setUnit('ft')}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.unitText, { color: unit === 'ft' ? '#fff' : tintColor }]}
                >
                  ft
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
              placeholder={unit === 'cm' ? 'Enter height in cm' : 'Enter height in feet'}
              placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
              value={height}
              onChangeText={setHeight}
              autoFocus
              keyboardType="decimal-pad"
              returnKeyType="next"
              onSubmitEditing={handleNext}
              accessibilityLabel="Height input"
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
            accessibilityLabel="Continue to weight"
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

