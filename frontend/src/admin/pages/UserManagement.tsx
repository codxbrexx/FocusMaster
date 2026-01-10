import { useState, useEffect } from 'react';
import { UserPlus, Filter, Search } from 'lucide-react';
import { UserViewPanel, type User } from '../features/users/UserViewPanel';
import { UserActionPanel } from '../features/users/UserActionPanel';
import { RequirePermission } from '../components/guards/RequirePermission';
import { motion, AnimatePresence } from 'framer-motion';

// MOCK DATA REMOVED



export const UserManagement = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch users (simplified for now without full pagination UI in this quick fix step)
        // In a full implementation we would use the pagination hook or AdminService directly with params
        // For keeping this fix minimal to satisfy type constraints and basic functionality:
        import('../../services/admin.service').then(({ adminService }) => {
            adminService.getUsers(1, searchTerm).then(data => {
                setUsers(data.users);
                setIsLoading(false);
            });
        });
    }, [searchTerm]);

    const filteredUsers = users; // Server side search handled above


    return (
        <RequirePermission permission="VIEW_USERS">
            <div className="h-[calc(100vh-7rem)] flex flex-col md:flex-row gap-6 overflow-hidden pb-2">
                {/* LEFT COLUMN: User List */}
                <div className="w-full md:w-1/3 flex flex-col glass-card rounded-2xl overflow-hidden relative h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-border/40 bg-secondary/20">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground tracking-tight">Users</h2>
                            <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <UserPlus size={18} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            />
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary cursor-pointer transition-colors" size={16} />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col gap-2 p-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 rounded-xl bg-secondary/30 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {filteredUsers.map((user) => (
                                    <motion.button
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${selectedUser?.id === user.id
                                            ? 'bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10'
                                            : 'hover:bg-primary/5 border border-transparent hover:border-primary/10'
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${selectedUser?.id === user.id
                                                ? 'bg-gradient-to-br from-primary to-accent-foreground text-primary-foreground'
                                                : 'bg-secondary text-muted-foreground group-hover:text-foreground group-hover:bg-secondary/80'
                                                }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${user.status === 'active' ? 'bg-emerald-500' :
                                                user.status === 'suspended' ? 'bg-amber-500' : 'bg-destructive'
                                                }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-sm font-medium truncate ${selectedUser?.id === user.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                                    }`}>
                                                    {user.name}
                                                </h4>
                                                <span className="text-[10px] uppercase font-mono text-muted-foreground bg-secondary px-1.5 rounded">{user.role}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate group-hover:text-foreground/70 transition-colors">{user.email}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Details & Actions */}
                <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 custom-scrollbar">
                    {selectedUser ? (
                        <>
                            <UserViewPanel user={selectedUser} />
                            <RequirePermission permission="MANAGE_USERS">
                                <UserActionPanel user={selectedUser} />
                            </RequirePermission>
                        </>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full opacity-60">
                            <div className="w-16 h-16 rounded-full bg-secondary mb-4 flex items-center justify-center">
                                <UserPlus size={32} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">Select a User</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                                Click on a user from the list to view their details, audit logs, and manage their status.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </RequirePermission>
    );
};
