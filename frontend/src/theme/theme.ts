import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#F5C842', 
    secondary: '#FFD966', 
    background: '#F8F9FA', 
    surface: '#FFFFFF',
    accent: '#F5C842',
    text: '#1A1A1A',
    error: '#EF4444',
    disabled: '#CCCCCC',
    onPrimary: '#1A1A1A',
    onSecondary: '#1A1A1A',
    onBackground: '#1A1A1A',
    onSurface: '#1A1A1A',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#F5C842',
    secondary: '#FFD966',
    background: '#0F172A',
    surface: '#1E293B',
    accent: '#F5C842',
    text: '#F1F5F9',
    error: '#EF4444',
    disabled: '#475569',
    onPrimary: '#1A1A1A',
    onSecondary: '#1A1A1A',
    onBackground: '#F1F5F9',
    onSurface: '#F1F5F9',
  },
};

// Exporta o tema customizado padrão (manter compatibilidade)
export const customTheme = lightTheme;
