import { motion } from 'framer-motion';
import { Circle, Calendar, Target, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/store/useTaskStore';

interface TaskItemProps {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const isHigh = task.priority === 'high';
  const progressPercent = (task.completedPomodoros / task.estimatedPomodoros) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border-2 backdrop-blur-xl bg-card/50 shadow-sm hover:shadow-md transition-all hover:z-10 
        ${isHigh ? 'border-l-4 border-l-destructive' : 'border-l-4 border-l-transparent'}`}
    >
      {/* Checkbox */}
      <div className="pt-1">
        <button
          onClick={() => onToggle(task)}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Circle className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <h3
              className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors truncate"
              onClick={() => onEdit(task)}
            >
              {task.title}
            </h3>
            <div className="flex gap-2">
              {task.priority === 'high' && (
                <Badge
                  variant="destructive"
                  className="font-normal text-xs animate-pulse pointer-events-none"
                >
                  High
                </Badge>
              )}
            </div>
          </div>

          {/* Actions (Desktop: visible on hover, Mobile: always visible) */}
          <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {task.deadline && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(task.deadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5" />
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <span className="text-xs">
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
          </div>
          {task.category && (
            <Badge variant="secondary" className="font-normal text-xs pointer-events-none">
              {task.category}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
