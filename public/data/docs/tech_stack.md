# The Engine Under the Hood (Technologies)

To simulate our galaxy in a stable, performant, and extremely immersive way, CodeOrigins relies on an extremely mature and state-of-the-art front-end technology stack (v2025+). We separate our tools into broad categories to ease mapping.

## Graphical Thrusters & Simulation (The Simulator)

-   **Three.js (0.183+)**: The mathematical heart. The raw Javascript engine communicating with the WebGL API and computing node positions, perspective camera, and sidereal planet materials.
-   **@react-three/fiber (R3F)**: The Maestro. R3F encapsulates almost all the verbose and complex imperative code of the raw Three.js API into wonderful declarative React components.
-   **@react-three/drei**: The Toolbox. An auxiliary collection of powerful ready-to-use components for R3F, providing us with stabilized `OrbitControls`, vector 3D fonts, and complex bounds and textures calculations.

## Basic Operational Structure (Core UI)

-   **React 19**: The backbone of our real-time interfaces. Orchestrating all screen mounts (HUD, Radars, windows) outside the 3D simulator using the new incredibly fast dynamic compilers.
-   **Vite 6**: Extremely agile compiling Master Module (Hot Module Replacement) for accelerated development environments and robust, instantaneous build bundling.
-   **TypeScript v5.8+**: Strict Contracts and Critical Failure Reduction. Our planets, formatted JSON data, and store instances depend fervently on TS's strong typing to prevent navigation from throwing real-time errors in front of the exploration screen.

## Materialization and Visual HTML Interface

The physical display layer floating over WebGL. Deals with Hi-Tech Menus, language info panels, and 2D Minimaps.
-   **Tailwind CSS v4**: Modern Utility First styling with super fast, on-demand compilation (JIT). Allowing us to create complex *dark interfaces* full of "glassmorphism", spatial gradients with long semantic names without leaking pure CSS scope.
-   **Framer Motion 12 / motion**: Manipulating ripples of time. Framer dictates the smooth animation of most blocks, UI panels, and popup notifications that open progressively without jerking. We use it for complex physics-based animations and keyframes.
-   **Lucide-react**: For modern, lightweight (SVG) icons present in the radar and navigation controls.

## Memory, Tools and Local Gravity

-   **Zustand v5**: The global store (State Manager). We chose Zustand over Redux or pure Context due to its ultra-lightweight (small footprint) nature and the brutally necessary fact that its setup allows external or mutable bindings vital for `react-three-fiber` to work without throttling every re-render of the front tree.
-   **Auxiliary Node Tools (`express`, `better-sqlite3`, base python/JS utility scripts)**: Although mostly local (SSG/SPA Front First) CodeOrigins loads and cleans sets of databases or injects *automatic categories* and "JSON Data Mass" relying on scripts running natively in NodeJS environments that parse large lists of influences on real languages during pre-flight build processes.

The synergy between R3F controlling the stars and Tailwind guiding the HUD yields a highly precise, cohesive application that never freezes your machine.
