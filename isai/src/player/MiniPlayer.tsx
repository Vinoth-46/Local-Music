import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '@/state/usePlayerStore';

export default function MiniPlayer() {
	const navigation = useNavigation();
	const { isPlaying, playPause } = usePlayerStore();

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={() => navigation.navigate('Player' as never)}
			style={styles.container}
		>
			<View style={styles.info}>
				<View style={styles.artworkPlaceholder} />
				<View>
					<Text style={styles.title} numberOfLines={1}>Not Playing</Text>
					<Text style={styles.subtitle} numberOfLines={1}>—</Text>
				</View>
			</View>
			<View style={styles.controls}>
				<TouchableOpacity onPress={playPause}>
					<Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {}}>
					<Ionicons name="play-skip-forward" size={24} color="#fff" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 12,
		right: 12,
		bottom: 12,
		height: 64,
		backgroundColor: '#1f1f1f',
		borderRadius: 12,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		elevation: 4,
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	artworkPlaceholder: {
		width: 44,
		height: 44,
		borderRadius: 8,
		backgroundColor: '#444',
	},
	title: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
		maxWidth: 180,
	},
	subtitle: {
		color: '#ccc',
		fontSize: 12,
		maxWidth: 180,
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
});

