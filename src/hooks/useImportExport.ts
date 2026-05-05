import { exportTasks as exportTasksDB, importTasks as importTasksDB } from '@/lib/db';
import { downloadJSON, readFileAsText } from '@/lib/utils';
import { useTaskStore } from '@/stores/useTaskStore';
import { toast } from 'sonner';

export function useImportExport() {
  const loadTasks = useTaskStore((state) => state.loadTasks);

  const exportTasks = async () => {
    try {
      const jsonData = await exportTasksDB();
      const filename = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(jsonData, filename);
      toast.success('Tasks exported successfully!');
    } catch (error) {
      toast.error('Failed to export tasks');
      console.error(error);
    }
  };

  const importTasks = async (file: File) => {
    try {
      const jsonData = await readFileAsText(file);
      await importTasksDB(jsonData);
      await loadTasks();
      toast.success('Tasks imported successfully!');
    } catch (error) {
      toast.error('Failed to import tasks');
      console.error(error);
    }
  };

  return { exportTasks, importTasks };
}
