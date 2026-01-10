import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from '@/components/Calendar';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }: any) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock CalendarEventDialog
vi.mock('@/components/calendar/CalendarEventDialog', () => ({
  CalendarEventDialog: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="calendar-dialog">
        Dialog Open
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('Calendar', () => {
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as any).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (useMutation as any).mockReturnValue({
      mutate: vi.fn(),
    });
  });

  it('renders calendar header with current month/year', () => {
    render(<Calendar />);
    const currentMonthYear = format(new Date(), 'MMMM yyyy');
    expect(screen.getByText(currentMonthYear)).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('renders days of the week', () => {
    render(<Calendar />);
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('opens dialog when Add Event is clicked', () => {
    render(<Calendar />);
    // "Add Event" button might be hidden on mobile in real CSS, but JSDOM usually ignores media queries unless configured.
    // However, the button has `className="hidden md:flex ..."`. JSDOM doesn't hide it unless layout is processed.
    // We'll try to find it.
    const addBtn = screen.getByText('Add Event');
    fireEvent.click(addBtn);
    expect(screen.getByTestId('calendar-dialog')).toBeInTheDocument();
  });

  //   it('navigates to next month', () => {
  //     render(<Calendar />);
  //     // Implementation details of changing month...
  //     // We can check if state updates, but looking for the new Month text is better.
  //     // This might be tricky if date-fns/system time dependence exists.
  //   });
});
