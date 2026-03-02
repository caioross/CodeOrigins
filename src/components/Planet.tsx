import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../data/languages';
import { useStore } from '../store';
import { languagePositions, YEAR_SCALE, BASE_YEAR } from './SolarSystem';

interface PlanetProps {
  language: Language;
}

export function Planet({ language }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const { setSelectedLanguage, selectedLanguage, setHoveredLanguage, hoveredLanguage, showNames, showMoons, playbackSpeed } = useStore();

  const isSelected = selectedLanguage?.id === language.id;
  const isHovered = hoveredLanguage?.id === language.id;

  // Calculate size based on usage (0.1 to 1.0 -> 0.5 to 2.5)
  const size = 0.5 + language.usage * 2;

  // Calculate color based on docs (1 = Earth-like blue/green, 0 = Mars-like red/orange)
  const color = useMemo(() => {
    const earthColor = new THREE.Color('#2b82c9'); // Blue
    const marsColor = new THREE.Color('#c1440e'); // Red/Orange
    return marsColor.lerp(earthColor, language.docs || 0.5);
  }, [language.docs]);

  // Deterministic Y offset based on ID
  const randomY = useMemo(() => {
    return (((language.id.length % 10) / 10) - 0.5) * 2;
  }, [language.id]);

  // Use a local ref to track exact accumulated angle so that pausing/unpausing doesn't snap positions
  const currentAngleRef = useRef(((language.angle || 0) * Math.PI) / 180);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.5 * delta * playbackSpeed;
    }
    if (moonsRef.current) {
      moonsRef.current.rotation.y -= 1.0 * delta * playbackSpeed; // Moons orbit
    }

    if (groupRef.current) {
      const radius = Math.max(0, (language.year - BASE_YEAR) * YEAR_SCALE);

      // Speed from 1 to 100 -> map to angular velocity base
      // 100 -> fast, 1 -> slow
      const speedFactor = (language.speed || 50) / 100;

      // Calculate amount to move THIS frame based on delta time and playback speed
      const angularVelocity = speedFactor * 0.1;
      const angleDelta = angularVelocity * delta * playbackSpeed;

      // Accumulate the angle
      currentAngleRef.current += angleDelta;
      const currentAngleRad = currentAngleRef.current;

      const baseX = Math.cos(currentAngleRad) * radius;
      const baseZ = Math.sin(currentAngleRad) * radius;

      let inclinationDeg = 0;
      const category = (language.category || 'Generic').toLowerCase();

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

      const x = baseX;
      const y = -baseZ * Math.sin(inclinationRad) + randomY;
      const z = baseZ * Math.cos(inclinationRad);

      groupRef.current.position.set(x, y, z);

      // Update global map for Connections and Minimap
      languagePositions.set(language.id, [x, y, z]);
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedLanguage(language);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredLanguage(language);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredLanguage(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.1}
          emissive={isSelected || isHovered ? new THREE.Color('#ffffff') : new THREE.Color('#000000')}
          emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.1 : 0}
        />
      </Sphere>

      {/* Label */}
      {showNames && (
        <Billboard>
          <Text
            position={[0, size + 0.5, 0]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {language.name}
          </Text>
        </Billboard>
      )}

      {/* Moons */}
      {showMoons && (
        <group ref={moonsRef}>
          {language.moons.map((moon, index) => {
            const angle = (index / language.moons.length) * Math.PI * 2;
            const distance = size + 1 + moon.usage;
            const moonX = Math.cos(angle) * distance;
            const moonZ = Math.sin(angle) * distance;
            const moonSize = 0.2 + moon.usage * 0.3;

            return (
              <group key={moon.name} position={[moonX, 0, moonZ]}>
                <Sphere args={[moonSize, 16, 16]}>
                  <meshStandardMaterial color="#aaaaaa" roughness={0.9} />
                </Sphere>
                {showNames && (
                  <Billboard>
                    <Text
                      position={[0, moonSize + 0.3, 0]}
                      fontSize={0.4}
                      color="#dddddd"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {moon.name}
                    </Text>
                  </Billboard>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}
