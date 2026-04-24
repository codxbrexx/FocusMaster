import type { FC } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useCounterAnimation } from './useCounterAnimation';

export interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
}

export const StatCard: FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  suffix = '',
}) => {
  const { displayValue, elementRef } = useCounterAnimation(value, 2);

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(0) + 'K';
    }
    return val.toString();
  };

  return (
    <motion.div
      ref={elementRef}
      className="glass-panel bg-slate-950/75 p-6 sm:p-7 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all hover:shadow-lg"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Icon */}
      <div className="mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      {/* Stat Number */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-bold text-white">
            {formatValue(displayValue)}
          </span>
          {suffix && (
            <span className="text-sm text-slate-300 font-medium">{suffix}</span>
          )}
        </div>
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm text-slate-300 font-medium uppercase tracking-widest">
        {label}
      </p>

      {/* Loading bar (animates while counter is counting) */}
      {displayValue < value && (
        <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 animate-loading"
            style={{
              width: `${(displayValue / value) * 100}%`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
};
