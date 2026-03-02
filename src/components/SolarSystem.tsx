import { useMemo, useEffect, useState } from 'react';
import { OrbitControls, Stars, Ring } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
// import { allLanguages as languages } from '../data';
import { Planet } from './Planet';
import { Connection } from './Connection';
import { Particles } from './Particles';
import { useStore, useCameraStore } from '../store';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Calculate positions for all languages
export const YEAR_SCALE = 6.0;
export const BASE_YEAR = 1950;

export const languagePositions = new Map<string, [number, number, number]>();

export const calculateLanguagePositions = (languages: any[]) => {
  languagePositions.clear();
  languages.forEach((lang) => {
    const radius = Math.max(0, (lang.year - BASE_YEAR) * YEAR_SCALE);
    const angleRad = ((lang.angle || 0) * Math.PI) / 180;

    // Base position on the XZ plane
    const baseX = Math.cos(angleRad) * radius;
    const baseZ = Math.sin(angleRad) * radius;

    // Inclination angle based on category
    let inclinationDeg = 0;
    const category = (lang.category || 'Generic').toLowerCase();

    if (category === 'Agent-Based') inclinationDeg = 0.0;
    else if (category === 'Agent-Oriented') inclinationDeg = 2.37;
    else if (category === 'Analytical') inclinationDeg = 4.74;
    else if (category === 'Array') inclinationDeg = 7.11;
    else if (category === 'Array-Oriented') inclinationDeg = 9.47;
    else if (category === 'Array-oriented') inclinationDeg = 11.84;
    else if (category === 'Aspect-Oriented') inclinationDeg = 14.21;
    else if (category === 'Assembly') inclinationDeg = 16.58;
    else if (category === 'Asynchronous') inclinationDeg = 18.95;
    else if (category === 'Business Process Management') inclinationDeg = 21.32;
    else if (category === 'Cloud Storage') inclinationDeg = 23.68;
    else if (category === 'Compiled') inclinationDeg = 26.05;
    else if (category === 'Component-Based') inclinationDeg = 28.42;
    else if (category === 'Concurrent') inclinationDeg = 30.79;
    else if (category === 'Constraint Logic Programming') inclinationDeg = 33.16;
    else if (category === 'Constraint Programming') inclinationDeg = 35.53;
    else if (category === 'Context-Sensitive') inclinationDeg = 37.89;
    else if (category === 'Creative') inclinationDeg = 40.26;
    else if (category === 'Declarative') inclinationDeg = 42.63;
    else if (category === 'Dynamic') inclinationDeg = 45.0;
    else if (category === 'Educational') inclinationDeg = 47.37;
    else if (category === 'Esoteric') inclinationDeg = 49.74;
    else if (category === 'Event-Driven') inclinationDeg = 52.11;
    else if (category === 'Evolutionary') inclinationDeg = 54.47;
    else if (category === 'Formal') inclinationDeg = 56.84;
    else if (category === 'Formal Methods') inclinationDeg = 59.21;
    else if (category === 'Functional') inclinationDeg = 61.58;
    else if (category === 'FunctionalReactive') inclinationDeg = 63.95;
    else if (category === 'Generic') inclinationDeg = 66.32;
    else if (category === 'Graph') inclinationDeg = 68.68;
    else if (category === 'Graphics') inclinationDeg = 71.05;
    else if (category === 'Hardware') inclinationDeg = 73.42;
    else if (category === 'Hardware Description') inclinationDeg = 75.79;
    else if (category === 'High-Performance') inclinationDeg = 78.16;
    else if (category === 'Imperative') inclinationDeg = 80.53;
    else if (category === 'Interpreted') inclinationDeg = 82.89;
    else if (category === 'Lisp') inclinationDeg = 85.26;
    else if (category === 'Logic') inclinationDeg = 87.63;
    else if (category === 'Logical') inclinationDeg = 90.0;
    else if (category === 'LogicalReactive') inclinationDeg = 92.37;
    else if (category === 'Low-Level') inclinationDeg = 94.74;
    else if (category === 'Mathematical') inclinationDeg = 97.11;
    else if (category === 'Meta-Programming') inclinationDeg = 99.47;
    else if (category === 'Minimalist') inclinationDeg = 101.84;
    else if (category === 'Model-Based') inclinationDeg = 104.21;
    else if (category === 'Multi-Paradigm') inclinationDeg = 106.58;
    else if (category === 'Network') inclinationDeg = 108.95;
    else if (category === 'Numerical') inclinationDeg = 111.32;
    else if (category === 'Object-Oriented') inclinationDeg = 113.68;
    else if (category === 'Parallel') inclinationDeg = 116.05;
    else if (category === 'Performance-Oriented') inclinationDeg = 118.42;
    else if (category === 'Procedural') inclinationDeg = 120.79;
    else if (category === 'Quantum') inclinationDeg = 123.16;
    else if (category === 'QuantumComputing') inclinationDeg = 125.53;
    else if (category === 'Reactive') inclinationDeg = 127.89;
    else if (category === 'Real-Time') inclinationDeg = 130.26;
    else if (category === 'Rule-Based') inclinationDeg = 132.63;
    else if (category === 'Scientific') inclinationDeg = 135.0;
    else if (category === 'Scripting') inclinationDeg = 137.37;
    else if (category === 'Service-Oriented') inclinationDeg = 139.74;
    else if (category === 'Specialized') inclinationDeg = 142.11;
    else if (category === 'Stack-Based') inclinationDeg = 144.47;
    else if (category === 'Stack-based') inclinationDeg = 146.84;
    else if (category === 'Static Site Generator') inclinationDeg = 149.21;
    else if (category === 'Statistical') inclinationDeg = 151.58;
    else if (category === 'String-Oriented') inclinationDeg = 153.95;
    else if (category === 'Structured') inclinationDeg = 156.32;
    else if (category === 'Symbolic') inclinationDeg = 158.68;
    else if (category === 'Synchronous') inclinationDeg = 161.05;
    else if (category === 'Systems') inclinationDeg = 163.42;
    else if (category === 'Template') inclinationDeg = 165.79;
    else if (category === 'Text Editor') inclinationDeg = 168.16;
    else if (category === 'Theoretical') inclinationDeg = 170.53;
    else if (category === 'Transformational') inclinationDeg = 172.89;
    else if (category === 'Visual') inclinationDeg = 175.26;
    else if (category === 'Visual Programming') inclinationDeg = 177.63;
    else if (category === 'Web Development') inclinationDeg = 180.0;
    else inclinationDeg = 0;

    const inclinationRad = (inclinationDeg * Math.PI) / 180;

    // Translate slightly on Y instead of purely random so it's deterministic but scattered
    const y = -baseZ * Math.sin(inclinationRad) + (((lang.id.length % 10) / 10) - 0.5) * 2;
    const x = baseX;
    const z = baseZ * Math.cos(inclinationRad);

    languagePositions.set(lang.id, [x, y, z]);
  });
};

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
    languages,
    selectedLanguage, hoveredLanguage,
    showOrbits, showConnections,
    docsFilter, usageFilter, categoryFilter,
    yearRange
  } = useStore();

  useEffect(() => {
    calculateLanguagePositions(languages);
  }, [languages]);

  const filteredLanguages = useMemo(() => {
    return languages.filter(lang => {
      const minFilter = yearRange[0] <= 1700 ? -Infinity : yearRange[0];
      if (lang.year < minFilter || lang.year > yearRange[1]) {
        return false;
      }
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
  }, [languages, docsFilter, usageFilter, categoryFilter, yearRange]);

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
  }, [languages]);

  return (
    <>
      <CameraController />
      <Particles />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={100} decay={2} />
      <directionalLight position={[10, 20, 10]} intensity={1} />

      <Stars radius={1000} depth={500} count={10000} factor={4} saturation={0} fade speed={1} />

      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={1200}
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
