import { motion } from 'framer-motion';
import { Pencil, Plus, Timer } from 'lucide-react';

interface TaskFormState {
  title: string;
  estimatedPomodoros: number;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  category: string;
}

interface TaskFormProps {
  isAdding: boolean;
  taskForm: TaskFormState;
  setTaskForm: (form: TaskFormState) => void;
  editingTaskId: string | null;
  handleSubmit: () => void;
  categories: string[];
  onCancel: () => void;
}

export function TaskForm({
  isAdding,
  taskForm,
  setTaskForm,
  editingTaskId,
  handleSubmit,
  categories,
  onCancel,
}: TaskFormProps) {
  if (!isAdding) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden font-sans text-slate-900"
    >
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          {editingTaskId ? (
            <Pencil className="w-4 h-4 text-[#6E36E4]" />
          ) : (
            <Plus className="w-4 h-4 text-[#6E36E4]" />
          )}
          <h3 className="text-base font-bold text-slate-900">
            {editingTaskId ? 'Edit Task Details' : 'Create New Focus Task'}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Task Title</label>
            <input
              type="text"
              placeholder="e.g., Complete System Architecture Review"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6E36E4]/40"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => {
                  const v = e.target.value as 'low' | 'medium' | 'high';
                  const defaults = { low: 2, medium: 3, high: 4 };
                  setTaskForm({
                    ...taskForm,
                    priority: v,
                    estimatedPomodoros: defaults[v],
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Est. Sessions</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={taskForm.estimatedPomodoros}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      estimatedPomodoros: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                />
                <Timer className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-6 py-2 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer"
            >
              {editingTaskId ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
