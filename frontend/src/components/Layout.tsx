import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useState, useEffect } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReportBugDialog } from './ReportBugDialog';



export const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <TooltipProvider>
            <Sonner />
            <div className="min-h-screen flex w-full font-sans text-foreground relative">
                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

                <div
                    className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}
                >
                    <TopBar onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto">
                        <div className="max-w-7xl mx-auto h-full flex flex-col">
                            <div className="flex-1">
                                <Outlet />
                            </div>

                            <footer className="w-full mt-auto py-4 border-t border-border/40 bg-background/50 backdrop-blur-sm">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
                                    <div className="flex items-center gap-2 font-mono order-2 md:order-1">
                                        <span>FocusMaster v1.0</span>
                                        <span className="hidden md:inline">•</span>
                                        <span className="opacity-75">Built by <a href="https://github.com/codxbrexx" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">codxbrexx</a></span>
                                    </div>

                                    <div className="flex items-center gap-4 order-1 md:order-2">
                                        <ReportBugDialog />
                                        <div className="h-4 w-px bg-border/60" /> {/* Divider */}
                                        <a
                                            href="https://github.com/codxbrexx"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                                            title="View on GitHub"
                                        >
                                            <Github className="w-3.5 h-3.5" />
                                            <span className="sr-only">GitHub</span>
                                        </a>
                                        <a
                                            href="https://linkedin.com/in/mozammilali"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                                            title="Connect on LinkedIn"
                                        >
                                            <Linkedin className="w-3.5 h-3.5" />
                                            <span className="sr-only">LinkedIn</span>
                                        </a>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
};
