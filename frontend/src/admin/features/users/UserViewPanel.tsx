import { Mail, Calendar, Shield, MapPin, Clock } from 'lucide-react';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'suspended' | 'banned';
    joinedAt: string;
    lastActive: string;
    location: string;
    avatarUrl?: string;
}

interface UserViewPanelProps {
    user: User;
}

export const UserViewPanel = ({ user }: UserViewPanelProps) => {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-6">User Profile</h3>

            <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-purple-900/20">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user.name.charAt(0).toUpperCase()
                    )}
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail size={14} />
                        <span>{user.email}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                user.status === 'suspended' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                            {user.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar size={14} />
                        <span>Joined</span>
                    </div>
                    <p className="text-slate-200 text-sm font-medium">{user.joinedAt}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Clock size={14} />
                        <span>Last Active</span>
                    </div>
                    <p className="text-slate-200 text-sm font-medium">{user.lastActive}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Shield size={14} />
                        <span>Security Level</span>
                    </div>
                    <p className="text-slate-200 text-sm font-medium">Standard (2FA Off)</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <MapPin size={14} />
                        <span>Location</span>
                    </div>
                    <p className="text-slate-200 text-sm font-medium">{user.location}</p>
                </div>
            </div>
        </div>
    );
};
