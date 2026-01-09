import { Clock, User as UserIcon, AlertCircle, FileText } from 'lucide-react';
import { useAuditLog } from '../../context/AuditLogContext';

export const AuditLogTable = () => {
    const { logs } = useAuditLog();

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-[#0b0f12] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-slate-400">
                            <th className="px-6 py-4 font-semibold">Timestamp</th>
                            <th className="px-6 py-4 font-semibold">Actor</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                            <th className="px-6 py-4 font-semibold">Target</th>
                            <th className="px-6 py-4 font-semibold">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Clock size={14} className="text-slate-600 group-hover:text-cyan-500 transition-colors" />
                                        <span className="font-mono text-xs">{formatTime(log.timestamp)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                            {log.actorName.charAt(0)}
                                        </div>
                                        <span className="text-slate-300 text-sm">{log.actorName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${log.action.includes('BAN') || log.action.includes('DELETE')
                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            : log.action.includes('UPDATE') || log.action.includes('EDIT')
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : 'bg-slate-700/30 text-slate-300 border-slate-600/30'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {log.targetName ? (
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                            <UserIcon size={14} />
                                            <span>{log.targetName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-600 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm max-w-xs truncate">
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
                <div className="p-12 text-center text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No audit logs found.</p>
                </div>
            )}
        </div>
    );
};
