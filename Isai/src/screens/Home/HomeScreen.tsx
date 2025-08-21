import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { usePlayer } from '../../hooks/usePlayer';
import { Song, Album, Playlist } from '../../types/music';
import MusicService from '../../services/MusicService';
import { gradientColors } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

const HomeScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { playSong } = usePlayer();
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [mostPlayed, setMostPlayed] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const musicService = MusicService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load existing data first
      await musicService.loadMusicData();
      await musicService.loadPlaylists();
      
      // Check if we have songs, if not scan for music
      const songs = musicService.getSongs();
      if (songs.length === 0) {
        await musicService.scanLocalMusic();
      }

      // Update state with current data
      setRecentlyPlayed(musicService.getRecentlyPlayed());
      setMostPlayed(musicService.getMostPlayed());
      setAlbums(musicService.getAlbums().slice(0, 10)); // Show first 10 albums
      setPlaylists(musicService.getPlaylists());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await musicService.scanLocalMusic();
    await loadData();
    setRefreshing(false);
  };

  const handlePlaySong = (song: Song, queue: Song[]) => {
    playSong(song, queue);
  };

  const renderSongItem = ({ item: song }: { item: Song }) => (
    <TouchableOpacity
      style={[styles.songCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handlePlaySong(song, recentlyPlayed.length > 0 ? recentlyPlayed : mostPlayed)}
    >
      <View style={styles.songArtContainer}>
        {song.artwork ? (
          <Image source={{ uri: song.artwork }} style={styles.songArt} />
        ) : (
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.songArt}
          >
            <Ionicons name="musical-notes" size={16} color="white" />
          </LinearGradient>
        )}
      </View>
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={[styles.songArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({ item: album }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => handlePlaySong(album.songs[0], album.songs)}
    >
      <View style={styles.albumArtContainer}>
        {album.artwork ? (
          <Image source={{ uri: album.artwork }} style={styles.albumArt} />
        ) : (
          <LinearGradient
            colors={gradientColors.albumArt[Math.floor(Math.random() * gradientColors.albumArt.length)]}
            style={styles.albumArt}
          >
            <Ionicons name="disc" size={32} color="white" />
          </LinearGradient>
        )}
      </View>
      <Text style={[styles.albumTitle, { color: theme.colors.text }]} numberOfLines={2}>
        {album.name}
      </Text>
      <Text style={[styles.albumArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
        {album.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderSection = (title: string, data: any[], renderItem: any, horizontal: boolean = false) => {
    if (data.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {horizontal ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <FlatList
            data={data.slice(0, 5)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="musical-notes" size={48} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading your music...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Welcome Header */}
        <LinearGradient
          colors={gradientColors.primary}
          style={styles.welcomeHeader}
        >
          <Text style={styles.welcomeText}>Good {getTimeGreeting()}</Text>
          <Text style={styles.welcomeSubtext}>What would you like to listen to?</Text>
          
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Ionicons 
              name={theme.isDark ? "sunny" : "moon"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Access */}
        <View style={styles.quickAccess}>
          <TouchableOpacity style={[styles.quickButton, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="shuffle" size={20} color={theme.colors.primary} />
            <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>Shuffle All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickButton, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="heart" size={20} color={theme.colors.secondary} />
            <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Played */}
        {renderSection("Recently Played", recentlyPlayed, renderSongItem)}

        {/* Albums */}
        {renderSection("Albums", albums, renderAlbumItem, true)}

        {/* Most Played */}
        {renderSection("Most Played", mostPlayed, renderSongItem)}

        {/* Bottom padding for mini player */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeHeader: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  themeToggle: {
    position: 'absolute',
    top: 32,
    right: 24,
    padding: 8,
  },
  quickAccess: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  songArtContainer: {
    marginRight: 12,
  },
  songArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
  },
  albumCard: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  albumArtContainer: {
    marginBottom: 8,
  },
  albumArt: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 14,
  },
});

export default HomeScreen;