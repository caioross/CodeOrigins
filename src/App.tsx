/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { SolarSystem } from './components/SolarSystem';
import { UI } from './components/UI';
import { Timeline } from './components/Timeline';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      <UI />
      <div className="flex-grow">
        <Canvas camera={{ position: [0, 80, 160], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <SolarSystem />
        </Canvas>
      </div>
      <Analytics />
    </div>
  );
}
