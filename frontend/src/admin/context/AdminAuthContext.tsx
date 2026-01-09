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

    // Map the main app user role to an AdminRole.
    // If user.role is 'admin', they get full 'admin' rights.
    // Otherwise, they default to 'viewer' (or we could return null/block).
    // For safety, we only grant 'admin' if explicit.
    const currentRole: AdminRole = user?.role === 'admin' ? 'admin' : 'viewer';

    // We pass the real user ID/Name for logging purposes
    const adminUser = {
        id: user?._id || 'unknown',
        name: user?.name || 'Unknown',
        email: user?.email || 'unknown',
    };

    const can = (permission: AdminPermission): boolean => {
        // If not logged in or not admin, strictly limit permissions (or block all).
        if (!user || user.role !== 'admin') {
            // Viewers might just see safe things, or nothing at all.
            // For this strict requirement ("only admin can access"), 
            // we return false for everything if not admin.
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

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
