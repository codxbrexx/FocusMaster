/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTaskStore } from '../store/useTaskStore';
import { useHistoryStore } from '../store/useHistoryStore';

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isGuest = localStorage.getItem('isGuest') === 'true';
      const hasAuthFlag = localStorage.getItem('isAuthenticated') === 'true';

      if (!hasAuthFlag && !isGuest) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
        setIsAuthenticated(true);
        if (!isGuest) localStorage.setItem('isAuthenticated', 'true');

        // Hydrate all stores after authentication
        await Promise.all([
          useSettingsStore.getState().fetchSettings(),
          useTaskStore.getState().fetchTasks(),
          useHistoryStore.getState().fetchHistory(),
        ]);
      } catch (error) {
        if (isGuest) {
          setUser({ _id: 'guest', name: 'Guest User', email: 'guest@daylite.app' });
          setIsAuthenticated(true);

          // Hydrate stores for guest mode
          await Promise.all([
            useSettingsStore.getState().fetchSettings(),
            useTaskStore.getState().fetchTasks(),
            useHistoryStore.getState().fetchHistory(),
          ]);
        } else {
          localStorage.removeItem('isAuthenticated');
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.removeItem('isGuest');
      localStorage.setItem('isAuthenticated', 'true');
      setUser(data);
      setIsAuthenticated(true);

      // Hydrate stores after login
      await Promise.all([
        useSettingsStore.getState().fetchSettings(),
        useTaskStore.getState().fetchTasks(),
        useHistoryStore.getState().fetchHistory(),
      ]);

      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const { data } = await api.post('/auth/google', { token });
      localStorage.removeItem('isGuest');
      localStorage.setItem('isAuthenticated', 'true');
      setUser(data);
      setIsAuthenticated(true);

      // Hydrate stores after Google login
      await Promise.all([
        useSettingsStore.getState().fetchSettings(),
        useTaskStore.getState().fetchTasks(),
        useHistoryStore.getState().fetchHistory(),
      ]);

      toast.success('Signed in with Google!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.removeItem('isGuest');
      localStorage.setItem('isAuthenticated', 'true');
      setUser(data);
      setIsAuthenticated(true);

      // Hydrate stores after registration
      await Promise.all([
        useSettingsStore.getState().fetchSettings(),
        useTaskStore.getState().fetchTasks(),
        useHistoryStore.getState().fetchHistory(),
      ]);

      toast.success('Account created!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    }
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guest_id');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  const loginAsGuest = async () => {
    try {
      // client-side "sticky" session ID to resume data
      const savedId = localStorage.getItem('guest_id');

      const { data } = await api.post('/auth/guest', { guestId: savedId });

      // Save ID for next time
      localStorage.setItem('guest_id', data._id);
      localStorage.setItem('isGuest', 'true');

      setUser(data);
      setIsAuthenticated(true);

      // Hydrate stores for guest mode
      await Promise.all([
        useSettingsStore.getState().fetchSettings(),
        useTaskStore.getState().fetchTasks(),
        useHistoryStore.getState().fetchHistory(),
      ]);

      toast.success('Welcome! You are now using a guest account.');
      return data;
    } catch (error) {
      console.error('Guest login error:', error);
      toast.error('Guest login failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, loginAsGuest, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
