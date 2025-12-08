import { create } from 'zustand';
import api from '../services/api';

interface SpotifyState {
  isConnected: boolean;
  isPlaying: boolean;
  currentTrack: any;
  isLoading: boolean;
  checkConnection: () => Promise<void>;
  params: any;
  getPlaybackState: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  login: () => Promise<void>;
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  isConnected: false,
  isPlaying: false,
  currentTrack: null,
  isLoading: false,
  params: null,

  checkConnection: async () => {
    try {
      await api.get('/spotify/player');
      set({ isConnected: true });
    } catch {
      set({ isConnected: false });
    }
  },

  getPlaybackState: async () => {
    try {
      const res = await api.get('/spotify/player');
      if (res.data.connected === false) {
        set({ isConnected: false });
        return;
      }
      set({
        isConnected: true,
        isPlaying: res.data.is_playing,
        currentTrack: res.data.item,
      });
    } catch (_error) {
      console.error(_error);
    }
  },

  play: async () => {
    await api.put('/spotify/play');
    set({ isPlaying: true });
  },

  pause: async () => {
    await api.put('/spotify/pause');
    set({ isPlaying: false });
  },

  login: async () => {
    const res = await api.get('/spotify/login');
    window.location.href = res.data.url;
  },
}));
