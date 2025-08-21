import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { usePlayer } from '../../hooks/usePlayer';
import { Playlist, Song } from '../../types/music';
import MusicService from '../../services/MusicService';

const PlaylistScreen: React.FC = () => {
  const { theme } = useTheme();
  const { playSong } = usePlayer();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const musicService = MusicService.getInstance();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    const loadedPlaylists = await musicService.loadPlaylists();
    setPlaylists(loadedPlaylists);
  };

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        await musicService.createPlaylist(newPlaylistName.trim());
        setNewPlaylistName('');
        setShowCreateModal(false);
        loadPlaylists();
      } catch (error) {
        Alert.alert('Error', 'Failed to create playlist');
      }
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete playlist functionality
            // For now, just reload playlists
            loadPlaylists();
          },
        },
      ]
    );
  };

  const renderPlaylistItem = ({ item: playlist }: { item: Playlist }) => {
    const firstSongArtwork = playlist.songs.find(song => song.artwork)?.artwork;
    
    return (
      <TouchableOpacity
        style={[styles.playlistItem, { backgroundColor: theme.colors.surface }]}
        onPress={() => handlePlayPlaylist(playlist)}
      >
        <View style={styles.playlistArtContainer}>
          {firstSongArtwork ? (
            <Image source={{ uri: firstSongArtwork }} style={styles.playlistArt} />
          ) : (
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.playlistArt}
            >
              <Ionicons name="musical-notes" size={24} color="white" />
            </LinearGradient>
          )}
          
          {/* Play overlay */}
          <View style={styles.playOverlay}>
            <View style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="play" size={16} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.playlistInfo}>
          <Text style={[styles.playlistName, { color: theme.colors.text }]} numberOfLines={1}>
            {playlist.name}
          </Text>
          <Text style={[styles.playlistDetails, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.playlistDate, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            Created {new Date(playlist.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playlistAction}
          onPress={() => handleDeletePlaylist(playlist)}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Your Playlists
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.quickActionText}>Create Playlist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}
        >
          <Ionicons name="heart" size={20} color={theme.colors.secondary} />
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="musical-notes-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Playlists Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Create your first playlist to organize your favorite songs
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>Create Playlist</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          playlists.length === 0 && styles.emptyListContent,
        ]}
      />

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Create New Playlist
            </Text>
            
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.textSecondary + '40',
                },
              ]}
              placeholder="Playlist name"
              placeholderTextColor={theme.colors.textSecondary}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
              maxLength={50}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Space for mini player
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    padding: 24,
    paddingTop: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  playlistArtContainer: {
    position: 'relative',
    marginRight: 16,
  },
  playlistArt: {
    width: 64,
    height: 64,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  playlistDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  playlistDate: {
    fontSize: 12,
  },
  playlistAction: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default PlaylistScreen;