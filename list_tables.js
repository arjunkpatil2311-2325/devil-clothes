const fs = require('fs');

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim().replace(/"/g, '');
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim().replace(/"/g, '');

  const res = await fetch(`${url}/rest/v1/profiles?select=*&limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  console.log(await res.json());
}
run();
