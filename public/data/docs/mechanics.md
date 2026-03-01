# Navigation and Interaction Mechanics

To fully understand how to explore the "spatial vastness" rendered by the CodeOrigins WebGL lenses, we list the basal commands and mechanics of the simulator camera:

## Flight Dynamics and Controls (Orbicular Camera)

Navigation primarily interacts with the mouse/trackpad operating under the doctrine of "Arbitrary Orbital Controls" powered by `@react-three/drei` (`OrbitControls`).

1.  **Cylindrical Rotation:** Hold the **Left button** of the mouse and drag over any empty point in the universe. This does not change the camera's absolute position, but rotates around the Target (Current Center/Pivot Point).
2.  **FTL Zoom:** The mouse Scroll (Wheel), or double pinch on Mac OS Trackpad and Mobile phones. Zooms in vertiginously, transforming large suns into titanic planets, and zooms out until they become tiny stardust in the panoramic web.
3.  **Spatial Tracking Pan:** Pressing the **Right** click and pulling alters the central spherical X/Y guidelines of the camera. In other words, "dragging the universe horizontally/vertically". It allows navigating long distances without rotating.

## Planet Focusing System (Raycasting)
Rigid standard web link buttons are not used to select planets.
The selection physics inside Three.js uses **Raycasting**. The monitor board projects a millimeter "Invisible Ray" (Laser) starting from where the mouse cursor rests until bumping into the bounding box of the Rendered Planet on the Grid.

Upon validly clicking a Planet:
1.  **Framing (Easing Camera):** The Camera automatically computes framing distances (`lerp()`), assuming a cinematic side position near the selected planet. The *Pivot Point* changes from "Free", becoming that specific planet.
2.  **Database Pop-up:** The HUD acknowledges via Zustand that something has been selected. Immediately the UI gravity lowers the "Language Database" side Panel, with a window filled with HTML translated i18n descriptions.
3.  **"Focus Parent/Creator" System:** Inside this frontal encyclopedia, links to other languages (E.g.: clicking that C is the parent of C++) make `OrbitControls` use fast-travel, rotating and sweeping 3D physical space at the speed of light from where the camera was to the newly computed local `vec3(x,y,z)` position of the C planet.

## Overlapping Panels (Scaled Z-Index)
The popups float above the WebGL element. You can freely drag them (depending on the main logs panel) or close them on the `X` format buttons of the top neon, restoring the full intergalactic peripheral view (Zen Mode) without HTML pollution.
