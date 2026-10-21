import axios from 'axios';
import Constants from 'expo-constants';

export const API_BASE_URL =
  (Constants.expoConfig?.extra as any)?.apiUrl ||
  'https://agrisoko-g15-api.onrender.com';

const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

export const askQuestion = async (question: string) =>
  (await client.post('/ask', { question })).data;

export const fetchMembers = async () =>
  (await client.get('/members')).data;

export const fetchMember = async (id: string) =>
  (await client.get(`/members/${id}`)).data;

export const fetchHealth = async () =>
  (await client.get('/health')).data;

export const fetchModelInfo = async () =>
  (await client.get('/model-info')).data;