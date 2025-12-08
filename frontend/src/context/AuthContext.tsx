/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isGuest = localStorage.getItem('isGuest') === 'true';

      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        if (isGuest) {
          setUser({ _id: 'guest', name: 'Guest User', email: 'guest@daylite.app' });
          setIsAuthenticated(true);
        } else {
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
      setUser(data);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.removeItem('isGuest');
      setUser(data);
      setIsAuthenticated(true);
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
    localStorage.removeItem('guest_id'); // Clear guest ID on logout
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
      toast.success('Welcome! You are now using a guest account.');
      return data;
    } catch (error) {
      console.error('Guest login error:', error);
      toast.error('Guest login failed'); // Added toast for guest login failure
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, loginAsGuest }}
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
