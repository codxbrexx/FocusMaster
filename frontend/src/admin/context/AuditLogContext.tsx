import { createContext, useContext, ReactNode, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';

export interface AuditLogEntry {
    id: string;
    action: string;
    actorId: string;
    actorName: string;
    targetId?: string;
    targetName?: string;
    details?: string;
    timestamp: string;
}

interface AuditLogContextType {
    logs: AuditLogEntry[];
    logAction: (action: string, details?: string, targetId?: string, targetName?: string) => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const useAuditLog = () => {
    const context = useContext(AuditLogContext);
    if (!context) {
        throw new Error('useAuditLog must be used within an AuditLogProvider');
    }
    return context;
};

// Initial MOCK Data
const INITIAL_LOGS: AuditLogEntry[] = [
    {
        id: 'log-1',
        action: 'USER_BAN',
        actorId: 'admin-123',
        actorName: 'Admin User',
        targetId: 'user-99',
        targetName: 'Malicious Bot',
        details: 'Pattern matching spam behavior',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: 'log-2',
        action: 'SYSTEM_CONFIG_UPDATE',
        actorId: 'admin-123',
        actorName: 'Admin User',
        details: 'Updated feature flag: ENABLE_BETA_UI',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    }
];

export const AuditLogProvider = ({ children }: { children: ReactNode }) => {
    const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
    const { user } = useAdminAuth();

    const logAction = (action: string, details?: string, targetId?: string, targetName?: string) => {
        const newEntry: AuditLogEntry = {
            id: `log-${Date.now()}`,
            action,
            actorId: user.id,
            actorName: user.name,
            targetId,
            targetName,
            details,
            timestamp: new Date().toISOString(),
        };

        // Prepend so newest is first
        setLogs(prev => [newEntry, ...prev]);
        console.log('[AUDIT LOG]', newEntry);
    };

    return (
        <AuditLogContext.Provider value={{ logs, logAction }}>
            {children}
        </AuditLogContext.Provider>
    );
};
