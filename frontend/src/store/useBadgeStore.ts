import { create } from 'zustand';
import api from '@/services/api';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  earnedAt?: string | null;
}

export interface XpSummary {
  totalXP: number;
  weeklyXP: number;
  monthlyXP: number;
  level: number;
  currentLevelXPThreshold: number;
  nextLevelXPThreshold: number;
  progressPercent: number;
  currentStreak: number;
  longestStreak: number;
  streakShield: {
    active: boolean;
    expiresAt?: string | null;
  };
  earnedBadgesCount: number;
  totalBadgesCount: number;
}

interface BadgeState {
  xpSummary: XpSummary | null;
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  recentUnlockedBadge: Badge | null;

  // Actions
  fetchXpSummary: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  activateShield: () => Promise<void>;
  clearRecentBadge: () => void;
}

export const useBadgeStore = create<BadgeState>((set) => ({
  xpSummary: null,
  badges: [],
  isLoading: false,
  error: null,
  recentUnlockedBadge: null,

  fetchXpSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/xp/me');
      set({ xpSummary: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to fetch XP summary',
        isLoading: false,
      });
    }
  },

  fetchBadges: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/xp/badges');
      set({ badges: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to fetch badges',
        isLoading: false,
      });
    }
  },

  activateShield: async () => {
    try {
      const response = await api.post('/xp/streak-shield');
      set((state) => ({
        xpSummary: state.xpSummary
          ? { ...state.xpSummary, streakShield: response.data.streakShield }
          : null,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to activate streak shield' });
    }
  },

  clearRecentBadge: () => set({ recentUnlockedBadge: null }),
}));
