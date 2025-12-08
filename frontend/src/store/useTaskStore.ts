import { create } from 'zustand';
import api from '../services/api';
import { toast } from 'sonner';

export interface Task {
  _id: string; // Backend uses _id
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean; // Backend uses isCompleted
  category?: string;
  deadline?: string;
  createdAt: string;
}


interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, '_id' | 'createdAt' | 'completedPomodoros' | 'isCompleted'>
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const isGuest = localStorage.getItem('isGuest') === 'true';
      if (isGuest) {
        const local = localStorage.getItem('guest-tasks');
        set({ tasks: local ? JSON.parse(local) : [] });
      } else {
        const { data } = await api.get('/tasks');
        set({ tasks: data });
      }
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      // toast.error('Failed to sync tasks'); // optional
      // Fallback to empty if auth error?
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      const newTask: Task = {
        ...taskData,
        _id: crypto.randomUUID(),
        isCompleted: false,
        completedPomodoros: 0,
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const updated = [newTask, ...state.tasks];
        localStorage.setItem('guest-tasks', JSON.stringify(updated));
        return { tasks: updated };
      });
      toast.success('Task added (Guest)');
      return;
    }

    set({ isLoading: true });
    try {
      const { data } = await api.post('/tasks', taskData);
      set((state) => ({
        tasks: [data, ...state.tasks],
      }));
      toast.success('Task created');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, updates) => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      set((state) => {
        const updated = state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t));
        localStorage.setItem('guest-tasks', JSON.stringify(updated));
        return { tasks: updated };
      });
      toast.success('Task updated (Guest)');
      return;
    }

    const previousTasks = get().tasks;
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
    }));

    try {
      await api.put(`/tasks/${id}`, updates);
      toast.success('Task updated');
    } catch (error: any) {
      console.error('Failed to update task', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
      // Revert on error
      set({ tasks: previousTasks });
    }
  },

  deleteTask: async (id) => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      set((state) => {
        const updated = state.tasks.filter((t) => t._id !== id);
        localStorage.setItem('guest-tasks', JSON.stringify(updated));
        return { tasks: updated };
      });
      toast.success('Task deleted (Guest)');
      return;
    }

    const previousTasks = get().tasks; // Capture for potential rollback
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    }));

    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
    } catch (error: any) {
      console.error('Failed to delete task', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
      // Revert on error
      set({ tasks: previousTasks });
    }
  },
}));
