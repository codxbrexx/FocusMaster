import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useState } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';



export const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <TooltipProvider>
            <Sonner />
            <div className="min-h-screen flex w-full font-sans text-foreground relative">
                <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

                <div
                    className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}
                >
                    <TopBar />

                    <main className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto">
                        <div className="max-w-7xl mx-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
};
