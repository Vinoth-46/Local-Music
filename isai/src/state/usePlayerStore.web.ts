import { create } from 'zustand';

type PlayerState = {
	queue: any[];
	currentTrackId: string | null;
	isPlaying: boolean;
	repeatMode: any;
	shuffle: boolean;
	setQueue: (tracks: any[]) => Promise<void>;
	playTrack: (trackId: string) => Promise<void>;
	playPause: () => Promise<void>;
	next: () => Promise<void>;
	previous: () => Promise<void>;
	setRepeatMode: (mode: any) => Promise<void>;
	setShuffle: (enabled: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
	queue: [],
	currentTrackId: null,
	isPlaying: false,
	repeatMode: 0,
	shuffle: false,
	setQueue: async (tracks: any[]) => set({ queue: tracks }),
	playTrack: async (trackId: string) => set({ currentTrackId: trackId, isPlaying: true }),
	playPause: async () => set({ isPlaying: !get().isPlaying }),
	next: async () => undefined,
	previous: async () => undefined,
	setRepeatMode: async (mode: any) => set({ repeatMode: mode }),
	setShuffle: (enabled: boolean) => set({ shuffle: enabled }),
}));

