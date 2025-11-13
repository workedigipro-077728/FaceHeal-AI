import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

// Colors
const DARK_BG = '#1a3a3f';
const TEAL_PRIMARY = '#4a9b8e';
const TEAL_LIGHT = '#6fb5a5';
const BORDER_TEAL = '#3a6b5f';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      router.push('/onboarding/age');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={TEXT_PRIMARY} />
        </Pressable>
        <ThemedText style={styles.stepText}>Step 1 of 4</ThemedText>
        <View style={styles.spacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.progressBarActive]} />
        <View style={[styles.progressBar, styles.progressBarInactive]} />
        <View style={[styles.progressBar, styles.progressBarInactive]} />
        <View style={[styles.progressBar, styles.progressBarInactive]} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Title */}
          <ThemedText style={styles.title}>What's your name?</ThemedText>

          {/* Description */}
          <ThemedText style={styles.description}>
            This will be displayed on your profile.
          </ThemedText>

          {/* Label */}
          <ThemedText style={styles.label}>Full Name</ThemedText>

          {/* Input */}
          <TextInput
            style={styles.input}
            placeholder="e.g., Jane Doe"
            placeholderTextColor={TEXT_SECONDARY}
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={handleNext}
            accessibilityLabel="Full name input"
          />
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleNext}
            disabled={!name.trim()}
            accessibilityRole="button"
            accessibilityLabel="Continue to age"
          >
            <ThemedText style={styles.nextButtonText}>Next</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressBarActive: {
    backgroundColor: TEAL_PRIMARY,
  },
  progressBarInactive: {
    backgroundColor: '#4a5860',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 16,
    lineHeight: 48,
  },
  description: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: 32,
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BORDER_TEAL,
    color: TEXT_PRIMARY,
    minHeight: 56,
    backgroundColor: 'transparent',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: TEAL_PRIMARY,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '600',
  },
});

