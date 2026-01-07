
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface CategoryData {
    name: string;
    value: number;
    [key: string]: any;
}

interface CategoryDistributionChartProps {
    data: CategoryData[];
    colors: string[];
}

export function CategoryDistributionChart({ data, colors }: CategoryDistributionChartProps) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={item} className="h-full">
            <Card className="border-white/10 shadow-xl backdrop-blur-xl bg-black/40 h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium tracking-wide text-white/90">Category Distribution</CardTitle>
                    <CardDescription className="text-white/50">Where your focus is going</CardDescription>
                </CardHeader>
                <CardContent className="h-full flex items-center justify-center pb-8">
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[250px] text-white/30">
                            <Target className="h-12 w-12 mb-4 opacity-50" />
                            <p className="font-medium">No category data yet</p>
                            <p className="text-sm opacity-70">Start sessions to see distribution</p>
                        </div>
                    ) : (
                        <div className="h-[250px] w-full min-w-0 relative">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((_entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={colors[index % colors.length]}
                                                className="filter drop-shadow-lg"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Central Label Idea - Optional, but adds 'professional' feel if we show Total Hours or Top Category */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-white/90">{data.length}</span>
                                    <p className="text-xs text-white/50 uppercase tracking-wider">Cats</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
