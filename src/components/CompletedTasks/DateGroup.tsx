import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { CompletedTaskGroup as CompletedTaskGroupType } from '@/types/task';
import { CompletedTaskCard } from './CompletedTaskCard';
import { Badge } from '@/components/UI/Badge';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

interface DateGroupProps {
  group: CompletedTaskGroupType;
}

export function DateGroup({ group }: DateGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {formatDate(group.date)}
          </span>
          <Badge variant="default">{group.tasks.length}</Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-2 space-y-2">
              {group.tasks.map((task) => (
                <CompletedTaskCard key={task.id} task={task} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
