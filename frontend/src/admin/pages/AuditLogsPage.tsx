import { RequirePermission } from '../components/guards/RequirePermission';
import { AuditLogTable } from '../features/audit/AuditLogTable';
import { History } from 'lucide-react';

export const AuditLogsPage = () => {
    return (
        <RequirePermission permission="VIEW_AUDIT_LOGS">
            <div className="max-w-6xl mx-auto p-2">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <History className="text-cyan-500" />
                        Audit Logs
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Immutable record of all administrative actions, security events, and system changes.
                    </p>
                </div>

                <AuditLogTable />
            </div>
        </RequirePermission>
    );
};
