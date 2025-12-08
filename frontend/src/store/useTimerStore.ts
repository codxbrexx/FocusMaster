import { create } from 'zustand';

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

interface TimerState {
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
}

const DEFAULT_DURATIONS = {
  'pomodoro': 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

export const useTimerStore = create<TimerState>((set) => ({
  mode: 'pomodoro',
  timeLeft: DEFAULT_DURATIONS['pomodoro'],
  isActive: false,
  totalDuration: DEFAULT_DURATIONS['pomodoro'],

  setMode: (mode) => {
    // When changing mode, we need to know the duration from settings.
    // However, store is pure. We'll rely on the component (PomodoroTimer) 
    // or GlobalTimer to update totalDuration if settings change.
    // For now, use defaults or current totalDuration if mapped.
    set({ mode, isActive: false });
  },

  setTotalDuration: (duration) => set({ totalDuration: duration, timeLeft: duration }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  setIsActive: (isActive) => set({ isActive }),

  toggleTimer: () => set((state) => ({ isActive: !state.isActive })),

  resetTimer: () => set((state) => ({
    isActive: false,
    timeLeft: state.totalDuration
  })),

  tick: () => set((state) => {
    if (state.timeLeft <= 0) {
      return { isActive: false, timeLeft: 0 };
    }
    return { timeLeft: state.timeLeft - 1 };
  }),
}));
