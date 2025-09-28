import { MD3LightTheme } from 'react-native-paper';

export const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF9B42', 
    secondary: '#FFB472', 
    background: '#FFFFFF', 
    surface: '#FFFFFF',
    accent: '#FF9B42',
    text: '#333333',
    error: '#B00020',
    disabled: '#CCCCCC',
  },
};
