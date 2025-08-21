import { create } from 'zustand';
import { PermissionsAndroid, Platform } from 'react-native';

export interface LocalSong {
  id: string;
  title: string;
  author?: string;
  album?: string;
  durationMs: number;
  path: string;
  folder?: string;
  artwork?: string;
}

interface LibraryStore {
  songs: LocalSong[];
  folders: Record<string, LocalSong[]>;
  scan: () => Promise<void>;
}

function identifyFolderFromPath(path: string): string | undefined {
  const parts = path.split('/');
  // Return parent directory name
  if (parts.length >= 2) return parts[parts.length - 2];
  return undefined;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  songs: [],
  folders: {},
  scan: async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.READ_MEDIA_AUDIO',
        'android.permission.READ_EXTERNAL_STORAGE',
      ] as any);
    }

    let MusicFiles: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      MusicFiles = require('react-native-get-music-files');
    } catch (e) {
      // Not available (e.g., web). Return gracefully
      set({ songs: [], folders: {} });
      return;
    }

    const res = await MusicFiles.getAll({
      blured: false,
      artist: true,
      duration: true,
      cover: true,
      batchNumber: 0,
      minimumSongDuration: 60_000, // 1 min
      fields: ['title', 'album', 'artist', 'duration', 'path', 'cover'] as any,
    }).catch(() => []);

    const songs: LocalSong[] = (res as any[]).map((s) => ({
      id: String(s.id ?? s.path),
      title: s.title || 'Unknown',
      author: s.author || s.artist,
      album: s.album,
      durationMs: Number(s.duration) || 0,
      path: s.path,
      folder: identifyFolderFromPath(s.path),
      artwork: s.cover,
    }));

    const folders: Record<string, LocalSong[]> = {};
    for (const song of songs) {
      const key = song.folder || 'Unknown';
      if (!folders[key]) folders[key] = [];
      folders[key].push(song);
    }

    set({ songs, folders });
  },
}));

