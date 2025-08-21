import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
	folder: string;
	count: number;
	onPress?: () => void;
};

export default function FolderRow({ folder, count, onPress }: Props) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.icon} />
			<View style={{ flex: 1 }}>
				<Text numberOfLines={1} style={styles.title}>{folder}</Text>
				<Text style={styles.subtitle}>{count} songs</Text>
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
	icon: {
		width: 42,
		height: 42,
		borderRadius: 6,
		backgroundColor: '#cfe3ff',
	},
	title: { fontWeight: '600' },
	subtitle: { color: '#666', fontSize: 12 },
});

