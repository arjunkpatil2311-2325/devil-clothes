const https = require('https');
https.get('https://www.instagram.com/devil_cloths_hub/?__a=1&__d=dis', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(json.graphql.user.profile_pic_url_hd);
    } catch(e) { console.log(data.substring(0, 100)); }
  });
});
