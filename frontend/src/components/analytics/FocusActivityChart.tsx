
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface FocusBreakData {
    day: string;
    focus: number;
    break: number;
}

interface FocusActivityChartProps {
    data: FocusBreakData[];
}

export function FocusActivityChart({ data }: FocusActivityChartProps) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-2 shadow-md backdrop-blur-xl bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="w-5 h-5 text-primary" />
                        Focus Activity
                    </CardTitle>
                    <CardDescription>
                        Compare your focus time vs break time over the last 7 days.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart
                                data={data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBreak" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
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
                                <YAxis
                                    hide={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="focus"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFocus)"
                                    name="Focus Time"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="break"
                                    stroke="hsl(var(--chart-2))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBreak)"
                                    name="Break Time"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
