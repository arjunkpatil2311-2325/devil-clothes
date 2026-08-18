const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const line = env.split('\n').find(l => l.startsWith(k + '='));
  if (!line) return undefined;
  return line.split('=')[1].trim().replace(/^"|"$/g, '');
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

import('@supabase/supabase-js').then(async m => {
  const supabase = m.createClient(SUPABASE_URL, SUPABASE_KEY);
  
  const [productsRes, categoriesRes, collectionsRes, ordersRes, orderItemsRes] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('collections').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('order_items').select('*', { count: 'exact', head: true })
  ]);

  console.log(`Products: ${productsRes.count || 0}`);
  console.log(`Categories: ${categoriesRes.count || 0}`);
  console.log(`Collections: ${collectionsRes.count || 0}`);
  console.log(`Orders: ${ordersRes.count || 0}`);
  console.log(`Order Items: ${orderItemsRes.count || 0}`);
});
