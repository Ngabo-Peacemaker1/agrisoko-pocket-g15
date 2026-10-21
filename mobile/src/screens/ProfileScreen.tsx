import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { fetchMember } from '../services/api';

export default function ProfileScreen({ route }: any) {
  const { memberId } = route.params;
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const m = await fetchMember(memberId);
        setMember(m);
      } catch {
        setError('Could not load profile (offline?).');
      } finally {
        setLoading(false);
      }
    })();
  }, [memberId]);

  async function openLink(url: string) {
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) await Linking.openURL(url);
    } catch {}
  }

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <View style={styles.center}><Text>{error}</Text></View>;
  if (!member) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{member.fullName}</Text>
      <Text style={styles.role}>{member.role}</Text>
      <Text style={styles.meta}>Reg #: {member.registrationNumber} · GitHub: @{member.githubUsername}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Contribution</Text>
        <Text style={styles.body}>{member.contribution}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Skills</Text>
        <Text style={styles.body}>{member.skills.join(', ')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Measured evidence</Text>
        <Text style={styles.body}>{member.outcomeMetric}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Evidence links</Text>
        {Object.entries(member.evidenceLinks || {}).map(([k, v]) => (
          <TouchableOpacity key={k} onPress={() => openLink(v as string)}>
            <Text style={styles.link}>🔗 {k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tester feedback</Text>
        <Text style={styles.body}>
          {member.testerFeedback?.tester}: {member.testerFeedback?.observation}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, gap: 12 },
  name: { fontSize: 24, fontWeight: '700', color: '#1b5e20' },
  role: { fontSize: 15, color: '#555' },
  meta: { fontSize: 12, color: '#666', marginBottom: 12 },
  card: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 10, gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', textTransform: 'uppercase' },
  body: { fontSize: 15, color: '#222', lineHeight: 22 },
  link: { fontSize: 15, color: '#1565c0', paddingVertical: 4 },
});