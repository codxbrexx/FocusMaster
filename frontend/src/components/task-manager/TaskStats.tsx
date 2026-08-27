import { Target, CheckCircle2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskStatsProps {
  activeCount: number;
  completedCount: number;
  progress: number;
  finishedPomodoros: number;
  totalPomodoros: number;
}

export function TaskStats({
  activeCount,
  completedCount,
  progress,
  finishedPomodoros,
  totalPomodoros,
}: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-sans text-slate-900">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Tasks
          </p>
          <h3 className="text-3xl font-bold text-slate-900">{activeCount}</h3>
        </div>
        <div className="p-3 bg-purple-50 text-[#6E36E4] rounded-xl border border-purple-100">
          <Target className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed
          </p>
          <h3 className="text-3xl font-bold text-slate-900">{completedCount}</h3>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs md:col-span-2 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#6E36E4]" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Productivity Velocity
            </span>
          </div>
          <span className="text-xs font-bold font-mono text-[#6E36E4]">
            {finishedPomodoros} / {totalPomodoros} Sessions ({Math.round(progress)}%)
          </span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-[#6E36E4] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
