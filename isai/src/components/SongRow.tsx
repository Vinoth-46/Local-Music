import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LocalTrack } from '@/utils/media';

type Props = {
	track: LocalTrack;
	onPress?: () => void;
};

export default function SongRow({ track, onPress }: Props) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.artwork} />
			<View style={{ flex: 1 }}>
				<Text numberOfLines={1} style={styles.title}>{track.title ?? track.filename ?? 'Unknown'}</Text>
				<Text numberOfLines={1} style={styles.subtitle}>{track.artist ?? 'Unknown Artist'}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingVertical: 10,
	},
	artwork: {
		width: 42,
		height: 42,
		borderRadius: 6,
		backgroundColor: '#ddd',
	},
	title: { fontWeight: '600' },
	subtitle: { color: '#666', fontSize: 12 },
});

