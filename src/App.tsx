import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useTaskStore } from '@/stores/useTaskStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Header } from '@/components/Layout/Header';
import { Board } from '@/components/Layout/Board';
import { TaskForm } from '@/components/TaskForm/TaskForm';

function App() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const isLoading = useTaskStore((state) => state.isLoading);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+n': () => {
      const input = document.querySelector<HTMLInputElement>('input[placeholder*="What needs"]');
      input?.focus();
    },
    escape: () => {
      const activeElement = document.activeElement as HTMLElement;
      activeElement?.blur();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8 h-screen flex flex-col gap-5">
        <Header />
        <TaskForm />
        <Board />
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
