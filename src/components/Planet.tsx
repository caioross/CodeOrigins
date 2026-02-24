import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
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
  const { setSelectedLanguage, selectedLanguage, setHoveredLanguage, hoveredLanguage, showNames, showMoons } = useStore();
  
  const isSelected = selectedLanguage?.id === language.id;
  const isHovered = hoveredLanguage?.id === language.id;
  
  // Calculate size based on usage (0.1 to 1.0 -> 0.5 to 2.5)
  const size = 0.5 + language.usage * 2;
  
  // Calculate color based on docs (1 = Earth-like blue/green, 0 = Mars-like red/orange)
  const color = useMemo(() => {
    const earthColor = new THREE.Color('#2b82c9'); // Blue
    const marsColor = new THREE.Color('#c1440e'); // Red/Orange
    return marsColor.lerp(earthColor, language.docs);
  }, [language.docs]);

  // Initial random Y offset
  const randomY = useMemo(() => (Math.random() - 0.5) * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (moonsRef.current) {
      moonsRef.current.rotation.y -= 0.01; // Moons orbit
    }
    
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const radius = Math.max(0, (language.year - BASE_YEAR) * YEAR_SCALE);
      
      // Speed from 1 to 100 -> map to angular velocity
      // 100 -> fast, 1 -> slow
      const speedFactor = (language.speed || 50) / 100;
      const angularVelocity = speedFactor * 0.1; // Adjust multiplier for overall speed
      
      const currentAngleRad = (language.angle * Math.PI) / 180 + time * angularVelocity;
      
      const baseX = Math.cos(currentAngleRad) * radius;
      const baseZ = Math.sin(currentAngleRad) * radius;
      
      let inclinationDeg = 0;
      const category = (language.category || 'Generic').toLowerCase();
      
      if (category === 'imperative') inclinationDeg = 0;
      else if (category === 'declarative') inclinationDeg = 10;
      else if (category === 'procedural') inclinationDeg = 20;
      else if (category === 'structured') inclinationDeg = 30;
      else if (category === 'object-oriented') inclinationDeg = 40;
      else if (category === 'functional') inclinationDeg = 50;
      else if (category === 'logical') inclinationDeg = 60;
      else if (category === 'reactive') inclinationDeg = 70;
      else if (category === 'event-driven') inclinationDeg = 80;
      else if (category === 'generic') inclinationDeg = 90;
      
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
                  <Text
                    position={[0, moonSize + 0.3, 0]}
                    fontSize={0.4}
                    color="#dddddd"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {moon.name}
                  </Text>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}
