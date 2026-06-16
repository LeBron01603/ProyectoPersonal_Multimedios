const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://inlineicons.com/icons/cartago-province-map-svg-icon/',
  'https://inlineicons.com/icons/puntarenas-province-map-svg-icon/',
  'https://inlineicons.com/icons/costa-rica-map-svg-icon/',
  'https://www.inlineicons.com/icons/cartago-province-map-svg-icon/',
  'https://www.inlineicons.com/icons/puntarenas-province-map-svg-icon/'
];

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

function fetchUrl(url, redirectDepth = 0) {
  if (redirectDepth > 5) {
    return Promise.resolve({ url, error: 'Too many redirects' });
  }
  return new Promise((resolve, reject) => {
    console.log(`Fetching ${url} (depth ${redirectDepth}) ...`);
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Redirecting to ${res.headers.location}`);
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsedUrl = new URL(url);
          redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
        }
        resolve(fetchUrl(redirectUrl, redirectDepth + 1));
        return;
      }
      
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
      // Look for svg or path d=
      const svgMatch = res.data.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (svgMatch) {
        console.log(`Found SVG inside ${res.url}`);
        // Save first 1000 characters of the SVG to debug
        console.log(svgMatch[0].substring(0, 500));
        // Save to file
        const parsed = new URL(res.url);
        const name = path.basename(parsed.pathname.replace(/\/$/, '')) || 'page';
        fs.writeFileSync(path.join(__dirname, `${name}.html`), res.data);
      } else {
        console.log(`No SVG found in page content of length ${res.data.length}`);
      }
    }
  }
}

run();
