import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlaylistsScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Playlists</Text>
			<Text style={styles.subtitle}>Create, rename, delete playlists</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 24, fontWeight: '700' },
	subtitle: { marginTop: 8, color: '#666' },
});

