import { useMemo } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';
import { DateGroup } from './DateGroup';
import { EmptyState } from '@/components/UI/EmptyState';
import { CheckCircle2 } from 'lucide-react';
import { PRIORITIES } from '@/constants/priorities';
import { parseISO } from 'date-fns';
import { CompletedTaskGroup } from '@/types/task';

export function CompletedPanel() {
  const tasks = useTaskStore((state) => state.tasks);

  const completedGroups: CompletedTaskGroup[] = useMemo(() => {
    const completed = tasks.filter((t) => t.done && t.completedAt);
    const grouped = new Map<string, typeof completed>();
    completed.forEach((task) => {
      const date = task.completedAt!;
      if (!grouped.has(date)) grouped.set(date, []);
      grouped.get(date)!.push(task);
    });
    grouped.forEach((list) =>
      list.sort((a, b) => PRIORITIES[a.priority].order - PRIORITIES[b.priority].order)
    );
    return Array.from(grouped.entries())
      .map(([date, tasks]) => ({ date, tasks }))
      .sort((a, b) => {
        try { return parseISO(b.date).getTime() - parseISO(a.date).getTime(); } catch { return 0; }
      });
  }, [tasks]);

  return (
    <div className="h-full bg-white dark:bg-gray-800 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {completedGroups.length === 0 ? (
          <EmptyState
            title="No completed tasks yet"
            description="Completed tasks will appear here"
            icon={<CheckCircle2 className="w-16 h-16" />}
          />
        ) : (
          completedGroups.map((group) => <DateGroup key={group.date} group={group} />)
        )}
      </div>
    </div>
  );
}
