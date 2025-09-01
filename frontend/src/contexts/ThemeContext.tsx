import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
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

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      isDark: theme === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};