# Stellar Engineers Guide (How to Contribute)

Whether expanding constellations (adding unmapped languages), fixing black holes (resolving State bugs), or reticulating 3D textures, your contribution physically expands this cosmos. 

## Development Environment and Clone

1. **Fork It:** Start by forking the main repository on GitHub to your safe development haven.
2. **Local Probe Boot:**
   ```bash
   git clone https://github.com/YourUsername/CodeOrigins.git
   cd CodeOrigins
   npm install
   ```
3. **Run Ignition (Vite):** 
   ```bash
   npm run dev
   ```

The application now resides at `http://localhost:3000`. Changes to React scripts trigger *Hot-Reload* re-rendering the canvas dynamically without heavy loss of state in the scene.

## Expanding the Universe (Standard Process)

The biggest collaborative demand in CodeOrigins is **Historical Accuracy**. Our temporal logs may present mistakes (e.g., erring on who influenced whom in the 80s). If you want to add languages or fix weights/textures, mess specifically with the files contained in `src/data/`.

*   `languages.ts` (or mapped derivatives `languages2.ts`, `languages3.ts` to alleviate the ast and type-checking time).
*   Supply the matrix in `src/lang/` with the `description` key referring to that change in fundamental English.

## Automatic Terraforming Utilities (Scripts)

The root repository has two heavy NodeJS scripts created for auto-population, in case the contributor is handling thousands of data points in raw format. (Although they are for strict advanced use by the maintainer's primary maintenance).
*   `update_categories.js`: Scans and applies auto-referential filtering on the dependency JSON arrays (Acting as a heavy categorizer to save manual time).
*   `add_speed.js`: Uses massive data injections via sequential Node processing (and raw access via regex or parsers) to batch alter entire matrices.

> [!WARNING]
> Be careful using pure *Node Scripts* in the root. It is necessary to run them in isolation (`node script.js`) before the build to generate the newly generated constants.

## Opening Open Contact (Pull Requests)

- Create meaningful Branches: `git checkout -b feature/update-ruby-relations`.
- Commit microscopically: Your descriptions help auditors understand physical changes in the cosmos.
- Open a **PR (Pull Request)** against the main `main` branch and attach screenshots if you've altered the render or HUD.

We evaluate speed. Rendering a new shader on a Planet's rings cannot result in a decline in overall FPS.
