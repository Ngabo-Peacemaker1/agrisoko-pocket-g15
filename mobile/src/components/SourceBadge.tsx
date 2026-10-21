import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SourceBadge({ source }: { source: 'live' | 'cached' | 'offline' }) {
  const colors: Record<string, string> = {
    live: '#2e7d32',
    cached: '#ef6c00',
    offline: '#c62828',
  };
  const labels: Record<string, string> = {
    live: '🟢 Live result',
    cached: '🟠 Cached result',
    offline: '🔴 Offline match',
  };
  return (
    <View style={[styles.badge, { backgroundColor: colors[source] }]}>
      <Text style={styles.text}>{labels[source]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
  text: { color: '#fff', fontWeight: '600', fontSize: 13 },
});