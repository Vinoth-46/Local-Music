import React from 'react';
import { Pressable, View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNowPlaying } from '../store/usePlayerStore';

interface MiniPlayerProps {
  onExpandRoute?: string;
}

export default function MiniPlayer({ onExpandRoute }: MiniPlayerProps) {
  const { currentTrack, isPlaying, togglePlayPause, playNext } = useNowPlaying();

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.left}>
        {currentTrack.artwork ? (
          <Image source={{ uri: currentTrack.artwork }} style={styles.art} />
        ) : (
          <View style={[styles.art, styles.artPlaceholder]} />
        )}
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title ?? 'Unknown'}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist ?? 'Unknown Artist'}</Text>
        </View>
      </Pressable>
      <View style={styles.controls}>
        <Pressable onPress={togglePlayPause} hitSlop={12}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
        </Pressable>
        <Pressable onPress={playNext} hitSlop={12}>
          <Icon name="skip-next" size={28} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(20,20,20,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  art: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  artPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#bbb',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

