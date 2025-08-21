import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

export default function FullPlayerScreen() {
	return (
		<LinearGradient colors={["#222", "#111"]} style={styles.container}>
			<View style={styles.artwork} />
			<View style={styles.meta}>
				<Text style={styles.title} numberOfLines={1}>Song Title</Text>
				<Text style={styles.subtitle} numberOfLines={1}>Artist</Text>
			</View>
			<View style={styles.sliderRow}>
				<Slider
					style={{ flex: 1 }}
					minimumValue={0}
					maximumValue={1}
					minimumTrackTintColor="#fff"
					maximumTrackTintColor="#555"
					thumbTintColor="#fff"
				/>
			</View>
			<View style={styles.controls}>
				<Ionicons name="shuffle" color="#fff" size={22} />
				<Ionicons name="play-skip-back" color="#fff" size={28} />
				<View style={styles.playButton}>
					<Ionicons name="play" color="#000" size={28} />
				</View>
				<Ionicons name="play-skip-forward" color="#fff" size={28} />
				<Ionicons name="repeat" color="#fff" size={22} />
			</View>
			<View style={{ height: 40 }} />
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 24,
	},
	artwork: {
		width: '100%',
		aspectRatio: 1,
		borderRadius: 16,
		backgroundColor: '#333',
		marginTop: 24,
	},
	meta: {
		marginTop: 16,
		gap: 4,
		alignItems: 'center',
	},
	title: {
		color: '#fff',
		fontSize: 20,
		fontWeight: '700',
	},
	subtitle: {
		color: '#aaa',
		fontSize: 14,
	},
	sliderRow: {
		marginTop: 16,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	controls: {
		marginTop: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	playButton: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

