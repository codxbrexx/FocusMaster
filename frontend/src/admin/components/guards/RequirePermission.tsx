import type { ReactNode } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import type { AdminPermission } from '../../config/permissions';
import { ShieldAlert } from 'lucide-react';

interface RequirePermissionProps {
  permission: AdminPermission;
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequirePermission = ({ permission, children, fallback }: RequirePermissionProps) => {
  const { can } = useAdminAuth();

  if (!can(permission)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-secondary/20 rounded-xl border border-border/40 mt-10">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4 opacity-80" />
        <h3 className="text-xl font-bold text-foreground mb-2">Access Denied</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          You do not have the required permission{' '}
          <code className="bg-secondary px-1.5 py-0.5 rounded text-destructive text-xs font-mono">
            {permission}
          </code>{' '}
          to view this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
