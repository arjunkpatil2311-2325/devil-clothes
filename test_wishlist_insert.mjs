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
  const { data: users } = await supabase.from('users').select('id').limit(1);
  if (!users || !users.length) return console.log('no users');
  const user_id = users[0].id;
  
  const { data: products } = await supabase.from('products').select('id').limit(1);
  if (!products || !products.length) return console.log('no products');
  const product_id = products[0].id;
  
  await supabase.from('wishlists').insert({ user_id, product_id }).select('*');
  
  const { data, error } = await supabase.from('wishlists').select('*, products(*)').eq('user_id', user_id);
  console.log('Query result:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}
test();
