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
  const user_id = 'b1eb97b4-7d6d-4960-b505-b3a1b8dcc537';
  
  const { data: products } = await supabase.from('products').select('id').limit(1);
  if (!products || !products.length) return console.log('no products');
  const product_id = products[0].id;
  
  console.log('Inserting for product', product_id);
  await supabase.from('wishlists').insert({ user_id, product_id }).select('*');
  
  const { data, error } = await supabase.from('wishlists').select('*, products(*)').eq('user_id', user_id);
  console.log('Query result products(*):', JSON.stringify(data, null, 2));
  console.log('Error:', error);
  
  const { data: data2, error: error2 } = await supabase.from('wishlists').select('*, product:product_id(*)').eq('user_id', user_id);
  console.log('Query result product:product_id(*):', JSON.stringify(data2, null, 2));
  console.log('Error2:', error2);
}
test();
