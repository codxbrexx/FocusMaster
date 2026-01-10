import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLivePresence, type LiveSession } from '../../context/LivePresenceContext';
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
      logAction(
        'SESSION_TERMINATE',
        `Force kicked user ${sessionToKick.userName} from session`,
        sessionToKick.userId,
        sessionToKick.userName
      );
      setSessionToKick(null);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return <Smartphone size={16} className="text-slate-400" />;
      case 'tablet':
        return <Tablet size={16} className="text-slate-400" />;
      default:
        return <Laptop size={16} className="text-slate-400" />;
    }
  };

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Active Sessions ({sessions.length})
            </h3>
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 p-0">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-secondary/95 backdrop-blur-sm">
              <tr className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-left border-b border-border/40">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Current Page</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 bg-card/20">
              <AnimatePresence initial={false}>
                {sessions.map((session) => (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                    className="hover:bg-secondary/40 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-purple-900/20">
                          {session.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {session.userName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {getDeviceIcon(session.device)}
                            <span>{session.device}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Globe size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{session.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-mono bg-accent/20 text-accent-foreground border border-accent/20">
                        {session.currentPage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSessionToKick(session)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/10"
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
