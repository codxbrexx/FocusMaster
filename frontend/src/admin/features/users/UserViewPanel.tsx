import { Mail, Calendar, Shield, MapPin, Clock } from 'lucide-react';

export interface User {
    id: string;
    _id?: string; // Backend ID
    name: string;
    email: string;
    role: string;
    status: 'active' | 'suspended' | 'banned';
    joinedAt?: string; // Backend: createdAt
    createdAt?: string;
    lastActive?: string; // Backend: updatedAt
    updatedAt?: string;
    location?: string;
    avatarUrl?: string;
}

interface UserViewPanelProps {
    user: User;
}

export const UserViewPanel = ({ user }: UserViewPanelProps) => {
    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="text-lg font-semibold text-foreground mb-6">User Profile</h3>

            <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-sm shadow-primary/20">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user.name.charAt(0).toUpperCase()
                    )}
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail size={14} />
                        <span>{user.email}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            user.status === 'suspended' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-destructive/10 text-destructive border border-destructive/20'
                            }`}>
                            {user.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar size={14} />
                        <span>Joined</span>
                    </div>
                    <p className="text-foreground text-sm font-medium">
                        {user.joinedAt || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')}
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Clock size={14} />
                        <span>Last Active</span>
                    </div>
                    <p className="text-foreground text-sm font-medium">
                        {user.lastActive || (user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A')}
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Shield size={14} />
                        <span>Security Level</span>
                    </div>
                    <p className="text-foreground text-sm font-medium">Standard</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <MapPin size={14} />
                        <span>Location</span>
                    </div>
                    <p className="text-foreground text-sm font-medium">{user.location || 'Unknown'}</p>
                </div>
            </div>
        </div>
    );
};
