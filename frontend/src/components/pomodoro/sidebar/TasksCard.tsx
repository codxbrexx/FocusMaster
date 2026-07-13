import { useState } from 'react';
import { Plus, CheckCircle2, Circle, ChevronRight, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore, type Task } from '@/store/useTaskStore';
import { Link } from 'react-router-dom';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-yellow-500/10 text-yellow-500',
  low: 'bg-primary/10 text-primary',
};

export const TasksCard = () => {
  const { tasks, updateTask, addTask } = useTaskStore();
  const [showInput, setShowInput] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const todayTasks = tasks.slice(0, 20);

  const toggle = async (task: Task) => {
    await updateTask(task._id, { isCompleted: !task.isCompleted });
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await addTask({ title: newTitle.trim(), priority: 'medium', estimatedPomodoros: 1, category: 'General' });
      setNewTitle('');
      setShowInput(false);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="bg-card border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Today's Tasks</CardTitle>
          <button
            id="tasks-add-btn"
            onClick={() => setShowInput((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {/* Inline add */}
        {showInput && (
          <div className="mb-3 flex gap-2">
            <input
              id="tasks-new-input"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') setShowInput(false);
              }}
              placeholder="Task title..."
              className="flex-1 text-sm rounded-xl border border-border bg-secondary px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <button
              id="tasks-save-btn"
              disabled={adding}
              onClick={handleAdd}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-60"
            >
              Save
            </button>
          </div>
        )}

        {/* Task list */}
        <div className="space-y-1.5 max-h-[135px] overflow-y-auto custom-scrollbar pr-1.5 -mr-1.5">
          {todayTasks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No tasks yet. Add one!</p>
          )}
          {todayTasks.map((task) => (
            <div
              key={task._id}
              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary transition-all duration-200 cursor-pointer"
              onClick={() => toggle(task)}
            >
              <div className="mt-0.5 flex-shrink-0">
                {task.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-tight truncate ${task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{task.estimatedPomodoros} session{task.estimatedPomodoros !== 1 ? 's' : ''}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize ${PRIORITY_COLORS[task.priority]}`}>
                    <Flag className="w-2.5 h-2.5 inline mr-0.5" />{task.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length > 20 && (
          <Link
            to="/tasks"
            className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors pt-3 border-t border-border/40"
          >
            View All Tasks <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
