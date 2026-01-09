import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';

const MOCK_ERRORS = [
    { id: 1, type: 'critical', message: 'DatabaseConnectionError: Pool timeout exceeded', time: '2 mins ago', count: 4 },
    { id: 2, type: 'warning', message: 'API Rate Limit exceeded for IP 192.168.1.5', time: '15 mins ago', count: 12 },
    { id: 3, type: 'info', message: 'Background Job: Email delivery delayed', time: '1 hour ago', count: 1 },
    { id: 4, type: 'warning', message: 'Redis: High memory fragmentation ratio', time: '3 hours ago', count: 1 },
];

export const ErrorLogList = () => {
    return (
        <div className="bg-[#0b0f12] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-rose-500" size={18} />
                    Recent Exceptions
                </h3>
                <span className="text-xs text-slate-500">Last 24 Hours</span>
            </div>
            <div className="divide-y divide-white/5">
                {MOCK_ERRORS.map((err) => (
                    <div key={err.id} className="p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className={`mt-1 ${err.type === 'critical' ? 'text-rose-500' :
                                err.type === 'warning' ? 'text-amber-500' :
                                    'text-blue-500'
                            }`}>
                            {err.type === 'critical' ? <AlertOctagon size={18} /> :
                                err.type === 'warning' ? <AlertTriangle size={18} /> :
                                    <Info size={18} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-slate-200 font-mono">{err.message}</p>
                                <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{err.time}</span>
                            </div>
                            <div className="mt-1 flex gap-2">
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${err.type === 'critical' ? 'bg-rose-500/10 text-rose-400' :
                                        err.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {err.type}
                                </span>
                                <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                                    Occurrences: {err.count}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
