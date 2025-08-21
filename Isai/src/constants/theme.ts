import { AppTheme } from '../types/music';

export const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    primary: '#1DB954', // Spotify green
    secondary: '#FF6B35', // Gaana orange
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    accent: '#1ED760',
    error: '#FF3333',
  },
};

export const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    primary: '#1DB954',
    secondary: '#FF6B35',
    background: '#121212',
    surface: '#282828',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    accent: '#1ED760',
    error: '#FF3333',
  },
};

export const gradientColors = {
  primary: ['#1DB954', '#1ED760'],
  secondary: ['#FF6B35', '#FF8A50'],
  dark: ['#191414', '#282828'],
  albumArt: ['#FF6B35', '#1DB954', '#9B59B6', '#E74C3C', '#3498DB'],
};