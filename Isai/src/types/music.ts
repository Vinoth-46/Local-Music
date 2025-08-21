export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  uri: string;
  artwork?: string;
  folder: string;
  dateAdded?: number;
  playCount?: number;
  lastPlayed?: number;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artwork?: string;
  songs: Song[];
  year?: number;
}

export interface Artist {
  id: string;
  name: string;
  songs: Song[];
  albums: Album[];
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  artwork?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  songs: Song[];
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}

export interface AppTheme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    error: string;
  };
}