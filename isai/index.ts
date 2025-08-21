import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

try {
	// Avoid static import to prevent bundling errors on web/Expo Go
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const TrackPlayer = require('react-native-track-player').default;
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	TrackPlayer.registerPlaybackService(() => require('./src/player/service').default);
} catch (e) {
	// no-op for non-native environments
}
