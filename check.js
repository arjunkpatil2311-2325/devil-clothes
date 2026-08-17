const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const line = env.split('\n').find(l => l.startsWith(k + '='));
  if (!line) return undefined;
  return line.split('=')[1].trim().replace(/^"|"$/g, '');
};

import('@supabase/supabase-js').then(m => {
  const s = m.createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  Promise.all([
    s.from('order_items').select('id').limit(1),
    s.from('orders').select('expires_at').limit(1),
    s.rpc('reserve_stock', { p_product_id: '00000000-0000-0000-0000-000000000000', p_quantity: 0 })
  ]).then(res => {
    console.log('OrderItems error:', res[0].error?.message || 'none');
    console.log('Orders expires_at error:', res[1].error?.message || 'none');
    console.log('RPC error:', res[2].error?.message || 'none');
  });
});
