import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalTrack, loadLocalAudio, groupByFolder } from '@/utils/media';

type LibraryState = {
	tracks: LocalTrack[];
	folders: Record<string, LocalTrack[]>;
	recentlyPlayedIds: string[];
	playCounts: Record<string, number>;
	isScanning: boolean;
	scanError?: string | null;
	scan: () => Promise<void>;
	markPlayed: (trackId: string) => Promise<void>;
};

const RECENTS_KEY = 'isai:recents';
const COUNTS_KEY = 'isai:playCounts';

export const useLibraryStore = create<LibraryState>((set, get) => ({
	tracks: [],
	folders: {},
	recentlyPlayedIds: [],
	playCounts: {},
	isScanning: false,
	scanError: null,
	scan: async () => {
		try {
			set({ isScanning: true, scanError: null });
			const tracks = await loadLocalAudio(60);
			const folders = groupByFolder(tracks);
			const [recentsStr, countsStr] = await Promise.all([
				AsyncStorage.getItem(RECENTS_KEY),
				AsyncStorage.getItem(COUNTS_KEY),
			]);
			const recentlyPlayedIds: string[] = recentsStr ? JSON.parse(recentsStr) : [];
			const playCounts: Record<string, number> = countsStr ? JSON.parse(countsStr) : {};
			set({ tracks, folders, recentlyPlayedIds, playCounts, isScanning: false });
		} catch (e: any) {
			set({ isScanning: false, scanError: e?.message ?? 'Scan failed' });
		}
	},
	markPlayed: async (trackId: string) => {
		const recents = [trackId, ...get().recentlyPlayedIds.filter(id => id !== trackId)].slice(0, 50);
		const counts = { ...get().playCounts, [trackId]: (get().playCounts[trackId] ?? 0) + 1 };
		set({ recentlyPlayedIds: recents, playCounts: counts });
		await Promise.all([
			AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(recents)),
			AsyncStorage.setItem(COUNTS_KEY, JSON.stringify(counts)),
		]);
	},
}));

