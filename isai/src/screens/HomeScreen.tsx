import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { useLibraryStore } from '@/state/useLibraryStore';
import SongRow from '@/components/SongRow';

export default function HomeScreen() {
	const { tracks, recentlyPlayedIds, playCounts } = useLibraryStore();
	const recentlyPlayed = useMemo(() => recentlyPlayedIds
		.map(id => tracks.find(t => t.id === id))
		.filter(Boolean), [recentlyPlayedIds, tracks]) as any[];
	const mostPlayed = useMemo(() => {
		return [...tracks]
			.sort((a, b) => (playCounts[b.id] ?? 0) - (playCounts[a.id] ?? 0))
			.slice(0, 10);
	}, [tracks, playCounts]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Isai</Text>
			<Text style={styles.sectionTitle}>Recently Played</Text>
			<FlatList
				data={recentlyPlayed}
				horizontal
				renderItem={({ item }) => (
					<View style={{ width: 180, marginRight: 12 }}>
						<SongRow track={item} />
					</View>
				)}
				showsHorizontalScrollIndicator={false}
			/>
			<Text style={styles.sectionTitle}>Most Played</Text>
			<FlatList
				data={mostPlayed}
				renderItem={({ item }) => <SongRow track={item} />}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 28, fontWeight: '800' },
	sectionTitle: { marginTop: 16, marginBottom: 8, fontWeight: '700', fontSize: 18 },
});

