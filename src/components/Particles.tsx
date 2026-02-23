import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { languagePositions } from './SolarSystem';

export function Particles() {
  const { selectedLanguage } = useStore();
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(9999, 9999, 9999), // Start hidden
        life: Math.random(),
        speed: 0.01 + Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        radius: 1.5 + Math.random() * 4,
        yOffset: (Math.random() - 0.5) * 3,
        orbitSpeed: (Math.random() - 0.5) * 0.05,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;

    const targetPos = selectedLanguage 
      ? languagePositions.get(selectedLanguage.id) 
      : null;

    particles.forEach((particle, i) => {
      if (targetPos) {
        // Orbit around the selected planet
        particle.angle += particle.orbitSpeed;
        
        const x = targetPos[0] + Math.cos(particle.angle) * particle.radius;
        const z = targetPos[2] + Math.sin(particle.angle) * particle.radius;
        const y = targetPos[1] + particle.yOffset + Math.sin(particle.angle * 3) * 0.5;

        // If particle is far away (just initialized or switched planet), snap it closer
        const targetVec = new THREE.Vector3(x, y, z);
        if (particle.position.distanceTo(targetVec) > 20) {
          particle.position.copy(targetVec);
        } else {
          // Smoothly move to target position
          particle.position.lerp(targetVec, 0.1);
        }
        
        particle.life -= particle.speed;
        if (particle.life <= 0) {
          particle.life = 1;
          particle.position.copy(targetVec); // Reset to exact position on rebirth
        }

        dummy.position.copy(particle.position);
        // Pulse size based on life
        const scale = Math.sin(particle.life * Math.PI) * 0.15;
        dummy.scale.set(scale, scale, scale);
      } else {
        // Hide
        dummy.position.set(9999, 9999, 9999);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial 
        color="#818cf8" 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false}
      />
    </instancedMesh>
  );
}
