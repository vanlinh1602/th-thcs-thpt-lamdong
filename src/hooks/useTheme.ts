import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check if we're in the browser environment
    // if (typeof window === 'undefined') {
    //   return 'light'; // Default theme for server-side rendering
    // }

    // Check localStorage and system preferences on initial load
    const currentTheme = localStorage.getItem('YuriTheme');
    if (currentTheme === 'dark') {
      return 'dark';
    }

    // if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   return 'dark';
    // }

    return 'light';
  });

  useEffect(() => {
    // Update the HTML class when dark mode changes
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('YuriTheme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('YuriTheme', 'light');
    }
  }, [theme]);

  return {
    theme,
    toggleTheme: (newTheme?: string) =>
      setTheme(newTheme || (theme === 'dark' ? 'light' : 'dark')),
  };
}
