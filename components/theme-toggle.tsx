import React from 'react';
import { Pressable, StyleSheet, View, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  style?: any;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  style, 
  showLabel = false 
}) => {
  const { isDarkMode, setIsDarkMode, theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <MaterialIcons
          name={isDarkMode ? 'dark-mode' : 'light-mode'}
          size={20}
          color={theme.TEXT_PRIMARY}
          style={styles.icon}
        />
      )}
      <Switch
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        trackColor={{ false: theme.TEAL_DARK, true: theme.TEAL_PRIMARY }}
        thumbColor={theme.TEAL_BRIGHT}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  icon: {
    marginRight: 4,
  },
});
