import * as Slider from '@radix-ui/react-slider';
import { useStore } from '../store';
import { allLanguages as languages } from '../data';
import { useMemo } from 'react';

export function TimelineSlider() {
  const { yearRange, setYearRange } = useStore();

  const { minYear, maxYear } = useMemo(() => {
    const years = languages.map(lang => lang.year);
    return { minYear: Math.min(...years), maxYear: new Date().getFullYear() };
  }, []);

  const handleValueChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
  };

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
