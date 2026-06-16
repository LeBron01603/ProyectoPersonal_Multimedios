const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'repaired_cr.svg');
const content = fs.readFileSync(svgPath, 'utf8');

// A very robust parser using string splitting
const paths = content.split('<path');
paths.forEach(p => {
  if (!p.trim()) return;
  
  // Extract id
  const idMatch = p.match(/id="([^"]+)"/);
  const nameMatch = p.match(/name="([^"]+)"/);
  
  if (idMatch) {
    const id = idMatch[1];
    const name = nameMatch ? nameMatch[1] : id;
    
    // Extract d attribute
    const dStartIndex = p.indexOf('d="');
    if (dStartIndex !== -1) {
      const dEndIndex = p.indexOf('"', dStartIndex + 3);
      if (dEndIndex !== -1) {
        const d = p.substring(dStartIndex + 3, dEndIndex).replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim();
        
        if (id === 'CRP' || id === 'CRC' || id === 'puntarenas' || id === 'cartago') {
          console.log(`FOUND ${name} (${id}): d length is ${d.length}`);
          const filename = id === 'CRP' || id === 'puntarenas' ? 'puntarenas_repaired.txt' : 'cartago_repaired.txt';
          fs.writeFileSync(path.join(__dirname, filename), d);
          console.log(`Saved to ${filename}`);
        }
      }
    }
  }
});
