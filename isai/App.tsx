import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import MiniPlayer from '@/player/MiniPlayer';
import HomeScreen from '@/screens/HomeScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import PlaylistsScreen from '@/screens/PlaylistsScreen';
import FullPlayerScreen from '@/player/FullPlayerScreen';

enableScreens(true);

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
      }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="library" color={color} size={size} />,
      }} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="albums" color={color} size={size} />,
      }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootStack.Navigator>
          <RootStack.Screen name="Root" component={Tabs} options={{ headerShown: false }} />
          <RootStack.Screen name="Player" component={FullPlayerScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        </RootStack.Navigator>
        <MiniPlayer />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// basic scaffolding screens are implemented under src/