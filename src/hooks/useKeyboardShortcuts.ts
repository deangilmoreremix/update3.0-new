import { useEffect } from 'react';

export const globalShortcuts: KeyboardShortcut[] = [
  {
    key: 'k',
    ctrl: true,
    action: () => {
      // Quick search functionality

    },
    description: 'Quick search'
  },
  {
    key: 'n',
    ctrl: true,
    action: () => {
      // New deal/contact

    },
    description: 'New item'
  },
  {
    key: 'd',
    ctrl: true,
    shift: true,
    action: () => {
      // Toggle dark mode

    },
    description: 'Toggle dark mode'
  },
  {
    key: '/',
    action: () => {
      // Focus search

    },
    description: 'Focus search'
  }
];

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch &&
          metaMatch
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [shortcuts]);
}