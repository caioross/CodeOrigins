import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../data/languages';
import { useStore } from '../store';

interface PlanetProps {
  language: Language;
  position: [number, number, number];
}

export function Planet({ language, position }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const { setSelectedLanguage, selectedLanguage, setHoveredLanguage, hoveredLanguage } = useStore();
  
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

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (moonsRef.current) {
      moonsRef.current.rotation.y -= 0.01; // Moons orbit
    }
  });

  return (
    <group position={position}>
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

      {/* Moons */}
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
              <Text
                position={[0, moonSize + 0.3, 0]}
                fontSize={0.4}
                color="#dddddd"
                anchorX="center"
                anchorY="middle"
              >
                {moon.name}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
}
