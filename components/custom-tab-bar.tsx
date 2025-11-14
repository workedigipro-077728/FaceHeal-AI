import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColor = Colors[colorScheme ?? 'light'].tint;
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  const iconNames: Record<string, string> = {
    index: 'house.fill',
    scan: 'magnifyingglass',
    analysis: 'chart.bar.fill',
    'daily-routine': 'checkmark.circle.fill',
    settings: 'gearshape.fill',
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1a1a1a' : '#2a2a2a',
          borderTopColor: isDark ? '#333' : '#444',
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = iconNames[route.name] || 'circle';
          const tabLabel = descriptors[route.key].options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            setActiveTooltip(route.key);
          };

          const onPressOut = () => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            setActiveTooltip(null);
          };

          return (
            <View key={route.key} style={styles.tabContainer}>
              {activeTooltip === route.key && (
                <View style={[styles.tooltip, { backgroundColor: isDark ? '#333' : '#444' }]}>
                  <Text style={styles.tooltipText}>{tabLabel}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                onPressOut={onPressOut}
                style={[
                  styles.tab,
                  isFocused && [styles.activeTab, { backgroundColor: `${themeColor}20` }],
                ]}
                activeOpacity={0.7}
              >
                {isFocused ? (
                  <View style={[styles.activeIconContainer, { backgroundColor: `${themeColor}99` }]}>
                    <IconSymbol
                      size={26}
                      name={iconName as any}
                      color="#ffffff"
                    />
                  </View>
                ) : (
                  <IconSymbol
                    size={26}
                    name={iconName as any}
                    color="#9CA3AF"
                  />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Active indicator line */}
      <View style={styles.indicatorContainer}>
        <View
          style={[
            styles.indicator,
            {
              marginLeft: `${(state.index / state.routes.length) * 100}%`,
              backgroundColor: themeColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
    borderRadius: 12,
  },
  activeTab: {
    paddingVertical: 8,
  },
  activeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorContainer: {
    height: 3,
    marginTop: 6,
    marginHorizontal: 16,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  indicator: {
    height: 3,
    width: '20%',
    borderRadius: 1.5,
  },
});
