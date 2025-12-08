import { create } from 'zustand';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  settings: any;
  points: number;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading by default to check auth

  login: async (userData: any) => {
    set({ user: userData, isAuthenticated: true });
  },

  register: async (userData: any) => {
    set({ user: userData, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false });
    } catch (_error) {
      console.error('Logout failed', _error);
      set({ user: null, isAuthenticated: false }); // Force logout anyway
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/profile');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
