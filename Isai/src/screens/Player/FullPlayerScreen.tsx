import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { useTheme } from '../../hooks/useTheme';
import { usePlayer } from '../../hooks/usePlayer';
import { gradientColors } from '../../constants/theme';
import SleepTimer from '../../components/common/SleepTimer';

const { width, height } = Dimensions.get('window');
const ALBUM_ART_SIZE = width * 0.8;

const FullPlayerScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const {
    playerState,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const [showLyrics, setShowLyrics] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const albumArtScale = new Animated.Value(1);

  useEffect(() => {
    if (!isDragging) {
      setSliderValue(playerState.position);
    }
  }, [playerState.position, isDragging]);

  useEffect(() => {
    // Animate album art when playing/pausing
    Animated.spring(albumArtScale, {
      toValue: playerState.isPlaying ? 1.05 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [playerState.isPlaying]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSliderComplete = (value: number) => {
    setIsDragging(false);
    seekTo(value);
  };

  const handleSliderStart = () => {
    setIsDragging(true);
  };

  if (!playerState.currentSong) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.noSongText, { color: theme.colors.text }]}>
          No song playing
        </Text>
      </View>
    );
  }

  const currentSong = playerState.currentSong;
  const progress = playerState.duration > 0 ? (isDragging ? sliderValue : playerState.position) / playerState.duration : 0;

  return (
    <LinearGradient
      colors={[
        theme.colors.primary + '40',
        theme.colors.background,
        theme.colors.background,
      ]}
      style={styles.container}
    >
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
          <Ionicons name="chevron-down" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Now Playing</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            from {currentSong.album}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.albumArtContainer}>
        <Animated.View style={[styles.albumArtWrapper, { transform: [{ scale: albumArtScale }] }]}>
          {currentSong.artwork ? (
            <Image 
              source={{ uri: currentSong.artwork }} 
              style={styles.albumArt}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.albumArt}
            >
              <Ionicons name="musical-notes" size={80} color="white" />
            </LinearGradient>
          )}
        </Animated.View>
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {currentSong.title}
        </Text>
        <Text style={[styles.artistName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          value={isDragging ? sliderValue : playerState.position}
          minimumValue={0}
          maximumValue={playerState.duration}
          onValueChange={handleSliderChange}
          onSlidingStart={handleSliderStart}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.textSecondary + '40'}
          thumbStyle={{ backgroundColor: theme.colors.primary, width: 16, height: 16 }}
        />
        
        <View style={styles.timeLabels}>
          <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
            {formatTime(isDragging ? sliderValue : playerState.position)}
          </Text>
          <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
            {formatTime(playerState.duration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={toggleShuffle}
          style={[
            styles.controlButton,
            playerState.shuffle && { backgroundColor: theme.colors.primary + '20' }
          ]}
        >
          <Ionicons 
            name="shuffle" 
            size={24} 
            color={playerState.shuffle ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToPrevious} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={32} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={togglePlayPause}
          style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
        >
          <Ionicons 
            name={playerState.isPlaying ? 'pause' : 'play'} 
            size={32} 
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToNext} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={32} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={toggleRepeat}
          style={[
            styles.controlButton,
            playerState.repeat !== 'off' && { backgroundColor: theme.colors.primary + '20' }
          ]}
        >
          <Ionicons 
            name={playerState.repeat === 'one' ? 'repeat-outline' : 'repeat'} 
            size={24} 
            color={playerState.repeat !== 'off' ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setShowLyrics(!showLyrics)}
          style={[
            styles.actionButton,
            showLyrics && { backgroundColor: theme.colors.primary + '20' }
          ]}
        >
          <Ionicons 
            name="document-text-outline" 
            size={24} 
            color={showLyrics ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowSleepTimer(true)}
        >
          <Ionicons name="moon-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Lyrics Overlay */}
      {showLyrics && (
        <View style={[styles.lyricsOverlay, { backgroundColor: theme.colors.background + 'F0' }]}>
          <Text style={[styles.lyricsText, { color: theme.colors.text }]}>
            Lyrics not available for this song
          </Text>
        </View>
      )}

      {/* Sleep Timer Modal */}
      <SleepTimer 
        visible={showSleepTimer}
        onClose={() => setShowSleepTimer(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSongText: {
    fontSize: 18,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  albumArtContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  albumArtWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  albumArt: {
    width: ALBUM_ART_SIZE,
    height: ALBUM_ART_SIZE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 32,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 32,
    marginTop: 32,
  },
  slider: {
    height: 40,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 24,
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 32,
    marginBottom: 32,
    gap: 32,
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  lyricsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  lyricsText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default FullPlayerScreen;