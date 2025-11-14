import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'app_theme_mode';

interface ThemeColors {
  BG: string;
  TEAL_PRIMARY: string;
  TEAL_BRIGHT: string;
  TEAL_DARK: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  DIVIDER: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  theme: ThemeColors;
}

// Dark Mode Colors
const DARK_COLORS: ThemeColors = {
  BG: '#1a3a3f',
  TEAL_PRIMARY: '#4a9b8e',
  TEAL_BRIGHT: '#00d4ff',
  TEAL_DARK: '#2a5a5f',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#a0a0a0',
  DIVIDER: 'rgba(255,255,255,0.1)',
};

// Light Mode Colors
const LIGHT_COLORS: ThemeColors = {
  BG: '#f5f5f5',
  TEAL_PRIMARY: '#4a9b8e',
  TEAL_BRIGHT: '#008080',
  TEAL_DARK: '#d0e8e5',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  DIVIDER: 'rgba(0,0,0,0.1)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkModeState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkModeState(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemePreference();
  }, []);

  const setIsDarkMode = async (value: boolean) => {
    setIsDarkModeState(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, theme }}>
      {isLoaded && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
