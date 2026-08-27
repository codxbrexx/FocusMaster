import api from './api';

export interface AiInsightsResponse {
  insights: string[];
  recommendations: string[];
  summary: string;
  prepAdvice?: string;
  productivityScore: number;
  examReadinessScore?: number;
  burnoutRisk?: string;
  scoreBreakdown: {
    consistency: { score: number; weight: number; streak: number };
    completion: { score: number; weight: number };
    focusQuality: { score: number; weight: number; avgMin: number; targetMin: number };
    timeManagement: { score: number; weight: number; peakHours: number[] };
  };
  stats: {
    focus: {
      totalSessions: number;
      totalMinutes: number;
      avgDurationMin: number;
      completionRate: number;
      weeklyMinutes: number;
    };
    patterns: {
      peakHours: number[];
      breakFrequency: number;
      currentStreak: number;
      moodDistribution: Record<string, number>;
    };
    tasks: {
      total: number;
      completed: number;
      completionRate: number;
    };
  };
  generatedAt: string;
  fromCache: boolean;
}

export interface StudySubject {
  name: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface StudyProfile {
  stream: string | null;
  customStreamName: string;
  subjects: StudySubject[];
  examDate: string | null;
  weeklyGoalHours: number;
  availableHoursPerDay: number;
}

export interface DailySubject {
  name: string;
  hours: number;
  activity: string;
}

export interface DailyPlan {
  day: string;
  subjects: DailySubject[];
}

export interface WeekPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  theme: string;
  dailyPlans: DailyPlan[];
}

export interface StudyPlanResponse {
  plan: {
    _id: string;
    weeks: WeekPlan[];
    examDate: string;
    totalWeeks: number;
    stream: string;
    subjects: string[];
    generatedAt: string;
  } | null;
  fromCache?: boolean;
  error?: string;
}

export interface Recommendation {
  id?: string;
  type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface AdaptiveTimerSuggestion {
  hasEnoughData: boolean;
  message?: string;
  suggestedFocusDuration?: number;
  suggestedShortBreak?: number;
  suggestedLongBreak?: number;
  confidence?: 'low' | 'medium' | 'high';
}

// ── AI Insights ─────────────────────────────────────────────────
export async function fetchInsights(): Promise<AiInsightsResponse> {
  const { data } = await api.get('/ai/insights');
  return data;
}

export async function fetchAnalyticsSummary(days = 30) {
  const { data } = await api.get(`/ai/summary?days=${days}`);
  return data;
}

// ── Study Profile ───────────────────────────────────────────────
export async function fetchStudyProfile(): Promise<{ studyProfile: StudyProfile }> {
  const { data } = await api.get('/study-profile');
  return data;
}

export async function updateStudyProfile(profile: Partial<StudyProfile>): Promise<{ studyProfile: StudyProfile }> {
  const { data } = await api.put('/study-profile', profile);
  return data;
}

// ── Study Plan ──────────────────────────────────────────────────
export async function fetchStudyPlan(): Promise<StudyPlanResponse> {
  const { data } = await api.get('/ai/study-plan');
  return data;
}

export async function regenerateStudyPlan(): Promise<StudyPlanResponse> {
  const { data } = await api.post('/ai/study-plan');
  return data;
}

// ── Recommendations ──────────────────────────────────────────────
export async function fetchRecommendations(): Promise<RecommendationsResponse> {
  const { data } = await api.get('/ai/recommendations');
  return data;
}

// ── Adaptive Timer ──────────────────────────────────────────────
export async function fetchAdaptiveTimer(): Promise<AdaptiveTimerSuggestion> {
  const { data } = await api.get('/ai/adaptive-timer');
  return data;
}

// ── RAG Study Assistant ─────────────────────────────────────────
export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/ai/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function fetchDocuments() {
  const { data } = await api.get('/ai/documents');
  return data;
}

export async function queryRag(query: string) {
  const { data } = await api.post('/ai/rag/query', { query });
  return data;
}

export async function generateQuiz(topic?: string) {
  const { data } = await api.post('/ai/rag/quiz', { topic });
  return data;
}

export async function sendStudyChat(message: string, history: any[] = []) {
  const { data } = await api.post('/ai/chat', { message, history });
  return data;
}

export interface WeeklyDigestResponse {
  weeklyFocusHours: number;
  sessionsCompleted: number;
  streakDays: number;
  productivityScore: number;
  examReadinessScore: number;
  burnoutRisk: 'low' | 'moderate' | 'high';
  headline: string;
  keyHighlights: string[];
  nextWeekAction: string;
  generatedAt: string;
}

export async function fetchWeeklyDigest(): Promise<WeeklyDigestResponse> {
  const { data } = await api.get('/ai/weekly-digest');
  return data;
}

