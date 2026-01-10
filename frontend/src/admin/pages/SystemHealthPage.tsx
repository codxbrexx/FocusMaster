import { Activity } from 'lucide-react';
import { SystemHealthCard } from '../features/health/SystemHealthCard';
import { ErrorLogList } from '../features/health/ErrorLogList';
import { RequirePermission } from '../components/guards/RequirePermission';

export const SystemHealthPage = () => {
    return (
        <RequirePermission permission="MANAGE_SYSTEM">
            <div className="max-w-6xl mx-auto p-2">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Activity className="text-emerald-500" />
                        System Health
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Operational status, performance metrics, and error tracking.
                    </p>
                </div>

                <SystemHealthCard />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ErrorLogList />
                    </div>
                    <div className="glass-card rounded-2xl p-6 h-fit">
                        <h4 className="text-foreground font-bold mb-4">Quick Limits</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">API Rate Limit</span>
                                <span className="text-emerald-500">65%</span>
                            </li>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[65%]" />
                            </div>

                            <li className="flex justify-between mt-4">
                                <span className="text-muted-foreground">Disk Usage (DB)</span>
                                <span className="text-amber-500">82%</span>
                            </li>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[82%]" />
                            </div>

                            <li className="flex justify-between mt-4">
                                <span className="text-muted-foreground">Email Quota</span>
                                <span className="text-blue-500">12%</span>
                            </li>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[12%]" />
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </RequirePermission>
    );
};
