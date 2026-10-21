import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SourceBadge } from '../components/SourceBadge';

export default function ResultScreen({ route, navigation }: any) {
  const { response, source } = route.params;

  if (!response.match) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <SourceBadge source={source} />
        <Text style={styles.title}>No confident match</Text>
        <Text style={styles.muted}>Confidence: {(response.confidence * 100).toFixed(0)}%</Text>
        <Text style={styles.muted}>{response.reason}</Text>
        <Text style={styles.section}>Try asking about:</Text>
        {response.suggestions?.map((s: any, i: number) => (
          <Text key={i} style={styles.suggestion}>• {s.name} — {s.role}</Text>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Directory')}>
          <Text style={styles.btnText}>Browse Directory</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const m = response.match;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SourceBadge source={source} />
      <Text style={styles.name}>{m.fullName}</Text>
      <Text style={styles.role}>{m.role}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Confidence</Text>
        <Text style={styles.big}>{(response.confidence * 100).toFixed(0)}%</Text>
        <Text style={styles.muted}>{response.reason}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Introduction</Text>
        <Text style={styles.body}>{response.introduction}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Contribution</Text>
        <Text style={styles.body}>{m.contribution || '(not available offline)'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Measured evidence</Text>
        <Text style={styles.body}>{m.outcomeMetric || '(not available offline)'}</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Profile', { memberId: m.id })}
      >
        <Text style={styles.btnText}>Open Full Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  name: { fontSize: 24, fontWeight: '700', color: '#1b5e20' },
  role: { fontSize: 15, color: '#555', marginBottom: 12 },
  card: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 10, gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', textTransform: 'uppercase' },
  big: { fontSize: 28, fontWeight: '700', color: '#2e7d32' },
  body: { fontSize: 15, color: '#222', lineHeight: 22 },
  muted: { fontSize: 13, color: '#666' },
  section: { fontSize: 15, fontWeight: '600', marginTop: 16 },
  suggestion: { fontSize: 14, color: '#333', marginTop: 4 },
  btn: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});