import { Priority } from '@/types/task';
import { Flame, Zap, Sprout } from 'lucide-react';

export interface PriorityConfig {
  label: Priority;
  color: string;
  darkColor: string;
  lightColor: string;
  bgColor: string;
  icon: typeof Flame;
  order: number;
}

export const PRIORITIES: Record<Priority, PriorityConfig> = {
  High: {
    label: 'High',
    color: '#ef4444',
    darkColor: '#dc2626',
    lightColor: '#fca5a5',
    bgColor: '#fee2e2',
    icon: Flame,
    order: 1,
  },
  Medium: {
    label: 'Medium',
    color: '#f59e0b',
    darkColor: '#d97706',
    lightColor: '#fcd34d',
    bgColor: '#fef3c7',
    icon: Zap,
    order: 2,
  },
  Low: {
    label: 'Low',
    color: '#10b981',
    darkColor: '#059669',
    lightColor: '#6ee7b7',
    bgColor: '#d1fae5',
    icon: Sprout,
    order: 3,
  },
};

export const PRIORITY_ORDER: Priority[] = ['High', 'Medium', 'Low'];
