import TrackPlayer, {
  Track,
  State,
  Event,
  RepeatMode,
  Capability,
} from 'react-native-track-player';
import { Song, PlayerState } from '../types/music';
import MusicService from './MusicService';

class PlayerService {
  private static instance: PlayerService;
  private playerState: PlayerState = {
    currentSong: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'off',
  };
  private listeners: ((state: PlayerState) => void)[] = [];
  private musicService = MusicService.getInstance();

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  async initialize(): Promise<void> {
    try {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 5, // 5MB cache
      });

      await TrackPlayer.updateOptions({
        stoppingAppPausesPlayback: false,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing player:', error);
    }
  }

  private setupEventListeners(): void {
    TrackPlayer.addEventListener(Event.PlaybackState, async (data) => {
      const isPlaying = data.state === State.Playing;
      this.updatePlayerState({ isPlaying });
    });

    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {
      if (data.nextTrack !== undefined) {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        if (track) {
          const currentSong = this.playerState.queue[data.nextTrack];
          this.updatePlayerState({
            currentSong,
            currentIndex: data.nextTrack,
          });

          // Update play count
          if (currentSong) {
            await this.musicService.updateSongPlayCount(currentSong.id);
          }
        }
      }
    });

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (data) => {
      this.updatePlayerState({
        position: data.position,
        duration: data.duration,
      });
    });
  }

  private updatePlayerState(updates: Partial<PlayerState>): void {
    this.playerState = { ...this.playerState, ...updates };
    this.listeners.forEach(listener => listener(this.playerState));
  }

  subscribe(listener: (state: PlayerState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getPlayerState(): PlayerState {
    return this.playerState;
  }

  private songToTrack(song: Song): Track {
    return {
      id: song.id,
      url: song.uri,
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: song.artwork,
      duration: song.duration,
    };
  }

  async playQueue(songs: Song[], startIndex: number = 0): Promise<void> {
    try {
      await TrackPlayer.reset();
      
      const tracks = songs.map(song => this.songToTrack(song));
      await TrackPlayer.add(tracks);
      
      this.updatePlayerState({
        queue: songs,
        currentIndex: startIndex,
        currentSong: songs[startIndex],
      });

      await TrackPlayer.skip(startIndex);
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing queue:', error);
    }
  }

  async playSong(song: Song, queue?: Song[]): Promise<void> {
    const songsToPlay = queue || [song];
    const startIndex = queue ? queue.findIndex(s => s.id === song.id) : 0;
    await this.playQueue(songsToPlay, Math.max(0, startIndex));
  }

  async play(): Promise<void> {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing:', error);
    }
  }

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }

  async togglePlayPause(): Promise<void> {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  async skipToNext(): Promise<void> {
    try {
      if (this.playerState.shuffle) {
        await this.playRandomSong();
      } else {
        await TrackPlayer.skipToNext();
      }
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  }

  async skipToPrevious(): Promise<void> {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  }

  async seekTo(position: number): Promise<void> {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }

  async toggleShuffle(): Promise<void> {
    const newShuffle = !this.playerState.shuffle;
    this.updatePlayerState({ shuffle: newShuffle });
  }

  async toggleRepeat(): Promise<void> {
    const currentRepeat = this.playerState.repeat;
    let newRepeat: 'off' | 'one' | 'all';
    let trackPlayerMode: RepeatMode;

    switch (currentRepeat) {
      case 'off':
        newRepeat = 'all';
        trackPlayerMode = RepeatMode.Queue;
        break;
      case 'all':
        newRepeat = 'one';
        trackPlayerMode = RepeatMode.Track;
        break;
      case 'one':
        newRepeat = 'off';
        trackPlayerMode = RepeatMode.Off;
        break;
    }

    await TrackPlayer.setRepeatMode(trackPlayerMode);
    this.updatePlayerState({ repeat: newRepeat });
  }

  private async playRandomSong(): Promise<void> {
    const { queue, currentIndex } = this.playerState;
    if (queue.length <= 1) return;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * queue.length);
    } while (randomIndex === currentIndex);

    await TrackPlayer.skip(randomIndex);
  }

  async addToQueue(song: Song): Promise<void> {
    try {
      const track = this.songToTrack(song);
      await TrackPlayer.add(track);
      
      this.updatePlayerState({
        queue: [...this.playerState.queue, song],
      });
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  }

  async clearQueue(): Promise<void> {
    try {
      await TrackPlayer.reset();
      this.updatePlayerState({
        queue: [],
        currentIndex: -1,
        currentSong: null,
      });
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  }

  async stop(): Promise<void> {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      this.updatePlayerState({
        isPlaying: false,
        position: 0,
        currentSong: null,
        currentIndex: -1,
        queue: [],
      });
    } catch (error) {
      console.error('Error stopping player:', error);
    }
  }
}

export default PlayerService;