import { create } from 'zustand';
import api from '../services/api';
import { toast } from 'sonner';

export interface PomodoroSettings {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartBreak: boolean;
    autoStartPomodoro: boolean;
    soundEnabled: boolean;
    motivationalQuotes: boolean;
    strictMode: boolean;
    dailyGoal: number;
    theme: 'dark' | 'light' | 'gray' | 'blue' | 'green' | 'purple';
}

interface SettingsState {
    settings: PomodoroSettings;
    isLoading: boolean;
    fetchSettings: () => Promise<void>;
    updateSettings: (newSettings: Partial<PomodoroSettings>) => Promise<void>;
}

const defaultSettings: PomodoroSettings = {
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    autoStartBreak: false,
    autoStartPomodoro: false,
    soundEnabled: true,
    motivationalQuotes: true,
    strictMode: false,
    dailyGoal: 8,
    theme: 'dark',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: defaultSettings,
    isLoading: false,

    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const isGuest = localStorage.getItem('isGuest') === 'true';
            if (isGuest) {
                const local = localStorage.getItem('guest-settings');
                if (local) {
                    set({ settings: JSON.parse(local) });
                }
            } else {
                const { data } = await api.get('/auth/profile');
                const backendSettings = data.settings || {};
                set({
                    settings: {
                        ...defaultSettings,
                        pomodoroDuration: backendSettings.focusDuration ?? defaultSettings.pomodoroDuration,
                        shortBreakDuration:
                            backendSettings.shortBreakDuration ?? defaultSettings.shortBreakDuration,
                        longBreakDuration:
                            backendSettings.longBreakDuration ?? defaultSettings.longBreakDuration,
                        autoStartBreak: backendSettings.autoStartBreak ?? defaultSettings.autoStartBreak,
                        autoStartPomodoro:
                            backendSettings.autoStartSession ?? defaultSettings.autoStartPomodoro,
                        motivationalQuotes:
                            backendSettings.motivationalQuotes ?? defaultSettings.motivationalQuotes,
                        dailyGoal: backendSettings.dailyGoal ?? defaultSettings.dailyGoal,
                        theme: backendSettings.theme ?? defaultSettings.theme,
                        soundEnabled: backendSettings.soundEnabled ?? defaultSettings.soundEnabled,
                        strictMode: backendSettings.strictMode ?? defaultSettings.strictMode,
                    },
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateSettings: async (newSettings) => {
        const previousSettings = get().settings;
        const updated = { ...previousSettings, ...newSettings };
        set({ settings: updated });

        const isGuest = localStorage.getItem('isGuest') === 'true';
        if (isGuest) {
            localStorage.setItem('guest-settings', JSON.stringify(updated));
            toast.success('Settings saved (Guest)');
            return;
        }

        try {
            const backendPayload = {
                settings: {
                    focusDuration: updated.pomodoroDuration,
                    shortBreakDuration: updated.shortBreakDuration,
                    longBreakDuration: updated.longBreakDuration,
                    autoStartBreak: updated.autoStartBreak,
                    autoStartSession: updated.autoStartPomodoro,
                    motivationalQuotes: updated.motivationalQuotes,
                    dailyGoal: updated.dailyGoal,
                    theme: updated.theme,
                    soundEnabled: updated.soundEnabled,
                    strictMode: updated.strictMode,
                },
            };

            await api.put('/auth/profile', backendPayload);
            toast.success('Settings saved');
        } catch (error) {
            console.error('Failed to update settings', error);
            toast.error('Failed to save settings');
            set({ settings: previousSettings });
        }
    },
}));
