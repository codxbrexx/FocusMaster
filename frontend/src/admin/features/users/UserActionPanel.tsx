import { useState } from 'react';
import { Ban, Lock, Trash2, RefreshCw } from 'lucide-react';
import { RequirePermission } from '../../components/guards/RequirePermission';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { User } from './UserViewPanel';

interface UserActionPanelProps {
    user: User;
    onActionComplete?: () => void;
}

type ActionType = 'ban' | 'suspend' | 'reset_password' | 'delete' | null;

export const UserActionPanel = ({ user, onActionComplete }: UserActionPanelProps) => {
    const [actionToConfirm, setActionToConfirm] = useState<ActionType>(null);

    const handleConfirmAction = () => {
        // MOCK API CALL
        console.log(`Executing ${actionToConfirm} on user ${user.id}`);
        // In real app: await api.users.performAction(user.id, actionToConfirm);

        setActionToConfirm(null);
        if (onActionComplete) onActionComplete();
    };

    const getActionDetails = (type: ActionType) => {
        switch (type) {
            case 'ban': return { title: 'Ban User', desc: `Are you sure you want to permanently ban ${user.name}? They will lose all access immediately.`, destructive: true };
            case 'suspend': return { title: 'Suspend User', desc: `Suspend ${user.name} for 24 hours?`, destructive: false };
            case 'reset_password': return { title: 'Reset Password', desc: `Send a password reset email to ${user.email}?`, destructive: false };
            case 'delete': return { title: 'Delete Account', desc: `PERMANENTLY delete ${user.name} and all associated data? This cannot be undone.`, destructive: true };
            default: return { title: '', desc: '', destructive: false };
        }
    };

    const details = getActionDetails(actionToConfirm);

    return (
        <RequirePermission permission="MANAGE_USERS" fallback={
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/5 text-center text-sm text-slate-500 italic">
                You do not have permission to manage users.
            </div>
        }>
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md mt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        onClick={() => setActionToConfirm('suspend')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all text-sm font-medium"
                    >
                        <Lock size={16} />
                        Suspend Access
                    </button>
                    <button
                        onClick={() => setActionToConfirm('reset_password')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all text-sm font-medium"
                    >
                        <RefreshCw size={16} />
                        Reset Password
                    </button>
                    <button
                        onClick={() => setActionToConfirm('ban')}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all text-sm font-medium"
                    >
                        <Ban size={16} />
                        Ban User
                    </button>
                    <button
                        onClick={() => setActionToConfirm('delete')}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-950/30 text-rose-600 hover:bg-rose-900/50 border border-rose-900/30 transition-all text-sm font-medium"
                    >
                        <Trash2 size={16} />
                        Delete Data
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!actionToConfirm}
                onClose={() => setActionToConfirm(null)}
                onConfirm={handleConfirmAction}
                title={details.title}
                description={details.desc}
                isDestructive={details.destructive}
                confirmText={details.destructive ? 'Yes, Proceed' : 'Confirm'}
            />
        </RequirePermission>
    );
};
