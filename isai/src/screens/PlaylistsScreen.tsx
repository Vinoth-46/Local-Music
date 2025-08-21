import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlaylistsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlists</Text>
      <Text>Create, rename, delete and add songs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});

