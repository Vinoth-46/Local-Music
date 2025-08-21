import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';

type Theme = 'light' | 'dark';

const storage = new MMKV({ id: 'isai-settings' });

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const THEME_KEY = 'theme';

function loadTheme(): Theme {
  const saved = storage.getString(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: loadTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    storage.set(THEME_KEY, next);
    set({ theme: next });
  },
  setTheme: (t: Theme) => {
    storage.set(THEME_KEY, t);
    set({ theme: t });
  },
}));

