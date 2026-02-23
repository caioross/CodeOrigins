import { useMemo, useEffect, useState } from 'react';
import { OrbitControls, Stars, Ring, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { allLanguages as languages } from '../data';
import { Planet } from './Planet';
import { Connection } from './Connection';
import { Particles } from './Particles';
import { useStore } from '../store';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Calculate positions for all languages
const YEAR_SCALE = 3.0;
const BASE_YEAR = 1950;

export const languagePositions = new Map<string, [number, number, number]>();

languages.forEach((lang) => {
  const radius = Math.max(0, (lang.year - BASE_YEAR) * YEAR_SCALE);
  const angleRad = (lang.angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * radius;
  const z = Math.sin(angleRad) * radius;
  // Add a slight random Y offset to avoid perfect flatness
  const y = (Math.random() - 0.5) * 2;
  languagePositions.set(lang.id, [x, y, z]);
});

function CameraController() {
  const { selectedLanguage } = useStore();
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const [targetPos, setTargetPos] = useState<THREE.Vector3 | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (selectedLanguage) {
      const pos = languagePositions.get(selectedLanguage.id);
      if (pos) {
        setTargetPos(new THREE.Vector3(...pos));
        setAnimating(true);
      }
    }
  }, [selectedLanguage]);

  useFrame(() => {
    if (animating && targetPos && controls) {
      // Disable user controls during animation to prevent fighting
      controls.enabled = false;
      
      controls.target.lerp(targetPos, 0.05);
      
      const desiredCamPos = targetPos.clone().add(new THREE.Vector3(5, 5, 12));
      camera.position.lerp(desiredCamPos, 0.05);
      
      controls.update();
      
      // Check if we're close enough to the target
      if (controls.target.distanceTo(targetPos) < 0.1 && camera.position.distanceTo(desiredCamPos) < 0.1) {
        // Snap to exact position to finish animation cleanly
        controls.target.copy(targetPos);
        camera.position.copy(desiredCamPos);
        controls.update();
        
        // Re-enable user controls
        setAnimating(false);
        controls.enabled = true;
      }
    }
  });

  return null;
}

export function SolarSystem() {
  const { selectedLanguage, hoveredLanguage } = useStore();

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

      {/* Orbit Rings */}
      {orbits.map((orbit, index) => {
        if (orbit.radius <= 0) return null;
        
        // Stagger the labels so they don't overlap as much
        const labelAngle = (index * Math.PI) / 4; 
        const labelX = Math.cos(labelAngle) * orbit.radius;
        const labelZ = Math.sin(labelAngle) * orbit.radius;

        return (
          <group key={orbit.year}>
            {/* The main orbit line */}
            <Ring args={[orbit.radius, orbit.radius + 0.1, 64]} rotation={[-Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
            </Ring>
            
            {/* The gap fill to show time passed */}
            {orbit.gap > 0 && orbit.prevRadius > 0 && (
              <Ring args={[orbit.prevRadius, orbit.radius, 64]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#446688" transparent opacity={0.03} side={THREE.DoubleSide} />
              </Ring>
            )}

            {/* Year Label */}
            <Text
              position={[labelX, 0, labelZ]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.2}
              color="#aaaaaa"
              anchorX="center"
              anchorY="bottom"
              opacity={0.6}
            >
              {orbit.year} {orbit.gap > 0 ? `(+${orbit.gap}y)` : ''}
            </Text>
          </group>
        );
      })}

      {/* Planets */}
      {languages.map((lang) => (
        <Planet 
          key={lang.id} 
          language={lang} 
          position={languagePositions.get(lang.id)!} 
        />
      ))}

      {/* Connections */}
      {languages.map((lang) => {
        return lang.parents.map((parentId) => {
          const parent = languages.find(l => l.id === parentId);
          if (!parent) return null;
          
          const startPos = languagePositions.get(parentId)!;
          const endPos = languagePositions.get(lang.id)!;
          
          const isHighlighted = 
            selectedLanguage?.id === lang.id || 
            selectedLanguage?.id === parentId ||
            hoveredLanguage?.id === lang.id ||
            hoveredLanguage?.id === parentId;

          return (
            <Connection 
              key={`${parentId}-${lang.id}`}
              start={startPos}
              end={endPos}
              strength={lang.usage * parent.usage} // Arbitrary strength
              isHighlighted={isHighlighted}
            />
          );
        });
      })}
    </>
  );
}
