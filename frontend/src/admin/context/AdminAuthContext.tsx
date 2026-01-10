import { createContext, useContext, type ReactNode } from 'react';
import type { AdminRole, AdminPermission } from '../config/permissions';
import { ROLE_PERMISSIONS } from '../config/permissions';
import { useAuth } from '../../context/AuthContext';

interface AdminAuthContextType {
  role: AdminRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
  can: (permission: AdminPermission) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const currentRole: AdminRole = user?.role === 'admin' ? 'admin' : 'viewer';

  const adminUser = {
    id: user?._id || 'unknown',
    name: user?.name || 'Unknown',
    email: user?.email || 'unknown',
  };

  const can = (permission: AdminPermission): boolean => {
    if (!user || user.role !== 'admin') {
      return false;
    }

    const allowedPermissions = ROLE_PERMISSIONS[currentRole] || [];
    return allowedPermissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider value={{ role: currentRole, user: adminUser, can }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
