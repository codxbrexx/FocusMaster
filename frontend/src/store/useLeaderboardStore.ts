import { create } from 'zustand';
import axios from 'axios';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  picture: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  stream: string;
  badgeCount: number;
}

interface LeaderboardState {
  period: 'weekly' | 'monthly' | 'alltime';
  stream: string;
  rankings: LeaderboardEntry[];
  userRank: LeaderboardEntry | null;
  totalParticipants: number;
  isLoading: boolean;
  error: string | null;

  setPeriod: (period: 'weekly' | 'monthly' | 'alltime') => void;
  setStream: (stream: string) => void;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  period: 'weekly',
  stream: 'global',
  rankings: [],
  userRank: null,
  totalParticipants: 0,
  isLoading: false,
  error: null,

  setPeriod: (period) => {
    set({ period });
    get().fetchLeaderboard();
  },

  setStream: (stream) => {
    set({ stream });
    get().fetchLeaderboard();
  },

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { period, stream } = get();
      const res = await axios.get(`/api/leaderboard`, {
        params: { period, stream, limit: 50 },
        withCredentials: true,
      });

      if (res.data?.success) {
        set({
          rankings: res.data.data.rankings || [],
          userRank: res.data.data.userRank || null,
          totalParticipants: res.data.data.totalParticipants || 0,
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to load leaderboard',
      });
    }
  },
}));
