import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <motion.div variants={item} className="h-full font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Weekly Focus Intensity</h3>
          <p className="text-xs text-slate-500 font-medium">Completed session volume per day</p>
        </div>

        <div className="h-[250px] w-full min-w-0 pt-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} barSize={32}>
              <defs>
                <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6E36E4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#9061F9" stopOpacity={0.8} />
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
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
              <Bar
                dataKey="count"
                radius={[8, 8, 8, 8]}
                fill="url(#intensityGradient)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
