/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { SolarSystem } from './components/SolarSystem';
import { UI } from './components/UI';

export default function App() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 80, 160], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <SolarSystem />
      </Canvas>
      <UI />
    </div>
  );
}
