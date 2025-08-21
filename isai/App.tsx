import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import PlaylistsScreen from './src/screens/PlaylistsScreen';
import MiniPlayer from './src/components/MiniPlayer';
import { useThemeStore } from './src/store/useThemeStore';

const Tab = createBottomTabNavigator();

export default function App() {
	const scheme = useThemeStore((s) => s.theme);
	const isDark = scheme === 'dark';

	return (
		<SafeAreaProvider>
			<NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
				<StatusBar style={isDark ? 'light' : 'dark'} />
				<Tab.Navigator
					screenOptions={({ route }) => ({
						headerTitle: 'Isai',
						tabBarIcon: ({ color, size }) => {
							const iconMap: Record<string, string> = {
								Home: 'home-variant',
								Library: 'music-box-multiple',
								Playlists: 'playlist-music',
							};
							const name = iconMap[route.name] ?? 'music';
							return <Icon name={name} color={color} size={size} />;
						},
					})}
				>
					<Tab.Screen name="Home" component={HomeScreen} />
					<Tab.Screen name="Library" component={LibraryScreen} />
					<Tab.Screen name="Playlists" component={PlaylistsScreen} />
				</Tab.Navigator>
				<MiniPlayer onExpandRoute="Player" />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
