import { useState } from 'react';
import { Trash2, CheckCircle2, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      className="max-w-5xl mx-auto space-y-8 pb-24"
    >
      <TaskStats
        activeCount={activeTasks.length}
        completedCount={completedTasks.length}
        progress={progress}
        finishedPomodoros={finishedPomodoros}
        totalPomodoros={totalPomodoros}
      />

      {/* --- MAIN CONTENT --- */}
      <div className="w-full space-y-12">
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

        {/* --- ACTIVE LIST --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <h2 className="text-xl font-semibold tracking-tight">To Do</h2>
            <span className="text-sm text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
              {sortedTasks.length}
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {sortedTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-secondary/20 rounded-xl border border-dashed"
              >
                <ListTodo className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <h3 className="font-semibold text-lg">No active tasks</h3>
                <p className="text-muted-foreground mb-4">
                  You're all caught up! Or maybe it's time to add one?
                </p>
                <Button variant="outline" onClick={() => setIsAdding(true)}>
                  Add First Task
                </Button>
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

        {/* --- COMPLETED LIST --- */}
        {completedTasks.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="space-y-2">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:border-primary/20 transition-all shadow-sm opacity-60 hover:opacity-100"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="text-green-600 hover:text-green-500 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <span className="line-through text-muted-foreground font-medium">
                        {task.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task._id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
