import React, { useMemo, useEffect } from "react";
import { Image } from "expo-image";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemeToggle } from "@/components/theme-toggle";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/context/ThemeContext";
import { FaceHealthAnalysis } from "@/src/services/gemini.service";
import { scanStorage } from "@/src/services/storage.service";
import { useRoutine } from "@/context/RoutineContext";
import { useAuth } from "@/context/authContext";
import { uploadSkinScan } from "@/services/supabase";

// Color definitions
const DARK_BG = "#1a3a3f";
const TEAL_PRIMARY = "#4a9b8e";
const TEAL_BRIGHT = "#00d4ff";
const TEAL_DARK = "#2a5a5f";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";
const STATUS_GOOD = "#4ade80";
const STATUS_FAIR = "#fbbf24";
const STATUS_CRITICAL = "#ef4444";

export default function AnalysisScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const themeKey = colorScheme ?? "light";
  const params = useLocalSearchParams();
  const { updateRoutinesFromScan } = useRoutine();
  const { user } = useAuth();

  // Parse the analysis data from params
  const analysisData = useMemo(() => {
    try {
      if (typeof params.data === "string") {
        return JSON.parse(params.data) as FaceHealthAnalysis;
      }
      return null;
    } catch (e) {
      console.error("Failed to parse analysis data:", e);
      return null;
    }
  }, [params.data]);

  const imageUri = typeof params.image === "string" ? params.image : null;

  // Save scan data when component mounts
  useEffect(() => {
    if (analysisData && imageUri) {
      // Save to local storage
      scanStorage.saveScan(analysisData, imageUri).catch((e) => {
        console.error("Error saving scan:", e);
      });

      // Update daily routine based on scan results
      updateRoutinesFromScan(analysisData);

      // Save to Supabase if user is authenticated
      if (user?.id) {
        // For now, we'll just log success since we need image file handling
        console.log(
          "Scan analysis ready to save to Supabase for user:",
          user.id
        );
        // TODO: Implement image conversion and Supabase upload when file handling is ready
      }
    }
  }, [analysisData, imageUri, updateRoutinesFromScan, user]);

  if (!analysisData) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyState}>
          <ThemedText>No analysis data available</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.push("/(tabs)/scan")}
          >
            <ThemedText style={styles.primaryButtonText}>
              Back to Scan
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const {
    healthScore = 0,
    skinType = "Unknown",
    detectedIssues = [],
    ageEstimate = 0,
    symmetryScore = 0,
    recommendations = {},
    skinCondition = {},
  } = analysisData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return STATUS_GOOD;
    if (score >= 60) return STATUS_FAIR;
    return STATUS_CRITICAL;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNewScan = () => {
    router.push("/(tabs)");
  };

  const handleViewDailyRoutine = () => {
    router.push("/(tabs)");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={handleGoBack}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={theme.TEXT_PRIMARY}
            />
          </Pressable>
          <ThemedText style={styles.headerTitle}>
            Face Health Analysis
          </ThemedText>
          <ThemeToggle />
        </View>

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.analysisImage}
              contentFit="cover"
            />
          </View>
        )}

        {/* Health Score Card */}
        <View
          style={[
            styles.scoreCard,
            { borderColor: getScoreColor(healthScore) },
          ]}
        >
          <View style={styles.scoreHeader}>
            <View>
              <ThemedText style={styles.scoreLabel}>
                Overall Health Score
              </ThemedText>
              <ThemedText style={styles.scoreStatus}>
                {getScoreLabel(healthScore)}
              </ThemedText>
            </View>
            <View
              style={[
                styles.scoreCircle,
                { borderColor: getScoreColor(healthScore) },
              ]}
            >
              <ThemedText
                style={[
                  styles.scoreText,
                  { color: getScoreColor(healthScore) },
                ]}
              >
                {Math.round(healthScore)}
              </ThemedText>
              <ThemedText style={styles.scoreMaxText}>/ 100</ThemedText>
            </View>
          </View>

          {/* Score Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(healthScore, 100)}%`,
                  backgroundColor: getScoreColor(healthScore),
                },
              ]}
            />
          </View>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsSection}>
          <ThemedText style={styles.sectionTitle}>Key Metrics</ThemedText>
          <View style={styles.metricsGrid}>
            <MetricCard
              icon="face"
              label="Skin Type"
              value={skinType}
              color={TEAL_BRIGHT}
            />
            <MetricCard
              icon="cake"
              label="Age Estimate"
              value={`${Math.round(ageEstimate)} yrs`}
              color={STATUS_FAIR}
            />
            <MetricCard
              icon="straighten"
              label="Symmetry"
              value={`${Math.round(symmetryScore)}%`}
              color={STATUS_GOOD}
            />
            <MetricCard
              icon="water-drop"
              label="Hydration"
              value={((skinCondition as any)?.hydration as string) || "Good"}
              color="#87ceeb"
            />
          </View>
        </View>

        {/* Detected Issues */}
        {detectedIssues && detectedIssues.length > 0 && (
          <View style={styles.issuesSection}>
            <ThemedText style={styles.sectionTitle}>
              Detected Concerns
            </ThemedText>
            <View style={styles.issuesList}>
              {detectedIssues.map((issue, index) => (
                <View key={index} style={styles.issueItem}>
                  <MaterialIcons
                    name="warning"
                    size={20}
                    color={STATUS_CRITICAL}
                  />
                  <ThemedText style={styles.issueText}>{issue}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recommendations */}
        {recommendations && (
          <View style={styles.recommendationsSection}>
            <ThemedText style={styles.sectionTitle}>
              Personalized Recommendations
            </ThemedText>

            {((recommendations as any)?.morningRoutine as Array<any>) &&
              ((recommendations as any).morningRoutine as Array<any>).length >
                0 && (
                <RecommendationBlock
                  title="☀️ Morning Routine"
                  items={(recommendations as any).morningRoutine}
                />
              )}

            {((recommendations as any)?.nightRoutine as Array<any>) &&
              ((recommendations as any).nightRoutine as Array<any>).length >
                0 && (
                <RecommendationBlock
                  title="🌙 Night Routine"
                  items={(recommendations as any).nightRoutine}
                />
              )}

            {((recommendations as any)?.products as Array<any>) &&
              ((recommendations as any).products as Array<any>).length > 0 && (
                <RecommendationBlock
                  title="🧴 Recommended Products"
                  items={(recommendations as any).products}
                  color={TEAL_BRIGHT}
                />
              )}

            {((recommendations as any)?.lifestyle as Array<any>) &&
              ((recommendations as any).lifestyle as Array<any>).length > 0 && (
                <RecommendationBlock
                  title="💪 Lifestyle Tips"
                  items={(recommendations as any).lifestyle}
                  color={STATUS_GOOD}
                />
              )}

            {((recommendations as any)?.exercises as Array<any>) &&
              ((recommendations as any).exercises as Array<any>).length > 0 && (
                <RecommendationBlock
                  title="🧘 Facial Exercises"
                  items={(recommendations as any).exercises}
                  color={STATUS_FAIR}
                />
              )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleViewDailyRoutine}
          >
            <MaterialIcons name="checklist" size={20} color={DARK_BG} />
            <ThemedText style={styles.primaryButtonText}>
              View Daily Plan
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleNewScan}
          >
            <MaterialIcons name="camera-alt" size={20} color={TEXT_PRIMARY} />
            <ThemedText style={styles.secondaryButtonText}>New Scan</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleGoBack}
          >
            <MaterialIcons name="home" size={20} color={TEXT_PRIMARY} />
            <ThemedText style={styles.secondaryButtonText}>Home</ThemedText>
          </Pressable>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[styles.metricCard, { borderColor: color }]}>
      <View style={[styles.metricIconBox, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <ThemedText style={styles.metricLabel}>{label}</ThemedText>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
    </View>
  );
}

function RecommendationBlock({
  title,
  items,
  color = TEAL_BRIGHT,
}: {
  title: string;
  items?: string[];
  color?: string;
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={[styles.recommendationBlock, { borderLeftColor: color }]}>
      <ThemedText style={styles.recommendationTitle}>{title}</ThemedText>
      <View style={styles.recommendationList}>
        {items.map((item, index) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={[styles.bulletPoint, { backgroundColor: color }]} />
            <ThemedText style={styles.recommendationText}>{item}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  imageContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  analysisImage: {
    width: "100%",
    height: 280,
  },
  scoreCard: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: STATUS_GOOD,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 40,
    fontWeight: "700",
  },
  scoreMaxText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  metricsSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    alignItems: "center",
  },
  metricIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 6,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  issuesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  issuesList: {
    gap: 10,
  },
  issueItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${STATUS_CRITICAL}15`,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationBlock: {
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  recommendationList: {
    gap: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  recommendationText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 18,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: DARK_BG,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: TEAL_BRIGHT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  bottomPadding: {
    height: 20,
  },
});
