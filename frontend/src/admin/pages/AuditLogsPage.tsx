import { RequirePermission } from '../components/guards/RequirePermission';
import { AuditLogTable } from '../features/audit/AuditLogTable';
import { History } from 'lucide-react';

export const AuditLogsPage = () => {
    return (
        <RequirePermission permission="VIEW_AUDIT_LOGS">
            <div className="max-w-6xl mx-auto p-2">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <History className="text-primary" />
                        Audit Logs
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Immutable record of all administrative actions, security events, and system changes.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-6 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar pb-2">
                        <AuditLogTable />
                    </div>
                </div>
            </div>
        </RequirePermission>
    );
};
