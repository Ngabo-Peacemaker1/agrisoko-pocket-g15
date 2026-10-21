import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { fetchModelInfo, fetchHealth, API_BASE_URL } from '../services/api';

export default function AboutScreen() {
  const [info, setInfo] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try { setInfo(await fetchModelInfo()); } catch {}
      try { setHealth(await fetchHealth()); } catch {}
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About AgriSoko Pocket G15</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Group code</Text>
        <Text style={styles.body}>G15</Text>
        <Text style={styles.label}>App version</Text>
        <Text style={styles.body}>1.0.0</Text>
        <Text style={styles.label}>API base URL</Text>
        <Text style={styles.body}>{API_BASE_URL}</Text>
        <Text style={styles.label}>API status</Text>
        <Text style={styles.body}>{health?.status || 'unavailable'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Data source</Text>
        <Text style={styles.body}>members.json (approved profiles)</Text>
        <Text style={styles.label}>Model approach</Text>
        <Text style={styles.body}>{info?.vectorizer || '—'}</Text>
        <Text style={styles.label}>Confidence threshold</Text>
        <Text style={styles.body}>{info?.threshold ?? '—'}</Text>
        <Text style={styles.label}>Dataset fingerprint</Text>
        <Text style={styles.body}>{info?.fingerprint?.slice(0, 24) || '—'}...</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Limitations</Text>
        {(info?.limitations || []).map((l: string, i: number) => (
          <Text key={i} style={styles.body}>• {l}</Text>
        ))}
      </View>

      <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Ngabo-Peacemaker1/agrisoko-pocket-g15')}>
        <Text style={styles.link}>🔗 View GitHub repository</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1b5e20', marginBottom: 8 },
  card: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 10, gap: 4 },
  label: { fontSize: 12, fontWeight: '600', color: '#666', textTransform: 'uppercase', marginTop: 6 },
  body: { fontSize: 15, color: '#222' },
  link: { color: '#1565c0', fontSize: 15, textAlign: 'center', padding: 12 },
});