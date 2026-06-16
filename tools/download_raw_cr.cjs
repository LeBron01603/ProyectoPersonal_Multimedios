const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://simplemaps.com/static/svg/country/cr/admin1/cr.svg';
const outputPath = path.join(__dirname, 'repaired_cr.svg');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

console.log(`Downloading raw SVG from ${url}...`);

https.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Request Failed. Status Code: ${res.statusCode}`);
    return;
  }

  const fileStream = fs.createWriteStream(outputPath);
  res.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`Download completed! Saved to ${outputPath}`);
    
    // Parse the file to confirm it has no truncation
    const content = fs.readFileSync(outputPath, 'utf8');
    if (content.includes('...')) {
      console.log('WARNING: Downloaded file still contains "..."!');
    } else {
      console.log('Success: Downloaded file is complete (no "..." found)!');
    }
  });
}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
