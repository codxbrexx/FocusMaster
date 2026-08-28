import { useState } from 'react';
import { Plus, CheckCircle2, Circle, ChevronRight, Flag, ListTodo } from 'lucide-react';
import { useTaskStore, type Task } from '@/store/useTaskStore';
import { Link } from 'react-router-dom';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-50 text-red-700 border-red-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low: 'bg-purple-50 text-[#6E36E4] border-purple-100',
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
      await addTask({
        title: newTitle.trim(),
        priority: 'medium',
        estimatedPomodoros: 1,
        category: 'General',
      });
      setNewTitle('');
      setShowInput(false);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-[#6E36E4]" />
          Today's Tasks
        </h3>
        <button
          id="tasks-add-btn"
          onClick={() => setShowInput((v) => !v)}
          className="flex items-center gap-1 text-xs font-bold text-[#6E36E4] hover:text-[#5B2AC6] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>

      {showInput && (
        <div className="flex gap-2">
          <input
            id="tasks-new-input"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setShowInput(false);
            }}
            placeholder="Quick task title..."
            className="flex-1 text-xs rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#6E36E4] transition-colors"
          />
          <button
            id="tasks-save-btn"
            disabled={adding}
            onClick={handleAdd}
            className="text-xs bg-[#6E36E4] hover:bg-[#5B2AC6] text-white px-3 py-2 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-60"
          >
            Save
          </button>
        </div>
      )}

      <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-none">
        {todayTasks.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No tasks yet. Add one!</p>
        )}
        {todayTasks.map((task) => (
          <div
            key={task._id}
            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
            onClick={() => toggle(task)}
          >
            <div className="mt-0.5 shrink-0">
              {task.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-semibold leading-tight truncate ${
                  task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  {task.estimatedPomodoros} session{task.estimatedPomodoros !== 1 ? 's' : ''}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border capitalize ${PRIORITY_COLORS[task.priority]}`}
                >
                  <Flag className="w-2.5 h-2.5 inline mr-0.5" />
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length > 20 && (
        <Link
          to="/tasks"
          className="flex items-center justify-between text-xs font-bold text-[#6E36E4] hover:text-[#5B2AC6] transition-colors pt-2 border-t border-slate-100"
        >
          <span>View All Tasks</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};
