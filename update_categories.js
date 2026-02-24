import fs from 'fs';

const categories = [
  'Imperative',
  'Declarative',
  'Procedural',
  'Structured',
  'Object-Oriented',
  'Functional',
  'Logical',
  'Reactive',
  'Event-Driven',
  'Generic'
];

function classify(description, connectionsExplanation) {
  const text = (description + ' ' + connectionsExplanation).toLowerCase();
  
  if (text.includes('object-oriented') || text.includes('oop') || text.includes('class-based')) return 'Object-Oriented';
  if (text.includes('functional') || text.includes('lisp') || text.includes('scheme') || text.includes('ml') || text.includes('haskell')) return 'Functional';
  if (text.includes('logic') || text.includes('prolog') || text.includes('datalog')) return 'Logical';
  if (text.includes('reactive')) return 'Reactive';
  if (text.includes('event-driven') || text.includes('event')) return 'Event-Driven';
  if (text.includes('declarative') || text.includes('query') || text.includes('sql') || text.includes('css')) return 'Declarative';
  if (text.includes('procedural') || text.includes('c-like') || text.includes('pascal')) return 'Procedural';
  if (text.includes('structured') || text.includes('algol')) return 'Structured';
  if (text.includes('imperative') || text.includes('assembly') || text.includes('machine code')) return 'Imperative';
  
  return 'Generic';
}

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Update Category type if present
  if (content.includes('export type Category =')) {
    content = content.replace(
      /export type Category =[^;]+;/,
      `export type Category = 'Imperative' | 'Declarative' | 'Procedural' | 'Structured' | 'Object-Oriented' | 'Functional' | 'Logical' | 'Reactive' | 'Event-Driven' | 'Generic';`
    );
  }

  // Split content by "id: '" to process each language block
  const parts = content.split(/id:\s*'/);
  let newContent = parts[0];
  
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    
    // Extract description
    let descMatch = part.match(/description:\s*'((?:[^'\\]|\\.)*)'/);
    let connMatch = part.match(/connectionsExplanation:\s*'((?:[^'\\]|\\.)*)'/);
    let catMatch = part.match(/category:\s*'([^']+)'/);
    
    if (descMatch && connMatch && catMatch) {
      const desc = descMatch[1];
      const conn = connMatch[1];
      const oldCat = catMatch[1];
      
      const newCat = classify(desc, conn);
      
      // Replace category in this part
      part = part.replace(`category: '${oldCat}'`, `category: '${newCat}'`);
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


