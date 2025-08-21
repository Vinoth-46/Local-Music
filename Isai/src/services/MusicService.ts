import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song, Album, Artist, Playlist, Folder } from '../types/music';

class MusicService {
  private static instance: MusicService;
  private songs: Song[] = [];
  private albums: Album[] = [];
  private artists: Artist[] = [];
  private playlists: Playlist[] = [];
  private folders: Folder[] = [];

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async scanLocalMusic(): Promise<Song[]> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission denied');
      }

      // Get audio files from device
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 1000, // Limit to first 1000 songs for performance
        sortBy: ['creationTime'],
      });

      const songs: Song[] = [];

      for (const asset of media.assets) {
        // Filter songs with duration > 1 minute (60 seconds)
        if (asset.duration > 60) {
          const song: Song = {
            id: asset.id,
            title: asset.filename.replace(/\.[^/.]+$/, ''), // Remove file extension
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            duration: Math.floor(asset.duration),
            uri: asset.uri,
            folder: this.extractFolderName(asset.uri),
            dateAdded: asset.creationTime,
            playCount: 0,
            lastPlayed: 0,
          };

          // Try to get metadata if available
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            if (assetInfo.localUri) {
              song.uri = assetInfo.localUri;
            }
          } catch (error) {
            console.warn('Could not get asset info:', error);
          }

          songs.push(song);
        }
      }

      this.songs = songs;
      this.organizeMusic();
      await this.saveMusicData();
      
      return songs;
    } catch (error) {
      console.error('Error scanning local music:', error);
      return [];
    }
  }

  private extractFolderName(uri: string): string {
    const pathParts = uri.split('/');
    // Find common folder names
    const commonFolders = ['Music', 'Download', 'Downloads', 'Movies', 'Audio'];
    
    for (const part of pathParts) {
      if (commonFolders.some(folder => 
        part.toLowerCase().includes(folder.toLowerCase())
      )) {
        return part;
      }
    }
    
    // Default to the parent folder
    return pathParts[pathParts.length - 2] || 'Unknown';
  }

  private organizeMusic(): void {
    // Organize by albums
    const albumMap = new Map<string, Album>();
    
    this.songs.forEach(song => {
      const albumKey = `${song.album}-${song.artist}`;
      
      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, {
          id: albumKey,
          name: song.album,
          artist: song.artist,
          songs: [],
        });
      }
      
      albumMap.get(albumKey)!.songs.push(song);
    });
    
    this.albums = Array.from(albumMap.values());

    // Organize by artists
    const artistMap = new Map<string, Artist>();
    
    this.songs.forEach(song => {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, {
          id: song.artist,
          name: song.artist,
          songs: [],
          albums: [],
        });
      }
      
      artistMap.get(song.artist)!.songs.push(song);
    });

    // Add albums to artists
    this.albums.forEach(album => {
      const artist = artistMap.get(album.artist);
      if (artist && !artist.albums.some(a => a.id === album.id)) {
        artist.albums.push(album);
      }
    });
    
    this.artists = Array.from(artistMap.values());

    // Organize by folders
    const folderMap = new Map<string, Folder>();
    
    this.songs.forEach(song => {
      if (!folderMap.has(song.folder)) {
        folderMap.set(song.folder, {
          id: song.folder,
          name: song.folder,
          path: song.folder,
          songs: [],
        });
      }
      
      folderMap.get(song.folder)!.songs.push(song);
    });
    
    this.folders = Array.from(folderMap.values());
  }

  async loadMusicData(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('musicData');
      if (data) {
        const parsed = JSON.parse(data);
        this.songs = parsed.songs || [];
        this.albums = parsed.albums || [];
        this.artists = parsed.artists || [];
        this.folders = parsed.folders || [];
      }
    } catch (error) {
      console.error('Error loading music data:', error);
    }
  }

  async saveMusicData(): Promise<void> {
    try {
      const data = {
        songs: this.songs,
        albums: this.albums,
        artists: this.artists,
        folders: this.folders,
      };
      await AsyncStorage.setItem('musicData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving music data:', error);
    }
  }

  // Getters
  getSongs(): Song[] {
    return this.songs;
  }

  getAlbums(): Album[] {
    return this.albums;
  }

  getArtists(): Artist[] {
    return this.artists;
  }

  getFolders(): Folder[] {
    return this.folders;
  }

  getRecentlyPlayed(): Song[] {
    return this.songs
      .filter(song => song.lastPlayed && song.lastPlayed > 0)
      .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
      .slice(0, 20);
  }

  getMostPlayed(): Song[] {
    return this.songs
      .filter(song => song.playCount && song.playCount > 0)
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, 20);
  }

  async updateSongPlayCount(songId: string): Promise<void> {
    const song = this.songs.find(s => s.id === songId);
    if (song) {
      song.playCount = (song.playCount || 0) + 1;
      song.lastPlayed = Date.now();
      await this.saveMusicData();
    }
  }

  // Playlist management
  async loadPlaylists(): Promise<Playlist[]> {
    try {
      const data = await AsyncStorage.getItem('playlists');
      if (data) {
        this.playlists = JSON.parse(data);
      }
      return this.playlists;
    } catch (error) {
      console.error('Error loading playlists:', error);
      return [];
    }
  }

  async savePlaylists(): Promise<void> {
    try {
      await AsyncStorage.setItem('playlists', JSON.stringify(this.playlists));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  }

  async createPlaylist(name: string): Promise<Playlist> {
    const playlist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.playlists.push(playlist);
    await this.savePlaylists();
    return playlist;
  }

  async addSongToPlaylist(playlistId: string, song: Song): Promise<boolean> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.songs.some(s => s.id === song.id)) {
      playlist.songs.push(song);
      playlist.updatedAt = Date.now();
      await this.savePlaylists();
      return true;
    }
    return false;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<boolean> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (playlist) {
      const index = playlist.songs.findIndex(s => s.id === songId);
      if (index !== -1) {
        playlist.songs.splice(index, 1);
        playlist.updatedAt = Date.now();
        await this.savePlaylists();
        return true;
      }
    }
    return false;
  }

  getPlaylists(): Playlist[] {
    return this.playlists;
  }
}

export default MusicService;