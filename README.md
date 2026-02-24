<div align="center">
  <img width="1200" height="475" alt="CodeOrigins Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>CodeOrigins</h1>

  <p>An interactive 3D solar system that maps the history and evolution of programming languages.</p>

  <a href="https://codeorigins.vercel.app">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#tech-stack">Tech Stack</a>
</div>

---

## What is CodeOrigins?

CodeOrigins visualizes the universe of programming languages as a **3D solar system**, where each language is a planet and its position in space encodes real historical data:

| Property | Meaning |
|----------|---------|
| **Orbital radius** | Year of creation — older languages orbit closer to the center (1950 baseline) |
| **Orbital inclination** | Programming paradigm — Imperative (0°), Object-Oriented (20°), Scripting (35°), Functional (50°), Generic (90°), etc. |
| **Connection lines** | Language lineage — C → C++ → Java, ML → Haskell → Scala |
| **Planet size** | Estimated usage/popularity |

The result is a navigable map of 100+ languages that makes it easy to see which languages inspired others, when paradigms emerged, and how the ecosystem evolved over decades.

## Features

- **3D Interactive Scene** — orbit, zoom, and click planets to explore languages
- **Minimap** — 2D overhead navigation panel with click-to-teleport
- **Camera animation** — smooth lerp transitions when selecting a language
- **Toggles** — show/hide orbit rings, language names, connection lines, and moons
- **Filters** — filter by documentation quality, usage level, and paradigm/category
- **Starfield background** — particle system for atmosphere
- **AI-powered data** — language metadata enriched with Google Gemini

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| 3D Rendering | Three.js 0.183, `@react-three/fiber`, `@react-three/drei` |
| State Management | Zustand 5 |
| Animation | Framer Motion 12 |
| Styling | Tailwind CSS 4 |
| Build | Vite 6 |
| Language | TypeScript 5.8 |
| AI | Google Gemini (`@google/genai`) |

## Project Structure

```
src/
├── components/
│   ├── SolarSystem.tsx   # Main 3D scene and camera controller
│   ├── Planet.tsx        # Individual planet rendering
│   ├── Connection.tsx    # Lineage connection lines between languages
│   ├── Minimap.tsx       # 2D overhead navigation panel
│   ├── Particles.tsx     # Background starfield particle system
│   └── UI.tsx            # HUD, filters, and info panel
├── data/
│   ├── index.ts          # Aggregates all language data
│   ├── languages.ts      # Language dataset (batch 1)
│   ├── languages2.ts     # Language dataset (batch 2)
│   ├── languages3.ts     # Language dataset (batch 3)
│   └── languages4.ts     # Language dataset (batch 4)
├── store.ts              # Zustand stores (UI state + camera state)
├── App.tsx               # Root component
└── main.tsx              # Vite entry point
```

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone https://github.com/caioross/CodeOrigins.git
   cd CodeOrigins
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Type-check with TypeScript |

## Controls

| Action | Control |
|--------|---------|
| Orbit camera | Click + drag |
| Zoom | Scroll wheel |
| Select language | Click on a planet |
| Navigate via minimap | Click anywhere on the minimap |
| Toggle overlays | Use the HUD buttons in the top-right corner |
