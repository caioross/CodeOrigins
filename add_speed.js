import fs from 'fs';

function estimateSpeed(name, description, connections) {
  const text = (name + ' ' + description + ' ' + connections).toLowerCase();
  
  // Very fast / Systems / Compiled
  if (name === 'Assembly' || name === 'C' || name === 'C++' || name === 'Rust' || name === 'Zig' || name === 'Nim') return 100;
  if (text.includes('systems programming') || text.includes('high performance') || text.includes('machine code') || text.includes('compiled to c') || text.includes('compiles to c')) return 90 + Math.floor(Math.random() * 10);
  
  // Fast compiled / JIT
  if (name === 'Go' || name === 'Java' || name === 'C#' || name === 'Swift' || name === 'Kotlin' || name === 'Julia' || name === 'Scala') return 85;
  if (text.includes('compiled') || text.includes('jvm') || text.includes('.net') || text.includes('bytecode')) return 75 + Math.floor(Math.random() * 15);
  
  // JIT / Fast dynamic
  if (name === 'JavaScript' || name === 'TypeScript' || name === 'Dart' || name === 'Lua') return 70;
  if (text.includes('javascript engine') || text.includes('jit') || text.includes('webassembly')) return 65 + Math.floor(Math.random() * 15);
  
  // Interpreted / Scripting
  if (name === 'Python' || name === 'Ruby' || name === 'PHP' || name === 'Perl' || name === 'R') return 30;
  if (text.includes('scripting') || text.includes('interpreted') || text.includes('dynamic')) return 25 + Math.floor(Math.random() * 20);
  
  // Shell / Slow
  if (text.includes('shell') || text.includes('bash') || text.includes('command-line')) return 15 + Math.floor(Math.random() * 10);
  
  // Esoteric
  if (text.includes('esoteric')) return 5 + Math.floor(Math.random() * 5);
  
  // Default fallback (average)
  return 50 + Math.floor(Math.random() * 20);
}

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add speed to Language interface if it's the main file
  if (content.includes('export interface Language {') && !content.includes('speed: number;')) {
    content = content.replace(
      /category\?: Category;\n\}/,
      `category?: Category;\n  speed: number; // 1 to 100\n}`
    );
  }

  // Split content by "id: '" to process each language block
  const parts = content.split(/id:\s*'/);
  let newContent = parts[0];
  
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    
    // Check if speed is already there
    if (!part.includes('speed:')) {
      // Extract name, description, connections
      let nameMatch = part.match(/name:\s*'((?:[^'\\]|\\.)*)'/);
      let descMatch = part.match(/description:\s*'((?:[^'\\]|\\.)*)'/);
      let connMatch = part.match(/connectionsExplanation:\s*'((?:[^'\\]|\\.)*)'/);
      
      if (nameMatch && descMatch && connMatch) {
        const name = nameMatch[1];
        const desc = descMatch[1];
        const conn = connMatch[1];
        
        const speed = estimateSpeed(name, desc, conn);
        
        // Insert speed before category or angle
        part = part.replace(/(angle:\s*\d+,)/, `$1 speed: ${speed},`);
      }
    }
    
    newContent += `id: '${part}`;
  }
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Updated ${filePath}`);
}

const files = ['src/data/languages.ts', 'src/data/languages2.ts', 'src/data/languages3.ts', 'src/data/languages4.ts'];
for (const file of files) {
  if (fs.existsSync(file)) {
    processFile(file);
  }
}
