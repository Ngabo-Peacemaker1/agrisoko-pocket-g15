import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView,Alert,
} from 'react-native';
import { askQuestion } from '../services/api';
import { offlineMatch, cacheLastResult } from '../services/offline';
import { useApp } from '../context/AppContext';

export default function AskScreen({ navigation }: any) {
  const { isOnline } = useApp();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 async function handleAsk() {
    const q = question.trim();
    
    // ====== CONTRIBUTION DE MERCI : Alertes de validation ======
    if (!q) {
      Alert.alert("Empty Question", "Please type a question before asking.");
      setError('Please enter a question.');
      return;
    }
    if (q.length > 200) {
      Alert.alert("Question too long", "Please keep your question under 200 characters.");
      setError('Question too long (max 200 chars).');
      return;
    }
    // ==========================================================
    
    setError('');

    if (!isOnline) {
      const match = await offlineMatch(q);
      if (match) {
        const fake = {
          match: { ...match } as any,
          confidence: 1.0,
          reason: 'Offline exact match',
          introduction: '(Offline mode — limited profile)',
          modelVersion: 'offline',
          groupCode: 'G15',
        };
        navigation.navigate('Result', { response: fake, source: 'offline' });
      } else {
        setError('No offline match. Try a name or role, or reconnect.');
      }
      return;
    }

    setLoading(true);
    try {
      const result = await askQuestion(q);
      await cacheLastResult(result);
      navigation.navigate('Result', { response: result, source: 'live' });
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') setError('Request timed out. Try again.');
      else setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Text>{isOnline ? '🟢 Online' : '🔴 Offline mode'}</Text>
      </View>
      <Text style={styles.label}>Your question</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g. "Who built the AI?" or "Tell me about Ngabo"'
        placeholderTextColor="#999"
        value={question}
        onChangeText={setQuestion}
        multiline
        maxLength={500}
      />
      <Text style={styles.counter}>{question.length}/500</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={handleAsk}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Ask</Text>}
      </TouchableOpacity>
      <Text style={styles.hint}>
        Try: "Who built offline mode?" · "Tell me about Ngabo" · "Who tested with farmers?"
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Directory')}>
        <Text style={styles.link}>Or browse the directory →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#e8f5e9', padding: 8, borderRadius: 8 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 14, minHeight: 100, fontSize: 16, textAlignVertical: 'top' },
  counter: { textAlign: 'right', color: '#888', fontSize: 12 },
  error: { color: '#c62828', fontSize: 14 },
  btn: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  hint: { fontSize: 13, color: '#666', marginTop: 16, lineHeight: 18 },
  link: { color: '#1565c0', textAlign: 'center', marginTop: 12 },
});