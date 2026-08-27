import { useState } from 'react';
import { Trash2, CheckCircle2, ListTodo, Target } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, type Task } from '@/store/useTaskStore';

// Sub-components
import { TaskStats } from './task-manager/TaskStats';
import { TaskFilters } from './task-manager/TaskFilters';
import { TaskForm } from './task-manager/TaskForm';
import { TaskItem } from './task-manager/TaskItem';

const CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Coding', 'Creative'];

export function TaskManager() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [taskForm, setTaskForm] = useState({
    title: '',
    estimatedPomodoros: 1,
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: new Date().toISOString().split('T')[0],
    category: 'Work',
  });

  const completedTasks = tasks.filter((t) => t.isCompleted);
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  const filteredActiveTasks = activeTasks.filter((t) => {
    const matchesPriority = filter === 'all' || t.priority === filter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesPriority && matchesCategory;
  });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...filteredActiveTasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  // Stats Logic
  const totalPomodoros = tasks.reduce((acc, t) => acc + t.estimatedPomodoros, 0);
  const finishedPomodoros = tasks.reduce((acc, t) => acc + t.completedPomodoros, 0);
  const progress = totalPomodoros > 0 ? (finishedPomodoros / totalPomodoros) * 100 : 0;

  const resetForm = () => {
    setTaskForm({
      title: '',
      estimatedPomodoros: 1,
      priority: 'medium',
      deadline: new Date().toISOString().split('T')[0],
      category: 'Work',
    });
    setEditingTaskId(null);
    setIsAdding(false);
  };

  const handleEditClick = (task: Task) => {
    setTaskForm({
      title: task.title,
      estimatedPomodoros: task.estimatedPomodoros,
      priority: task.priority,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      category: task.category || 'Work',
    });
    setEditingTaskId(task._id);
    setIsAdding(true);
  };

  const handleSubmit = () => {
    try {
      if (!taskForm.title.trim()) {
        toast.error('Please enter a task title');
        return;
      }

      const taskData = {
        title: taskForm.title,
        estimatedPomodoros: taskForm.estimatedPomodoros,
        priority: taskForm.priority,
        deadline: taskForm.deadline || undefined,
        category: taskForm.category,
      };

      if (editingTaskId) {
        updateTask(editingTaskId, taskData);
        toast.success('Task updated successfully');
      } else {
        addTask({
          ...taskData,
        });
        toast.success('Task added successfully');
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task._id, { isCompleted: !task.isCompleted });
    if (!task.isCompleted) toast.success('Nice work! Task completed.');
  };

  const toggleAdd = () => {
    if (isAdding) resetForm();
    else setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-24 font-sans text-slate-900 animate-fade-in"
    >
      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6E36E4] border border-purple-100 text-xs font-semibold">
            <Target className="w-3.5 h-3.5 text-[#6E36E4]" />
            <span>Focus Priority Planner</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Task Management & Priority Backlog
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            Break down your study objectives into focused Pomodoro sessions and track your completion velocity.
          </p>
        </div>
      </div>

      <TaskStats
        activeCount={activeTasks.length}
        completedCount={completedTasks.length}
        progress={progress}
        finishedPomodoros={finishedPomodoros}
        totalPomodoros={totalPomodoros}
      />

      {/* Main Task List & Filter Section */}
      <div className="w-full space-y-6">
        <TaskFilters
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          filter={filter}
          setFilter={setFilter}
          isAdding={isAdding}
          onToggleAdd={toggleAdd}
          categories={CATEGORIES}
        />

        <AnimatePresence>
          <TaskForm
            isAdding={isAdding}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            editingTaskId={editingTaskId}
            handleSubmit={handleSubmit}
            categories={CATEGORIES}
            onCancel={() => {
              setIsAdding(false);
              resetForm();
            }}
          />
        </AnimatePresence>

        {/* --- ACTIVE TASK LIST --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>To Do Tasks</span>
              <span className="text-xs font-bold text-[#6E36E4] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                {sortedTasks.length}
              </span>
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            {sortedTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3"
              >
                <ListTodo className="w-10 h-10 mx-auto text-slate-300" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">No Active Tasks Found</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    You're all caught up! Click 'Add Task' to create your next study objective.
                  </p>
                </div>
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-[#6E36E4] hover:bg-[#5B2AC6] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  Create First Task
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {sortedTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={handleToggleComplete}
                    onEdit={handleEditClick}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- COMPLETED TASK LIST --- */}
        {completedTasks.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completed Objectives ({completedTasks.length})
              </h3>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 transition-all font-sans text-xs text-slate-700 hover:opacity-100"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <span className="line-through text-slate-500 font-medium">
                        {task.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
