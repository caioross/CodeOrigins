import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { languagePositions } from './SolarSystem';

interface ConnectionProps {
  startId: string;
  endId: string;
  strength: number; // 0 to 1
  isHighlighted: boolean;
}

export function Connection({ startId, endId, strength, isHighlighted }: ConnectionProps) {
  const lineRef = useRef<any>(null);
  
  // Initial positions
  const initialStart = languagePositions.get(startId) || [0, 0, 0];
  const initialEnd = languagePositions.get(endId) || [0, 0, 0];

  useFrame((state) => {
    if (lineRef.current) {
      // Animate the dash offset to look like flowing energy
      const speed = isHighlighted ? 0.03 : 0.01;
      lineRef.current.material.dashOffset -= speed * (1 + strength);
      
      // Pulsating electrified effect
      if (isHighlighted) {
        // Fast, intense pulse for highlighted connections
        lineRef.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 8) * 0.4;
      } else {
        // Slow, subtle pulse for background connections
        // Offset by strength so they don't all pulse at the exact same time
        lineRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2 + strength * 10) * 0.15;
      }

      // Update geometry positions dynamically
      const start = languagePositions.get(startId);
      const end = languagePositions.get(endId);
      
      if (start && end && lineRef.current.geometry) {
        const midX = (start[0] + end[0]) / 2;
        const midY = (start[1] + end[1]) / 2;
        const midZ = (start[2] + end[2]) / 2;
        
        const dist = Math.sqrt(
          Math.pow(end[0] - start[0], 2) + 
          Math.pow(end[2] - start[2], 2)
        );
        
        const midPoint = new THREE.Vector3(midX, midY + dist * 0.3, midZ);
        const startV = new THREE.Vector3(...start);
        const endV = new THREE.Vector3(...end);
        
        const curve = new THREE.QuadraticBezierCurve3(startV, midPoint, endV);
        const points = curve.getPoints(20);
        
        const positions = new Float32Array(points.length * 3);
        for (let i = 0; i < points.length; i++) {
          positions[i * 3] = points[i].x;
          positions[i * 3 + 1] = points[i].y;
          positions[i * 3 + 2] = points[i].z;
        }
        
        lineRef.current.geometry.setPositions(positions);
      }
    }
  });

  const color = isHighlighted ? '#ffaa00' : '#446688';
  const lineWidth = isHighlighted ? 2 + strength * 3 : 0.5 + strength;

  return (
    <QuadraticBezierLine
      start={initialStart}
      end={initialEnd}
      color={color}
      lineWidth={lineWidth}
      dashed={true}
      dashScale={isHighlighted ? 20 : 10}
      dashSize={isHighlighted ? 4 : 2}
      dashOffset={0}
      ref={lineRef}
      transparent
      opacity={isHighlighted ? 0.8 : 0.3}
    />
  );
}
