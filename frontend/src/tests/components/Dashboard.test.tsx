import { render, screen } from '@testing-library/react';
import { Dashboard } from '@/components/Dashboard';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '@/store/useTaskStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useAuth } from '@/context/AuthContext';
import { useAiStore } from '@/store/useAiStore';

// Mock Stores and Auth
vi.mock('@/store/useTaskStore', () => ({ useTaskStore: vi.fn() }));
vi.mock('@/store/useSettingsStore', () => ({ useSettingsStore: vi.fn() }));
vi.mock('@/store/useHistoryStore', () => ({ useHistoryStore: vi.fn() }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));

// Mock Child Components to simplify Dashboard test
vi.mock('@/components/FocusHeatmap', () => ({
  FocusHeatmap: () => <div data-testid="focus-heatmap">Heatmap</div>,
}));
vi.mock('@/components/dashboard/WelcomeHeader', () => ({
  WelcomeHeader: ({ user }: any) => <div>Welcome {user?.name}</div>,
}));
vi.mock('@/components/dashboard/StatsOverview', () => ({
  StatsOverview: () => <div>Stats Overview</div>,
}));
vi.mock('@/components/dashboard/PriorityTasks', () => ({
  PriorityTasks: () => <div>Priority Tasks</div>,
}));
vi.mock('@/components/dashboard/DailyOverviewChart', () => ({
  DailyOverviewChart: () => <div>Chart</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

vi.mock('@/store/useAiStore', () => ({ useAiStore: vi.fn() }));

vi.mock('@/components/dashboard/AiInsightsPanel', () => ({
  AiInsightsPanel: () => <div>AiInsightsPanel</div>,
}));

vi.mock('@/components/dashboard/StudyPlanCard', () => ({
  StudyPlanCard: () => <div>StudyPlanCard</div>,
}));

vi.mock('@/components/dashboard/RecommendationsCard', () => ({
  RecommendationsCard: () => <div>RecommendationsCard</div>,
}));

vi.mock('@/components/dashboard/WeeklyDigestCard', () => ({
  WeeklyDigestCard: () => <div>WeeklyDigestCard</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as any).mockReturnValue({
      user: { name: 'Test User' },
    });

    (useTaskStore as any).mockReturnValue({
      tasks: [],
    });

    (useSettingsStore as any).mockReturnValue({
      settings: { dailyGoal: 4, pomodoroDuration: 25 },
    });

    (useHistoryStore as any).mockReturnValue({
      sessions: [],
    });
    
    (useAiStore as any).mockReturnValue({
      fetchStudyProfile: vi.fn(),
    });
  });

  it('renders dashboard components', () => {
    render(<Dashboard />);
    expect(screen.getByText('Welcome Test User')).toBeInTheDocument();
    expect(screen.getByText('Stats Overview')).toBeInTheDocument();
    expect(screen.getByText('Priority Tasks')).toBeInTheDocument();
    expect(screen.getByText('Chart')).toBeInTheDocument();
    expect(screen.getByTestId('focus-heatmap')).toBeInTheDocument();
  });
});
