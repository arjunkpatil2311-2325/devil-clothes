import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.rpc('query_rls', { table_name: 'wishlists' }).catch(() => ({}));
  if (data) console.log(data);
  
  // Or let's just query pg_policies
  const { data: policies, error: err } = await supabase.from('pg_policies').select('*').eq('tablename', 'wishlists').catch(() => ({}));
  if (policies) {
     console.log('Policies using postgrest:', policies);
  } else {
    // raw query via rpc if possible? Usually pg_policies is not exposed.
    console.log('Cant read pg_policies directly via PostgREST');
  }
}
test();
