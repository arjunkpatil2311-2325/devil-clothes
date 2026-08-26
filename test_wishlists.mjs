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
  const { data: data1, error: err1 } = await supabase.from('wishlists').select('*, product:product_id(*)').limit(1);
  console.log('Query: product:product_id(*) -> Data:', data1, 'Error:', err1);
  
  const { data: data2, error: err2 } = await supabase.from('wishlists').select('*, products(*)').limit(1);
  console.log('Query: products(*) -> Data:', data2, 'Error:', err2);
}
test();
