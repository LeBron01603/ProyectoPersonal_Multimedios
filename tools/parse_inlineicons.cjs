const fs = require('fs');
const path = require('path');

const files = [
  'cartago-province-map-svg-icon.html',
  'puntarenas-province-map-svg-icon.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`Parsing ${file} ...`);
  
  // Find all <svg tags
  const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/g;
  let match;
  let count = 0;
  while ((match = svgRegex.exec(content)) !== null) {
    count++;
    const svgText = match[0];
    if (svgText.includes('viewBox="0 0 1000 1000"') || svgText.length > 1000 || svgText.includes('path') && svgText.match(/d="M\d+/)) {
      console.log(`Found candidate SVG #${count} (length: ${svgText.length})`);
      console.log(svgText.substring(0, 800));
      console.log('--- END OF PREVIEW ---');
    }
  }
  console.log(`Total SVGs found: ${count}`);
});
