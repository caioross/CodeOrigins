# Architecture

CodeOrigins is built using a React + Vite setup.

- **Routing:** Handled via component state as it's a single-page app right now.
- **State Management:** `zustand` stores the selected languages, filters, and global states.
- **Rendering:** `react-three-fiber` and `drei` for 3D elements, standard DOM elements for the UI overlay.

The architecture is designed to keep UI logic and 3D logic cleanly separated via the Zustand store.
