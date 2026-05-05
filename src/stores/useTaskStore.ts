import { create } from 'zustand';
import { Task, Priority, TaskStats, CompletedTaskGroup } from '@/types/task';
import { getAllTasks, saveTask, saveTasks, deleteTask as deleteTaskDB } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { PRIORITIES } from '@/constants/priorities';
import { format, parseISO } from 'date-fns';

interface TaskStore {
  tasks: Task[];
  selectedTasks: Set<string>;
  searchQuery: string;
  isLoading: boolean;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (
    title: string,
    priority: Priority,
    url?: string,
    notes?: string,
    dueDate?: string
  ) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string, permanent?: boolean) => Promise<void>;
  restoreTask: (task: Task) => Promise<void>;
  markDone: (id: string) => Promise<void>;
  markUndone: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;
  changeTaskPriority: (id: string, priority: Priority) => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleTaskSelection: (id: string) => void;
  clearSelection: () => void;
  bulkMarkDone: () => Promise<void>;
  bulkDelete: () => Promise<void>;

  // Selectors
  getFilteredTasks: () => Task[];
  getActiveTasksByPriority: () => Record<Priority, Task[]>;
  getCompletedTasksByDate: () => CompletedTaskGroup[];
  getTaskStats: () => TaskStats;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTasks: new Set(),
  searchQuery: '',
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await getAllTasks();
      set({ tasks });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (title, priority, url, notes, dueDate) => {
    const tasks = get().tasks;
    const maxOrder = Math.max(0, ...tasks.filter((t) => t.priority === priority).map((t) => t.order));
    
    const task: Task = {
      id: generateId(),
      title,
      url,
      priority,
      notes,
      dueDate,
      done: false,
      createdAt: new Date().toISOString(),
      order: maxOrder + 1,
    };

    await saveTask(task);
    set({ tasks: [...tasks, task] });
    return task;
  },

  updateTask: async (id, updates) => {
    const tasks = get().tasks;
    const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    const updatedTask = updatedTasks.find((t) => t.id === id);
    
    if (updatedTask) {
      await saveTask(updatedTask);
      set({ tasks: updatedTasks });
    }
  },

  deleteTask: async (id, permanent = false) => {
    if (permanent) {
      await deleteTaskDB(id);
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    } else {
      // Soft delete - mark for deletion UI
      get().updateTask(id, { isDeleting: true });
      
      // Auto-delete after 5 seconds
      setTimeout(async () => {
        const task = get().tasks.find((t) => t.id === id);
        if (task?.isDeleting) {
          await deleteTaskDB(id);
          set({ tasks: get().tasks.filter((t) => t.id !== id) });
        }
      }, 5000);
    }
  },

  restoreTask: async (task) => {
    const updatedTask = { ...task, isDeleting: false };
    await saveTask(updatedTask);
    set({ tasks: get().tasks.map((t) => (t.id === task.id ? updatedTask : t)) });
  },

  markDone: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const updates = {
      done: true,
      completedAt: format(new Date(), 'yyyy-MM-dd'),
    };
    
    await get().updateTask(id, updates);
  },

  markUndone: async (id) => {
    await get().updateTask(id, { done: false, completedAt: undefined });
  },

  reorderTasks: async (reorderedTasks) => {
    const tasksWithOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    
    await saveTasks(tasksWithOrder);
    
    const otherTasks = get().tasks.filter(
      (t) => !reorderedTasks.find((rt) => rt.id === t.id)
    );
    
    set({ tasks: [...tasksWithOrder, ...otherTasks] });
  },

  changeTaskPriority: async (id, priority) => {
    const tasks = get().tasks;
    const maxOrder = Math.max(0, ...tasks.filter((t) => t.priority === priority).map((t) => t.order));
    
    await get().updateTask(id, { priority, order: maxOrder + 1 });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleTaskSelection: (id) => {
    const selected = new Set(get().selectedTasks);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    set({ selectedTasks: selected });
  },

  clearSelection: () => set({ selectedTasks: new Set() }),

  bulkMarkDone: async () => {
    const { selectedTasks, tasks } = get();
    const updates = Array.from(selectedTasks).map((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task && !task.done) {
        return { ...task, done: true, completedAt: format(new Date(), 'yyyy-MM-dd') };
      }
      return null;
    }).filter(Boolean) as Task[];

    if (updates.length > 0) {
      await saveTasks(updates);
      const updatedTasks = tasks.map((t) => {
        const update = updates.find((u) => u.id === t.id);
        return update || t;
      });
      set({ tasks: updatedTasks, selectedTasks: new Set() });
    }
  },

  bulkDelete: async () => {
    const { selectedTasks } = get();
    for (const id of selectedTasks) {
      await get().deleteTask(id, false);
    }
    set({ selectedTasks: new Set() });
  },

  getFilteredTasks: () => {
    const { tasks, searchQuery } = get();
    if (!searchQuery) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.notes?.toLowerCase().includes(query) ||
        task.url?.toLowerCase().includes(query)
    );
  },

  getActiveTasksByPriority: () => {
    const filteredTasks = get().getFilteredTasks();
    const activeTasks = filteredTasks.filter((t) => !t.done);
    
    const grouped: Record<Priority, Task[]> = {
      High: [],
      Medium: [],
      Low: [],
    };

    activeTasks.forEach((task) => {
      grouped[task.priority].push(task);
    });

    // Sort by order within each priority
    Object.keys(grouped).forEach((priority) => {
      grouped[priority as Priority].sort((a, b) => a.order - b.order);
    });

    return grouped;
  },

  getCompletedTasksByDate: () => {
    const filteredTasks = get().getFilteredTasks();
    const completedTasks = filteredTasks.filter((t) => t.done && t.completedAt);
    
    const grouped = new Map<string, Task[]>();
    
    completedTasks.forEach((task) => {
      const date = task.completedAt!;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(task);
    });

    // Sort tasks within each date by priority
    grouped.forEach((tasks) => {
      tasks.sort((a, b) => PRIORITIES[a.priority].order - PRIORITIES[b.priority].order);
    });

    // Convert to array and sort by date (newest first)
    return Array.from(grouped.entries())
      .map(([date, tasks]) => ({ date, tasks }))
      .sort((a, b) => {
        try {
          return parseISO(b.date).getTime() - parseISO(a.date).getTime();
        } catch {
          return 0;
        }
      });
  },

  getTaskStats: () => {
    const tasks = get().tasks;
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const pending = total - done;

    const byPriority: TaskStats['byPriority'] = {
      High: { total: 0, done: 0, pending: 0 },
      Medium: { total: 0, done: 0, pending: 0 },
      Low: { total: 0, done: 0, pending: 0 },
    };

    tasks.forEach((task) => {
      byPriority[task.priority].total++;
      if (task.done) {
        byPriority[task.priority].done++;
      } else {
        byPriority[task.priority].pending++;
      }
    });

    return { total, done, pending, byPriority };
  },
}));
