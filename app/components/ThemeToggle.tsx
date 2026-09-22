'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6 text-amber-400" />
      ) : (
        <Moon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}
