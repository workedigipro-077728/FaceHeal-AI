import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

// Dark teal background color
const DARK_TEAL_BG = '#1a3a3f';
// Lighter teal for logo circle
const LIGHT_TEAL = '#2a5a5f';
// Bright cyan for face icon
const BRIGHT_CYAN = '#00d4ff';
// Light gray for tagline
const LIGHT_GRAY = '#b0b0b0';
// Progress bar colors
const PROGRESS_CYAN = '#00d4ff';
const PROGRESS_DARK_TEAL = '#1a4a4f';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            {/* Face Icon */}
            <View style={styles.faceContainer}>
              {/* Curved line for head/hair - using border radius trick */}
              <View style={styles.hairLine} />
              {/* Left eye */}
              <View style={[styles.eye, styles.eyeLeft]} />
              {/* Right eye */}
              <View style={[styles.eye, styles.eyeRight]} />
            </View>
          </View>
        </View>

        {/* Title */}
        <ThemedText style={styles.title}>FaceHeal AI</ThemedText>

        {/* Tagline */}
        <ThemedText style={styles.tagline}>Your Personal Face Health Analyst.</ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Hidden button to navigate - tap anywhere to continue */}
      <Pressable
        style={styles.hiddenButton}
        onPress={() => router.push('/onboarding/name' as any)}
        accessibilityRole="button"
        accessibilityLabel="Continue to next screen"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_TEAL_BG,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: LIGHT_TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceContainer: {
    width: 70,
    height: 50,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hairLine: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 60,
    height: 25,
    borderTopWidth: 3,
    borderTopColor: BRIGHT_CYAN,
    borderLeftWidth: 3,
    borderLeftColor: BRIGHT_CYAN,
    borderRightWidth: 3,
    borderRightColor: BRIGHT_CYAN,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  eye: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRIGHT_CYAN,
  },
  eyeLeft: {
    left: 18,
    top: 22,
  },
  eyeRight: {
    right: 18,
    top: 22,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: LIGHT_GRAY,
    textAlign: 'center',
    fontWeight: '400',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressBar: {
    height: 3,
    backgroundColor: PROGRESS_DARK_TEAL,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '33%',
    backgroundColor: PROGRESS_CYAN,
    borderRadius: 1.5,
  },
  hiddenButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
