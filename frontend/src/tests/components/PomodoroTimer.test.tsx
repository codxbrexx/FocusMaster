import { render, screen, fireEvent } from '@testing-library/react';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerStore } from '@/store/useTimerStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useHistoryStore } from '@/store/useHistoryStore';

// Mock stores
vi.mock('@/store/useTimerStore', () => ({
    useTimerStore: vi.fn(),
}));

vi.mock('@/store/useSettingsStore', () => ({
    useSettingsStore: vi.fn(),
}));

vi.mock('@/store/useTaskStore', () => ({
    useTaskStore: vi.fn(),
}));

vi.mock('@/store/useHistoryStore', () => ({
    useHistoryStore: vi.fn(),
}));

// Mock Audio (Constructible)
const mockPlay = vi.fn();
vi.stubGlobal('Audio', class {
    play = mockPlay;
    pause = vi.fn();
    currentTime = 0;
    src = '';
});

describe('PomodoroTimer', () => {
    const mockSetMode = vi.fn();
    const mockSetIsActive = vi.fn(); // Replaces setIsRunning
    const mockResetTimer = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useTimerStore to handle selectors
        (useTimerStore as unknown as any).mockImplementation((selector: any) => {
            const state = {
                mode: 'pomodoro',
                timeLeft: 1500, // 25:00
                isActive: false,
                totalDuration: 1500,
                setMode: mockSetMode,
                setIsActive: mockSetIsActive,
                resetTimer: mockResetTimer,
                selectedTag: 'Work',
                selectedTaskId: 'none',
                setSelectedTag: vi.fn(),
                setSelectedTaskId: vi.fn(),
                setTotalDuration: vi.fn(),
            };
            return selector ? selector(state) : state;
        });

        // Mock getState for useEffect usage
        (useTimerStore as unknown as any).getState = vi.fn(() => ({
            setTotalDuration: vi.fn(),
        }));

        // Mock Settings
        (useSettingsStore as unknown as any).mockReturnValue({
            settings: {
                pomodoroDuration: 25,
                shortBreakDuration: 5,
                longBreakDuration: 15,
                autoStartBreaks: false,
                autoStartPomodoros: false,
            },
        });

        // Mock Tasks
        (useTaskStore as unknown as any).mockReturnValue({
            tasks: [],
        });

        // Mock History
        (useHistoryStore as unknown as any).mockReturnValue({
            sessions: [],
        });
    });

    const renderTimer = () => {
        return render(
            <BrowserRouter>
                <PomodoroTimer />
            </BrowserRouter>
        );
    };

    it('renders timer display correctly', () => {
        renderTimer();
        expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('toggles start/pause', () => {
        // Initial state is paused/idle
        renderTimer();

        // Check for "Start" text which contains the icon and text
        const startButton = screen.getByRole('button', { name: /start/i });
        fireEvent.click(startButton);

        // Should call setIsActive(true)
        expect(mockSetIsActive).toHaveBeenCalledWith(true);
    });

    it('switches modes', () => {
        renderTimer();
        const shortBreakBtn = screen.getByText('Short');
        fireEvent.click(shortBreakBtn);
        expect(mockSetMode).toHaveBeenCalledWith('short-break');
    });

    it('renders task section', () => {
        renderTimer();
        // Use flexible matcher for "Working On" label
        expect(screen.getByText(/Working On/i)).toBeInTheDocument();
    });
});
