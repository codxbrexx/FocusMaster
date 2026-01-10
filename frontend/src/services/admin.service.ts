import axios from 'axios';
import type { User } from '../admin/features/users/UserViewPanel';

const API_URL = '/api/admin';

// Configuration for Axios (Intercepts can be added here if not globally set)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for Admin Auth Cookie
});

export interface DashboardStats {
  kpis: {
    totalUsers: number;
    totalSessions: number;
    activeToday: number;
    recentErrors: number;
  };
  traffic: {
    date: string;
    sessions: number;
    visitors: number;
  }[];
}

export interface UserResponse {
  users: User[];
  page: number;
  pages: number;
  total: number;
}

export const adminService = {
  // Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/stats');
    return data;
  },

  // Users
  getUsers: async (page = 1, search = '', role = '', status = ''): Promise<UserResponse> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    if (role && role !== 'all') params.append('role', role);
    if (status && status !== 'all') params.append('status', status);

    const { data } = await api.get(`/users?${params.toString()}`);
    return data;
  },

  // Actions
  updateUserStatus: async (id: string, status: string, banReason?: string) => {
    const { data } = await api.put(`/users/${id}/status`, { status, banReason });
    return data;
  },

  // Audit
  getAuditLogs: async () => {
    const { data } = await api.get('/audit');
    return data;
  },

  // Health
  getSystemHealth: async () => {
    const { data } = await api.get('/health');
    return data;
  },

  // Support
  getFeedback: async () => {
    const { data } = await api.get('/feedback');
    return data;
  },

  updateFeedbackStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/feedback/${id}/status`, { status });
    return data;
  },
};
