import { motion } from 'framer-motion';
import { ExternalLink, Trash2, RotateCcw, StickyNote } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Task } from '@/types/task';
import { useTaskStore } from '@/stores/useTaskStore';
import { PRIORITIES } from '@/constants/priorities';
import { toast } from 'sonner';

interface CompletedTaskCardProps {
  task: Task;
}

export function CompletedTaskCard({ task }: CompletedTaskCardProps) {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const markUndone = useTaskStore((state) => state.markUndone);

  const PriorityIcon = PRIORITIES[task.priority].icon;

  const handleUndo = async () => {
    await markUndone(task.id);
    toast.success('Task restored to active');
  };

  const handleDelete = async () => {
    await deleteTask(task.id, true);
    toast.success('Task permanently deleted');
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="group bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <PriorityIcon
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: PRIORITIES[task.priority].color }}
            />
            <h4 className="text-sm text-gray-600 dark:text-gray-400 line-through">
              {task.title}
            </h4>
          </div>

          {task.url && (
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">{task.url}</span>
            </a>
          )}

          {task.notes && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 flex items-start gap-1">
              <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{task.notes}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleUndo}
                  className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
                  sideOffset={5}
                >
                  Restore
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleDelete}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
                  sideOffset={5}
                >
                  Delete permanently
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </motion.div>
  );
}
