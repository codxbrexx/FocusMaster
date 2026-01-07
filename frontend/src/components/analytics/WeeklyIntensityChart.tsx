
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { ChartTooltip } from './ChartTooltip';

interface HeatmapData {
    day: string;
    count: number;
    fullDate: string;
}

interface WeeklyIntensityChartProps {
    data: HeatmapData[];
}

export function WeeklyIntensityChart({ data }: WeeklyIntensityChartProps) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={item} className="h-full">
            <Card className="border-border shadow-xl backdrop-blur-xl bg-card/40 h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium tracking-wide text-foreground">Weekly Intensity</CardTitle>
                    <CardDescription className="text-muted-foreground">Sessions completed daily</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={data} barSize={32}>
                                <defs>
                                    <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(128,128,128,0.2)"
                                />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888888', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(128,128,128,0.1)' }}
                                    content={<ChartTooltip />}
                                />
                                <Bar
                                    dataKey="count"
                                    radius={[6, 6, 6, 6]}
                                    fill="url(#intensityGradient)"
                                    className="filter drop-shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
