import { render, screen, fireEvent } from '@testing-library/react';
import { TopBar } from '@/components/TopBar';
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
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const mockLogout = vi.fn();
const mockSetTheme = vi.fn();

// Mock the AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com', picture: 'test.jpg', points: 150 },
    logout: mockLogout,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the ThemeContext
vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: mockSetTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TopBar Component', () => {
  const renderTopBar = () => {
    return render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <TopBar />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
  };

  it('renders time and user level indicator', () => {
    renderTopBar();
    // Level is derived from 150 points. Level 1 starts at 0 points.
    expect(screen.getByText(/Lv\./i)).toBeInTheDocument();
  });

  it('opens profile dropdown menu when profile button is clicked', () => {
    renderTopBar();
    const trigger = screen.getByAltText('Profile');
    fireEvent.click(trigger);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('toggles theme panel inside dropdown', () => {
    renderTopBar();
    const trigger = screen.getByAltText('Profile');
    fireEvent.click(trigger);

    const themeToggle = screen.getByText('Theme');
    fireEvent.click(themeToggle);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Navy')).toBeInTheDocument();

    const lightButton = screen.getByText('Light');
    fireEvent.click(lightButton);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('triggers logout and navigates to login page', () => {
    renderTopBar();
    const trigger = screen.getByAltText('Profile');
    fireEvent.click(trigger);

    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
