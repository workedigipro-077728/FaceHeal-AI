import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const progressColor = useThemeColor(
    { light: '#0a7ea4', dark: '#fff' },
    'tint'
  );
  const backgroundColor = useThemeColor(
    { light: '#E0E0E0', dark: '#333' },
    'icon'
  );

  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>
      <ThemedText style={styles.progressText}>
        {currentStep} of {totalSteps}
      </ThemedText>
    </View>
  );
}

export default OnboardingProgress;

const styles = StyleSheet.create({
   container: {
     gap: 12,
     marginBottom: 32,
   },
   progressBarContainer: {
     width: '100%',
   },
   progressBar: {
     height: 4,
     borderRadius: 2,
     overflow: 'hidden',
   },
   progressFill: {
     height: '100%',
     borderRadius: 2,
   },
   progressText: {
     fontSize: 14,
     opacity: 0.6,
     textAlign: 'center',
   },
});

