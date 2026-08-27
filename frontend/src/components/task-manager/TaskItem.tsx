import { motion } from 'framer-motion';
import { Circle, Calendar, Target, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/store/useTaskStore';

interface TaskItemProps {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const progressPercent = (task.completedPomodoros / task.estimatedPomodoros) * 100;

  const PRIORITY_BADGES = {
    high: 'bg-red-50 text-red-700 border-red-200/80',
    medium: 'bg-amber-50 text-amber-700 border-amber-200/80',
    low: 'bg-blue-50 text-blue-700 border-blue-200/80',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 1.002 }}
      transition={{ duration: 0.15 }}
      className="group bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all font-sans text-slate-900 flex items-start gap-3.5"
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className="mt-0.5 text-slate-300 hover:text-[#6E36E4] transition-colors cursor-pointer shrink-0"
      >
        <Circle className="w-5 h-5" />
      </button>

      {/* Main Task Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <h3
              onClick={() => onEdit(task)}
              className="text-sm font-bold text-slate-900 hover:text-[#6E36E4] transition-colors cursor-pointer truncate"
            >
              {task.title}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#6E36E4] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Metadata & Progress Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Priority Pill */}
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium}`}>
            {task.priority}
          </span>

          {/* Category Pill */}
          {task.category && (
            <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-600 border border-slate-200/60">
              {task.category}
            </span>
          )}

          {/* Deadline */}
          {task.deadline && (
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(task.deadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Pomodoro Session Progress */}
          <div className="flex items-center gap-1.5 ml-auto text-slate-500 font-mono text-[11px]">
            <Target className="w-3 h-3 text-[#6E36E4]" />
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6E36E4] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <span>
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
