import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  Check,
  Trash2,
  ExternalLink,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/stores/useTaskStore';
import { PRIORITIES } from '@/constants/priorities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/UI/Button';
import { Input, Textarea } from '@/components/UI/Input';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
  isDragOverlay?: boolean;
}

export function TaskCard({ task, isDragOverlay = false }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } = useSortable({
    id: task.id,
    animateLayoutChanges: () => false,
  });

  const markDone = useTaskStore((state) => state.markDone);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const restoreTask = useTaskStore((state) => state.restoreTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isSorting ? transition : undefined,
    opacity: isDragging ? 0.4 : task.isDeleting ? 0.6 : 1,
    borderLeftColor: task.isDeleting ? undefined : PRIORITIES[task.priority].color,
    zIndex: isDragging ? 50 : undefined,
  };

  const handleMarkDone = async () => {
    await markDone(task.id);
    
    // Confetti animation
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: [PRIORITIES[task.priority].color],
    });
    
    toast.success('Task completed! 🎉');
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    toast('Task deleted', {
      action: {
        label: 'Undo',
        onClick: () => restoreTask(task),
      },
    });
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim()) {
      await updateTask(task.id, {
        title: editTitle.trim(),
        notes: editNotes.trim() || undefined,
      });
      setIsEditing(false);
      toast.success('Task updated');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditNotes(task.notes || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout={!isDragOverlay}
      initial={false}
      animate={{ scale: 1, opacity: isDragging ? 0.4 : 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing',
        isDragging && 'shadow-none',
        isDragOverlay && 'shadow-xl'
      )}
      {...attributes}
      {...listeners}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-sm"
                  autoFocus
                />
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={2}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                  {task.title}
                </h4>

                {task.url && (
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">{task.url}</span>
                  </a>
                )}

                {task.notes && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded p-2">
                    {task.notes}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg" sideOffset={5}>Edit</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={handleMarkDone}
                      className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                    >
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg" sideOffset={5}>Mark as done</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={handleDelete}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg" sideOffset={5}>Delete</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
