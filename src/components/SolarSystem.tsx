import { useMemo, useEffect, useState } from 'react';
import { OrbitControls, Stars, Ring } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { allLanguages as languages } from '../data';
import { Planet } from './Planet';
import { Connection } from './Connection';
import { Particles } from './Particles';
import { useStore, useCameraStore } from '../store';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Calculate positions for all languages
export const YEAR_SCALE = 3.0;
export const BASE_YEAR = 1950;

export const languagePositions = new Map<string, [number, number, number]>();

languages.forEach((lang) => {
  const radius = Math.max(0, (lang.year - BASE_YEAR) * YEAR_SCALE);
  const angleRad = (lang.angle * Math.PI) / 180;
  
  // Base position on the XZ plane
  const baseX = Math.cos(angleRad) * radius;
  const baseZ = Math.sin(angleRad) * radius;
  
  // Inclination angle based on category
  let inclinationDeg = 0;
  const category = (lang.category || 'Generic').toLowerCase();
  
  if (category === 'imperative') inclinationDeg = 0;
  else if (category === 'declarative') inclinationDeg = 10;
  else if (category === 'procedural') inclinationDeg = 20;
  else if (category === 'structured') inclinationDeg = 30;
  else if (category === 'object-oriented (oop)') inclinationDeg = 40;
  else if (category === 'functional') inclinationDeg = 50;
  else if (category === 'logical') inclinationDeg = 60;
  else if (category === 'reactive') inclinationDeg = 70;
  else if (category === 'event-driven') inclinationDeg = 80;
  else if (category === 'generic') inclinationDeg = 90;
  
  const inclinationRad = (inclinationDeg * Math.PI) / 180;
  
  // Rotate around X axis
  const x = baseX;
  const y = -baseZ * Math.sin(inclinationRad) + (Math.random() - 0.5) * 2;
  const z = baseZ * Math.cos(inclinationRad);
  
  languagePositions.set(lang.id, [x, y, z]);
});

function CameraController() {
  const { selectedLanguage, setSelectedLanguage } = useStore();
  const { target: mapTarget, setTarget: setMapTarget } = useCameraStore();
  const { camera, gl } = useThree();
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const [isAnimating, setIsAnimating] = useState(false);

  // Track the ID of the language we are animating towards
  const [animationTargetId, setAnimationTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLanguage) {
      setIsAnimating(true);
      setAnimationTargetId(selectedLanguage.id);
      setMapTarget(null);
    } else if (!mapTarget) {
      setIsAnimating(false);
      setAnimationTargetId(null);
    }
  }, [selectedLanguage, setMapTarget]);

  useEffect(() => {
    if (mapTarget) {
      setIsAnimating(true);
      // We don't have a language ID for map targets, so we can use a special value
      setAnimationTargetId('map_target'); 
    } else if (!selectedLanguage) {
      setIsAnimating(false);
      setAnimationTargetId(null);
    }
  }, [mapTarget]);

  // Effect to handle user interruption
  useEffect(() => {
    const onInteraction = () => {
      if (isAnimating) {
        setIsAnimating(false);
        setAnimationTargetId(null);
        setSelectedLanguage(null);
        setMapTarget(null);
      }
    };

    const domElement = gl.domElement;
    domElement.addEventListener('pointerdown', onInteraction);
    domElement.addEventListener('wheel', onInteraction);

    return () => {
      domElement.removeEventListener('pointerdown', onInteraction);
      domElement.removeEventListener('wheel', onInteraction);
    };
  }, [isAnimating, gl.domElement, setSelectedLanguage, setMapTarget]);

  useFrame(() => {
    useCameraStore.getState().setPosition([camera.position.x, camera.position.y, camera.position.z]);

    if (isAnimating && controls) {
      let currentTargetPos: THREE.Vector3 | undefined;

      if (animationTargetId === 'map_target' && mapTarget) {
        currentTargetPos = new THREE.Vector3(...mapTarget);
      } else if (animationTargetId) {
        const posArray = languagePositions.get(animationTargetId);
        if (posArray) {
          currentTargetPos = new THREE.Vector3(...posArray);
        }
      }

      if (currentTargetPos) {
        controls.enabled = false;
        controls.target.lerp(currentTargetPos, 0.05);

        const desiredCamPos = currentTargetPos.clone().add(new THREE.Vector3(5, 5, 12));
        camera.position.lerp(desiredCamPos, 0.05);

        controls.update();

        if (controls.target.distanceTo(currentTargetPos) < 0.1 && camera.position.distanceTo(desiredCamPos) < 0.1) {
          controls.target.copy(currentTargetPos);
          camera.position.copy(desiredCamPos);
          controls.update();
          
          setIsAnimating(false);
          setAnimationTargetId(null);
          controls.enabled = true;
          if (mapTarget) setMapTarget(null);
        }
      } else {
        // Target position not found, stop animating
        setIsAnimating(false);
        setAnimationTargetId(null);
        controls.enabled = true;
      }
    } else if (controls) {
      controls.enabled = true;
    }
  });

  return null;
}

