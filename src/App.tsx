/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { SolarSystem } from './components/SolarSystem';
import { UI } from './components/UI';
import { LoadingScreen } from './components/LoadingScreen';
import { useEffect } from 'react';
import { useStore } from './store';
import { getAvailableLocales, loadLocaleData } from './services/localeLoader';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const setAvailableLocales = useStore(state => state.setAvailableLocales);

  useEffect(() => {
    const locales = getAvailableLocales();
    setAvailableLocales(locales);
    // Load default language initially
    loadLocaleData('en');
  }, [setAvailableLocales]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      <LoadingScreen />
      <UI />
      <div className="flex-grow">
        <Canvas camera={{ position: [0, 80, 160], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <SolarSystem />
        </Canvas>
      </div>
      <SpeedInsights />
    </div>
  );
}
