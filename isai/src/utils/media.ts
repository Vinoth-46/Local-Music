import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export type LocalTrack = {
	id: string;
	uri: string;
	title?: string | null;
	artist?: string | null;
	album?: string | null;
	duration?: number | null;
	filename?: string | null;
	folder?: string | null;
};

export async function requestAudioPermissions(): Promise<boolean> {
	const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
	if (status === 'granted') return true;
	if (canAskAgain) {
		const res = await MediaLibrary.requestPermissionsAsync();
		return res.status === 'granted';
	}
	return false;
}

export async function loadLocalAudio(minDurationSec: number = 60): Promise<LocalTrack[]> {
	if (Platform.OS === 'web') return [];
	const granted = await requestAudioPermissions();
	if (!granted) return [];

	const pageSize = 200;
	let hasNextPage = true;
	let after: string | undefined = undefined;
	const results: LocalTrack[] = [];

	while (hasNextPage) {
		const page = await MediaLibrary.getAssetsAsync({
			mediaType: MediaLibrary.MediaType.audio,
			first: pageSize,
			after,
		});

		for (const asset of page.assets) {
			// Expo does not expose duration in getAssetsAsync for audio on some devices
			// We attempt to read it from asset.duration; filter if available
			const durationSec = (asset as any).duration ?? null;
			if (durationSec !== null && durationSec < minDurationSec) continue;
			const folder = asset.uri.split('/').slice(0, -1).slice(-1)[0] ?? null;
			results.push({
				id: asset.id,
				uri: asset.uri,
				title: asset.filename,
				artist: null,
				album: null,
				duration: durationSec,
				filename: asset.filename,
				folder,
			});
		}

		after = page.endCursor ?? undefined;
		hasNextPage = page.hasNextPage;
	}

	return results;
}

export function groupByFolder(tracks: LocalTrack[]): Record<string, LocalTrack[]> {
	return tracks.reduce<Record<string, LocalTrack[]>>((acc, t) => {
		const key = t.folder ?? 'Unknown';
		if (!acc[key]) acc[key] = [];
		acc[key].push(t);
		return acc;
	}, {});
}

