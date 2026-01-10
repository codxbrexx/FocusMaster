import { Clock, User as UserIcon, AlertCircle, FileText, Shield } from 'lucide-react';
import { useAuditLog } from '../../context/AuditLogContext';

export const AuditLogTable = () => {
    const { logs } = useAuditLog();

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="glass-card rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30 border-b border-border/40 text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="px-6 py-4 font-semibold">Timestamp</th>
                            <th className="px-6 py-4 font-semibold">Actor</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                            <th className="px-6 py-4 font-semibold">Target</th>
                            <th className="px-6 py-4 font-semibold">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-secondary/40 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Clock size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-mono text-xs">{formatTime(log.timestamp)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${log.actorName.toLowerCase().includes('admin')
                                            ? 'bg-gradient-to-br from-primary to-accent-foreground text-primary-foreground shadow-sm shadow-primary/20'
                                            : 'bg-primary/20 text-primary'
                                            }`}>
                                            {log.actorName.toLowerCase().includes('admin') ? <Shield size={12} /> : log.actorName.charAt(0)}
                                        </div>
                                        <span className={`text-sm ${log.actorName.toLowerCase().includes('admin') ? 'text-primary font-medium' : 'text-foreground/80'}`}>
                                            {log.actorName}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${log.action.includes('BAN') || log.action.includes('DELETE')
                                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                                        : log.action.includes('UPDATE') || log.action.includes('EDIT')
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            : 'bg-secondary text-muted-foreground border-border/50'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {log.targetName ? (
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                            <UserIcon size={14} />
                                            <span>{log.targetName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground/50 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm max-w-xs truncate">
                                        {log.details && <FileText size={14} className="flex-shrink-0" />}
                                        <span className="truncate" title={log.details}>{log.details || '-'}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {logs.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No audit logs found.</p>
                </div>
            )}
        </div>
    );
};
