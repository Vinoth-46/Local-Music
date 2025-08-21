import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  SectionList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { usePlayer } from '../../hooks/usePlayer';
import { Song, Album, Artist, Folder } from '../../types/music';
import MusicService from '../../services/MusicService';

type LibraryTab = 'songs' | 'artists' | 'albums' | 'folders';

interface LibrarySection {
  title: string;
  data: any[];
}

const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();
  const { playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<LibraryTab>('songs');
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const musicService = MusicService.getInstance();

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    await musicService.loadMusicData();
    setSongs(musicService.getSongs());
    setArtists(musicService.getArtists());
    setAlbums(musicService.getAlbums());
    setFolders(musicService.getFolders());
  };

  const handlePlaySong = (song: Song, queue: Song[]) => {
    playSong(song, queue);
  };

  const handlePlayAlbum = (album: Album) => {
    if (album.songs.length > 0) {
      playSong(album.songs[0], album.songs);
    }
  };

  const handlePlayArtist = (artist: Artist) => {
    if (artist.songs.length > 0) {
      playSong(artist.songs[0], artist.songs);
    }
  };

  const handlePlayFolder = (folder: Folder) => {
    if (folder.songs.length > 0) {
      playSong(folder.songs[0], folder.songs);
    }
  };

  const renderTabButton = (tab: LibraryTab, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab && { backgroundColor: theme.colors.primary },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabButtonText,
          { color: activeTab === tab ? 'white' : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item: song }: { item: Song }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handlePlaySong(song, songs)}
    >
      <View style={styles.itemArtContainer}>
        {song.artwork ? (
          <Image source={{ uri: song.artwork }} style={styles.itemArt} />
        ) : (
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.itemArt}
          >
            <Ionicons name="musical-note" size={20} color="white" />
          </LinearGradient>
        )}
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {song.artist} • {song.album}
        </Text>
      </View>

      <TouchableOpacity style={styles.itemAction}>
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderArtistItem = ({ item: artist }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handlePlayArtist(artist)}
    >
      <View style={styles.itemArtContainer}>
        <LinearGradient
          colors={[theme.colors.secondary, theme.colors.primary]}
          style={[styles.itemArt, styles.circularArt]}
        >
          <Ionicons name="person" size={20} color="white" />
        </LinearGradient>
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {artist.name}
        </Text>
        <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {artist.songs.length} song{artist.songs.length !== 1 ? 's' : ''} • {artist.albums.length} album{artist.albums.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity style={styles.itemAction}>
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({ item: album }: { item: Album }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handlePlayAlbum(album)}
    >
      <View style={styles.itemArtContainer}>
        {album.artwork ? (
          <Image source={{ uri: album.artwork }} style={styles.itemArt} />
        ) : (
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.itemArt}
          >
            <Ionicons name="disc" size={20} color="white" />
          </LinearGradient>
        )}
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {album.artist} • {album.songs.length} song{album.songs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity style={styles.itemAction}>
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFolderItem = ({ item: folder }: { item: Folder }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handlePlayFolder(folder)}
    >
      <View style={styles.itemArtContainer}>
        <View style={[styles.itemArt, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="folder" size={20} color={theme.colors.primary} />
        </View>
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {folder.name}
        </Text>
        <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {folder.songs.length} song{folder.songs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity style={styles.itemAction}>
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getActiveData = () => {
    switch (activeTab) {
      case 'songs':
        return songs;
      case 'artists':
        return artists;
      case 'albums':
        return albums;
      case 'folders':
        return folders;
      default:
        return [];
    }
  };

  const getActiveRenderItem = () => {
    switch (activeTab) {
      case 'songs':
        return renderSongItem;
      case 'artists':
        return renderArtistItem;
      case 'albums':
        return renderAlbumItem;
      case 'folders':
        return renderFolderItem;
      default:
        return renderSongItem;
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'songs':
        return 'No songs found. Pull to refresh or check your music folder.';
      case 'artists':
        return 'No artists found.';
      case 'albums':
        return 'No albums found.';
      case 'folders':
        return 'No music folders found.';
      default:
        return 'No items found.';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Stats */}
      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{songs.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Songs</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>{artists.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Artists</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{albums.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Albums</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {renderTabButton('songs', 'Songs')}
        {renderTabButton('artists', 'Artists')}
        {renderTabButton('albums', 'Albums')}
        {renderTabButton('folders', 'Folders')}
      </ScrollView>

      {/* Content */}
      <View style={styles.content}>
        {getActiveData().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="musical-notes-outline" 
              size={64} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {getEmptyMessage()}
            </Text>
          </View>
        ) : (
          <FlatList
            data={getActiveData()}
            renderItem={getActiveRenderItem()}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  tabContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Space for mini player
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 2,
  },
  itemArtContainer: {
    marginRight: 16,
  },
  itemArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularArt: {
    borderRadius: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
  },
  itemAction: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
});

export default LibraryScreen;