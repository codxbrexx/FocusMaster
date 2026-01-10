import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

const DATA = [
    { name: 'Mon', visits: 4000, sessions: 2400 },
    { name: 'Tue', visits: 3000, sessions: 1398 },
    { name: 'Wed', visits: 2000, sessions: 9800 },
    { name: 'Thu', visits: 2780, sessions: 3908 },
    { name: 'Fri', visits: 1890, sessions: 4800 },
    { name: 'Sat', visits: 2390, sessions: 3800 },
    { name: 'Sun', visits: 3490, sessions: 4300 },
];

export const AdminTrafficChart = () => {
    const { theme } = useTheme();

    const primaryColor = (theme as string) === 'green' ? '#10b981' : (theme as string) === 'blue' ? '#3b82f6' : '#8b5cf6';
    const secondaryColor = (theme as string) === 'green' ? '#059669' : (theme as string) === 'blue' ? '#2563eb' : '#7c3aed';

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card) / 0.8)',
                            backdropFilter: 'blur(12px)',
                            borderColor: 'hsl(var(--border) / 0.5)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            color: 'hsl(var(--foreground))'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="visits"
                        stroke={primaryColor}
                        fillOpacity={1}
                        fill="url(#colorVisits)"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke={secondaryColor}
                        fillOpacity={1}
                        fill="url(#colorSessions)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
