import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, PanResponder, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

// Colors
const DARK_BG = '#1a3a3f';
const TEAL_PRIMARY = '#4a9b8e';
const TEAL_BRIGHT = '#00d4ff';
const TEAL_LIGHT = '#3a6b5f';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';

const MIN_CM = 120;
const MAX_CM = 220;

export default function HeightScreen() {
  const router = useRouter();
  const [height, setHeight] = useState(175);
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');

  const feetInches = {
    feet: Math.floor(height * 0.0328084),
    inches: Math.round((height * 0.0328084 - Math.floor(height * 0.0328084)) * 12),
  };

  const handleNext = () => {
    router.push('/onboarding/weight');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSliderChange = (newHeight: number) => {
    setHeight(Math.round(newHeight));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={TEXT_PRIMARY} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Profile Setup</ThemedText>
        <View style={styles.spacer} />
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotInactive]} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={[styles.progressDot, styles.progressDotInactive]} />
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
        <ThemedText style={styles.title}>What's your height?</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
          This helps us provide more accurate analysis.
        </ThemedText>

        {/* Unit Toggle */}
        <View style={styles.unitToggleContainer}>
          <Pressable
            style={[
              styles.unitToggleButton,
              unit === 'cm' && styles.unitToggleButtonActive,
            ]}
            onPress={() => setUnit('cm')}
          >
            <ThemedText
              style={[
                styles.unitToggleText,
                unit === 'cm' && styles.unitToggleTextActive,
              ]}
            >
              cm
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.unitToggleButton,
              unit === 'ft' && styles.unitToggleButtonActive,
            ]}
            onPress={() => setUnit('ft')}
          >
            <ThemedText
              style={[
                styles.unitToggleText,
                unit === 'ft' && styles.unitToggleTextActive,
              ]}
            >
              ft / in
            </ThemedText>
          </Pressable>
        </View>

        {/* Height Display */}
        <View style={styles.heightDisplayContainer}>
          <View style={styles.heightValueContainer}>
            <ThemedText style={styles.heightValue}>{height}</ThemedText>
            <ThemedText style={styles.heightUnitLabel}>cm</ThemedText>
          </View>
        </View>

        {/* Custom Slider */}
        <View style={styles.sliderContainer}>
          <CustomSlider
            value={height}
            min={MIN_CM}
            max={MAX_CM}
            onChange={handleSliderChange}
          />
          <View style={styles.sliderLabels}>
            <ThemedText style={styles.sliderLabel}>{MIN_CM} cm</ThemedText>
            <ThemedText style={styles.sliderLabel}>{MAX_CM} cm</ThemedText>
          </View>
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
          accessibilityLabel="Continue to weight"
        >
          <ThemedText style={styles.nextButtonText}>Next</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function CustomSlider({ value, min, max, onChange }: CustomSliderProps) {
  const sliderRef = React.useRef<View>(null);
  const [sliderWidth, setSliderWidth] = React.useState(0);

  const getPercentage = () => ((value - min) / (max - min)) * 100;
  const percentage = getPercentage();

  const handleLayout = (event: any) => {
    if (event && event.nativeEvent && event.nativeEvent.layout) {
      setSliderWidth(event.nativeEvent.layout.width);
    }
  };

  const handleSliderPress = (event: any) => {
    if (!sliderWidth) return;
    
    let touchX = 0;
    if (event.nativeEvent) {
      if (event.nativeEvent.offsetX !== undefined) {
        touchX = event.nativeEvent.offsetX;
      } else if (event.nativeEvent.locationX !== undefined) {
        touchX = event.nativeEvent.locationX;
      }
    }

    const newValue = min + (touchX / sliderWidth) * (max - min);
    onChange(Math.round(newValue));
  };

  return (
    <View style={styles.customSliderContainer}>
      <Pressable
        ref={sliderRef}
        style={styles.sliderTrack}
        onPress={handleSliderPress}
        onLayout={handleLayout}
      >
        <View
          style={[
            styles.sliderFill,
            {
              width: `${percentage}%`,
            },
          ]}
        />
        <View
          style={[
            styles.sliderThumb,
            {
              left: `${percentage}%`,
            },
          ]}
        />
      </Pressable>

      {/* Tick Marks */}
      <View style={styles.tickMarksContainer}>
        {Array.from({ length: 21 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.tick,
              (i % 5 === 0) && styles.tickMajor,
            ]}
          />
        ))}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
    justifyContent: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressDotActive: {
    backgroundColor: TEAL_BRIGHT,
  },
  progressDotInactive: {
    backgroundColor: '#3a5a5f',
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
    marginBottom: 12,
    lineHeight: 48,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: 40,
    lineHeight: 22,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 50,
  },
  unitToggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TEAL_LIGHT,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  unitToggleButtonActive: {
    backgroundColor: TEAL_PRIMARY,
    borderColor: TEAL_PRIMARY,
  },
  unitToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  unitToggleTextActive: {
    color: TEXT_PRIMARY,
  },
  heightDisplayContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  heightValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  heightValue: {
    fontSize: 80,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  heightUnitLabel: {
    fontSize: 18,
    color: TEXT_SECONDARY,
  },
  sliderContainer: {
    marginBottom: 60,
  },
  customSliderContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 2,
    marginBottom: 12,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 4,
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEAL_BRIGHT,
    borderWidth: 3,
    borderColor: TEAL_BRIGHT,
    position: 'absolute',
    top: '50%',
    marginLeft: -14,
    marginTop: -17,
    zIndex: 10,
  },
  tickMarksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    marginTop: 8,
  },
  tick: {
    width: 2,
    height: 6,
    backgroundColor: TEAL_LIGHT,
  },
  tickMajor: {
    height: 12,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sliderLabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
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
