import { useState, useEffect } from 'react';
import { Users, Clock, AlertTriangle, DollarSign } from 'lucide-react';

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
        // SIMULATE NETWORK DELAY
        const timer = setTimeout(() => {
            // MOCK DATA GENERATION BASED ON TIME RANGE
            const isWeek = timeRange === '7d';

            setKpis([
                {
                    title: 'Live Users',
                    value: isWeek ? '1,245' : '1,500', // Just diversifying numbers
                    trend: isWeek ? '+12.5% from last hour' : '+5% avg',
                    trendUp: true,
                    icon: Users,
                    color: 'text-cyan-500'
                },
                {
                    title: 'Total Sessions',
                    value: isWeek ? '45,231' : '182,042',
                    trend: isWeek ? '+4.3% vs last week' : '+12% vs last month',
                    trendUp: true,
                    icon: Clock,
                    color: 'text-purple-500'
                },
                {
                    title: 'Error Rate',
                    value: isWeek ? '0.42%' : '0.38%',
                    trend: isWeek ? '-0.05% improvement' : 'Stable',
                    trendUp: true, // "Up" here means good (green), logic handled in UI usually, but label says improvement
                    icon: AlertTriangle,
                    color: 'text-rose-500'
                },
                {
                    title: 'Revenue (Est)',
                    value: isWeek ? '$12,450' : '$48,201',
                    trend: isWeek ? '+8.1% vs last week' : '+15% vs last month',
                    trendUp: true,
                    icon: DollarSign,
                    color: 'text-emerald-500'
                }
            ]);

            // Generate Chart Data
            const days = isWeek ? 7 : 30;
            const data: TrafficPoint[] = [];
            const now = new Date();

            for (let i = days; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                data.push({
                    name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    visitors: Math.floor(Math.random() * 500) + 1000,
                    sessions: Math.floor(Math.random() * 800) + 1500,
                });
            }
            setTrafficData(data);
            setIsLoading(false);
        }, 800); // 800ms delay

        return () => clearTimeout(timer);
    }, [timeRange]);

    return { kpis, trafficData, isLoading };
};
