# Isai 🎶 - Modern Offline Music Player

A beautiful, modern offline music player app built with React Native and Expo. Inspired by the structured UI of Spotify and the vibrant UX of Gaana.

## Features

✅ **Offline Music Playback**
- Loads only device-downloaded audio files (.mp3, .wav, .aac, etc.)
- Filters songs shorter than 1 minute
- Organizes music by folders, artists, albums, and playlists

✅ **Modern UI/UX**
- Spotify-inspired structured layout with smooth animations
- Gaana-inspired vibrant colors and intuitive navigation
- Dark/Light theme toggle
- Gradient backgrounds based on album art

✅ **Full-Featured Player**
- Persistent mini player at the bottom
- Full-screen player with album art and controls
- Background playback with notification controls
- Lockscreen controls (play, pause, next, previous)

✅ **Music Organization**
- Recently Played and Most Played sections
- Create and manage custom playlists
- Browse by Artists, Albums, and Folders
- Search and filter functionality

✅ **Player Controls**
- Play, pause, next, previous
- Shuffle and repeat modes
- Seek bar with time display
- Lyrics toggle (when available)

## Tech Stack

- **React Native** with Expo
- **react-native-track-player** - Background audio playback
- **expo-media-library** - Local music file access
- **@react-navigation** - Screen navigation
- **expo-linear-gradient** - Beautiful gradients
- **@expo/vector-icons** - Icon library
- **react-native-reanimated** - Smooth animations

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Isai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - For Android: `npx expo run:android`
   - For iOS: `npx expo run:ios` (requires macOS)
   - Or use Expo Go app to scan the QR code

## Permissions

The app requires the following permissions:

### Android
- `READ_EXTERNAL_STORAGE` - Access music files
- `READ_MEDIA_AUDIO` - Read audio files (Android 13+)
- `WAKE_LOCK` - Keep device awake during playback
- `FOREGROUND_SERVICE` - Background playback

### iOS
- `NSAppleMusicUsageDescription` - Access music library
- `UIBackgroundModes: ["audio"]` - Background audio playback

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   ├── player/         # Player-specific components
│   └── library/        # Library-specific components
├── screens/            # Screen components
│   ├── Home/          # Home screen
│   ├── Player/        # Full player screen
│   ├── Library/       # Library screen
│   └── Playlist/      # Playlist screen
├── services/          # Business logic services
│   ├── MusicService.ts    # Music file handling
│   └── PlayerService.ts  # Audio playback
├── hooks/             # Custom React hooks
│   ├── useTheme.tsx   # Theme management
│   └── usePlayer.ts   # Player state management
├── types/             # TypeScript type definitions
├── constants/         # App constants and themes
├── utils/             # Utility functions
└── navigation/        # Navigation configuration
```

## Key Components

### MusicService
- Scans and loads local music files
- Filters songs by duration (>1 minute)
- Organizes music by artists, albums, folders
- Manages playlist creation and editing
- Tracks play counts and recently played

### PlayerService
- Manages audio playback using react-native-track-player
- Handles background playback and notifications
- Supports shuffle, repeat, and queue management
- Provides lockscreen controls

### Theme System
- Dynamic light/dark theme switching
- Vibrant color schemes inspired by Spotify and Gaana
- Gradient backgrounds and smooth transitions

## Usage

1. **First Launch**: The app will request permission to access your music library
2. **Music Scanning**: Automatically scans for local music files on first run
3. **Playback**: Tap any song to start playing, use mini player for quick controls
4. **Full Player**: Tap mini player to open full-screen player with all controls
5. **Playlists**: Create custom playlists from the Playlists tab
6. **Library**: Browse your music by songs, artists, albums, or folders
7. **Theme**: Toggle between light and dark themes from the home screen

## Development

### Adding New Features
1. Create components in appropriate folders
2. Add new screens to navigation if needed
3. Update services for new functionality
4. Add types for new data structures

### Customizing Themes
- Edit `src/constants/theme.ts` to modify colors
- Update gradient colors in the same file
- Theme changes are automatically applied throughout the app

## Building for Production

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Spotify for UI/UX inspiration
- Gaana for vibrant design inspiration
- React Native Track Player community
- Expo team for excellent development tools

---

**Isai** (இசை) means "Music" in Tamil. Enjoy your music! 🎵