export function SolarSystem() {
  const { 
    selectedLanguage, hoveredLanguage, 
    showOrbits, showConnections,
    docsFilter, usageFilter, categoryFilter
  } = useStore();

  const filteredLanguages = useMemo(() => {
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
  }, [docsFilter, usageFilter, categoryFilter]);

  // Generate orbit rings
  const orbits = useMemo(() => {
    const years = Array.from(new Set(languages.map(l => l.year))).sort();
    return years.map((year, index) => {
      const radius = Math.max(0, (year - BASE_YEAR) * YEAR_SCALE);
      const prevYear = index > 0 ? years[index - 1] : BASE_YEAR;
      const prevRadius = Math.max(0, (prevYear - BASE_YEAR) * YEAR_SCALE);
      const gap = year - prevYear;
      return { year, radius, prevRadius, gap };
    });
  }, []);

  return (
    <>
      <CameraController />
      <Particles />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={100} decay={2} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <OrbitControls 
        makeDefault
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxDistance={400}
        minDistance={5}
      />

      {/* Central Sun (The Origin of Code) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ffcc00" />
        <pointLight intensity={2} distance={50} color="#ffcc00" />
      </mesh>

      {/* Orbit Rings for all 5 inclinations */}
      {showOrbits && orbits.map((orbit, index) => {
        if (orbit.radius <= 0) return null;
        
        // Stagger the labels so they don't overlap as much
        const labelAngle = (index * Math.PI) / 4; 
        
        const inclinations = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

        return (
          <group key={orbit.year}>
            {inclinations.map((inclinationDeg) => {
              const inclinationRad = (inclinationDeg * Math.PI) / 180;
              
              // Calculate label position based on inclination
              const baseX = Math.cos(labelAngle) * orbit.radius;
              const baseZ = Math.sin(labelAngle) * orbit.radius;
              
              const labelX = baseX;
              const labelY = -baseZ * Math.sin(inclinationRad);
              const labelZ = baseZ * Math.cos(inclinationRad);

              return (
                <group key={`${orbit.year}-${inclinationDeg}`}>
                  {/* The main orbit line */}
                  <Ring 
                    args={[orbit.radius, orbit.radius + 0.1, 64]} 
                    rotation={[-Math.PI / 2 + inclinationRad, 0, 0]}
                  >
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
                  </Ring>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* Planets */}
      {filteredLanguages.map((lang) => (
        <Planet 
          key={lang.id} 
          language={lang} 
        />
      ))}

      {/* Connections */}
      {showConnections && filteredLanguages.map((lang) => {
        return lang.parents.map((parentId) => {
          const parent = filteredLanguages.find(l => l.id === parentId);
          if (!parent) return null;
          
          const isHighlighted = 
            selectedLanguage?.id === lang.id || 
            selectedLanguage?.id === parentId ||
            hoveredLanguage?.id === lang.id ||
            hoveredLanguage?.id === parentId;

          return (
            <Connection 
              key={`${parentId}-${lang.id}`}
              startId={parentId}
              endId={lang.id}
              strength={lang.usage * parent.usage} // Arbitrary strength
              isHighlighted={isHighlighted}
            />
          );
        });
      })}
    </>
  );
}
