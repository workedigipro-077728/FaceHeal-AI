import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

// Colors
const DARK_BG = '#1a3a3f';
const TEAL_PRIMARY = '#4a9b8e';
const TEAL_BRIGHT = '#00d4ff';
const BORDER_TEAL = '#3a6b5f';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';
const TEXT_MUTED = '#5a6a70';

const MIN_AGE = 13;
const MAX_AGE = 120;

export default function AgeScreen() {
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState(25);
  const scrollViewRef = useRef<ScrollView>(null);

  const ages = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

  const handleNext = () => {
    router.push('/onboarding/height');
  };

  const handleBack = () => {
    router.back();
  };

  const renderAgeItem = (age: number) => (
    <Pressable
      key={age}
      onPress={() => setSelectedAge(age)}
      style={[styles.ageItem, selectedAge === age && styles.ageItemSelected]}
    >
      <ThemedText
        style={[
          styles.ageText,
          selectedAge === age && styles.ageTextSelected,
        ]}
      >
        {age}
      </ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={TEXT_PRIMARY} />
        </Pressable>
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotInactive]} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={[styles.progressDot, styles.progressDotInactive]} />
        <View style={[styles.progressDot, styles.progressDotInactive]} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <ThemedText style={styles.title}>What is your age?</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
          This helps us personalize your skin health analysis.
        </ThemedText>

        {/* Age Picker */}
        <View style={styles.pickerContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.agesScroll}
            ref={scrollViewRef}
          >
            {ages.map(renderAgeItem)}
          </ScrollView>
        </View>
      </ScrollView>

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
          accessibilityRole="button"
          accessibilityLabel="Continue to height"
        >
          <ThemedText style={styles.nextButtonText}>Next</ThemedText>
        </Pressable>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    justifyContent: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressDotActive: {
    backgroundColor: TEAL_BRIGHT,
  },
  progressDotInactive: {
    backgroundColor: '#4a5860',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 16,
    lineHeight: 48,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: 60,
    lineHeight: 22,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 40,
  },
  agesScroll: {
    paddingHorizontal: 40,
    gap: 12,
    alignItems: 'center',
  },
  ageItem: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageItemSelected: {
    backgroundColor: TEAL_PRIMARY,
  },
  ageText: {
    fontSize: 24,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  ageTextSelected: {
    color: TEXT_PRIMARY,
    fontSize: 28,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#1a3a3f',
    fontSize: 18,
    fontWeight: '600',
  },
});
