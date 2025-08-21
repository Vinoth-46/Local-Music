import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNowPlaying } from '../store/usePlayerStore';

export default function PlayerScreen() {
  const { currentTrack, isPlaying, togglePlayPause, playNext, playPrevious } = useNowPlaying();

  if (!currentTrack) {
    return (
      <View style={styles.empty}>
        <Text>No track playing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentTrack.artwork ? (
        <Image source={{ uri: currentTrack.artwork }} style={styles.art} />
      ) : (
        <View style={[styles.art, styles.placeholder]} />
      )}
      <Text style={styles.title}>{currentTrack.title ?? 'Unknown'}</Text>
      <Text style={styles.artist}>{currentTrack.artist ?? 'Unknown Artist'}</Text>
      <View style={styles.controls}>
        <Pressable onPress={playPrevious}>
          <Icon name="skip-previous" size={36} />
        </Pressable>
        <Pressable onPress={togglePlayPause}>
          <Icon name={isPlaying ? 'pause-circle' : 'play-circle'} size={64} />
        </Pressable>
        <Pressable onPress={playNext}>
          <Icon name="skip-next" size={36} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, alignItems: 'center', padding: 20 },
  art: { width: 280, height: 280, borderRadius: 16, backgroundColor: '#222', marginTop: 24 },
  placeholder: { },
  title: { fontSize: 22, fontWeight: '700', marginTop: 16 },
  artist: { fontSize: 14, color: '#666', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', marginTop: 24 },
});

