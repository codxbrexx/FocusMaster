import { create } from 'zustand';
import {
  fetchInsights,
  fetchStudyProfile,
  updateStudyProfile as updateStudyProfileApi,
  fetchStudyPlan,
  regenerateStudyPlan as regenerateStudyPlanApi,
  fetchRecommendations,
  fetchAdaptiveTimer,
  type AiInsightsResponse,
  type StudyProfile,
  type StudyPlanResponse,
  type Recommendation,
  type AdaptiveTimerSuggestion,
} from '../services/aiApi';

interface AiState {
  // Insights
  insights: AiInsightsResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
  fetchAiInsights: () => Promise<void>;
  clearInsights: () => void;

  // Study Profile
  studyProfile: StudyProfile | null;
  profileLoading: boolean;
  fetchStudyProfile: () => Promise<void>;
  updateStudyProfile: (profile: Partial<StudyProfile>) => Promise<void>;

  // Study Plan
  studyPlan: StudyPlanResponse | null;
  planLoading: boolean;
  planError: string | null;
  fetchStudyPlan: () => Promise<void>;
  regenerateStudyPlan: () => Promise<void>;

  // Recommendations
  recommendations: Recommendation[];
  recsLoading: boolean;
  fetchRecommendations: () => Promise<void>;

  // Adaptive Timer
  adaptiveSuggestion: AdaptiveTimerSuggestion | null;
  adaptiveLoading: boolean;
  fetchAdaptiveTimer: () => Promise<void>;
}

export const useAiStore = create<AiState>((set) => ({
  // ── Insights ────────────────────────────────────────────────────
  insights: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchAiInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchInsights();
      set({ insights: data, isLoading: false, lastFetched: new Date() });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load AI insights';
      set({ isLoading: false, error: message });
    }
  },

  clearInsights: () => {
    set({ insights: null, error: null, lastFetched: null });
  },

  // ── Study Profile ──────────────────────────────────────────────
  studyProfile: null,
  profileLoading: false,

  fetchStudyProfile: async () => {
    set({ profileLoading: true });
    try {
      const { studyProfile } = await fetchStudyProfile();
      set({ studyProfile, profileLoading: false });
    } catch {
      set({ profileLoading: false });
    }
  },

  updateStudyProfile: async (profile) => {
    set({ profileLoading: true });
    try {
      const { studyProfile } = await updateStudyProfileApi(profile);
      set({ studyProfile, profileLoading: false });
    } catch {
      set({ profileLoading: false });
    }
  },

  // ── Study Plan ─────────────────────────────────────────────────
  studyPlan: null,
  planLoading: false,
  planError: null,

  fetchStudyPlan: async () => {
    set({ planLoading: true, planError: null });
    try {
      const result = await fetchStudyPlan();
      set({ studyPlan: result, planLoading: false, planError: result.error || null });
    } catch {
      set({ planLoading: false, planError: 'Failed to load study plan' });
    }
  },

  regenerateStudyPlan: async () => {
    set({ planLoading: true, planError: null });
    try {
      const result = await regenerateStudyPlanApi();
      set({ studyPlan: result, planLoading: false, planError: result.error || null });
    } catch {
      set({ planLoading: false, planError: 'Failed to generate study plan' });
    }
  },

  // ── Recommendations ────────────────────────────────────────────
  recommendations: [],
  recsLoading: false,

  fetchRecommendations: async () => {
    set({ recsLoading: true });
    try {
      const { recommendations } = await fetchRecommendations();
      set({ recommendations, recsLoading: false });
    } catch {
      set({ recsLoading: false });
    }
  },

  // ── Adaptive Timer ─────────────────────────────────────────────
  adaptiveSuggestion: null,
  adaptiveLoading: false,

  fetchAdaptiveTimer: async () => {
    set({ adaptiveLoading: true });
    try {
      const suggestion = await fetchAdaptiveTimer();
      set({ adaptiveSuggestion: suggestion, adaptiveLoading: false });
    } catch {
      set({ adaptiveLoading: false });
    }
  },
}));

