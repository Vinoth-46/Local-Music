import { create } from 'zustand';
import TrackPlayer, { Track } from 'react-native-track-player';
import { setupPlayerOnce } from '../player/service';

interface PlayerStore {
  isReady: boolean;
  isPlaying: boolean;
  queue: Track[];
  currentTrack: Track | null;
  init: () => Promise<void>;
  playTracks: (tracks: Track[], startIndex?: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
}

export const useNowPlaying = create<PlayerStore>((set, get) => ({
  isReady: false,
  isPlaying: false,
  queue: [],
  currentTrack: null,
  init: async () => {
    if (get().isReady) return;
    await setupPlayerOnce();
    set({ isReady: true });
  },
  playTracks: async (tracks: Track[], startIndex = 0) => {
    await get().init();
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    set({ queue: tracks, currentTrack: tracks[startIndex] ?? null });
    if (startIndex > 0) {
      await TrackPlayer.skip(startIndex);
    }
    await TrackPlayer.play();
    set({ isPlaying: true });
  },
  togglePlayPause: async () => {
    const { isPlaying } = get();
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    set({ isPlaying: !isPlaying });
  },
  playNext: async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch {}
  },
  playPrevious: async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch {}
  },
}));

