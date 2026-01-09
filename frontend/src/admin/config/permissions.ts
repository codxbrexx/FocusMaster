export type AdminRole = 'viewer' | 'analyst' | 'moderator' | 'admin' | 'owner';

export type AdminPermission =
    | 'VIEW_DASHBOARD'
    | 'VIEW_ANALYTICS'
    | 'VIEW_USERS'
    | 'MANAGE_USERS'     // Ban, Edit, Reset
    | 'VIEW_AUDIT_LOGS'
    | 'MANAGE_SYSTEM'    // Settings, Feature Flags
    | 'MANAGE_BILLING';  // Invoices, Plans

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
    'viewer': [
        'VIEW_DASHBOARD'
    ],
    'analyst': [
        'VIEW_DASHBOARD',
        'VIEW_ANALYTICS'
    ],
    'moderator': [
        'VIEW_DASHBOARD',
        'VIEW_ANALYTICS',
        'VIEW_USERS',
        'MANAGE_USERS',
        'VIEW_AUDIT_LOGS'
    ],
    'admin': [
        'VIEW_DASHBOARD',
        'VIEW_ANALYTICS',
        'VIEW_USERS',
        'MANAGE_USERS',
        'VIEW_AUDIT_LOGS',
        'MANAGE_SYSTEM'
    ],
    'owner': [
        'VIEW_DASHBOARD',
        'VIEW_ANALYTICS',
        'VIEW_USERS',
        'MANAGE_USERS',
        'VIEW_AUDIT_LOGS',
        'MANAGE_SYSTEM',
        'MANAGE_BILLING'
    ]
};
