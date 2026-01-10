import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { vi, describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => { }, // Deprecated
      removeListener: () => { }, // Deprecated
      addEventListener: () => { },
      removeEventListener: () => { },
      dispatchEvent: () => false,
    }),
  });
});

// Mock the AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com', picture: 'test.jpg' },
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the ThemeContext
vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the DeviceContext
vi.mock('@/context/DeviceContext', () => ({
  useDevice: () => ({
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    capabilities: {},
  }),
  DeviceProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Sidebar Integration', () => {
  const mockOnOpenChange = vi.fn();

  const renderSidebar = (open = true) => {
    return render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Sidebar open={open} onOpenChange={mockOnOpenChange} />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
  };

  it('renders correctly', () => {
    renderSidebar();
    expect(screen.getByText('FocusMaster')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Pomodoro')).toBeInTheDocument();
  });

  it('toggles sidebar on click', () => {
    renderSidebar(true);
    // Find the toggle button (it has "Close Sidebar" text when open)
    const toggleBtn = screen.getByText('Close Sidebar');
    fireEvent.click(toggleBtn);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('navigates to dashboard on click', () => {
    renderSidebar();
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  it('opens profile menu and shows appearance settings', () => {
    renderSidebar();
    const profileButton = screen.getByText('Test User').closest('.cursor-pointer');
    fireEvent.click(profileButton!);

    expect(screen.getByText('My Profile')).toBeVisible();
    expect(screen.getByText('Theme')).toBeVisible();
    fireEvent.click(screen.getByText('Theme'));

    expect(screen.getByTitle('Dark')).toBeInTheDocument();
  });
});
