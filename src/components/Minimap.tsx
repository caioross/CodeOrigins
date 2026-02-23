import React from 'react';
import { useCameraStore } from '../store';
import { allLanguages as languages } from '../data';
import { languagePositions } from './SolarSystem';

const MAP_SIZE = 200;
const MAX_RADIUS = 250; // Max distance from center in the 3D scene

export function Minimap() {
  const position = useCameraStore(state => state.position);
  const setTarget = useCameraStore(state => state.setTarget);
  
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const worldX = ((x / MAP_SIZE) * 2 - 1) * MAX_RADIUS;
    const worldZ = ((y / MAP_SIZE) * 2 - 1) * MAX_RADIUS;
    
    setTarget([worldX, 0, worldZ]);
  };

  const camX = ((position[0] / MAX_RADIUS) + 1) * 50;
  const camZ = ((position[2] / MAX_RADIUS) + 1) * 50;

  return (
    <div className="pointer-events-auto mt-4 flex flex-col gap-3">
      <div 
        className="relative bg-black/40 border border-white/10 rounded-xl overflow-hidden cursor-crosshair backdrop-blur-md shadow-lg"
        style={{ width: MAP_SIZE, height: MAP_SIZE }}
        onClick={handleMapClick}
      >
        {/* Sun */}
        <div 
          className="absolute w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,204,0,0.8)]"
          style={{ left: '50%', top: '50%' }}
        />

        {/* Planets */}
        {languages.map(lang => {
          const pos = languagePositions.get(lang.id);
          if (!pos) return null;
          const left = ((pos[0] / MAX_RADIUS) + 1) * 50;
          const top = ((pos[2] / MAX_RADIUS) + 1) * 50;
          
          return (
            <div 
              key={lang.id}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-60"
              style={{ left: `${left}%`, top: `${top}%` }}
              title={lang.name}
            />
          );
        })}
        
        {/* Camera Viewport / Position */}
        <div 
          className="absolute w-4 h-4 border-2 border-white rounded-sm transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-75 pointer-events-none"
          style={{ left: `${camX}%`, top: `${camZ}%` }}
        />
      </div>

      {/* Legends */}
      <div className="flex gap-6 text-xs text-gray-400 bg-black/40 p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-lg w-[200px]">
        {/* Color Legend */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="font-semibold text-gray-300 mb-1">Docs</span>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ccff]"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#806680]"></div>
            <span>Avg</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff0000]"></div>
            <span>Poor</span>
          </div>
        </div>

        {/* Size Legend */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="font-semibold text-gray-300 mb-1">Usage</span>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border border-gray-400 bg-white/10"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400 bg-white/10"></div>
            <span>Med</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full border border-gray-400 bg-white/10"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
