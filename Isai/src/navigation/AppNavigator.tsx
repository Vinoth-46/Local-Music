import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import HomeScreen from '../screens/Home/HomeScreen';
import LibraryScreen from '../screens/Library/LibraryScreen';
import PlaylistScreen from '../screens/Playlist/PlaylistScreen';
import FullPlayerScreen from '../screens/Player/FullPlayerScreen';
import MiniPlayer from '../components/player/MiniPlayer';

export type RootStackParamList = {
  MainTabs: undefined;
  FullPlayer: undefined;
  PlaylistDetail: { playlistId: string };
  AlbumDetail: { albumId: string };
  ArtistDetail: { artistId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Playlists: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Library') {
              iconName = focused ? 'library' : 'library-outline';
            } else if (route.name === 'Playlists') {
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            } else {
              iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 24,
            fontWeight: 'bold',
          },
          headerTintColor: theme.colors.text,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerTitle: 'Isai' }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen}
          options={{ headerTitle: 'Your Library' }}
        />
        <Tab.Screen 
          name="Playlists" 
          component={PlaylistScreen}
          options={{ headerTitle: 'Playlists' }}
        />
      </Tab.Navigator>
      <MiniPlayer />
    </View>
  );
};

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: 'bold',
          },
          headerTintColor: theme.colors.text,
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FullPlayer" 
          component={FullPlayerScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;