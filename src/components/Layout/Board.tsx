import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { ActiveTasksPanel } from '@/components/ActiveTasks/ActiveTasksPanel';
import { CompletedPanel } from '@/components/CompletedTasks/CompletedPanel';
import { useTaskStore } from '@/stores/useTaskStore';
import { Badge } from '@/components/UI/Badge';

export function Board() {
  const [showCompleted, setShowCompleted] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="flex-1 min-h-0 relative">
      {/* Active Tasks - always full width */}
      <div className="h-full">
        <ActiveTasksPanel />
      </div>

      {/* Toggle Button - Bottom right corner */}
      {!showCompleted && (
        <button
          onClick={() => setShowCompleted(true)}
          className="fixed bottom-6 right-6 z-20 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all hover:shadow-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
          {doneCount > 0 && <Badge variant="default">{doneCount}</Badge>}
        </button>
      )}

      {/* Completed Panel - Slide from right as overlay */}
      <AnimatePresence>
        {showCompleted && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowCompleted(false)}
              className="fixed inset-0 bg-black/20 z-30"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 w-[400px] z-40 shadow-2xl"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Completed
                    {doneCount > 0 && <Badge variant="default">{doneCount}</Badge>}
                  </h2>
                  <button
                    onClick={() => setShowCompleted(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CompletedPanel />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
