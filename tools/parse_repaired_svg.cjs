const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'repaired_cr.svg');
const content = fs.readFileSync(svgPath, 'utf8');

// Find paths
const pathRegex = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)"/g;
let match;
while ((match = pathRegex.exec(content)) !== null) {
  const d = match[1];
  const id = match[2];
  const name = match[3];
  
  if (id === 'CRP' || id === 'CRC') {
    console.log(`=== FULL PATH FOR ${name} (${id}) ===`);
    console.log(d);
    fs.writeFileSync(path.join(__dirname, `${id.toLowerCase()}_full_path.txt`), d);
  }
}
