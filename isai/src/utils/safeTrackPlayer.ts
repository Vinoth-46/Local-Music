// A thin wrapper that avoids importing react-native-track-player at Node/EAS time
// and provides no-op fallbacks for web/bundler.
export type SafeTrackPlayer = any;

export function getTrackPlayerSafe(): SafeTrackPlayer | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-track-player');
  } catch (_e) {
    return null;
  }
}

