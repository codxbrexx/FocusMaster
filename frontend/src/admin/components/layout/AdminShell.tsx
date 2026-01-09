import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Activity,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useAdminAuth } from '../../context/AdminAuthContext';
import type { AdminPermission } from '../../config/permissions';

const ADMIN_MENU: { path: string; label: string; icon: any; permission: AdminPermission }[] = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'VIEW_DASHBOARD' },
    { path: '/admin/live', label: 'Live Traffic', icon: Activity, permission: 'VIEW_ANALYTICS' },
    { path: '/admin/users', label: 'User Management', icon: Users, permission: 'VIEW_USERS' },
    { path: '/admin/settings', label: 'System Settings', icon: Settings, permission: 'MANAGE_SYSTEM' },
];

import { AdminAuthProvider } from '../../context/AdminAuthContext';

export const AdminShell = () => {
    return (
        <AdminAuthProvider>
            <InternalAdminLayout />
        </AdminAuthProvider>
    );
};

const InternalAdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { can } = useAdminAuth();

    return (
        <div className="min-h-screen w-full bg-[#0b0f12] text-slate-200 font-sans flex overflow-hidden">
            {/* --- ADMIN SIDEBAR --- */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 260 : 80 }}
                className="hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl relative z-20"
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                            <Shield size={18} />
                        </div>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-bold text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 whitespace-nowrap"
                                >
                                    Admin Panel
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {ADMIN_MENU.filter(item => can(item.permission)).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-cyan-500/10 text-cyan-400"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} className={cn("shrink-0", sidebarOpen ? "" : "mx-auto")} />
                            {sidebarOpen && (
                                <span className="font-medium text-sm">{item.label}</span>
                            )}
                            {!sidebarOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 rounded bg-slate-800 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => navigate('/')}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full",
                            !sidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="font-medium text-sm">Exit Admin</span>}
                    </button>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="mt-4 flex items-center justify-center w-full py-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors"
                    >
                        <Menu size={16} />
                    </button>
                </div>
            </motion.aside>

            {/* --- MAIN AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f12]">
                {/* Admin Topbar */}
                <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
                    {/* Mobile Toggle */}
                    <button className="md:hidden text-slate-400 mr-4">
                        <Menu size={24} />
                    </button>

                    {/* Search */}
                    <div className="relative hidden md:block w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search users, logs, or settings..."
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-[#0b0f12]" />
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">Admin User</div>
                                <div className="text-xs text-cyan-400">Super Admin</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border border-white/20 shadow-inner" />
                        </div>
                    </div>
                </header>

                {/* Content Outlet */}
                <main className="flex-1 overflow-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
