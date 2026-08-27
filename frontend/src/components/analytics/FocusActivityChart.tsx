import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
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
    <motion.div variants={item} className="lg:col-span-2 h-full font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-[#6E36E4]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Focus & Break Activity</h3>
              <p className="text-xs text-slate-500 font-medium">Compare focus time vs break time over the last 7 days</p>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full min-w-0 pt-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6E36E4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6E36E4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBreak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                hide={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="focus"
                stroke="#6E36E4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorFocus)"
                name="Focus Time"
              />
              <Area
                type="monotone"
                dataKey="break"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorBreak)"
                name="Break Time"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
