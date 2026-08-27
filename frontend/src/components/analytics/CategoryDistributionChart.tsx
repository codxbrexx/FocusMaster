import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
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

  const DEFAULT_COLORS = ['#6E36E4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <motion.div variants={item} className="h-full font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs h-full flex flex-col justify-between space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Category Breakdown</h3>
          <p className="text-xs text-slate-500 font-medium">Distribution of tagged focus time</p>
        </div>

        <div className="h-full flex items-center justify-center pb-4">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[230px] text-slate-400">
              <Target className="h-10 w-10 mb-2 text-slate-300" />
              <p className="font-bold text-xs text-slate-600">No Category Data Yet</p>
              <p className="text-[11px] text-slate-400 font-medium">Start tagged sessions to view breakdown</p>
            </div>
          ) : (
            <div className="h-[230px] w-full min-w-0 relative">
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
                        fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length] || colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-2xl font-bold font-mono text-slate-900">{data.length}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Categories</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
