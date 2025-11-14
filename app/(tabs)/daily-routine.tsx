import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useRoutine } from '@/context/RoutineContext';

interface RoutineLog {
  time: string;
  amount: number;
}

interface Routine {
  id: string;
  title: string;
  icon: string;
  color: string;
  goal: number;
  current: number;
  logs: RoutineLog[];
}

const screenWidth = Dimensions.get('window').width;

export default function DailyRoutineScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { routines: routinesTasks, toggleTask, scanData } = useRoutine();

  const [waterIntake, setWaterIntake] = useState(1200); // in ml
  const dailyGoal = 2000; // in ml
  const waterPercentage = (waterIntake / dailyGoal) * 100;

  const getWaterMessage = () => {
    if (waterPercentage < 30) return 'Let\'s get started!';
    if (waterPercentage < 50) return 'Good progress!';
    if (waterPercentage < 75) return 'Great start!';
    if (waterPercentage < 100) return 'Almost there!';
    return 'Goal reached!';
  };

  const addWaterToRoutine = (amount: number = 250) => {
    setWaterIntake((prev) => Math.min(prev + amount, dailyGoal));
  };

  const getRoutineColor = (period: 'morning' | 'evening' | 'night'): string => {
    switch (period) {
      case 'morning':
        return '#FF9500'; // Orange for morning
      case 'evening':
        return '#FFD60A'; // Yellow for evening
      case 'night':
        return '#6366F1'; // Indigo for night
      default:
        return '#0a7ea4';
    }
  };

  const getRoutineIcon = (period: 'morning' | 'evening' | 'night'): any => {
    switch (period) {
      case 'morning':
        return 'sunny';
      case 'evening':
        return 'sunset';
      case 'night':
        return 'moon';
      default:
        return 'time';
    }
  };

  const getScanDataDisplay = (): string => {
    if (!scanData) return 'No scan data available';
    const parts = [];
    if (scanData.skinType) parts.push(`Skin: ${scanData.skinType}`);
    if (scanData.hydration) parts.push(`Hydration: ${scanData.hydration}%`);
    if (scanData.acne) parts.push(`Acne: ${scanData.acne}/10`);
    if (scanData.oiliness) parts.push(`Oiliness: ${scanData.oiliness}%`);
    return parts.join(' • ') || 'Scan data ready';
  };

  const getCompletedCount = (period: 'morning' | 'evening' | 'night'): number => {
    return routinesTasks[period].filter((task) => task.completed).length;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#e0e0e0' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Hydration</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Scan Data Card */}
        {scanData && (
          <View
            style={[
              styles.scanDataCard,
              { backgroundColor: isDark ? '#1a1a1a' : '#f0f8ff' },
            ]}
          >
            <View style={styles.scanDataHeader}>
              <Ionicons name="flask-sharp" size={20} color="#4a7c99" />
              <Text
                style={[styles.scanDataTitle, { color: colors.text }]}
              >
                Latest Scan Results
              </Text>
            </View>
            <Text
              style={[styles.scanDataContent, { color: colors.icon }]}
            >
              {getScanDataDisplay()}
            </Text>
            {scanData.recommendation && (
              <Text
                style={[styles.scanDataRecommendation, { color: colors.icon }]}
              >
                {scanData.recommendation}
              </Text>
            )}
          </View>
        )}

        {/* Hydration Tracker */}
        <View style={styles.progressSection}>
          <View style={styles.hydrationHeader}>
            <Text style={[styles.hydrationTitle, { color: colors.text }]}>
              Daily Hydration
            </Text>
            <TouchableOpacity onPress={() => addWaterToRoutine(250)}>
              <Ionicons name="add-circle" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          </View>
          <View style={styles.circleContainer}>
            <View
              style={[
                styles.circleBackground,
                {
                  borderColor: isDark ? '#333' : '#e8f0f5',
                },
              ]}
            />
            <View
              style={[
                styles.circleProgress,
                {
                  borderColor: '#0a7ea4',
                  borderRightColor: isDark ? '#1a1a1a' : colors.background,
                  borderBottomColor: isDark ? '#1a1a1a' : colors.background,
                  transform: [{ rotate: `${(waterPercentage / 100) * 360}deg` }],
                },
              ]}
            />
            <View style={styles.circleContent}>
              <Text style={[styles.waterAmount, { color: colors.text }]}>
                {(waterIntake / 1000).toFixed(1)}L / {(dailyGoal / 1000).toFixed(1)}L
              </Text>
              <Text style={[styles.waterMessage, { color: colors.icon }]}>
                {getWaterMessage()}
              </Text>
            </View>
          </View>
        </View>

        {/* Routine Sections */}
        {(['morning', 'evening', 'night'] as const).map((period) => {
          const tasks = routinesTasks[period];
          const completedCount = getCompletedCount(period);
          const color = getRoutineColor(period);
          const icon = getRoutineIcon(period);

          return (
            <View key={period} style={styles.periodSection}>
              <View
                style={[
                  styles.periodHeader,
                  { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' },
                ]}
              >
                <View style={styles.periodTitleContainer}>
                  <Ionicons name={icon} size={24} color={color} />
                  <View style={styles.periodTitleText}>
                    <Text
                      style={[styles.periodTitle, { color: colors.text }]}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)} Routine
                    </Text>
                    <Text
                      style={[styles.periodSubtitle, { color: colors.icon }]}
                    >
                      {completedCount} of {tasks.length} completed
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.progressBadge,
                    {
                      backgroundColor: `${color}20`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.progressBadgeText,
                      { color: color },
                    ]}
                  >
                    {Math.round((completedCount / tasks.length) * 100)}%
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.tasksList,
                  { backgroundColor: isDark ? '#0f0f0f' : '#fafafa' },
                ]}
              >
                {tasks.map((task, index) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => toggleTask(period, task.id)}
                    style={[
                      styles.taskItem,
                      index !== tasks.length - 1 && {
                        borderBottomColor: isDark ? '#333' : '#e0e0e0',
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: task.completed ? color : 'transparent',
                          borderColor: color,
                        },
                      ]}
                    >
                      {task.completed && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#fff"
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.taskName,
                        {
                          color: colors.text,
                          textDecorationLine: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.6 : 1,
                        },
                      ]}
                    >
                      {task.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scanDataCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c99',
  },
  scanDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanDataTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  scanDataContent: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  scanDataRecommendation: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74,124,153,0.2)',
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circleContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleBackground: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 20,
  },
  circleProgress: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 20,
    borderTopColor: '#0a7ea4',
    borderLeftColor: '#0a7ea4',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  circleContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  waterAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  waterMessage: {
    fontSize: 14,
    fontWeight: '500',
  },
  periodSection: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  periodTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  periodTitleText: {
    marginLeft: 12,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  periodSubtitle: {
    fontSize: 12,
  },
  progressBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tasksList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
