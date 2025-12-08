import { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Target,
  ListTodo,
  Filter,
  Pencil,
  Tag,
  X,
  Timer,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, type Task } from '../store/useTaskStore';

const CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Coding', 'Creative'];

export function TaskManager() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState('active');

  const [taskForm, setTaskForm] = useState({
    title: '',
    estimatedPomodoros: 1,
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: '',
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
      deadline: '',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-24"
    >
      {/* --- DASHBOARD STATS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-card/50 shadow-sm border-2 border-l-4 border-l-primary">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active
              </p>
              <h3 className="text-2xl font-bold">{activeTasks.length}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Target className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 shadow-sm border-2 border-l-4 border-l-green-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Done
              </p>
              <h3 className="text-2xl font-bold">{completedTasks.length}</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 shadow-sm border-2 border-l-4 border-l-blue-500 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Productivity Score
                </p>
                <h3 className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {finishedPomodoros} / {totalPomodoros} Sessions
              </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- MAIN CONTENT --- */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="grid w-full md:w-[240px] grid-cols-2">
            <TabsTrigger value="active">To Do</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">
            {currentTab === 'active' && (
              <>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px] shadow-sm">
                    <Tag className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger className="w-[140px] shadow-sm">
                    <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            <Button
              onClick={() => {
                if (isAdding) resetForm();
                else setIsAdding(true);
              }}
              variant={isAdding ? 'secondary' : 'default'}
              className="shadow-sm min-w-[120px]"
            >
              {isAdding ? (
                <>
                  <X className="w-4 h-4 mr-2" /> Close
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> New Task
                </>
              )}
            </Button>
          </div>
        </div>

        {/* --- ADD/EDIT FORM (IMPROVED BASED ON IMAGE) --- */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <Card className="backdrop-blur-xl bg-card/50 border-2 border-border/50 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {editingTaskId ? (
                      <Pencil className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary" />
                    )}
                    {editingTaskId ? 'Edit Task' : 'Create New Task'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">What needs to be done?</label>
                    <Input
                      placeholder="e.g. Finish React Project..."
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="text-lg py-6 px-4"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={taskForm.category}
                        onValueChange={(v) => setTaskForm({ ...taskForm, category: v })}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={taskForm.priority}
                        onValueChange={(v: any) => setTaskForm({ ...taskForm, priority: v })}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high" className="text-destructive">
                            High Priority
                          </SelectItem>
                          <SelectItem value="medium" className="text-orange-500">
                            Medium Priority
                          </SelectItem>
                          <SelectItem value="low" className="text-blue-500">
                            Low Priority
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Est. Pomodoros
                      </label>
                      <div className="flex items-center gap-2 relative">
                        <Input
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
                          className="h-10 pr-8"
                        />
                        <Timer className="w-4 h-4 text-muted-foreground absolute right-3" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={taskForm.deadline}
                        onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="px-8">
                      {editingTaskId ? 'Save Changes' : 'Create Task'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ACTIVE LIST --- */}
        <TabsContent value="active" className="space-y-4">
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
              sortedTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={handleToggleComplete}
                  onEdit={handleEditClick}
                  onDelete={deleteTask}
                />
              ))
            )}
          </AnimatePresence>
        </TabsContent>

        {/* --- COMPLETED LIST --- */}
        <TabsContent value="completed">
          <div className="space-y-2">
            <AnimatePresence>
              {completedTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No completed tasks yet. Get to work!</p>
                </div>
              ) : (
                completedTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggleComplete(task)} className="text-green-600">
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
                ))
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// Sub-component for cleaner code and animations
function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
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
      className={`group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border-2 backdrop-blur-xl bg-card/50 shadow-sm hover:shadow-md transition-all 
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors truncate pr-8"
            onClick={() => onEdit(task)}
          >
            {task.title}
          </h3>
          <div className="flex gap-2 shrink-0">
            {task.category && (
              <Badge variant="secondary" className="font-normal">
                {task.category}
              </Badge>
            )}
            {task.priority === 'high' && (
              <Badge variant="destructive" className="font-normal animate-pulse">
                High
              </Badge>
            )}
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
        </div>
      </div>

      {/* Actions (Absolute on Desktop, static on mobile) */}
      <div className="flex md:flex-col md:absolute md:right-2 md:top-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={() => onEdit(task)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task._id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}