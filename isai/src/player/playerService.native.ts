import TrackPlayer, { Event, Capability } from 'react-native-track-player';

async function setup() {
	try {
		await TrackPlayer.setupPlayer();
		await TrackPlayer.updateOptions({
			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.Stop,
			],
			compactCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
			],
			progressUpdateEventInterval: 1,
		});
	} catch (e) {
		// ignore if already set up
	}
}

setup();

TrackPlayer.registerPlaybackService(() => async () => {
	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
	TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
	TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
});

