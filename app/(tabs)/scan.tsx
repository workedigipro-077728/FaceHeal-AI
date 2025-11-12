import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { analyzeFaceHealth, FaceHealthAnalysis } from '@/src/services/gemini.service';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ScanScreen() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<FaceHealthAnalysis | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const themeKey = colorScheme ?? 'light';

  const tintColor = Colors[themeKey].tint;
  const cardBackground = useMemo(
    () => (themeKey === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
    [themeKey]
  );
  const errorBackground = useMemo(
    () => (themeKey === 'dark' ? 'rgba(255,85,85,0.18)' : 'rgba(255,85,85,0.12)'),
    [themeKey]
  );

  const handleSelectImage = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'We need access to your photo library to analyze your skin.'
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });

      if (pickerResult.canceled) {
        return;
      }

      const [asset] = pickerResult.assets;
      if (!asset?.uri) {
        Alert.alert('Something went wrong', 'Unable to read the selected image.');
        return;
      }

      setSelectedImageUri(asset.uri);
      setStatus('loading');
      setErrorMessage(null);

      const base64 = await readFileAsBase64(asset.uri);

      const analysis = await analyzeFaceHealth({
        imageBase64: base64,
        mimeType: asset.mimeType ?? undefined,
      });

      setResult(analysis);
      setStatus('success');
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Failed to analyze face health.';
      setErrorMessage(message);
      setStatus('error');
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Face Scan</ThemedText>
          <ThemedText type="subtitle">
            Upload a clear photo to receive AI-powered skin health insights.
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBackground }]}>
          <PrimaryButton
            label={status === 'loading' ? 'Analyzing…' : 'Select photo'}
            onPress={handleSelectImage}
            disabled={status === 'loading'}
            tintColor={tintColor}
          />
          <ThemedText style={styles.helperText}>
            Tips: use good lighting, remove heavy makeup, keep your face centered.
          </ThemedText>
        </ThemedView>

        {selectedImageUri && (
          <ThemedView style={styles.previewContainer}>
            <ThemedText type="subtitle">Selected photo</ThemedText>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.previewImage}
              contentFit="cover"
            />
          </ThemedView>
        )}

        {status === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={styles.loadingText}>
              Scanning skin health. This may take a few seconds…
            </ThemedText>
          </View>
        )}

        {status === 'error' && errorMessage && (
          <ErrorBanner message={errorMessage} backgroundColor={errorBackground} />
        )}

        {status === 'success' && result && (
          <AnalysisResult result={result} cardBackground={cardBackground} />
        )}
      </ScrollView>
    </ThemedView>
  );
}

function AnalysisResult({
  result,
  cardBackground,
}: {
  result: FaceHealthAnalysis;
  cardBackground: string;
}) {
  const {
    healthScore,
    skinType,
    detectedIssues,
    ageEstimate,
    symmetryScore,
    recommendations,
  } = result;

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardBackground }]}>
      <ThemedText type="subtitle">Analysis results</ThemedText>
      <View style={styles.metricsRow}>
        <Metric label="Health score" value={formatNumber(healthScore, 0)} suffix="/100" />
        <Metric label="Skin type" value={skinType ?? 'Unknown'} capitalize />
        <Metric label="Age estimate" value={formatNumber(ageEstimate, 0)} suffix="yrs" />
        <Metric label="Symmetry score" value={formatNumber(symmetryScore, 1)} suffix="/100" />
      </View>

      <Section title="Detected concerns">
        {Array.isArray(detectedIssues) && detectedIssues.length > 0 ? (
          detectedIssues.map((issue) => (
            <ThemedText key={issue} style={styles.listItem}>
              • {capitalizeText(issue)}
            </ThemedText>
          ))
        ) : (
          <ThemedText>No major concerns detected 🎉</ThemedText>
        )}
      </Section>

      <Section title="Recommended routines">
        <RecommendationList title="Morning routine" items={recommendations?.morningRoutine} />
        <RecommendationList title="Night routine" items={recommendations?.nightRoutine} />
      </Section>

      <Section title="Suggested extras">
        <RecommendationList title="Products" items={recommendations?.products} />
        <RecommendationList title="Lifestyle tips" items={recommendations?.lifestyle} />
        <RecommendationList title="Facial exercises" items={recommendations?.exercises} />
      </Section>
    </ThemedView>
  );
}

function RecommendationList({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.listBlock}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      {items.map((item, index) => (
        <ThemedText key={`${title}-${index}`} style={styles.listItem}>
          • {item}
        </ThemedText>
      ))}
    </View>
  );
}

function Metric({
  label,
  value,
  suffix,
  capitalize,
}: {
  label: string;
  value: string;
  suffix?: string;
  capitalize?: boolean;
}) {
  return (
    <View style={styles.metric}>
      <ThemedText type="defaultSemiBold" style={styles.metricLabel}>
        {label}
      </ThemedText>
      <ThemedText type="title" style={styles.metricValue}>
        {capitalize ? capitalizeText(value) : value}
        {suffix ? ` ${suffix}` : ''}
      </ThemedText>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function ErrorBanner({ message, backgroundColor }: { message: string; backgroundColor: string }) {
  return (
    <ThemedView style={[styles.errorBanner, { backgroundColor }]}>
      <ThemedText type="defaultSemiBold">Analysis failed</ThemedText>
      <ThemedText>{message}</ThemedText>
    </ThemedView>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
  tintColor,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tintColor: string;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? 'rgba(150,150,150,0.6)'
            : tintColor,
          opacity: pressed && !disabled ? 0.85 : 1,
        },
      ]}
    >
      <ThemedText
        type="defaultSemiBold"
        style={disabled ? styles.buttonTextDisabled : styles.buttonText}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function formatNumber(value: unknown, fractionDigits: number): string {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value.toFixed(fractionDigits);
  }

  const parsed = Number(value);
  if (!Number.isNaN(parsed)) {
    return parsed.toFixed(fractionDigits);
  }

  return '—';
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function capitalizeText(text: string): string {
  return text
    .split(' ')
    .map((segment) => capitalize(segment))
    .join(' ');
}

async function readFileAsBase64(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blobToBase64(blob);
  }

  return FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file data.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.split(',')[1];
        resolve(base64 ?? '');
      } else {
        reject(new Error('Unsupported file reader result.'));
      }
    };
    reader.readAsDataURL(blob);
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    gap: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  helperText: {
    opacity: 0.7,
  },
  previewContainer: {
    gap: 12,
  },
  previewImage: {
    width: '100%',
    height: 320,
    borderRadius: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  metric: {
    minWidth: '45%',
    gap: 4,
  },
  metricLabel: {
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.7,
  },
  listBlock: {
    gap: 6,
  },
  listItem: {
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: 'rgba(255,85,85,0.12)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: Colors.light.tint,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#eee',
    opacity: 0.7,
  },
});

