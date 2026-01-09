import React, { createContext, useContext, ReactNode } from 'react';
import { AdminRole, AdminPermission, ROLE_PERMISSIONS } from '../config/permissions';

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
    // START_MOCK
    const mockAdminUser = {
        id: 'admin-123',
        name: 'Admin User',
        email: 'admin@focusmaster.com',
    };
    const currentRole: AdminRole = 'admin'; // Change this to test (e.g., 'viewer')
    // END_MOCK

    const can = (permission: AdminPermission): boolean => {
        const allowedPermissions = ROLE_PERMISSIONS[currentRole] || [];
        return allowedPermissions.includes(permission);
    };

    return (
        <AdminAuthContext.Provider value={{ role: currentRole, user: mockAdminUser, can }}>
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
