import { create } from 'zustand';

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  totalDuration: number;

  setMode: (mode: TimerMode) => void;
  setTimeLeft: (time: number) => void;
  setIsActive: (isActive: boolean) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setTotalDuration: (duration: number) => void;
  selectedTag: string;
  selectedTaskId: string;
  lastSessionId?: string;
  setSelectedTag: (tag: string) => void;
  setSelectedTaskId: (id: string) => void;
  setLastSessionId: (id: string | undefined) => void;
}

const DEFAULT_DURATIONS = {
  pomodoro: 5,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

export const useTimerStore = create<TimerState>((set) => ({
  mode: 'pomodoro',
  timeLeft: DEFAULT_DURATIONS['pomodoro'],
  isActive: false,
  totalDuration: DEFAULT_DURATIONS['pomodoro'],
  selectedTag: 'Study',
  selectedTaskId: 'none',
  lastSessionId: undefined,

  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setLastSessionId: (id) => set({ lastSessionId: id }),

  setMode: (mode) => {
    set({ mode, isActive: false });
  },

  setTotalDuration: (duration) => set({ totalDuration: duration, timeLeft: duration }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  setIsActive: (isActive) => set({ isActive }),

  toggleTimer: () => set((state) => ({ isActive: !state.isActive })),

  resetTimer: () =>
    set((state) => ({
      isActive: false,
      timeLeft: state.totalDuration,
    })),

  tick: () =>
    set((state) => {
      if (state.timeLeft <= 0) {
        return { isActive: false, timeLeft: 0 };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),
}));
