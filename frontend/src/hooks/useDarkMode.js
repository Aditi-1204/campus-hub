import { useState, useEffect } from 'react';

export default function useDarkMode() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('campushub_theme') === 'dark'
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campushub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campushub_theme', 'light');
    }
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
}
