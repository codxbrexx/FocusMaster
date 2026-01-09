import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLivePresence, LiveSession } from '../../context/LivePresenceContext';
import { Laptop, Smartphone, Tablet, Globe, Ban } from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useAuditLog } from '../../context/AuditLogContext';

export const LiveUsersTable = () => {
    const { sessions, kickSession } = useLivePresence();
    const { logAction } = useAuditLog();
    const [sessionToKick, setSessionToKick] = useState<LiveSession | null>(null);

    const handleKickConfirm = () => {
        if (sessionToKick) {
            kickSession(sessionToKick.id);
            logAction('SESSION_TERMINATE', `Force kicked user ${sessionToKick.userName} from session`, sessionToKick.userId, sessionToKick.userName);
            setSessionToKick(null);
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'mobile': return <Smartphone size={16} className="text-slate-400" />;
            case 'tablet': return <Tablet size={16} className="text-slate-400" />;
            default: return <Laptop size={16} className="text-slate-400" />;
        }
    };

    return (
        <>
            <div className="bg-[#0b0f12] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="min-w-full inline-block align-middle">
                    <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Active Sessions ({sessions.length})</h3>
                        </div>
                    </div>
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-white/[0.02] text-xs font-medium text-slate-500 uppercase tracking-wider text-left border-b border-white/5">
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Current Page</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-[#0b0f12]">
                            <AnimatePresence initial={false}>
                                {sessions.map((session) => (
                                    <motion.tr
                                        key={session.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        layout
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-900/20">
                                                    {session.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">{session.userName}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        {getDeviceIcon(session.device)}
                                                        <span>{session.device}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Globe size={14} className="text-slate-500" />
                                                {session.country}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 rounded text-xs font-mono bg-cyan-950/30 text-cyan-400 border border-cyan-900/30">
                                                {session.currentPage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSessionToKick(session)}
                                                className="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                                                title="Kick User"
                                            >
                                                <Ban size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!sessionToKick}
                onClose={() => setSessionToKick(null)}
                onConfirm={handleKickConfirm}
                title="Kick User Session?"
                description={`Are you sure you want to forcibly disconnect ${sessionToKick?.userName}? They will be logged out immediately.`}
                isDestructive={true}
                confirmText="Kick User"
            />
        </>
    );
};
