import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Recently Played</Text>
      <View style={styles.row}>
        {/* TODO: Cards */}
      </View>
      <Text style={styles.heading}>Most Played</Text>
      <View style={styles.row} />
      <Text style={styles.heading}>Playlists</Text>
      <View style={styles.row} />
      <Text style={styles.heading}>Folders</Text>
      <View style={styles.row} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  row: { height: 140, backgroundColor: 'transparent' },
});

