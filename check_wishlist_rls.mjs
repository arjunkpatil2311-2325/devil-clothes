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

const supabaseAdmin = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);
const supabaseAnon = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const user_id = 'b1eb97b4-7d6d-4960-b505-b3a1b8dcc537';
  
  // We need to see pg_policies
  const { data: policies } = await supabaseAdmin.from('pg_policies').select('*').eq('tablename', 'wishlists').catch(()=>({data:[]}));
  console.log('Policies from pg_policies:', policies);
  
  // Try querying as anon
  const { data: anonData, error: anonError } = await supabaseAnon.from('wishlists').select('*');
  console.log('Anon query result:', anonData, anonError);
}
test();
