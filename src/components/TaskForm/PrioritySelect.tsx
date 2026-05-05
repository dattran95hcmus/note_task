import { Priority } from '@/types/task';
import { PRIORITIES } from '@/constants/priorities';
import { cn } from '@/lib/utils';

interface PrioritySelectProps {
  value: Priority;
  onChange: (value: Priority) => void;
  className?: string;
}

export function PrioritySelect({ value, onChange, className }: PrioritySelectProps) {
  const Icon = PRIORITIES[value].icon;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Priority)}
        className={cn(
          'appearance-none h-10 pl-10 pr-10 rounded-lg border border-gray-300 bg-white',
          'text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 cursor-pointer',
          className
        )}
        style={{ color: PRIORITIES[value].color }}
      >
        {Object.entries(PRIORITIES).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: PRIORITIES[value].color }}
      />
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
