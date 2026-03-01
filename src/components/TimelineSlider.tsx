import { useState, useEffect, useMemo, useRef } from 'react';
import { useStore, useCameraStore } from '../store';
import * as Slider from '@radix-ui/react-slider';
import { motion, AnimatePresence } from 'framer-motion';
// import { allLanguages as languages } from '../data';
import { languagePositions } from './SolarSystem';
import { Filter, ChevronUp, ChevronDown, Check } from 'lucide-react';

export function TimelineSlider() {
  const {
    languages,
    yearRange,
    setYearRange,
    setSelectedLanguage,
    docsFilter, setDocsFilter,
    usageFilter, setUsageFilter,
    categoryFilter, setCategoryFilter
  } = useStore();
  const setCameraTarget = useCameraStore(state => state.setTarget);
  const { minYear, maxYear } = useMemo(() => {
    if (languages.length === 0) return { minYear: 1950, maxYear: 2024 };
    const years = languages.map(l => l.year);
    return {
      minYear: Math.max(1700, Math.min(...years)),
      maxYear: Math.max(...years)
    };
  }, [languages]);

  useEffect(() => {
    if (languages.length > 0) {
      setYearRange([minYear, maxYear]);
    }
  }, [minYear, maxYear, setYearRange, languages.length]);

  const markers = useMemo(() => {
    const decades = [];
    for (let y = Math.floor(minYear / 10) * 10; y <= Math.ceil(maxYear / 10) * 10; y += 10) {
      decades.push(y);
    }
    return decades;
  }, [minYear, maxYear]);

  const handleValueChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
  };

  const categories = useMemo(() => {
    const cats = new Set(languages.map(l => l.category || 'Generic'));
    return Array.from(cats).sort();
  }, [languages]);

  if (languages.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 flex items-center gap-4">
      <span className="text-xs text-gray-400 font-mono">{yearRange[0]}</span>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        defaultValue={[minYear, maxYear]}
        min={minYear}
        max={maxYear}
        step={1}
        value={yearRange}
        onValueChange={handleValueChange}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="bg-gray-800 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75" />
        <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75" />
      </Slider.Root>
      <span className="text-xs text-gray-400 font-mono">{yearRange[1]}</span>
    </div>
  );
}
