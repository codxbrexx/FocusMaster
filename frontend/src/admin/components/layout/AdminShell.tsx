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
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useAdminAuth } from '../../context/AdminAuthContext';
import type { AdminPermission } from '../../config/permissions';

const ADMIN_MENU: { path: string; label: string; icon: any; permission: AdminPermission }[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'VIEW_DASHBOARD' },
  { path: '/admin/live', label: 'Live Traffic', icon: Activity, permission: 'VIEW_ANALYTICS' },
  { path: '/admin/users', label: 'User Management', icon: Users, permission: 'VIEW_USERS' },
  {
    path: '/admin/support',
    label: 'Support Issues',
    icon: MessageSquare,
    permission: 'VIEW_SUPPORT',
  },
  {
    path: '/admin/settings',
    label: 'System Settings',
    icon: Settings,
    permission: 'MANAGE_SYSTEM',
  },
];

import { AdminAuthProvider } from '../../context/AdminAuthContext';
import { AuditLogProvider } from '../../context/AuditLogContext';
import { LivePresenceProvider } from '../../context/LivePresenceContext';

export const AdminShell = () => {
  return (
    <AdminAuthProvider>
      <AuditLogProvider>
        <LivePresenceProvider>
          <InternalAdminLayout />
        </LivePresenceProvider>
      </AuditLogProvider>
    </AdminAuthProvider>
  );
};

const InternalAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { can } = useAdminAuth();

  return (
    <div className="h-screen w-full bg-background text-foreground font-sans flex overflow-hidden bg-matrix">
      {/* --- ADMIN SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden md:flex flex-col border-r border-border/40 glass-card rounded-none border-y-0 border-l-0 relative z-20"
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Shield size={18} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-lg tracking-wide text-foreground whitespace-nowrap"
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative w-full text-left mb-4',
              'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
              !sidebarOpen && 'justify-center'
            )}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={20} className="shrink-0" />
            ) : (
              <PanelLeftOpen size={20} className="shrink-0 mx-auto" />
            )}
            {sidebarOpen && <span className="font-medium text-sm">Close Sidebar</span>}
          </button>

          {ADMIN_MENU.filter((item) => can(item.permission)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )
              }
            >
              <item.icon size={20} className={cn('shrink-0', sidebarOpen ? '' : 'mx-auto')} />
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 rounded bg-popover border border-border text-xs text-foreground opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/40">
          <button
            onClick={() => navigate('/')}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium text-sm">Exit Admin</span>}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative z-10">
        {/* Admin Topbar */}
        <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          {/* Mobile Toggle */}
          <button className="md:hidden text-muted-foreground mr-4">
            <Menu size={24} />
          </button>

          {/* Search */}
          <div className="relative hidden md:block w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Search users, logs, or settings..."
              className="w-full bg-secondary/50 border border-border/50 rounded-full pl-10 pr-4 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
            </button>
            <div className="h-6 w-px bg-border/40 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">Admin User</div>
                <div className="text-xs text-primary font-medium">Super Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-foreground border border-border/50 shadow-inner" />
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
