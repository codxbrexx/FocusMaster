
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
        <motion.div variants={item}>
            <Card className="border-2 shadow-md backdrop-blur-xl bg-card/50 h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Weekly Intensity</CardTitle>
                    <CardDescription>Sessions completed per day</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={data} barSize={20}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                    opacity={0.4}
                                />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
