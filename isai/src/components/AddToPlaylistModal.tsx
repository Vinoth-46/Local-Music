import React from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { usePlaylistsStore } from '../store/usePlaylistsStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  songId: string | null;
}

export default function AddToPlaylistModal({ visible, onClose, songId }: Props) {
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylistsStore();
  const [name, setName] = React.useState('');

  if (!visible) return null;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add to playlist</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="New playlist name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Pressable
              style={styles.button}
              onPress={() => {
                if (!name.trim()) return;
                const id = createPlaylist(name.trim());
                setName('');
                if (songId) addSongToPlaylist(id, songId);
              }}
            >
              <Text style={styles.buttonText}>Create</Text>
            </Pressable>
          </View>
          <FlatList
            data={Object.values(playlists)}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  if (songId) addSongToPlaylist(item.id, songId);
                  onClose();
                }}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </Pressable>
            )}
          />
          <Pressable style={[styles.button, { alignSelf: 'center', marginTop: 8 }]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#111', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 8 },
  button: { backgroundColor: '#1db954', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#000', fontWeight: '700' },
  item: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#333' },
  itemText: { color: '#fff' },
});

