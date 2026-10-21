import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }: any) {
  const { isOnline, members } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AgriSoko Pocket G15</Text>
      <Text style={styles.subtitle}>
        Ask about any team member by name, nickname, role, or skill.
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{isOnline ? '🟢 Online' : '🔴 Offline'}</Text>
      </View>
      <Text style={styles.meta}>
        Group Code: G15 · Version 1.0.0 · {members.length} members loaded
      </Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Ask')}>
        <Text style={styles.btnText}>Ask the Team</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnAlt]} onPress={() => navigation.navigate('Directory')}>
        <Text style={styles.btnText}>Browse Directory</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnAlt]} onPress={() => navigation.navigate('About')}>
        <Text style={styles.btnText}>About & Evidence</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#1b5e20', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#333', marginBottom: 16 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e8f5e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 13, color: '#666', marginBottom: 24 },
  btn: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 10, alignItems: 'center' },
  btnAlt: { backgroundColor: '#558b2f' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});