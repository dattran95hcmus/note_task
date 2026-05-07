import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { Task, Priority } from '@/types/task';
import { PRIORITIES } from '@/constants/priorities';
import { TaskCard } from './TaskCard';
import { Badge } from '@/components/UI/Badge';
import { EmptyState } from '@/components/UI/EmptyState';
import { cn } from '@/lib/utils';

interface PriorityColumnProps {
  priority: Priority;
  tasks: Task[];
}

export function PriorityColumn({ priority, tasks }: PriorityColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${priority}`,
    data: { priority },
  });

  const PriorityIcon = PRIORITIES[priority].icon;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col w-1/3 min-w-0 min-h-0 border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-colors duration-200',
        isOver && 'bg-blue-50/70 dark:bg-blue-900/20'
      )}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: `${PRIORITIES[priority].bgColor}20` }}
      >
        <div className="flex items-center gap-2">
          <PriorityIcon className="w-4 h-4" style={{ color: PRIORITIES[priority].color }} />
          <h3 className="font-semibold text-sm" style={{ color: PRIORITIES[priority].darkColor }}>
            {priority}
          </h3>
        </div>
        <Badge variant={priority}>{tasks.length}</Badge>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className={cn(
              'h-full flex items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200',
              isOver ? 'border-blue-400 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-900/20' : 'border-transparent'
            )}>
              <EmptyState
                title={`No ${priority.toLowerCase()} priority tasks`}
                description="Drag tasks here or create a new one"
                icon={<PriorityIcon className="w-12 h-12" />}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
