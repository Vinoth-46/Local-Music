import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from './src/hooks/useTheme';
import AppNavigator from './src/navigation/AppNavigator';
import PlayerService from './src/services/PlayerService';

export default function App() {
  useEffect(() => {
    // Initialize player service when app starts
    const initializePlayer = async () => {
      try {
        await PlayerService.getInstance().initialize();
      } catch (error) {
        console.error('Failed to initialize player:', error);
      }
    };

    initializePlayer();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
