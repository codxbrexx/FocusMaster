import { create } from 'zustand';
import api from '../services/api';
import { toast } from 'sonner';

export interface PomodoroSession {
  id?: string;
  type: 'pomodoro' | 'short-break' | 'long-break';
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
  tag?: string;
  mood?: string;
  taskId?: string;
}

export interface ClockEntry {
  id: string; // Backend _id
  clockIn: Date;
  clockOut?: Date;
  date: string;
  breakTime: number; // in seconds
}

interface HistoryState {
  sessions: PomodoroSession[];
  clockEntries: ClockEntry[];
  isLoading: boolean;

  fetchHistory: () => Promise<void>;
  addSession: (session: PomodoroSession) => Promise<void>;

  // Clock In/Out
  clockIn: () => Promise<void>;
  clockOut: (breakTime: number, notes?: string) => Promise<void>;


  addClockEntry: (entry: Omit<ClockEntry, 'id'>) => Promise<void>; // Used for Clock In
  updateClockEntry: (id: string, updates: Partial<ClockEntry>) => Promise<void>; // Used for Clock Out
}

export const useHistoryStore = create<HistoryState>((set) => ({
  sessions: [],
  clockEntries: [],
  isLoading: false,

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const isGuest = localStorage.getItem('isGuest') === 'true';

      if (isGuest) {
        const localSessions = JSON.parse(localStorage.getItem('guest-sessions') || '[]');
        const localEntries = JSON.parse(localStorage.getItem('guest-clock-entries') || '[]');

        set({
          sessions: localSessions.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: new Date(s.endTime),
          })),
          clockEntries: localEntries.map((l: any) => ({
            ...l,
            clockIn: new Date(l.clockIn),
            clockOut: l.clockOut ? new Date(l.clockOut) : undefined,
          })),
        });
        set({ isLoading: false });
        return;
      }

      const [sessionsRes, logsRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/clock/logs'),
      ]);

      set({
        sessions: sessionsRes.data.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
        })),
        clockEntries: logsRes.data.map((l: any) => ({
          id: l._id,
          clockIn: new Date(l.startTime),
          clockOut: l.endTime ? new Date(l.endTime) : undefined,
          date: new Date(l.startTime).toLocaleDateString('en-CA'),
          breakTime: l.breakTime || 0,
        })),
      });
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addSession: async (session) => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      set((state) => {
        const newSession = { ...session, id: crypto.randomUUID() };
        const updatedSessions = [newSession, ...state.sessions];
        localStorage.setItem('guest-sessions', JSON.stringify(updatedSessions));
        return { sessions: updatedSessions };
      });
      return;
    }

    try {
      const { data } = await api.post('/sessions', session);
      set((state) => ({
        sessions: [
          { ...data, startTime: new Date(data.startTime), endTime: new Date(data.endTime) },
          ...state.sessions,
        ],
      }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to save session');
    }
  },

  clockIn: async () => {
    // Direct action if needed
  },
  clockOut: async (_breakTime, _notes) => {
    // Direct action if needed
  },

  // Compatibility Implementations
  addClockEntry: async (entry) => {
    if (!entry.clockOut) {
      const isGuest = localStorage.getItem('isGuest') === 'true';

      if (isGuest) {
        const newEntry = {
          id: crypto.randomUUID(),
          clockIn: entry.clockIn,
          clockOut: undefined,
          date: entry.date,
          breakTime: 0,
        };
        set((state) => {
          const updated = [newEntry, ...state.clockEntries];
          localStorage.setItem('guest-clock-entries', JSON.stringify(updated));
          return { clockEntries: updated };
        });
        toast.success('Clocked in (Guest)');
        return;
      }

      // It's a Clock In
      try {
        const { data } = await api.post('/clock/start');
        const newEntry = {
          id: data._id,
          clockIn: new Date(data.startTime),
          clockOut: undefined,
          date: new Date(data.startTime).toLocaleDateString('en-CA'),
          breakTime: 0,
        };
        set((state) => ({ clockEntries: [newEntry, ...state.clockEntries] }));
        toast.success('Clocked in successfully');

      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to clock in');
        throw error;
      }
    }
  },

  updateClockEntry: async (id, updates) => {
    const isGuest = localStorage.getItem('isGuest') === 'true';

    if (isGuest) {
      set((state) => {
        const updatedEntries = state.clockEntries.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        );
        localStorage.setItem('guest-clock-entries', JSON.stringify(updatedEntries));
        return { clockEntries: updatedEntries };
      });
      if (updates.clockOut) toast.success('Clocked out (Guest)');
      return;
    }

    // If updating clockOut, call /stop
    if (updates.clockOut) {
      try {
        const { data } = await api.post('/clock/stop', {
          breakTime: updates.breakTime,
          notes: '', 
        });
        set((state) => ({
          clockEntries: state.clockEntries.map((e) =>
            e.id === id
              ? {
                ...e,
                clockOut: new Date(data.endTime),
                breakTime: data.breakTime,
              }
              : e
          ),
        }));
        toast.success('Clocked out successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to clock out');
        throw error;
      }
    }
  },
}));
