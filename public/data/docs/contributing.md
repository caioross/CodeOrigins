# Stellar Engineers Guide (How to Contribute)

Whether expanding constellations (adding unmapped languages), fixing black holes (resolving State bugs), or reticulating 3D textures, your contribution physically expands this cosmos. 

## Data Contribution via JSON Editor (The Easy Way)

The biggest collaborative demand in CodeOrigins is **Historical Accuracy** and **Database Expansion**.
We want you to help us improve the quality of our data: adjusting translations, fixing erroneous influence routes, and increasing our database of languages.

To make this extremely accessible, CodeOrigins has a built-in visual editor located in the GitHub environment.

1.  **Access the Visual Editor**: Open our repository on GitHub. Look for the local visual JSON editor tool or load the `public/data/docs` locally.
2.  **No Code Required**: You do not need to deal with TypeScript code if you are just adding a language. The Editor will compile the JSON accurately!

### Data Structure Standard (JSON)
If you are manually adding or using the editor to fill a new planet, observe how the schema MUST be filled:

```json
{
  "id": "lua", 
  "name": "Lua",
  "year": 1993,
  "creators": ["Roberto Ierusalimschy", "Waldemar Celes", "Luiz Henrique de Figueiredo"],
  "paradigms": ["Multi-paradigm", "Scripting"],
  "influencedBy": ["c", "c++", "scheme"],
  "mass": 3.0
}
```
*   `id`: **Critical**. Must be pure lowercase, no spaces (use hyphens `my-lang`), and act as a Unique Key.
*   `year`: Must be a Number. The timeline uses this number to hide/show the node.
*   `influencedBy`: MUST be an array of `id`s of languages that *already exist* in the database.
*   `mass`: A float indicating the visual size. Modest scripts hover at `1.0` or `2.0`.

## Programming Environment (The Hard Way)

If you intend to change the WebGL Engine or React layouts:

1. **Fork It:** Fork the main repository.
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

## Automatic Terraforming Utilities (Scripts)

The root repository has two NodeJS scripts created for auto-population (for strict advanced use):
*   `update_categories.js`: Scans and applies auto-referential filtering on the dependency JSON arrays.
*   `add_speed.js`: Uses massive data injections to batch alter arrays.

## Opening Open Contact (Pull Requests)
- Create meaningful Branches: `git checkout -b feature/update-ruby-relations`.
- Commit microscopically.
- Open a **PR (Pull Request)** against the `main` branch.
