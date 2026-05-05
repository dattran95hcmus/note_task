import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useTaskStore } from '@/stores/useTaskStore';
import { Priority } from '@/types/task';
import { Button } from '@/components/UI/Button';
import { Input, Textarea } from '@/components/UI/Input';
import { toast } from 'sonner';

export function TaskForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [notes, setNotes] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const addTask = useTaskStore((state) => state.addTask);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setNotes('');
    setPriority('Medium');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addTask(
        title.trim(),
        priority,
        url.trim() || undefined,
        notes.trim() || undefined,
        undefined
      );

      resetForm();
      setIsOpen(false);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
      console.error(error);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (title.trim()) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <>
      {/* Big Add Task Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3.5 px-5 text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all
          bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
          text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30
          active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-600 dark:shadow-blue-900/30"
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">New Task</h3>

                {/* Title - Enter submits */}
                <Input
                  ref={titleInputRef}
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  required
                />

                {/* URL */}
                <Input
                  type="url"
                  placeholder="https://... (optional)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />

                {/* Priority */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {(['High', 'Medium', 'Low'] as Priority[]).map((p) => {
                      const config = {
                        High: { emoji: '🔥', active: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-2 ring-red-500' },
                        Medium: { emoji: '⚡', active: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-2 ring-amber-500' },
                        Low: { emoji: '🌱', active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-2 ring-green-500' },
                      };
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            priority === p
                              ? config[p].active
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {config[p].emoji} {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes - Enter allowed here for multiline */}
                <Textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="ghost" size="md" onClick={() => { resetForm(); setIsOpen(false); }}>
                    Cancel
                  </Button>
                  <Button type="submit" size="md" disabled={!title.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
