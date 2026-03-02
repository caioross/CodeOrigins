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
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Agent-Based' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Agent-Based' ? null : 'Agent-Based')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[0deg]"></div>
            <span>Agent-Based (0°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Agent-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Agent-Oriented' ? null : 'Agent-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[2.37deg]"></div>
            <span>Agent-Oriented (2.37°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Analytical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Analytical' ? null : 'Analytical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[4.74deg]"></div>
            <span>Analytical (4.74°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Array' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Array' ? null : 'Array')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[7.11deg]"></div>
            <span>Array (7.11°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Array-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Array-Oriented' ? null : 'Array-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[9.47deg]"></div>
            <span>Array-Oriented (9.47°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Aspect-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Aspect-Oriented' ? null : 'Aspect-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[14.21deg]"></div>
            <span>Aspect-Oriented (14.21°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Assembly' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Assembly' ? null : 'Assembly')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[16.58deg]"></div>
            <span>Assembly (16.58°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Asynchronous' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Asynchronous' ? null : 'Asynchronous')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[18.95deg]"></div>
            <span>Asynchronous (18.95°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Business Process Management' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Business Process Management' ? null : 'Business Process Management')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[21.32deg]"></div>
            <span>Business Process Management (21.32°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Cloud Storage' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Cloud Storage' ? null : 'Cloud Storage')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[23.68deg]"></div>
            <span>Cloud Storage (23.68°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Compiled' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Compiled' ? null : 'Compiled')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[26.05deg]"></div>
            <span>Compiled (26.05°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Component-Based' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Component-Based' ? null : 'Component-Based')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[28.42deg]"></div>
            <span>Component-Based (28.42°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Concurrent' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Concurrent' ? null : 'Concurrent')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[30.79deg]"></div>
            <span>Concurrent (30.79°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Constraint Logic Programming' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Constraint Logic Programming' ? null : 'Constraint Logic Programming')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[33.16deg]"></div>
            <span>Constraint Logic Programming (33.16°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Constraint Programming' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Constraint Programming' ? null : 'Constraint Programming')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[35.53deg]"></div>
            <span>Constraint Programming (35.53°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Context-Sensitive' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Context-Sensitive' ? null : 'Context-Sensitive')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[37.89deg]"></div>
            <span>Context-Sensitive (37.89°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Creative' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Creative' ? null : 'Creative')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[40.26deg]"></div>
            <span>Creative (40.26°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Declarative' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Declarative' ? null : 'Declarative')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[42.63deg]"></div>
            <span>Declarative (42.63°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Dynamic' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Dynamic' ? null : 'Dynamic')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[45deg]"></div>
            <span>Dynamic (45°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Educational' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Educational' ? null : 'Educational')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[47.37deg]"></div>
            <span>Educational (47.37°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Esoteric' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Esoteric' ? null : 'Esoteric')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[49.74deg]"></div>
            <span>Esoteric (49.74°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Event-Driven' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Event-Driven' ? null : 'Event-Driven')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[52.11deg]"></div>
            <span>Event-Driven (52.11°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Evolutionary' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Evolutionary' ? null : 'Evolutionary')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[54.47deg]"></div>
            <span>Evolutionary (54.47°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Formal' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Formal' ? null : 'Formal')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[56.84deg]"></div>
            <span>Formal (56.84°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Formal Methods' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Formal Methods' ? null : 'Formal Methods')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[59.21deg]"></div>
            <span>Formal Methods (59.21°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Functional' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Functional' ? null : 'Functional')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[61.58deg]"></div>
            <span>Functional (61.58°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'FunctionalReactive' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'FunctionalReactive' ? null : 'FunctionalReactive')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[63.95deg]"></div>
            <span>FunctionalReactive (63.95°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Generic' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Generic' ? null : 'Generic')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[66.32deg]"></div>
            <span>Generic (66.32°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Graph' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Graph' ? null : 'Graph')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[68.68deg]"></div>
            <span>Graph (68.68°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Graphics' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Graphics' ? null : 'Graphics')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[71.05deg]"></div>
            <span>Graphics (71.05°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Hardware' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Hardware' ? null : 'Hardware')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[73.42deg]"></div>
            <span>Hardware (73.42°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Hardware Description' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Hardware Description' ? null : 'Hardware Description')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[75.79deg]"></div>
            <span>Hardware Description (75.79°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'High-Performance' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'High-Performance' ? null : 'High-Performance')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[78.16deg]"></div>
            <span>High-Performance (78.16°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Imperative' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Imperative' ? null : 'Imperative')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[80.53deg]"></div>
            <span>Imperative (80.53°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Interpreted' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Interpreted' ? null : 'Interpreted')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[82.89deg]"></div>
            <span>Interpreted (82.89°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Lisp' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Lisp' ? null : 'Lisp')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[85.26deg]"></div>
            <span>Lisp (85.26°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Logic' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Logic' ? null : 'Logic')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[87.63deg]"></div>
            <span>Logic (87.63°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Logical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Logical' ? null : 'Logical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[90deg]"></div>
            <span>Logical (90°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'LogicalReactive' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'LogicalReactive' ? null : 'LogicalReactive')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[92.37deg]"></div>
            <span>LogicalReactive (92.37°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Low-Level' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Low-Level' ? null : 'Low-Level')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[94.74deg]"></div>
            <span>Low-Level (94.74°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Mathematical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Mathematical' ? null : 'Mathematical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[97.11deg]"></div>
            <span>Mathematical (97.11°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Meta-Programming' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Meta-Programming' ? null : 'Meta-Programming')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[99.47deg]"></div>
            <span>Meta-Programming (99.47°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Minimalist' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Minimalist' ? null : 'Minimalist')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[101.84deg]"></div>
            <span>Minimalist (101.84°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Model-Based' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Model-Based' ? null : 'Model-Based')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[104.21deg]"></div>
            <span>Model-Based (104.21°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Multi-Paradigm' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Multi-Paradigm' ? null : 'Multi-Paradigm')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[106.58deg]"></div>
            <span>Multi-Paradigm (106.58°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Network' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Network' ? null : 'Network')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[108.95deg]"></div>
            <span>Network (108.95°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Numerical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Numerical' ? null : 'Numerical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[111.32deg]"></div>
            <span>Numerical (111.32°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Object-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Object-Oriented' ? null : 'Object-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[113.68deg]"></div>
            <span>Object-Oriented (113.68°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Parallel' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Parallel' ? null : 'Parallel')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[116.05deg]"></div>
            <span>Parallel (116.05°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Performance-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Performance-Oriented' ? null : 'Performance-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[118.42deg]"></div>
            <span>Performance-Oriented (118.42°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Procedural' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Procedural' ? null : 'Procedural')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[120.79deg]"></div>
            <span>Procedural (120.79°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Quantum' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Quantum' ? null : 'Quantum')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[123.16deg]"></div>
            <span>Quantum (123.16°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'QuantumComputing' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'QuantumComputing' ? null : 'QuantumComputing')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[125.53deg]"></div>
            <span>QuantumComputing (125.53°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Reactive' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Reactive' ? null : 'Reactive')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[127.89deg]"></div>
            <span>Reactive (127.89°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Real-Time' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Real-Time' ? null : 'Real-Time')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[130.26deg]"></div>
            <span>Real-Time (130.26°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Rule-Based' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Rule-Based' ? null : 'Rule-Based')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[132.63deg]"></div>
            <span>Rule-Based (132.63°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Scientific' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Scientific' ? null : 'Scientific')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[135deg]"></div>
            <span>Scientific (135°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Scripting' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Scripting' ? null : 'Scripting')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[137.37deg]"></div>
            <span>Scripting (137.37°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Service-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Service-Oriented' ? null : 'Service-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[139.74deg]"></div>
            <span>Service-Oriented (139.74°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Specialized' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Specialized' ? null : 'Specialized')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[142.11deg]"></div>
            <span>Specialized (142.11°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Stack-Based' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Stack-Based' ? null : 'Stack-Based')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[144.47deg]"></div>
            <span>Stack-Based (144.47°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Static Site Generator' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Static Site Generator' ? null : 'Static Site Generator')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[149.21deg]"></div>
            <span>Static Site Generator (149.21°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Statistical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Statistical' ? null : 'Statistical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[151.58deg]"></div>
            <span>Statistical (151.58°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'String-Oriented' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'String-Oriented' ? null : 'String-Oriented')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[153.95deg]"></div>
            <span>String-Oriented (153.95°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Structured' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Structured' ? null : 'Structured')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[156.32deg]"></div>
            <span>Structured (156.32°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Symbolic' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Symbolic' ? null : 'Symbolic')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[158.68deg]"></div>
            <span>Symbolic (158.68°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Synchronous' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Synchronous' ? null : 'Synchronous')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[161.05deg]"></div>
            <span>Synchronous (161.05°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Systems' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Systems' ? null : 'Systems')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[163.42deg]"></div>
            <span>Systems (163.42°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Template' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Template' ? null : 'Template')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[165.79deg]"></div>
            <span>Template (165.79°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Text Editor' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Text Editor' ? null : 'Text Editor')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[168.16deg]"></div>
            <span>Text Editor (168.16°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Theoretical' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Theoretical' ? null : 'Theoretical')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[170.53deg]"></div>
            <span>Theoretical (170.53°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Transformational' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Transformational' ? null : 'Transformational')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[172.89deg]"></div>
            <span>Transformational (172.89°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Visual' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Visual' ? null : 'Visual')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[175.26deg]"></div>
            <span>Visual (175.26°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Visual Programming' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Visual Programming' ? null : 'Visual Programming')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[177.63deg]"></div>
            <span>Visual Programming (177.63°)</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${categoryFilter === 'Web Development' ? 'text-white font-bold' : ''}`}
            onClick={() => handleFilterChange(setCategoryFilter, categoryFilter === 'Web Development' ? null : 'Web Development')}
          >
            <div className="w-2 h-0.5 bg-white/50 -rotate-[180deg]"></div>
            <span>Web Development (180°)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
