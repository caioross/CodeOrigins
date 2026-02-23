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
