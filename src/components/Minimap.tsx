import * as React from 'react';
import { useMemo, useRef } from 'react';
import { useStore, useCameraStore } from '../store';
import { languagePositions } from './SolarSystem';
import { Orbit, Type, Link, Moon } from 'lucide-react';

const MAP_SIZE = 240; // Increased from 160 to accommodate 2x radius
const CENTER = MAP_SIZE / 2;
const SCALE = 0.5; // Scale down from 3D world to 2D map

export function Minimap() {
  const position = useCameraStore(state => state.position);
  const setCameraTarget = useCameraStore(state => state.setTarget); // Renamed setTarget to setCameraTarget
  const svgRef = useRef<SVGSVGElement>(null); // Added svgRef

  const {
    languages, // Now sourced from useStore
    selectedLanguage,
    hoveredLanguage,
    setSelectedLanguage,
    setHoveredLanguage,
    showOrbits, setShowOrbits,
    showNames, setShowNames,
    showConnections, setShowConnections,
    showMoons, setShowMoons,
    docsFilter, setDocsFilter,
    usageFilter, setUsageFilter,
    categoryFilter, setCategoryFilter,
    setIsLoading
  } = useStore();

  // Calculate maximum radius to scale the map appropriately
  const maxRadius = useMemo(() => {
    if (languages.length === 0) return 100;
    let max = 0;
    languages.forEach(l => {
      const pos = languagePositions.get(l.id);
      if (pos) {
        const r = Math.sqrt(pos[0] * pos[0] + pos[2] * pos[2]);
        if (r > max) max = r;
      }
    });
    return max || 100;
  }, [languages]);

  const filteredLanguages = React.useMemo(() => {
    return languages.filter(lang => {
      if (docsFilter) {
        if (docsFilter === 'Good' && lang.docs < 0.7) return false;
        if (docsFilter === 'Avg' && (lang.docs < 0.4 || lang.docs >= 0.7)) return false;
        if (docsFilter === 'Poor' && lang.docs >= 0.4) return false;
      }
      if (usageFilter) {
        if (usageFilter === 'High' && lang.usage < 0.7) return false;
        if (usageFilter === 'Med' && (lang.usage < 0.4 || lang.usage >= 0.7)) return false;
        if (usageFilter === 'Low' && lang.usage >= 0.4) return false;
      }
      if (categoryFilter) {
        const cat = lang.category || 'Generic';
        if (cat.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [docsFilter, usageFilter, categoryFilter, languages]);

  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => {
        setIsLoading(false);
      }, 150); // Faster popup hide
    }, 10); // Faster trigger
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const worldX = ((x / MAP_SIZE) * 2 - 1) * maxRadius;
    const worldZ = ((y / MAP_SIZE) * 2 - 1) * maxRadius;

    setCameraTarget([worldX, 0, worldZ]);
  };

  const camX = ((position[0] / maxRadius) + 1) * 50;
  const camZ = ((position[2] / maxRadius) + 1) * 50;

  const planetRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  React.useEffect(() => {
    let animationFrameId: number;

    const updatePositions = () => {
      planetRefs.current.forEach((el, id) => {
        const pos = languagePositions.get(id);
        if (pos) {
          const left = ((pos[0] / maxRadius) + 1) * 50;
          const top = ((pos[2] / maxRadius) + 1) * 50;
          el.style.left = `${left}%`;
          el.style.top = `${top}%`;
        }
      });
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => cancelAnimationFrame(animationFrameId);
  }, [maxRadius]); // Added maxRadius to dependency array

  return (
    <div className="pointer-events-auto mt-4 flex flex-col gap-3">
      <div
        className="relative bg-black/40 border border-white/10 rounded-xl overflow-hidden cursor-crosshair backdrop-blur-md shadow-lg"
        style={{ width: MAP_SIZE, height: MAP_SIZE }}
        onClick={handleMapClick}
      >
        <svg
          ref={svgRef}
          width={MAP_SIZE}
          height={MAP_SIZE}
          className="transform -rotate-90 pointer-events-none"
        >
          {/* Background circle */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={CENTER - 2}
            fill="rgba(0,0,0,0.5)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Center marker (Sun/Timeline Start) */}
          <circle cx={CENTER} cy={CENTER} r="3" fill="#fbbf24" />

          {/* Orbits rendering removed based on user request */}

          {/* Planets */}
          {filteredLanguages.map(lang => {
            const pos = languagePositions.get(lang.id);
            if (!pos) return null;

            const isSelected = selectedLanguage?.id === lang.id;
            const isHovered = hoveredLanguage?.id === lang.id;

            const r = Math.sqrt(pos[0] * pos[0] + pos[2] * pos[2]);
            const scaledR = (r / maxRadius) * (CENTER - 10);

            // Calculate angle from position (accounting for SVG rotation)
            const angle = Math.atan2(pos[2], pos[0]);
            const x = CENTER + Math.cos(angle) * scaledR;
            const y = CENTER + Math.sin(angle) * scaledR;

            return (
              <g key={`planet-${lang.id}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 4 : isHovered ? 3 : 2}
                  fill={isSelected ? '#818cf8' : isHovered ? '#fff' : '#4b5563'}
                  className="transition-all duration-300 pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredLanguage(lang)}
                  onMouseLeave={() => setHoveredLanguage(null)}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    if (setCameraTarget) { // Assuming setCameraTarget is defined or available
                      setCameraTarget([pos[0], pos[1], pos[2]]);
                    }
                  }}
                />

                {/* Highlight ring for selected */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Camera Position Indicator */}
          {position && (() => {
            const r = Math.sqrt(position[0] * position[0] + position[2] * position[2]);
            const scaledR = (r / maxRadius) * (CENTER - 10);
            const angle = Math.atan2(position[2], position[0]);
            const x = CENTER + Math.cos(angle) * scaledR;
            const y = CENTER + Math.sin(angle) * scaledR;

            return (
              <path
                d={`M ${x - 3} ${y + 3} L ${x} ${y - 4} L ${x + 3} ${y + 3} Z`}
                fill="#fbbf24"
                className="transition-all duration-200"
                style={{
                  transformOrigin: `${x}px ${y}px`,
                  transform: `rotate(${Math.atan2(position[0], position[2]) * 180 / Math.PI}deg)`
                }}
              />
            );
          })()}
        </svg>
      </div>

      {/* Visibility Toggles */}
      <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/10 backdrop-blur-md shadow-lg w-[200px]">
        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className={`p-1.5 rounded-lg transition-colors ${showOrbits ? 'bg-indigo-500/30 text-indigo-300' : 'text-gray-500 hover:bg-white/5'}`}
          title="Toggle Orbits"
        >
          <Orbit size={18} />
        </button>
        <button
          onClick={() => setShowNames(!showNames)}
          className={`p-1.5 rounded-lg transition-colors ${showNames ? 'bg-indigo-500/30 text-indigo-300' : 'text-gray-500 hover:bg-white/5'}`}
          title="Toggle Names"
        >
          <Type size={18} />
        </button>
        <button
          onClick={() => setShowConnections(!showConnections)}
          className={`p-1.5 rounded-lg transition-colors ${showConnections ? 'bg-indigo-500/30 text-indigo-300' : 'text-gray-500 hover:bg-white/5'}`}
          title="Toggle Connections"
        >
          <Link size={18} />
        </button>
        <button
          onClick={() => setShowMoons(!showMoons)}
          className={`p-1.5 rounded-lg transition-colors ${showMoons ? 'bg-indigo-500/30 text-indigo-300' : 'text-gray-500 hover:bg-white/5'}`}
          title="Toggle Moons"
        >
          <Moon size={18} />
        </button>
      </div>

      {/* Legends */}
      <div className="flex flex-col gap-3 text-xs text-gray-400 bg-black/40 p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-lg w-[200px]">
        <div className="flex gap-6">
          {/* Color Legend */}
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-semibold text-gray-300 mb-1">Docs</span>
            <div
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${docsFilter === 'Good' ? 'text-white font-bold' : ''}`}
              onClick={() => handleFilterChange(setDocsFilter, docsFilter === 'Good' ? null : 'Good')}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ccff]"></div>
              <span>Good</span>
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${docsFilter === 'Avg' ? 'text-white font-bold' : ''}`}
              onClick={() => handleFilterChange(setDocsFilter, docsFilter === 'Avg' ? null : 'Avg')}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#806680]"></div>
              <span>Avg</span>
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${docsFilter === 'Poor' ? 'text-white font-bold' : ''}`}
              onClick={() => handleFilterChange(setDocsFilter, docsFilter === 'Poor' ? null : 'Poor')}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff0000]"></div>
              <span>Poor</span>
            </div>
          </div>

          {/* Size Legend */}
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-semibold text-gray-300 mb-1">Usage</span>
            <div
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${usageFilter === 'High' ? 'text-white font-bold' : ''}`}
              onClick={() => handleFilterChange(setUsageFilter, usageFilter === 'High' ? null : 'High')}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-gray-400 bg-white/10"></div>
              <span>High</span>
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${usageFilter === 'Med' ? 'text-white font-bold' : ''}`}
              onClick={() => handleFilterChange(setUsageFilter, usageFilter === 'Med' ? null : 'Med')}
            >
              <div className="w-2.5 h-2.5 rounded-full border border-gray-400 bg-white/10"></div>
              <span>Med</span>
            </div>
            <div
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${usageFilter === 'Low' ? 'text-white font-bold' : ''}`}
              onClick={() => handleFilterChange(setUsageFilter, usageFilter === 'Low' ? null : 'Low')}
            >
              <div className="w-1.5 h-1.5 rounded-full border border-gray-400 bg-white/10"></div>
              <span>Low</span>
            </div>
          </div>
        </div>

        {/* Category Legend */}
        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
          <span className="font-semibold text-gray-300 mb-1">Categories (Inclination)</span>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Imperative' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Imperative' ? null : 'Imperative')}
          >
            <div className="w-2 h-0.5 bg-white/50 rotate-0"></div>
            <span>Imperative (0°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Declarative' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Declarative' ? null : 'Declarative')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[10deg]"></div>
            <span>Declarative (10°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Procedural' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Procedural' ? null : 'Procedural')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[20deg]"></div>
            <span>Procedural (20°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Structured' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Structured' ? null : 'Structured')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[30deg]"></div>
            <span>Structured (30°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Object-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Object-Oriented' ? null : 'Object-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[40deg]"></div>
            <span>Object-Oriented (40°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Functional' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Functional' ? null : 'Functional')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[50deg]"></div>
            <span>Functional (50°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Logical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Logical' ? null : 'Logical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[60deg]"></div>
            <span>Logical (60°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Reactive' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Reactive' ? null : 'Reactive')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[70deg]"></div>
            <span>Reactive (70°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Event-Driven' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Event-Driven' ? null : 'Event-Driven')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[80deg]"></div>
            <span>Event-Driven (80°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Generic' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Generic' ? null : 'Generic')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-90"></div>
            <span>Generic (90°)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
