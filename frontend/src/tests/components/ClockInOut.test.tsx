import { render, screen, fireEvent } from '@testing-library/react';
import { ClockInOut } from '@/components/ClockInOut';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useHistoryStore } from '@/store/useHistoryStore';

// Mock subcomponents
vi.mock('@/components/clock-in-out/DateNavigator', () => ({
  DateNavigator: ({ selectedDate }: any) => <div>Date: {selectedDate.toDateString()}</div>,
}));
vi.mock('@/components/clock-in-out/WorkClock', () => ({
  WorkClock: ({ onClockIn, onClockOut, todayEntry }: any) => (
    <div>
      {todayEntry ? 'Clocked In' : 'Clocked Out'}
      <button onClick={onClockIn}>Clock In</button>
      <button onClick={onClockOut}>Clock Out</button>
    </div>
  ),
}));
vi.mock('@/components/clock-in-out/InfoPanel', () => ({ InfoPanel: () => <div>Info Panel</div> }));
vi.mock('@/components/clock-in-out/WorkTimeline', () => ({
  WorkTimeline: () => <div>Timeline</div>,
}));
vi.mock('@/components/clock-in-out/StatsGrid', () => ({ StatsGrid: () => <div>Stats Grid</div> }));

vi.mock('@/store/useHistoryStore', () => ({ useHistoryStore: vi.fn() }));

describe('ClockInOut', () => {
  const mockAddClockEntry = vi.fn();
  const mockUpdateClockEntry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T10:00:00'));

    (useHistoryStore as any).mockReturnValue({
      clockEntries: [],
      addClockEntry: mockAddClockEntry,
      updateClockEntry: mockUpdateClockEntry,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', () => {
    render(<ClockInOut />);
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
    expect(screen.getByText('Clocked Out')).toBeInTheDocument();
  });

  it('handles clock in', () => {
    render(<ClockInOut />);
    const clockInBtn = screen.getByText('Clock In');
    fireEvent.click(clockInBtn);
    expect(mockAddClockEntry).toHaveBeenCalled();
  });

  it('handles clock out', () => {
    // Mock store to be clocked in
    (useHistoryStore as any).mockReturnValue({
      clockEntries: [{ id: '1', clockIn: new Date(), clockOut: null, date: '2023-01-01' }],
      addClockEntry: mockAddClockEntry,
      updateClockEntry: mockUpdateClockEntry,
    });

    render(<ClockInOut />);
    expect(screen.getByText('Clocked In')).toBeInTheDocument();

    const clockOutBtn = screen.getByText('Clock Out');
    fireEvent.click(clockOutBtn);
    expect(mockUpdateClockEntry).toHaveBeenCalled();
  });
});
