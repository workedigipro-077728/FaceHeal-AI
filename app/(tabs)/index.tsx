import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const FEATURES = [
  {
    title: 'AI-powered analysis',
    description:
      'Detect acne, wrinkles, hydration level, and symmetry using the latest Gemini 1.5 Vision model.',
  },
  {
    title: 'Personalized routines',
    description:
      'Receive curated AM/PM skincare, product ideas, and daily facial exercises tailored to your results.',
  },
  {
    title: 'Progress tracking',
    description:
      'Save past scans, compare visuals, and track health score trends over time (coming soon).',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const cardBackground =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <ThemedText type="title" style={styles.title}>
          Face Heal AI
        </ThemedText>
        <ThemedText style={styles.lead}>
          Understand your skin in seconds. Capture a photo, let Gemini analyze it, and follow the
          routine that’s crafted for you.
        </ThemedText>

        <Link href="/scan" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.primaryCta,
              { backgroundColor: tintColor, opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Start a face scan"
          >
            <ThemedText type="defaultSemiBold" style={styles.primaryCtaText}>
              Start a face scan →
            </ThemedText>
          </Pressable>
        </Link>

        <View style={styles.featureList}>
          {FEATURES.map((feature) => (
            <ThemedView
              key={feature.title}
              style={[styles.featureCard, { backgroundColor: cardBackground }]}
            >
              <ThemedText type="subtitle">{feature.title}</ThemedText>
              <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 20,
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
  },
  lead: {
    fontSize: 16,
    opacity: 0.75,
  },
  primaryCta: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: '#fff',
    fontSize: 16,
  },
  featureList: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 18,
    padding: 20,
    gap: 8,
  },
  featureDescription: {
    opacity: 0.7,
    lineHeight: 20,
  },
});
