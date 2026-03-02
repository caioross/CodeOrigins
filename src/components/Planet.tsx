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

      if (category === 'agent-based') inclinationDeg = 0.0;
      else if (category === 'agent-oriented') inclinationDeg = 2.37;
      else if (category === 'analytical') inclinationDeg = 4.74;
      else if (category === 'array') inclinationDeg = 7.11;
      else if (category === 'array-oriented') inclinationDeg = 9.47;
      else if (category === 'array-oriented') inclinationDeg = 11.84;
      else if (category === 'aspect-oriented') inclinationDeg = 14.21;
      else if (category === 'assembly') inclinationDeg = 16.58;
      else if (category === 'asynchronous') inclinationDeg = 18.95;
      else if (category === 'business process management') inclinationDeg = 21.32;
      else if (category === 'cloud storage') inclinationDeg = 23.68;
      else if (category === 'compiled') inclinationDeg = 26.05;
      else if (category === 'component-based') inclinationDeg = 28.42;
      else if (category === 'concurrent') inclinationDeg = 30.79;
      else if (category === 'constraint logic programming') inclinationDeg = 33.16;
      else if (category === 'constraint programming') inclinationDeg = 35.53;
      else if (category === 'context-sensitive') inclinationDeg = 37.89;
      else if (category === 'creative') inclinationDeg = 40.26;
      else if (category === 'declarative') inclinationDeg = 42.63;
      else if (category === 'dynamic') inclinationDeg = 45.0;
      else if (category === 'educational') inclinationDeg = 47.37;
      else if (category === 'esoteric') inclinationDeg = 49.74;
      else if (category === 'event-driven') inclinationDeg = 52.11;
      else if (category === 'evolutionary') inclinationDeg = 54.47;
      else if (category === 'formal') inclinationDeg = 56.84;
      else if (category === 'formal methods') inclinationDeg = 59.21;
      else if (category === 'functional') inclinationDeg = 61.58;
      else if (category === 'functionalreactive') inclinationDeg = 63.95;
      else if (category === 'generic') inclinationDeg = 66.32;
      else if (category === 'graph') inclinationDeg = 68.68;
      else if (category === 'graphics') inclinationDeg = 71.05;
      else if (category === 'hardware') inclinationDeg = 73.42;
      else if (category === 'hardware description') inclinationDeg = 75.79;
      else if (category === 'high-performance') inclinationDeg = 78.16;
      else if (category === 'imperative') inclinationDeg = 80.53;
      else if (category === 'interpreted') inclinationDeg = 82.89;
      else if (category === 'lisp') inclinationDeg = 85.26;
      else if (category === 'logic') inclinationDeg = 87.63;
      else if (category === 'logical') inclinationDeg = 90.0;
      else if (category === 'logicalreactive') inclinationDeg = 92.37;
      else if (category === 'low-level') inclinationDeg = 94.74;
      else if (category === 'mathematical') inclinationDeg = 97.11;
      else if (category === 'meta-programming') inclinationDeg = 99.47;
      else if (category === 'minimalist') inclinationDeg = 101.84;
      else if (category === 'model-based') inclinationDeg = 104.21;
      else if (category === 'multi-paradigm') inclinationDeg = 106.58;
      else if (category === 'network') inclinationDeg = 108.95;
      else if (category === 'numerical') inclinationDeg = 111.32;
      else if (category === 'object-oriented') inclinationDeg = 113.68;
      else if (category === 'parallel') inclinationDeg = 116.05;
      else if (category === 'performance-oriented') inclinationDeg = 118.42;
      else if (category === 'procedural') inclinationDeg = 120.79;
      else if (category === 'quantum') inclinationDeg = 123.16;
      else if (category === 'quantumcomputing') inclinationDeg = 125.53;
      else if (category === 'reactive') inclinationDeg = 127.89;
      else if (category === 'real-time') inclinationDeg = 130.26;
      else if (category === 'rule-based') inclinationDeg = 132.63;
      else if (category === 'scientific') inclinationDeg = 135.0;
      else if (category === 'scripting') inclinationDeg = 137.37;
      else if (category === 'service-oriented') inclinationDeg = 139.74;
      else if (category === 'specialized') inclinationDeg = 142.11;
      else if (category === 'stack-based') inclinationDeg = 144.47;
      else if (category === 'stack-based') inclinationDeg = 146.84;
      else if (category === 'static site generator') inclinationDeg = 149.21;
      else if (category === 'statistical') inclinationDeg = 151.58;
      else if (category === 'string-oriented') inclinationDeg = 153.95;
      else if (category === 'structured') inclinationDeg = 156.32;
      else if (category === 'symbolic') inclinationDeg = 158.68;
      else if (category === 'synchronous') inclinationDeg = 161.05;
      else if (category === 'systems') inclinationDeg = 163.42;
      else if (category === 'template') inclinationDeg = 165.79;
      else if (category === 'text editor') inclinationDeg = 168.16;
      else if (category === 'theoretical') inclinationDeg = 170.53;
      else if (category === 'transformational') inclinationDeg = 172.89;
      else if (category === 'visual') inclinationDeg = 175.26;
      else if (category === 'visual programming') inclinationDeg = 177.63;
      else if (category === 'web development') inclinationDeg = 180.0;
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
