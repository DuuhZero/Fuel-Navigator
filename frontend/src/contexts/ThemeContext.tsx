import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  gradient: string[];
  shadow: string;
}

const lightTheme: ThemeColors = {
  primary: '#F5C842',
  secondary: '#FFD966',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  gradient: ['#F5C842', '#FFD966'],
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme: ThemeColors = {
  primary: '#F5C842',
  secondary: '#FFD966',
  background: '#0F172A',
  surface: '#1E293B',
  card: '#334155',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#475569',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  gradient: ['#F5C842', '#FDB93C'],
  shadow: 'rgba(0, 0, 0, 0.3)',
};

interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme || 'light');

  useEffect(() => {
    carregarTemaSalvo();
  }, []);

  const carregarTemaSalvo = async () => {
    try {
      const temaSalvo = await AsyncStorage.getItem('@theme');
      if (temaSalvo) {
        setTheme(temaSalvo as 'light' | 'dark');
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const toggleTheme = async () => {
    const novoTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(novoTheme);
    
    try {
      await AsyncStorage.setItem('@theme', novoTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      isDark: theme === 'dark',
      colors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};