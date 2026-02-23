import { create } from 'zustand';
import { Language } from './data';

interface AppState {
  selectedLanguage: Language | null;
  setSelectedLanguage: (lang: Language | null) => void;
  hoveredLanguage: Language | null;
  setHoveredLanguage: (lang: Language | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedLanguage: null,
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  hoveredLanguage: null,
  setHoveredLanguage: (lang) => set({ hoveredLanguage: lang }),
}));
