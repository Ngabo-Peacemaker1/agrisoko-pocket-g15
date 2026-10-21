import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';

export default function DirectoryScreen({ navigation }: any) {
  const { members, isOnline } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text>{isOnline ? '🟢 Online directory' : '🔴 Cached directory'}</Text>
      </View>
      <FlatList
        data={members}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Profile', { memberId: item.id })}
          >
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.skills}>{item.skills.join(' · ')}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No members loaded yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  badge: { backgroundColor: '#e8f5e9', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  name: { fontSize: 17, fontWeight: '700', color: '#1b5e20' },
  role: { fontSize: 14, color: '#333', marginTop: 2 },
  skills: { fontSize: 12, color: '#666', marginTop: 6 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});