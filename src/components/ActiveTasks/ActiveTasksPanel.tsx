import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useTaskStore } from '@/stores/useTaskStore';
import { Task, Priority } from '@/types/task';
import { PRIORITY_ORDER } from '@/constants/priorities';
import { PriorityColumn } from './PriorityColumn';
import { TaskCard } from './TaskCard';

export function ActiveTasksPanel() {
  const tasks = useTaskStore((state) => state.tasks);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const changeTaskPriority = useTaskStore((state) => state.changeTaskPriority);

  const tasksByPriority = React.useMemo(() => {
    const active = tasks.filter((t) => !t.done && !t.isDeleting);
    const grouped: Record<Priority, Task[]> = { High: [], Medium: [], Low: [] };
    active.forEach((t) => grouped[t.priority].push(t));
    Object.keys(grouped).forEach((p) => grouped[p as Priority].sort((a, b) => a.order - b.order));
    return grouped;
  }, [tasks]);

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const findTaskPriority = (taskId: string): Priority | undefined => {
    for (const [priority, tasks] of Object.entries(tasksByPriority)) {
      if (tasks.some((t) => t.id === taskId)) return priority as Priority;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    const activePriority = findTaskPriority(activeTaskId);
    if (!activePriority) return;

    // Check if dropping over a column droppable
    if (overId.startsWith('droppable-')) {
      const targetPriority = overId.replace('droppable-', '') as Priority;
      if (activePriority !== targetPriority) {
        changeTaskPriority(activeTaskId, targetPriority);
      }
      return;
    }

    // Check if dropping over another task
    const overPriority = findTaskPriority(overId);
    if (overPriority && activePriority !== overPriority) {
      changeTaskPriority(activeTaskId, overPriority);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    // Skip if dropped on column droppable or same position
    if (overId.startsWith('droppable-') || activeTaskId === overId) return;

    const activePriority = findTaskPriority(activeTaskId);
    if (!activePriority) return;

    const columnTasks = tasksByPriority[activePriority];
    const activeIndex = columnTasks.findIndex((t) => t.id === activeTaskId);
    const overIndex = columnTasks.findIndex((t) => t.id === overId);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const reordered = arrayMove(columnTasks, activeIndex, overIndex);
      reorderTasks(reordered);
    }
  };

  const activeTask = activeId
    ? Object.values(tasksByPriority).flat().find((t) => t.id === activeId)
    : null;

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Active Tasks</h2>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {PRIORITY_ORDER.map((priority) => (
            <PriorityColumn key={priority} priority={priority} tasks={tasksByPriority[priority]} />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? (
            <div className="rotate-2 scale-105 shadow-xl opacity-95">
              <TaskCard task={activeTask} isDragOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
