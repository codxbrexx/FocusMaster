import api from './api';

export interface AiInsightsResponse {
  insights: string[];
  recommendations: string[];
  summary: string;
  productivityScore: number;
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

export async function fetchInsights(): Promise<AiInsightsResponse> {
  const { data } = await api.get('/ai/insights');
  return data;
}

export async function fetchAnalyticsSummary(days = 30) {
  const { data } = await api.get(`/ai/summary?days=${days}`);
  return data;
}
