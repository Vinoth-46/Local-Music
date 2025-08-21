import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';

// Register the track player service
TrackPlayer.registerPlaybackService(() => require('./trackPlayerService'));

// Register the main component
registerRootComponent(App);