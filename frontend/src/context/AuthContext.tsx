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

  // Check for existing token on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      // Check if temporary guest
      const isGuest = localStorage.getItem('isGuest') === 'true';

      if (token) {
        try {
          // Verify token and get user
          const { data } = await api.get('/auth/profile');
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false); // Ensure isAuthenticated is false on failure
        }
      } else if (isGuest) {
        setUser({ _id: 'guest', name: 'Guest User', email: 'guest@daylite.app' });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
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
      localStorage.setItem('token', data.token);
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
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    setUser(null);
    setIsAuthenticated(false); // Ensure this is set
    toast.success('Logged out');
  };

  const loginAsGuest = async () => {
    try {
      const { data } = await api.post('/auth/guest');
      localStorage.setItem('token', data.token); // Assuming backend returns token
      // Backend returns isGuest in user object, but we can also set it explicitly if needed for logic
      localStorage.setItem('isGuest', 'true');
      setUser(data);
      setIsAuthenticated(true);
      toast.success('Welcome! You are now using a guest account.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Guest login failed');
      // Fallback to local guest mode if offline? (Optional, but let's stick to valid backend auth)
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
