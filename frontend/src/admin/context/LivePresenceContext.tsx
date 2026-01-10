import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface LiveSession {
    id: string;
    userId: string;
    userName: string;
    avatarUrl?: string;
    device: 'desktop' | 'mobile' | 'tablet';
    currentPage: string;
    startedAt: string;
    lastActionAt: string;
    country: string;
}

interface LivePresenceContextType {
    sessions: LiveSession[];
    kickSession: (sessionId: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
const LivePresenceContext = createContext<LivePresenceContextType | undefined>(undefined);

export const useLivePresence = () => {
    const context = useContext(LivePresenceContext);
    if (!context) {
        throw new Error('useLivePresence must be used within a LivePresenceProvider');
    }
    return context;
};

// MOCK DATA HELPERS
const DEVICES = ['desktop', 'mobile', 'tablet'] as const;
const PAGES = ['/dashboard', '/tasks', '/pomodoro', '/settings', '/clock', '/analytics'];
const NAMES = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi'];
const COUNTRIES = ['USA', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU'];

const generateSession = (): LiveSession => ({
    id: `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: `user-${Math.floor(Math.random() * 1000)}`,
    userName: NAMES[Math.floor(Math.random() * NAMES.length)],
    device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    currentPage: PAGES[Math.floor(Math.random() * PAGES.length)],
    startedAt: new Date().toISOString(),
    lastActionAt: new Date().toISOString(),
    country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
});

export const LivePresenceProvider = ({ children }: { children: ReactNode }) => {
    const [sessions, setSessions] = useState<LiveSession[]>([]);

    const kickSession = (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    useEffect(() => {                                                                                                                                                                                                                                                                                                                       
        setSessions(Array.from({ length: 5 }, generateSession));

        const interval = setInterval(() => {
            const random = Math.random();

            if (random > 0.7) {
                const newSession = generateSession();
                setSessions(prev => [newSession, ...prev]);
            } else if (random > 0.4) {
                setSessions(prev => {
                    if (prev.length === 0) return prev;
                    const idx = Math.floor(Math.random() * prev.length);
                    const updated = [...prev];
                    updated[idx] = {
                        ...updated[idx],
                        currentPage: PAGES[Math.floor(Math.random() * PAGES.length)],
                        lastActionAt: new Date().toISOString()
                    };
                    return updated;
                });
            } else if (random < 0.1) {
                setSessions(prev => {
                    if (prev.length === 0) return prev;
                    const idx = Math.floor(Math.random() * prev.length);
                    return prev.filter((_, i) => i !== idx);
                });
            }
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <LivePresenceContext.Provider value={{ sessions, kickSession }}>
            {children}
        </LivePresenceContext.Provider>
    );
};
