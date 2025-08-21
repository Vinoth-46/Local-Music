import { useState, useEffect } from 'react';
import { PlayerState, Song } from '../types/music';
import PlayerService from '../services/PlayerService';

export const usePlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'off',
  });

  const playerService = PlayerService.getInstance();

  useEffect(() => {
    // Initialize player service
    playerService.initialize();

    // Subscribe to player state changes
    const unsubscribe = playerService.subscribe((state) => {
      setPlayerState(state);
    });

    // Get initial state
    setPlayerState(playerService.getPlayerState());

    return unsubscribe;
  }, []);

  const playSong = async (song: Song, queue?: Song[]) => {
    await playerService.playSong(song, queue);
  };

  const playQueue = async (songs: Song[], startIndex: number = 0) => {
    await playerService.playQueue(songs, startIndex);
  };

  const togglePlayPause = async () => {
    await playerService.togglePlayPause();
  };

  const skipToNext = async () => {
    await playerService.skipToNext();
  };

  const skipToPrevious = async () => {
    await playerService.skipToPrevious();
  };

  const seekTo = async (position: number) => {
    await playerService.seekTo(position);
  };

  const toggleShuffle = async () => {
    await playerService.toggleShuffle();
  };

  const toggleRepeat = async () => {
    await playerService.toggleRepeat();
  };

  const addToQueue = async (song: Song) => {
    await playerService.addToQueue(song);
  };

  const clearQueue = async () => {
    await playerService.clearQueue();
  };

  const stop = async () => {
    await playerService.stop();
  };

  return {
    playerState,
    playSong,
    playQueue,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    clearQueue,
    stop,
  };
};