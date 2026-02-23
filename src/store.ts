import { create } from 'zustand';
import { Language } from './data';

interface AppState {
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
}

export const useStore = create<AppState>((set) => ({
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
