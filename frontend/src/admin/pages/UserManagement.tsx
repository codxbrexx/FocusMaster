import { useState } from 'react';
import { UserPlus, Filter, Search } from 'lucide-react';
import { UserViewPanel, type User } from '../features/users/UserViewPanel';
import { UserActionPanel } from '../features/users/UserActionPanel';
import { RequirePermission } from '../components/guards/RequirePermission';
import { motion, AnimatePresence } from 'framer-motion';

// MOCK DATA
const MOCK_USERS: User[] = [
    { id: '1', name: 'Alice Cooper', email: 'alice@example.com', role: 'admin', status: 'active', joinedAt: '2023-10-15', lastActive: '2 min ago', location: 'New York, USA' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'viewer', status: 'suspended', joinedAt: '2023-11-02', lastActive: '2 days ago', location: 'London, UK' },
    { id: '3', name: 'Charlie Day', email: 'charlie@example.com', role: 'moderator', status: 'active', joinedAt: '2024-01-20', lastActive: '5 hours ago', location: 'Toronto, CA' },
    { id: '4', name: 'Diana Ross', email: 'diana@example.com', role: 'viewer', status: 'active', joinedAt: '2024-02-14', lastActive: '1 week ago', location: 'Paris, FR' },
    { id: '5', name: 'Evan Peters', email: 'evan@example.com', role: 'analyst', status: 'banned', joinedAt: '2023-12-05', lastActive: '3 months ago', location: 'Berlin, DE' },
];

export const UserManagement = () => {
    const [selectedUser, setSelectedUser] = useState<User>(MOCK_USERS[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <AnimatePresence initial={false}>
                            {filteredUsers.map((user) => (
                                <motion.button
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${selectedUser.id === user.id
                                        ? 'bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10'
                                        : 'hover:bg-primary/5 border border-transparent hover:border-primary/10'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${selectedUser.id === user.id
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
                                            <h4 className={`text-sm font-medium truncate ${selectedUser.id === user.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
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
                    </div>
                </div>

                {/* RIGHT COLUMN: Details & Actions */}
                <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 custom-scrollbar">
                    <UserViewPanel user={selectedUser} />
                    <RequirePermission permission="MANAGE_USERS">
                        <UserActionPanel user={selectedUser} />
                    </RequirePermission>
                </div>
            </div>
        </RequirePermission>
    );
};
