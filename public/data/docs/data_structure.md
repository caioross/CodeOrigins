# Data Management (The Dark Matter of the Application)

For a graphics engine to project languages as planets, it is necessary to translate historical traits and abstract semantics into pure serializable mathematics. These structured data live centrally spread across constants in the `src/data/languages.ts` files or equivalents listed in huge blocks of the JSON matrix.

## Universal Language Schema

Each planet in CodeOrigins is rendered from a standardized object with mandatory fields. Consider the following vital TypeScript (or underlying JSON) interface:

```typescript
export interface LanguageData {
  id: string;              // "c", "python", "php" (Always lowercase Kebab/Snake case as Primary Key)
  name: string;            // Capitalized real name: "C", "Python", "PHP"
  year: number;            // The Element's Big Bang - 1972, 1991, 1995. Timeline controller axis
  creators: string[];      // ["Dennis Ritchie", "Guido van Rossum"]
  paradigms: string[];     // ["Imperative", "Procedural", "Object-Oriented"] - Governs 3D material Color and Texture
  influencedBy: string[];  // ["b", "algol-68"] - The String Arrays linked to the Orbit Lines creation system
  website: string | null;  // Optional landing of the original external ref site
  github: string | null;   // If it has an indexed lifetime repository.
  // Computed Spatial Properties (For the Drei Model):
  mass: number;            // Controls the planet's R3F BoundingBox Radius. Values from 1.0 (Modest satellite) to 8.0/10.0 (C, Java type Stars).
  color?: string;          // Used in UI hexadecimal HUD visual particles or material fallbacks.
}
```

## Data Metrification

*   **The Influence Matrix (Orbits):** The `influencedBy` field determines where R3F should point the connector rays/wires during the main layout. An array containing five IDs will cause the Render to trace three tubular nodes tracing cubic geometry in the simulation pointed towards the Center of the mentioned IDs.
*   **Relative Masses:** Defined "by hand" in current compilations loosely based on the language's adoption and time, reflecting its gravitational popularity. Excessively increasing a language's `mass` immensely scales it within the `useFrame()` vector.
*   **Categories based on Year:** For the *Year Timeline* system not to fail on an empty frame and stop, an Array set of key years (`1950, 1960, ... 2025`) processes internally and injects which objects with `year: < T` can become Visible=`true`. 

## Inserting New Languages

A Space Engineer wanting to add a `FooBar` Language born today, would have to:
1. Go to the local source inside the Data folder.
2. Add the standard block with Name `foobar`, Date `1985`, and *influenced by* `x`.
3. Make sure that the parent Object *already actively exists* before. Inserting object orbits (in `influencedBy`) pointing to a ghost ID with no data will break the route on the connectable strings when rendering the graph.
4. Consequently the dynamic Locales would have to have keys mapping the history of that insertion.
