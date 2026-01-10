import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { TopBar } from './TopBar';
import { useState, useEffect, useRef } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTaskStore } from '@/store/useTaskStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useDevice } from '@/context/DeviceContext';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { BottomMobileNav } from './BottomMobileNav';
import { Footer } from './Footer';

export const Layout = () => {
  const { deviceType } = useDevice();
  const isScreenSmall = useMediaQuery('(max-width: 1023px)');
  // Default to open on desktop, closed on mobile/tablet
  const [sidebarOpen, setSidebarOpen] = useState(deviceType === 'desktop' && !isScreenSmall);

  const { fetchTasks } = useTaskStore();
  const { fetchHistory } = useHistoryStore();
  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchTasks();
    fetchHistory();
    fetchSettings();
  }, [fetchTasks, fetchHistory, fetchSettings]);

  // Swipe Gesture Logic
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }
  };

  return (
    <TooltipProvider>
      <Sonner />
      <div
        className="min-h-screen flex w-full font-sans text-foreground relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Backdrop */}
        {sidebarOpen && (deviceType === 'mobile' || deviceType === 'tablet' || isScreenSmall) && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}
        >
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6 overflow-x-hidden overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              <div className="flex-1">
                <Outlet />
              </div>

              <Footer />
              <BottomMobileNav />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};
