import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { scanStorage, StoredScanData } from '@/src/services/storage.service';
import { FaceHealthAnalysis } from '@/src/services/gemini.service';

// Colors
const DARK_BG = '#1a3a3f';
const TEAL_PRIMARY = '#4a9b8e';
const TEAL_BRIGHT = '#00d4ff';
const TEAL_DARK = '#2a5a5f';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';
const STATUS_GOOD = '#4ade80';
const STATUS_FAIR = '#fbbf24';
const STATUS_LOW = '#ef4444';

interface Metric {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'good' | 'fair' | 'low';
  statusText: string;
}

const defaultMetrics: Metric[] = [
  {
    id: 'hydration',
    title: 'Hydration',
    description: 'Your skin is well-hydrated.',
    icon: 'water-drop',
    status: 'good',
    statusText: 'Good',
  },
  {
    id: 'wrinkles',
    title: 'Wrinkle Index',
    description: 'Showing minimal signs of fine lines.',
    icon: 'grain',
    status: 'low',
    statusText: 'Low',
  },
  {
    id: 'redness',
    title: 'Redness',
    description: 'Slight inflammation detected.',
    icon: 'wb-sunny',
    status: 'fair',
    statusText: 'Fair',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [expandedTip, setExpandedTip] = useState(false);
  const [scanData, setScanData] = useState<StoredScanData | null>(null);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const userName = 'Olivia';
  const healthScore = scanData?.healthScore || 0;

  // Load scan data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadScanData();
    }, [])
  );

  const loadScanData = async () => {
    try {
      const result = await scanStorage.getLatestScan();
      if (result) {
        setScanData(result.data);
        setScanImage(result.image);

        // Update metrics from scan data
        if (result.data.detectedIssues && result.data.detectedIssues.length > 0) {
          const updatedMetrics = defaultMetrics.map((metric) => {
            const issue = result.data.detectedIssues?.[0] || '';

            // Customize metrics based on detected issues
            if (metric.id === 'redness' && issue.toLowerCase().includes('redness')) {
              return { ...metric, status: 'low' as const, statusText: 'Low' };
            }
            if (metric.id === 'wrinkles' && issue.toLowerCase().includes('wrinkle')) {
              return { ...metric, status: 'fair' as const, statusText: 'Fair' };
            }

            // Default to good status if no issues
            return { ...metric, status: 'good' as const, statusText: 'Good' };
          });

          setMetrics(updatedMetrics);
        }
      }
    } catch (error) {
      console.error('Failed to load scan data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return STATUS_GOOD;
      case 'fair':
        return STATUS_FAIR;
      case 'low':
        return STATUS_LOW;
      default:
        return TEXT_SECONDARY;
    }
  };

  const handleStartScan = () => {
    router.push('/(tabs)/scan');
  };

  const handleAnalysisView = () => {
    if (scanData) {
      router.push({
        pathname: '/(tabs)/analysis' as any,
        params: {
          data: JSON.stringify(scanData),
          image: scanImage,
        },
      });
    }
  };

  const handleNotification = () => {
    // Handle notification tap
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={32} color={TEAL_BRIGHT} />
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleNotification}
          >
            <MaterialIcons name="notifications-none" size={24} color={TEXT_PRIMARY} />
          </Pressable>
        </View>

        {/* Greeting */}
        <ThemedText style={styles.greeting}>Good Morning, {userName}</ThemedText>

        {/* Face Health Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <View>
              <ThemedText style={styles.scoreTitle}>Your Face Health Score</ThemedText>
              <ThemedText style={styles.scoreSubtitle}>
                {healthScore > 0
                  ? `Based on your latest scan.`
                  : 'Start a scan to see your results.'}
              </ThemedText>
            </View>
            <View style={styles.scoreDisplay}>
              <ThemedText style={styles.scoreNumber}>{Math.round(healthScore)}</ThemedText>
              <ThemedText style={styles.scoreMax}>/100</ThemedText>
            </View>
          </View>

          {/* Progress Bar */}
          {healthScore > 0 && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(healthScore, 100)}%`,
                  },
                ]}
              />
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.scanButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={handleStartScan}
            >
              <ThemedText style={styles.scanButtonText}>
                {healthScore > 0 ? 'Rescan' : 'Start Scan'}
              </ThemedText>
            </Pressable>

            {healthScore > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.viewResultsButton,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={handleAnalysisView}
              >
                <ThemedText style={styles.viewResultsButtonText}>View Results</ThemedText>
              </Pressable>
            )}
          </View>
        </View>

        {/* Scan Data Metrics */}
        {scanData && (
          <View style={styles.scanDataCard}>
            <ThemedText style={styles.scanDataTitle}>Latest Scan Summary</ThemedText>
            <View style={styles.scanMetricsGrid}>
              <MetricBadge
                label="Skin Type"
                value={scanData.skinType || 'N/A'}
                icon="face"
                color={TEAL_BRIGHT}
              />
              <MetricBadge
                label="Age Estimate"
                value={`${Math.round(scanData.ageEstimate || 0)} yrs`}
                icon="cake"
                color={STATUS_FAIR}
              />
              <MetricBadge
                label="Symmetry"
                value={`${Math.round(scanData.symmetryScore || 0)}%`}
                icon="straighten"
                color={STATUS_GOOD}
              />
              <MetricBadge
                label="Concerns"
                value={String(scanData.detectedIssues?.length || 0)}
                icon="warning"
                color={
                  scanData.detectedIssues && scanData.detectedIssues.length > 0
                    ? STATUS_LOW
                    : STATUS_GOOD
                }
              />
            </View>

            {scanData.detectedIssues && scanData.detectedIssues.length > 0 && (
              <View style={styles.issuesBox}>
                <ThemedText style={styles.issuesLabel}>Detected Issues:</ThemedText>
                {scanData.detectedIssues.slice(0, 3).map((issue, index) => (
                  <ThemedText key={index} style={styles.issueItem}>
                    • {issue}
                  </ThemedText>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Daily Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={styles.tipIconContainer}>
              <MaterialIcons name="spa" size={20} color={TEAL_BRIGHT} />
            </View>
            <ThemedText style={styles.tipTitle}>Daily Facial Health Tip</ThemedText>
          </View>

          <ThemedText style={styles.tipText}>
            Did you know? Consistent, gentle patting motions when applying moisturizer can boost
            circulation and enhance product absorption without stressing the skin.
          </ThemedText>

          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={() => setExpandedTip(!expandedTip)}
          >
            <ThemedText style={styles.readMore}>Read More</ThemedText>
          </Pressable>
        </View>

        {/* Key Metrics Section */}
        <View>
          <ThemedText style={styles.metricsTitle}>Key Metrics</ThemedText>

          <View style={styles.metricsContainer}>
            {metrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <View style={styles.metricIconContainer}>
                  <MaterialIcons
                    name={metric.icon as any}
                    size={24}
                    color={TEAL_BRIGHT}
                  />
                </View>

                <View style={styles.metricContent}>
                  <ThemedText style={styles.metricTitle}>{metric.title}</ThemedText>
                  <ThemedText style={styles.metricDescription}>{metric.description}</ThemedText>
                </View>

                <ThemedText
                  style={[
                    styles.metricStatus,
                    { color: getStatusColor(metric.status) },
                  ]}
                >
                  {metric.statusText}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Top Recommendation Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <View style={styles.recommendationIconContainer}>
              <MaterialIcons name="lightbulb" size={24} color="#fbbf24" />
            </View>
            <ThemedText style={styles.recommendationTitle}>
              Today's Top Recommendation
            </ThemedText>
          </View>

          <ThemedText style={styles.recommendationText}>
            {scanData?.detectedIssues && scanData.detectedIssues.length > 0
              ? `To address ${scanData.detectedIssues[0].toLowerCase()}, follow the detailed recommendations in your analysis.`
              : 'To address the slight redness, try a calming serum with Niacinamide. It can help strengthen your skin barrier and reduce inflammation.'}
          </ThemedText>
        </View>

        {/* Extra padding for bottom navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function MetricBadge({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <View style={[styles.metricBadge, { borderColor: color }]}>
      <MaterialIcons name={icon as any} size={20} color={color} />
      <ThemedText style={styles.metricBadgeLabel}>{label}</ThemedText>
      <ThemedText style={styles.metricBadgeValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d4916f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: TEAL_BRIGHT,
  },
  scoreMax: {
    fontSize: 16,
    color: TEXT_SECONDARY,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 3,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  scanButton: {
    flex: 1,
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: DARK_BG,
    fontSize: 16,
    fontWeight: '600',
  },
  viewResultsButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: TEAL_BRIGHT,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewResultsButtonText: {
    color: TEAL_BRIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
  scanDataCard: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scanDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  scanMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricBadge: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  metricBadgeLabel: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
  metricBadgeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginTop: 4,
  },
  issuesBox: {
    backgroundColor: `${STATUS_LOW}15`,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: STATUS_LOW,
  },
  issuesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  issueItem: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  tipCard: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  tipText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMore: {
    fontSize: 14,
    color: TEAL_BRIGHT,
    fontWeight: '600',
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  metricsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: TEAL_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  metricDescription: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  metricStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationCard: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    padding: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  recommendationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  recommendationText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});
