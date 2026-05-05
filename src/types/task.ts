export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  url?: string;
  priority: Priority;
  done: boolean;
  createdAt: string;
  completedAt?: string;
  order: number;
  notes?: string;
  dueDate?: string;
  isDeleting?: boolean;
}

export interface TaskStats {
  total: number;
  done: number;
  pending: number;
  byPriority: {
    [key in Priority]: {
      total: number;
      done: number;
      pending: number;
    };
  };
}

export interface CompletedTaskGroup {
  date: string;
  tasks: Task[];
}
