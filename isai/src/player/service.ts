let TrackPlayer: any;
let Capability: any;
let AppKilledPlaybackBehavior: any;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const mod = require('react-native-track-player');
	TrackPlayer = mod.default ?? mod;
	Capability = mod.Capability;
	AppKilledPlaybackBehavior = mod.AppKilledPlaybackBehavior;
} catch (e) {
	// fallbacks for web/bundler; will be undefined but service isn't run
}

export default async function service() {
	if (!TrackPlayer) return;
	TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
	TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
	TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
	TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
}

export async function setupPlayerOnce() {
	if (!TrackPlayer) return;
	try {
		await TrackPlayer.getState();
		return; // already setup
	} catch {}
	await TrackPlayer.setupPlayer({
		android: {
			appKilledPlaybackBehavior: AppKilledPlaybackBehavior?.StopWithApp,
		},
	});
	await TrackPlayer.updateOptions({
		capabilities: [
			Capability?.Play,
			Capability?.Pause,
			Capability?.SkipToNext,
			Capability?.SkipToPrevious,
			Capability?.Stop,
		].filter(Boolean),
		compactCapabilities: [Capability?.Play, Capability?.Pause, Capability?.SkipToNext].filter(Boolean),
		notificationCapabilities: [Capability?.Play, Capability?.Pause, Capability?.SkipToNext, Capability?.SkipToPrevious].filter(Boolean),
	});
}

