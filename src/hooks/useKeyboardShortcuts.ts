import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const withCtrl = e.ctrlKey || e.metaKey;
      const withShift = e.shiftKey;

      let shortcutKey = '';
      if (withCtrl) shortcutKey += 'ctrl+';
      if (withShift) shortcutKey += 'shift+';
      shortcutKey += key;

      if (shortcuts[shortcutKey]) {
        e.preventDefault();
        shortcuts[shortcutKey]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
