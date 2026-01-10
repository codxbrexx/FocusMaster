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
    <motion.div variants={item} className="lg:col-span-2 h-full">
      <Card className="border-border shadow-xl backdrop-blur-xl bg-card/40 h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-wide text-foreground">
            <Activity className="w-5 h-5 text-indigo-400" />
            Focus Activity
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Compare your focus time vs break time over the last 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBreak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
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
                <YAxis
                  hide={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="focus"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFocus)"
                  name="Focus Time"
                />
                <Area
                  type="monotone"
                  dataKey="break"
                  stroke="#2dd4bf"
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
