import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../src/components/sidebar/Sidebar';
import { DeviceContext, DeviceProvider } from '../src/context/DeviceContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock DeviceContext values
const mockDeviceContext = (type: 'desktop' | 'mobile') => ({
    deviceType: type,
    capabilities: { input: 'mouse' as const, connection: 'fast' as const },
    isServerDerived: false,
});

const renderWithContext = (ui: React.ReactNode, deviceType: 'desktop' | 'mobile' = 'desktop') => {
    return render(
        <BrowserRouter>
            {/* We mock the provider value by hijacking the hook or Context directly if we exported context, 
                but since we exported Provider, we might just mock the hook. 
                Easier: Mock useDevice in the test setup. 
            */}
            {ui}
        </BrowserRouter>
    );
};

// Mock useDevice module
vi.mock('../src/context/DeviceContext', async () => {
    const actual = await vi.importActual('../src/context/DeviceContext');
    return {
        ...actual,
        useDevice: vi.fn(),
    };
});

// Mock useAuth module
vi.mock('../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Test User', email: 'test@example.com' },
        logout: vi.fn(),
    }),
}));

import { useDevice } from '../src/context/DeviceContext';

describe('Sidebar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders on desktop (desktop variant)', () => {
        (useDevice as any).mockReturnValue(mockDeviceContext('desktop'));
        renderWithContext(<Sidebar open={true} onOpenChange={() => { }} />);

        // Should contain the Logo text
        expect(screen.getByText('FocusMaster')).toBeInTheDocument();

        // Should have desktop width style (checking via logic assumption or class)
        // Since Framer Motion handles width, it's hard to check computed style in JSDOM easily without setup.
        // But we can check if it exists in the document.
        const aside = screen.getByRole('complementary'); // 'aside' role
        expect(aside).toBeInTheDocument();
    });

    it('renders mini mode on desktop when closed', () => {
        (useDevice as any).mockReturnValue(mockDeviceContext('desktop'));
        renderWithContext(<Sidebar open={false} onOpenChange={() => { }} />);

        // Logo text might be hidden or removed
        // In our implementation, we use AnimatePresence {open && ...} for logo text.
        // So it should NOT be there.
        expect(screen.queryByText('Pro Workspace')).not.toBeInTheDocument();

        // But icons should be there
        // The text is hidden, so we can't search by accessible name easily without aria-label (which NavLink might not set on icon).
        // Let's verify the link exists by href attribute.
        // The text is hidden, so we can't search by accessible name easily without aria-label.
        // Verify links exist.
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Check if Dashboard link is among them
        const dashboardLink = links.find(link => link.getAttribute('href') === '/dashboard');
        expect(dashboardLink).toBeInTheDocument();
        expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
    });

    it('hides completely on mobile when closed', () => {
        (useDevice as any).mockReturnValue(mockDeviceContext('mobile'));
        renderWithContext(<Sidebar open={false} onOpenChange={() => { }} />);

        // In mobileClosed variant, x is -100%. 
        // JSDOM doesn't do layout, so we can't check 'not visible' easily via toBeVisible() usually for transforms.
        // But we can check if `isMobile` logic is firing by looking for classes.
        // 'border-none' is applied on mobile.
        const aside = screen.getByRole('complementary');
        expect(aside).toHaveClass('border-none');
    });

    it('shows on mobile when open', () => {
        (useDevice as any).mockReturnValue(mockDeviceContext('mobile'));
        const handleOpen = vi.fn();
        renderWithContext(<Sidebar open={true} onOpenChange={handleOpen} />);

        // Logo text should be visible on mobile open
        expect(screen.getByText('Pro Workspace')).toBeInTheDocument();
    });
});
