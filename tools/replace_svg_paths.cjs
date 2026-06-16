const fs = require('fs');
const path = require('path');

const puntarenasPath = fs.readFileSync(path.join(__dirname, 'puntarenas_repaired.txt'), 'utf8').trim();
const cartagoPath = fs.readFileSync(path.join(__dirname, 'cartago_repaired.txt'), 'utf8').trim();

// 1. Update src/components/game/MapaCostaRica.vue
const vuePath = path.join(__dirname, '..', '..', 'components', 'game', 'MapaCostaRica.vue');
if (fs.existsSync(vuePath)) {
  let content = fs.readFileSync(vuePath, 'utf8');
  
  // Replace Puntarenas path
  const puntarenasRegex = /\{\s*id:\s*'puntarenas',\s*d:\s*'[^']+'\s*\}/;
  const newPuntarenas = `{ id: 'puntarenas', d: '${puntarenasPath}' }`;
  content = content.replace(puntarenasRegex, newPuntarenas);
  
  // Replace Cartago path
  const cartagoRegex = /\{\s*id:\s*'cartago',\s*d:\s*'[^']+'\s*\}/;
  const newCartago = `{ id: 'cartago', d: '${cartagoPath}' }`;
  content = content.replace(cartagoRegex, newCartago);
  
  fs.writeFileSync(vuePath, content, 'utf8');
  console.log('Successfully updated MapaCostaRica.vue');
} else {
  console.error(`Vue file not found at ${vuePath}`);
}

// 2. Update src/assets/images/mapa-costa-rica.svg
const svgPath = path.join(__dirname, '..', '..', 'assets', 'images', 'mapa-costa-rica.svg');
if (fs.existsSync(svgPath)) {
  let content = fs.readFileSync(svgPath, 'utf8');
  
  // We can split by <path tags to find id="CRP" and id="CRC" and replace their d attributes
  const paths = content.split('<path');
  const updatedPaths = paths.map(p => {
    if (p.includes('id="CRP"')) {
      // Replace d="..."
      return p.replace(/d="[^"]+"/, `d="${puntarenasPath}"`);
    } else if (p.includes('id="CRC"')) {
      return p.replace(/d="[^"]+"/, `d="${cartagoPath}"`);
    }
    return p;
  });
  
  fs.writeFileSync(svgPath, updatedPaths.join('<path'), 'utf8');
  console.log('Successfully updated mapa-costa-rica.svg');
} else {
  console.error(`SVG file not found at ${svgPath}`);
}
