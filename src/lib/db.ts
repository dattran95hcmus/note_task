import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Task } from '@/types/task';

interface TaskDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-priority': string; 'by-done': number };
  };
}

let dbInstance: IDBPDatabase<TaskDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<TaskDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<TaskDB>('TaskPriorityDB', 1, {
    upgrade(db) {
      const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
      taskStore.createIndex('by-priority', 'priority');
      taskStore.createIndex('by-done', 'done');
    },
  });

  return dbInstance;
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await initDB();
  return db.getAll('tasks');
}

export async function getTask(id: string): Promise<Task | undefined> {
  const db = await initDB();
  return db.get('tasks', id);
}

export async function saveTask(task: Task): Promise<void> {
  const db = await initDB();
  await db.put('tasks', task);
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('tasks', 'readwrite');
  await Promise.all(tasks.map((task) => tx.store.put(task)));
  await tx.done;
}

export async function deleteTask(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('tasks', id);
}

export async function clearAllTasks(): Promise<void> {
  const db = await initDB();
  await db.clear('tasks');
}

export async function exportTasks(): Promise<string> {
  const tasks = await getAllTasks();
  return JSON.stringify(tasks, null, 2);
}

export async function importTasks(jsonData: string): Promise<Task[]> {
  const tasks = JSON.parse(jsonData) as Task[];
  await saveTasks(tasks);
  return tasks;
}
