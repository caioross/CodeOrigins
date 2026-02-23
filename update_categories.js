const fs = require('fs');

const categories = {
  databases: ['sql', 'sparql', 'cypher', 'gremlin', 'datalog', 'xquery', 'xpath', 'piglatin', 'hiveql', 'foxpro', 'clarion', 'q', 'k', 'j', 'clipper', 'sas', 'stata', 'spss', 'mumps'],
  'cloud development': ['go', 'erlang', 'elixir', 'hcl', 'dhall', 'jsonnet', 'cue', 'nickel', 'pkl', 'kusion', 'kcl', 'rego', 'cedar', 'polar', 'ballerina', 'unison', 'pony', 'chapel', 'x10', 'opencl', 'cuda'],
  'web frameworks': ['javascript', 'typescript', 'php', 'elm', 'webassembly', 'mint', 'ur', 'coffeescript', 'livescript', 'purescript', 'clojurescript', 'rescript', 'moonscript', 'assemblyscript', 'xslt', 'dsssl'],
  'devs IDEs': ['visualbasic', 'delphi', 'powerbuilder', 'magic', 'uniface', 'alice', 'netlogo', 'processing', 'labview', 'simulink', 'gml', 'gdscript', 'inform6', 'inform7', 'tads', 'zmachine', 'scratch', 'autohotkey', 'autoit', 'applescript', 'hypertalk', 'livecode', 'vba', 'openscad', 'gnuplot', 'metapost', 'asymptote', 'mql4', 'mql5', 'pinescript'],
  'programing and scripts': [] // default
};

function getCategory(id) {
  for (const [cat, ids] of Object.entries(categories)) {
    if (ids.includes(id)) return cat;
  }
  return 'programing and scripts';
}

['languages.ts', 'languages2.ts', 'languages3.ts', 'languages4.ts'].forEach(file => {
  let content = fs.readFileSync(`src/data/${file}`, 'utf8');
  
  // Remove existing category fields to avoid duplicates
  content = content.replace(/,\s*category:\s*'[^']+'/g, '');
  
  // Add category field after angle
  content = content.replace(/id:\s*'([^']+)'([\s\S]*?)angle:\s*([0-9.]+)/g, (match, id, middle, angle) => {
    const cat = getCategory(id);
    return `id: '${id}'${middle}angle: ${angle}, category: '${cat}'`;
  });
  
  fs.writeFileSync(`src/data/${file}`, content);
});

console.log('Categories updated successfully!');
