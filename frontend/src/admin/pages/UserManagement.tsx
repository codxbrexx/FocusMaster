import { useState } from 'react';
import { Search } from 'lucide-react';
import { User, UserViewPanel } from '../features/users/UserViewPanel';
import { UserActionPanel } from '../features/users/UserActionPanel';

// MOCK DATA
const MOCK_USERS: User[] = [
    { id: '1', name: 'Alice Cooper', email: 'alice@example.com', role: 'admin', status: 'active', joinedAt: '2023-10-15', lastActive: '2 min ago', location: 'New York, USA' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'viewer', status: 'suspended', joinedAt: '2023-11-02', lastActive: '2 days ago', location: 'London, UK' },
    { id: '3', name: 'Charlie Day', email: 'charlie@example.com', role: 'moderator', status: 'active', joinedAt: '2024-01-20', lastActive: '5 hours ago', location: 'Toronto, CA' },
];

export const UserManagement = () => {
    const [selectedUser, setSelectedUser] = useState<User>(MOCK_USERS[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden">
            {/* LEFT COLUMN: User List */}
            <div className="w-1/3 flex flex-col bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${selectedUser.id === user.id
                                    ? 'bg-cyan-500/10 border border-cyan-500/20'
                                    : 'hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">
                                {user.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className={`text-sm font-medium truncate ${selectedUser.id === user.id ? 'text-cyan-400' : 'text-slate-200'}`}>
                                    {user.name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN: Details & Actions */}
            <div className="flex-1 overflow-y-auto pr-2">
                <UserViewPanel user={selectedUser} />
                <UserActionPanel user={selectedUser} />
            </div>
        </div>
    );
};
