import { render, act } from '@testing-library/react';
import { GlobalTimer } from '@/components/GlobalTimer';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTimerStore } from '@/store/useTimerStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { toast } from 'sonner';

vi.mock('@/store/useTimerStore', () => ({ useTimerStore: vi.fn() }));
vi.mock('@/store/useSettingsStore', () => ({ useSettingsStore: vi.fn() }));
vi.mock('@/store/useHistoryStore', () => ({ useHistoryStore: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn() } }));

// Fix Audio constructor
vi.stubGlobal(
  'Audio',
  class {
    play = vi.fn().mockResolvedValue(undefined);
    src = '';
  }
);

describe('GlobalTimer', () => {
  const mockTick = vi.fn();
  const mockSetIsActive = vi.fn();
  const mockSetMode = vi.fn();
  const mockSetTotalDuration = vi.fn();
  const mockAddSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useTimerStore as any).mockReturnValue({
      isActive: false,
      tick: mockTick,
      timeLeft: 100,
      mode: 'pomodoro',
      setIsActive: mockSetIsActive,
      totalDuration: 1500,
      setTotalDuration: mockSetTotalDuration,
      setMode: mockSetMode,
      selectedTag: 'Work',
      selectedTaskId: '1',
    });

    (useSettingsStore as any).mockReturnValue({
      settings: {
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStartBreak: false,
        autoStartPomodoro: false,
        soundEnabled: true,
      },
    });

    (useHistoryStore as any).mockReturnValue({
      addSession: mockAddSession,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ticks when active', () => {
    (useTimerStore as any).mockReturnValue({
      ...useTimerStore(),
      isActive: true,
      timeLeft: 100,
    });

    render(<GlobalTimer />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockTick).toHaveBeenCalled();
  });

  it('completes timer and adds session', () => {
    (useTimerStore as any).mockReturnValue({
      ...useTimerStore(),
      isActive: true,
      timeLeft: 0, // Finished
    });

    render(<GlobalTimer />);

    // Effect should run immediately on mount/update if timeLeft is 0 and active
    expect(mockSetIsActive).toHaveBeenCalledWith(false);
    expect(mockAddSession).toHaveBeenCalled(); // Saves to history
    expect(toast.success).toHaveBeenCalledWith('Focus Session Complete!', expect.any(Object));
  });
});
