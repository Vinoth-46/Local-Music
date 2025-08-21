import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../hooks/useTheme';
import { usePlayer } from '../../hooks/usePlayer';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { gradientColors } from '../../constants/theme';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MiniPlayer: React.FC = () => {
  const { theme } = useTheme();
  const { playerState, togglePlayPause, skipToNext } = usePlayer();
  const navigation = useNavigation<NavigationProp>();

  if (!playerState.currentSong) {
    return null;
  }

  const handlePress = () => {
    navigation.navigate('FullPlayer');
  };

  const handlePlayPause = (e: any) => {
    e.stopPropagation();
    togglePlayPause();
  };

  const handleNext = (e: any) => {
    e.stopPropagation();
    skipToNext();
  };

  const progress = playerState.duration > 0 ? playerState.position / playerState.duration : 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.textSecondary + '30' }]}>
            <LinearGradient
              colors={gradientColors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Album Art */}
          <View style={styles.albumArtContainer}>
            {playerState.currentSong.artwork ? (
              <Image 
                source={{ uri: playerState.currentSong.artwork }} 
                style={styles.albumArt}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.albumArt}
              >
                <Ionicons 
                  name="musical-notes" 
                  size={20} 
                  color={theme.colors.text} 
                />
              </LinearGradient>
            )}
          </View>

          {/* Song Info */}
          <View style={styles.songInfo}>
            <Text style={[styles.songTitle, { color: theme.colors.text }]} numberOfLines={1}>
              {playerState.currentSong.title}
            </Text>
            <Text style={[styles.artistName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {playerState.currentSong.artist}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={handlePlayPause}
              style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons 
                name={playerState.isPlaying ? 'pause' : 'play'} 
                size={20} 
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleNext}
              style={styles.controlButton}
            >
              <Ionicons 
                name="play-skip-forward" 
                size={20} 
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above tab bar
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  progressContainer: {
    height: 2,
  },
  progressBar: {
    flex: 1,
    height: 2,
  },
  progressFill: {
    height: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  albumArtContainer: {
    marginRight: 12,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '400',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default MiniPlayer;