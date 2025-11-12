import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { OnboardingProgress } from '../components/onboarding-progress';

export default function NameScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333' }, 'icon');

  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      // TODO: Save to profile/store
      router.push('/onboarding/age');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <OnboardingProgress currentStep={1} totalSteps={5} />

          <View style={styles.form}>
            <ThemedText type="title" style={styles.title}>
              What's your name?
            </ThemedText>
            <ThemedText style={styles.description}>
              We'll use this to personalize your experience.
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F5F5',
                  color: textColor,
                  borderColor,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={handleNext}
              accessibilityLabel="Name input"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: name.trim() ? tintColor : '#CCCCCC',
                opacity: pressed && name.trim() ? 0.85 : 1,
              },
            ]}
            onPress={handleNext}
            disabled={!name.trim()}
            accessibilityRole="button"
            accessibilityLabel="Continue to age"
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
    marginBottom: 32,
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

