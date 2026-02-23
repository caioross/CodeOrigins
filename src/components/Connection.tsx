import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  strength: number; // 0 to 1
  isHighlighted: boolean;
}

export function Connection({ start, end, strength, isHighlighted }: ConnectionProps) {
  const materialRef = useRef<any>(null);
  
  // Calculate a control point for the bezier curve to make it arc upwards
  const midPoint = useMemo(() => {
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ = (start[2] + end[2]) / 2;
    
    // Distance between points
    const dist = Math.sqrt(
      Math.pow(end[0] - start[0], 2) + 
      Math.pow(end[2] - start[2], 2)
    );
    
    // Arc height based on distance
    return [midX, midY + dist * 0.3, midZ] as [number, number, number];
  }, [start, end]);

  useFrame((state) => {
    if (materialRef.current) {
      // Animate the dash offset to look like flowing energy
      const speed = isHighlighted ? 0.03 : 0.01;
      materialRef.current.dashOffset -= speed * (1 + strength);
      
      // Pulsating electrified effect
      if (isHighlighted) {
        // Fast, intense pulse for highlighted connections
        materialRef.current.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 8) * 0.4;
      } else {
        // Slow, subtle pulse for background connections
        // Offset by strength so they don't all pulse at the exact same time
        materialRef.current.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2 + strength * 10) * 0.15;
      }
    }
  });

  const color = isHighlighted ? '#ffaa00' : '#446688';
  const lineWidth = isHighlighted ? 2 + strength * 3 : 0.5 + strength;

  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={midPoint}
      color={color}
      lineWidth={lineWidth}
      dashed={true}
      dashScale={isHighlighted ? 20 : 10}
      dashSize={isHighlighted ? 4 : 2}
      dashOffset={0}
      ref={materialRef}
      transparent
      opacity={isHighlighted ? 0.8 : 0.3}
    />
  );
}
