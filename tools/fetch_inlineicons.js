const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://www.inlineicons.com/icons/cartago-province-map-svg-icon/',
  'https://www.inlineicons.com/icons/puntarenas-province-map-svg-icon/',
  'https://www.inlineicons.com/icons/costa-rica-map-svg-icon/',
  'https://www.inlineicons.com/vectors/cartago-province-map-svg-icon/',
  'https://www.inlineicons.com/vectors/puntarenas-province-map-svg-icon/'
];

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching ${url} ...`);
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`Success fetching ${url} (${data.length} chars)`);
          resolve({ url, data });
        } else {
          console.log(`Failed fetching ${url}: Status ${res.statusCode}`);
          resolve({ url, error: res.statusCode });
        }
      });
    }).on('error', (err) => {
      console.log(`Error fetching ${url}: ${err.message}`);
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  for (const url of urls) {
    const res = await fetchUrl(url);
    if (res.data) {
      // Look for <svg or path d=
      const svgMatch = res.data.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (svgMatch) {
        console.log(`Found SVG inside ${res.url}`);
        // Save first 1000 characters of the SVG to debug
        console.log(svgMatch[0].substring(0, 500));
        // Save to file
        const name = path.basename(url.replace(/\/$/, ''));
        fs.writeFileSync(path.join(__dirname, `${name}.html`), res.data);
      }
    }
  }
}

run();
