import { Server, Database, Zap, Cpu } from 'lucide-react';

export const SystemHealthCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <HealthItem
                label="API Status"
                value="Operational"
                subValue="99.99% Uptime"
                icon={Server}
                status="healthy"
            />
            <HealthItem
                label="Database Latency"
                value="24ms"
                subValue="Read Replica: Synced"
                icon={Database}
                status="healthy"
            />
            <HealthItem
                label="Cache Hit Rate"
                value="94.2%"
                subValue="Redis Cluster OK"
                icon={Zap}
                status="healthy"
            />
            <HealthItem
                label="Server Load"
                value="42%"
                subValue="32/64GB RAM Used"
                icon={Cpu}
                status="warning"
            />
        </div>
    );
};

const HealthItem = ({ label, value, subValue, icon: Icon, status }: any) => {
    const statusColor = status === 'healthy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
        status === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
            'text-rose-400 bg-rose-500/10 border-rose-500/20';

    return (
        <div className="bg-[#0b0f12] border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className={`p-3 rounded-xl ${statusColor} border`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
                <h4 className="text-xl font-bold text-white mb-1">{value}</h4>
                <p className="text-xs text-slate-500">{subValue}</p>
            </div>
        </div>
    );
};
