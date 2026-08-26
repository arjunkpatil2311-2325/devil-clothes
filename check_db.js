const fs = require('fs');

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim().replace(/"/g, '');
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim().replace(/"/g, '');

  let res = await fetch(`${url}/rest/v1/wishlists?select=*&limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  console.log("wishlists:", res.status);

  res = await fetch(`${url}/rest/v1/?select=*`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  const data = await res.json();
  const tables = Object.keys(data.paths).filter(p => p.includes('wish'));
  console.log("OpenAPI paths with 'wish':", tables);
}
run();
