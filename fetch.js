const https = require('https');
https.get('https://www.instagram.com/devil_cloths_hub/', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/property=\"og:image\" content=\"(.*?)\"/);
    if (match) console.log(match[1]);
    else console.log('Not found');
  });
}).on('error', (e) => {
  console.error(e);
});
