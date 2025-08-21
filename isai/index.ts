import { registerRootComponent } from 'expo';
import App from './App';

// Initialize TrackPlayer service (native only)
import '@/player/playerService';

registerRootComponent(App);