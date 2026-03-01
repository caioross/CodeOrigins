import ReactSlider from 'react-slider';
import { useStore } from '../store';
// import { allLanguages as languages } from '../data';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Timeline() {
  const { languages, selectedLanguage, hoveredLanguage, setSelectedLanguage, setHoveredLanguage, yearRange, setYearRange } = useStore();

  const sortedLanguages = useMemo(() => {
    return languages
      .filter(l => {
        const minFilter = yearRange[0] <= 1700 ? -Infinity : yearRange[0];
        return l.year >= minFilter && l.year <= yearRange[1];
      })
      .sort((a, b) => a.year - b.year);
  }, [languages, yearRange]);

  const years = Array.from(new Set(sortedLanguages.map(l => l.year))).sort();

  if (languages.length === 0) return null;

  const minYear = useMemo(() => Math.max(1700, Math.min(...languages.map(l => l.year))), [languages]);
  const maxYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex items-center gap-4 text-white">
      <span className="text-sm font-mono whitespace-nowrap">{yearRange[0]}</span>
      <ReactSlider
        className="w-full h-1 bg-white/10 rounded-full cursor-pointer"
        thumbClassName="w-4 h-4 -top-1.5 bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-150 ease-in-out shadow-md"
        trackClassName="h-1 bg-indigo-400/50 rounded-full"
        value={yearRange}
        min={minYear}
        max={maxYear}
        onChange={(value) => setYearRange(value as [number, number])}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        pearling
        minDistance={1}
      />
      <span className="text-sm font-mono whitespace-nowrap">{yearRange[1]}</span>
    </div>
  );
}
