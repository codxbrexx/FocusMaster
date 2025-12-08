
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
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
        <motion.div variants={item}>
            <Card className="border-2 shadow-md backdrop-blur-xl bg-card/50 h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Category Distribution</CardTitle>
                    <CardDescription>Where your focus is going</CardDescription>
                </CardHeader>
                <CardContent className="h-full flex items-center justify-center">
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                            <Target className="h-12 w-12 mb-4 opacity-20" />
                            <p>No category data yet</p>
                            <p className="text-sm">Start sessions to see distribution</p>
                        </div>
                    ) : (
                        <div className="h-[250px] w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
