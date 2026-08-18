const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const line = env.split('\n').find(l => l.startsWith(k + '='));
  if (!line) return undefined;
  return line.split('=')[1].trim().replace(/^"|"$/g, '');
};

import('@supabase/supabase-js').then(m => {
  const s = m.createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  
  async function check() {
    const { data: cols, error: e1 } = await s.from('collections').select('*').limit(1);
    console.log('Collections data:', cols, 'Error:', e1);

    const { data: cats, error: e2 } = await s.from('categories').select('*').limit(1);
    console.log('Categories data:', cats, 'Error:', e2);
  }
  check();
});
