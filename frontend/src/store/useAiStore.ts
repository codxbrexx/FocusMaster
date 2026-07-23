import { create } from 'zustand';
import { fetchInsights, type AiInsightsResponse } from '../services/aiApi';

interface AiState {
  insights: AiInsightsResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;

  fetchAiInsights: () => Promise<void>;
  clearInsights: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  insights: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchAiInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchInsights();
      set({
        insights: data,
        isLoading: false,
        lastFetched: new Date(),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load AI insights';
      set({ isLoading: false, error: message });
    }
  },

  clearInsights: () => {
    set({ insights: null, error: null, lastFetched: null });
  },
}));
