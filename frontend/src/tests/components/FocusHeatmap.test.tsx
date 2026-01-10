import { render, screen, waitFor } from '@testing-library/react';
import { FocusHeatmap } from '@/components/FocusHeatmap';
import { vi, describe, it, expect } from 'vitest';
import api from '@/services/api';

// Mock API
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('FocusHeatmap', () => {
  it('renders loading state initially', () => {
    (api.get as any).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<FocusHeatmap />);
    // Check for pulse animation or loading structure
    // The component has a specific loading skeleton structure
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders heatmap data after fetch', async () => {
    const mockData = [
      { date: '2023-01-01', count: 5 },
      { date: '2023-01-02', count: 0 },
    ];
    (api.get as any).mockResolvedValue({ data: mockData });

    render(<FocusHeatmap />);

    await waitFor(() => {
      expect(screen.getByText('Consistency')).toBeInTheDocument();
    });

    // We can check if "Mon", "Wed", "Fri" labels are present
    expect(screen.getByText('Mon')).toBeInTheDocument();

    // Check if legend exists
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (api.get as any).mockRejectedValue(new Error('Network error'));

    render(<FocusHeatmap />);

    await waitFor(() => {
      // It should still render the card even if empty
      expect(screen.getByText('Consistency')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch heatmap data', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
