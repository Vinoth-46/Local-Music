import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';

interface PlayHistoryEntry {
  songId: string;
  playedAt: number;
}

interface HistoryStore {
  recent: PlayHistoryEntry[];
  playCounts: Record<string, number>;
  pushRecent: (songId: string) => void;
}

const storage = new MMKV({ id: 'isai-history' });
const RECENT_KEY = 'recent';
const COUNT_KEY = 'counts';

function load<T>(key: string, fallback: T): T {
  const raw = storage.getString(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  recent: load<PlayHistoryEntry[]>(RECENT_KEY, []),
  playCounts: load<Record<string, number>>(COUNT_KEY, {}),
  pushRecent: (songId: string) => {
    const entry: PlayHistoryEntry = { songId, playedAt: Date.now() };
    const nextRecent = [entry, ...get().recent].slice(0, 100);
    const nextCounts = { ...get().playCounts, [songId]: (get().playCounts[songId] ?? 0) + 1 };
    storage.set(RECENT_KEY, JSON.stringify(nextRecent));
    storage.set(COUNT_KEY, JSON.stringify(nextCounts));
    set({ recent: nextRecent, playCounts: nextCounts });
  },
}));

