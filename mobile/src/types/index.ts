export type MemberSummary = {
  id: string;
  fullName: string;
  role: string;
  skills: string[];
  feature: string;
};

export type MemberFull = MemberSummary & {
  registrationNumber: string;
  githubUsername: string;
  contribution: string;
  outcomeMetric: string;
  evidenceLinks: Record<string, string>;
  testerFeedback: { tester: string; observation: string; date: string };
  introductionDraft: string;
};

export type AskResponse = {
  match: MemberFull | null;
  confidence: number;
  reason: string;
  introduction?: string;
  suggestions?: { name: string; role: string }[];
  modelVersion: string;
  groupCode: string;
};

export type RootStackParamList = {
  Home: undefined;
  Ask: undefined;
  Result: { response: AskResponse; source: 'live' | 'cached' | 'offline' };
  Directory: undefined;
  Profile: { memberId: string };
  About: undefined;
};