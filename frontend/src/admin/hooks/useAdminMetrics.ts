import { useState, useEffect } from 'react';
import { Users, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { adminService, type DashboardStats } from '../../services/admin.service';

export interface KPI {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: any;
  color: string;
}

export interface TrafficPoint {
  name: string;
  visitors: number;
  sessions: number;
}

export const useAdminMetrics = (timeRange: '7d' | '30d') => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data: DashboardStats = await adminService.getDashboardStats();

        // Transform API Data to UI format
        setKpis([
          {
            title: 'Total Users',
            value: data.kpis.totalUsers.toLocaleString(),
            trend: 'Active Today: ' + data.kpis.activeToday,
            trendUp: true,
            icon: Users,
            color: 'text-cyan-500',
          },
          {
            title: 'Total Sessions',
            value: data.kpis.totalSessions.toLocaleString(),
            trend: '+--%', // Real trend requires previous period comparison (skipped for now)
            trendUp: true,
            icon: Clock,
            color: 'text-purple-500',
          },
          {
            title: 'System Health',
            value: data.kpis.recentErrors === 0 ? 'Healthy' : 'Degraded',
            trend: `${data.kpis.recentErrors} errors (24h)`,
            trendUp: data.kpis.recentErrors === 0,
            icon: AlertTriangle,
            color: data.kpis.recentErrors === 0 ? 'text-emerald-500' : 'text-rose-500',
          },
          {
            title: 'Revenue',
            value: 'N/A', // Not implemented
            trend: 'Free Tier',
            trendUp: true,
            icon: DollarSign,
            color: 'text-amber-500',
          },
        ]);

        // Map Traffic Data
        const traffic = data.traffic.map((t) => ({
          name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          visitors: t.visitors,
          sessions: t.sessions,
        }));
        // Fill in gaps if needed, but basic mapping works
        setTrafficData(traffic);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        // Fallback to empty or error state? Keeping previous mock not ideal.
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { kpis, trafficData, isLoading };
};
