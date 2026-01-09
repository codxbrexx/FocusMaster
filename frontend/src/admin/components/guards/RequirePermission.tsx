import { ReactNode } from 'react';
import { useAdminAuth, AdminRole } from '../../context/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

interface RequirePermissionProps {
    minRole: AdminRole;
    children: ReactNode;
    fallback?: ReactNode;
}

export const RequirePermission = ({ minRole, children, fallback }: RequirePermissionProps) => {
    const { hasPermission } = useAdminAuth();

    if (!hasPermission(minRole)) {
        if (fallback) return <>{fallback}</>;

        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-xl border border-white/10">
                <ShieldAlert className="w-10 h-10 text-rose-400 mb-3" />
                <h3 className="text-lg font-semibold text-white">Access Restricted</h3>
                <p className="text-sm text-slate-400 max-w-xs mt-1">
                    You need <strong>{minRole}</strong> privileges to view this section.
                </p>
            </div>
        );
    }

    return <>{children}</>;
};
