const fs = require('fs');
const path = require('path');

const files = [
  { name: 'cartago-province-map-svg-icon.html', id: 'cartago' },
  { name: 'puntarenas-province-map-svg-icon.html', id: 'puntarenas' }
];

files.forEach(fileInfo => {
  const filePath = path.join(__dirname, fileInfo.name);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/g;
  let match;
  while ((match = svgRegex.exec(content)) !== null) {
    const svgText = match[0];
    if (svgText.includes('viewBox="0 0 1024 1024"') || svgText.length > 1000) {
      // Extract the d attribute of the path
      const dMatch = svgText.match(/d="([^"]+)"/);
      if (dMatch) {
        console.log(`=== FULL PATH FOR ${fileInfo.id.toUpperCase()} ===`);
        console.log(dMatch[1]);
        console.log(`=== END PATH FOR ${fileInfo.id.toUpperCase()} (Length: ${dMatch[1].length}) ===`);
        fs.writeFileSync(path.join(__dirname, `${fileInfo.id}_path.txt`), dMatch[1]);
      }
    }
  }
});
