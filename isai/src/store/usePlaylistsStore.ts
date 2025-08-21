import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

interface PlaylistsStore {
  playlists: Record<string, Playlist>;
  createPlaylist: (name: string) => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (id: string, songId: string) => void;
  removeSongFromPlaylist: (id: string, songId: string) => void;
}

const storage = new MMKV({ id: 'isai-playlists' });
const KEY = 'playlists';

function save(playlists: Record<string, Playlist>) {
  storage.set(KEY, JSON.stringify(playlists));
}

function load(): Record<string, Playlist> {
  const raw = storage.getString(KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export const usePlaylistsStore = create<PlaylistsStore>((set, get) => ({
  playlists: load(),
  createPlaylist: (name: string) => {
    const id = `pl_${Date.now()}`;
    const next = { ...get().playlists, [id]: { id, name, songIds: [], createdAt: Date.now() } };
    save(next);
    set({ playlists: next });
    return id;
  },
  renamePlaylist: (id, name) => {
    const next = { ...get().playlists };
    if (next[id]) next[id].name = name;
    save(next);
    set({ playlists: next });
  },
  deletePlaylist: (id) => {
    const next = { ...get().playlists };
    delete next[id];
    save(next);
    set({ playlists: next });
  },
  addSongToPlaylist: (id, songId) => {
    const next = { ...get().playlists };
    if (!next[id]) return;
    if (!next[id].songIds.includes(songId)) next[id].songIds.push(songId);
    save(next);
    set({ playlists: next });
  },
  removeSongFromPlaylist: (id, songId) => {
    const next = { ...get().playlists };
    if (!next[id]) return;
    next[id].songIds = next[id].songIds.filter((s) => s !== songId);
    save(next);
    set({ playlists: next });
  },
}));

