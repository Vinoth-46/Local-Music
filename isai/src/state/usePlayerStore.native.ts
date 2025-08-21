import { create } from 'zustand';
import TrackPlayer, { RepeatMode, Track } from 'react-native-track-player';

type PlayerState = {
	queue: Track[];
	currentTrackId: string | null;
	isPlaying: boolean;
	repeatMode: RepeatMode;
	shuffle: boolean;
	setQueue: (tracks: Track[]) => Promise<void>;
	playTrack: (trackId: string) => Promise<void>;
	playPause: () => Promise<void>;
	next: () => Promise<void>;
	previous: () => Promise<void>;
	setRepeatMode: (mode: RepeatMode) => Promise<void>;
	setShuffle: (enabled: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
	queue: [],
	currentTrackId: null,
	isPlaying: false,
	repeatMode: RepeatMode.Off,
	shuffle: false,
	setQueue: async (tracks: Track[]) => {
		await TrackPlayer.reset();
		await TrackPlayer.add(tracks);
		set({ queue: tracks });
	},
	playTrack: async (trackId: string) => {
		const index = get().queue.findIndex(t => (t.id as string) === trackId);
		if (index >= 0) {
			await TrackPlayer.skip(index);
			await TrackPlayer.play();
			set({ currentTrackId: trackId, isPlaying: true });
		}
	},
	playPause: async () => {
		const { isPlaying } = get();
		if (isPlaying) {
			await TrackPlayer.pause();
			set({ isPlaying: false });
		} else {
			await TrackPlayer.play();
			set({ isPlaying: true });
		}
	},
	next: async () => {
		await TrackPlayer.skipToNext();
		await TrackPlayer.play();
	},
	previous: async () => {
		await TrackPlayer.skipToPrevious();
		await TrackPlayer.play();
	},
	setRepeatMode: async (mode: RepeatMode) => {
		await TrackPlayer.setRepeatMode(mode);
		set({ repeatMode: mode });
	},
	setShuffle: (enabled: boolean) => set({ shuffle: enabled }),
}));

