import { create } from 'zustand';
import { Language } from './data';

interface AppState {
  languages: Language[];
  setLanguages: (langs: Language[]) => void;
  availableLocales: string[];
  setAvailableLocales: (locales: string[]) => void;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  selectedLanguage: Language | null;
  setSelectedLanguage: (lang: Language | null) => void;
  hoveredLanguage: Language | null;
  setHoveredLanguage: (lang: Language | null) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showNames: boolean;
  setShowNames: (show: boolean) => void;
  showConnections: boolean;
  setShowConnections: (show: boolean) => void;
  showMoons: boolean;
  setShowMoons: (show: boolean) => void;
  docsFilter: string | null;
  setDocsFilter: (filter: string | null) => void;
  usageFilter: string | null;
  setUsageFilter: (filter: string | null) => void;
  categoryFilter: string | null;
  setCategoryFilter: (filter: string | null) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const useStore = create<AppState>((set) => ({
  languages: [],
  setLanguages: (langs) => set({ languages: langs }),
  availableLocales: [],
  setAvailableLocales: (locales) => set({ availableLocales: locales }),
  currentLocale: 'en',
  setCurrentLocale: (locale) => set({ currentLocale: locale }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  selectedLanguage: null,
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  hoveredLanguage: null,
  setHoveredLanguage: (lang) => set({ hoveredLanguage: lang }),
  showOrbits: true,
  setShowOrbits: (show) => set({ showOrbits: show }),
  showNames: true,
  setShowNames: (show) => set({ showNames: show }),
  showConnections: true,
  setShowConnections: (show) => set({ showConnections: show }),
  showMoons: true,
  setShowMoons: (show) => set({ showMoons: show }),
  docsFilter: null,
  setDocsFilter: (filter) => set({ docsFilter: filter }),
  usageFilter: null,
  setUsageFilter: (filter) => set({ usageFilter: filter }),
  categoryFilter: null,
  setCategoryFilter: (filter) => set({ categoryFilter: filter }),
  yearRange: [1950, new Date().getFullYear()],
  setYearRange: (range) => set({ yearRange: range }),
  playbackSpeed: 1,
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));

interface CameraState {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
  target: [number, number, number] | null;
  setTarget: (pos: [number, number, number] | null) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  position: [0, 80, 160],
  setPosition: (pos) => set({ position: pos }),
  target: null,
  setTarget: (pos) => set({ target: pos }),
}));
