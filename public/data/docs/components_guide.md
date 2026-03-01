# The Complete Components Guide (Space Probe)

A deep dive into the build hierarchy inside the `src/components/` folder, explaining the main gears involved in the rendering between the pure DOM system and the Fiber/ThreeJS engine. This is the "Behind the Lenses" view of how we group the renderable space.

## 🌌 `SolarSystem.tsx` (Root System/Engine)
The Primary ecosystem. It is the central mounting `Mesh` that manages planets, not just the elements themselves, but the Light configurations and the deep Raycasting Logic.
- **Function:** Acts as a huge Canvas wrapper of the Galaxy. Inside it, ambient lights, `Stars` (microscopic Point-lights) are instantiated and the massive list of the Global State of "currently active valid languages" is passed via iterator.
- **Specific Behavior:** Looks directly at the `Zustand` dates to render whether the Genealogy connector lines will be atomic or hidden from the general view.

## 🌎 `Planet.tsx` / `InstancedPlanet.tsx` (Physical Celestial Bodies)
The unitary wrapper of the computed material. The `Planet` draws a circular Texture (`<sphereGeometry />`), defines a Shader Material (`<meshStandardMaterial />` and its emissions).
- **The Click/Hover:** Each Planet carries with it the WebGL API's native intersection detection (`onPointerOver`, `onClick`), allowing immersive HTML feedback and triggering updates in the Zustand Global store ("User Focused Alpha Planet").
- ***Instanced* Versions:** Used when `SolarSystem` decides to dispatch heavy lists under the same computational vector instead of the Unitary R3F tree Render, preventing CallStacks suffocation.

## 🔍 The Naval Radar: `Minimap.tsx`
Built entirely in Native React (HTML and Tailwind). Resting on the UI skeleton in absolute position. 
- It sweeps the global 3D coordinates (`x,y,z`), projects the three-dimensional distances flattening them into a 2-dimensional transparent HUD canvas. It constantly listens to `State.SelectedNodes` and displays luminescent red dots when "Aimed" by Sidebar Radar searches.

## ⏳ `Timeline.tsx` / `TimelineSlider.tsx`
Encapsulated UI Slider Panel, renders from modern Radix/UI or reactive pure HTML sliders. 
- Has the simple interactive purpose of registering thumb or mouse drag positions on the years markers (1950 - 2025). But its effects trigger heavy Zustand calls filtering the Data arrays listing for sidereal visualization. Timeline rewinding affects heavy rendering surroundings.

## 📖 Descriptive Windows: `DocsPopup.tsx` and `UI.tsx`
These components push Overlay layouts around the 3D WebGL Canvas.
- Responsible for pulling the activated locale (`en`, `pt`, `es`) from the Loader service (`localeLoader.ts`), they mount the floating Markdown reader interface, and handle all translated human-readable information of that planet selected by the matrix.
- This is where the TailwindCSS utilities and the smooth keyframing of *Framer Motion* really shine to animate smooth holographic screens popping up on click.
