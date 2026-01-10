import { Activity } from 'lucide-react';
import { LiveUsersTable } from '../features/live/LiveUsersTable';
import { RequirePermission } from '../components/guards/RequirePermission';

export const LiveActivityPage = () => {
    return (
        <RequirePermission permission="VIEW_ANALYTICS">
            <div className="max-w-6xl mx-auto p-2">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Activity className="text-emerald-500" />
                        Live Activity
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Real-time monitoring of active user sessions and behaviors.
                    </p>
                </div>

                <LiveUsersTable />
            </div>
        </RequirePermission>
    );
};
