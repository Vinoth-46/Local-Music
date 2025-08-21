import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { useLibraryStore } from '@/state/useLibraryStore';
import FolderRow from '@/components/FolderRow';

export default function LibraryScreen() {
	const { scan, isScanning, tracks, folders, scanError } = useLibraryStore();

	useEffect(() => {
		scan();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Library</Text>
			{isScanning ? (
				<View style={styles.center}>\
					<ActivityIndicator />
					<Text style={styles.subtitle}>Scanning local audio…</Text>
				</View>
			) : scanError ? (
				<Text style={[styles.subtitle, { color: 'red' }]}>{scanError}</Text>
			) : (
				<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
					<Text style={[styles.sectionTitle]}>Folders</Text>
					<FlatList
						data={Object.entries(folders)}
						renderItem={({ item }) => (
							<FolderRow folder={item[0]} count={item[1].length} />
						)}
						keyExtractor={(item) => item[0]}
						ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
					/>
					<Text style={[styles.sectionTitle, { marginTop: 16 }]}>All Songs ({tracks.length})</Text>
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 24, fontWeight: '700' },
	subtitle: { marginTop: 8, color: '#666' },
	center: { alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 8 },
	sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});

