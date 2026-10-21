import AsyncStorage from '@react-native-async-storage/async-storage';
import { MemberSummary } from '../types';

const MEMBERS_KEY = '@members';
const LAST_RESULT_KEY = '@last_result';

export const cacheMembers = (m: MemberSummary[]) =>
  AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(m));

export const getCachedMembers = async (): Promise<MemberSummary[]> => {
  const raw = await AsyncStorage.getItem(MEMBERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const cacheLastResult = (r: any) =>
  AsyncStorage.setItem(LAST_RESULT_KEY, JSON.stringify(r));

export const getLastResult = async () => {
  const raw = await AsyncStorage.getItem(LAST_RESULT_KEY);
  return raw ? JSON.parse(raw) : null;
};

export async function offlineMatch(question: string): Promise<MemberSummary | null> {
  const members = await getCachedMembers();
  const q = question.toLowerCase().trim();
  if (!q) return null;
  return (
    members.find(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.id.toLowerCase() === q
    ) || null
  );
}