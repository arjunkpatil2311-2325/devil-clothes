import fs from 'fs';
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
  
  console.log("Creating Test Category...");
  const { data: cat, error: catErr } = await supabase.from('categories').insert([
    { name: 'TEST CATEGORY', slug: 'test-category', active: true }
  ]).select().single();
  if (catErr) console.error(catErr);
  
  console.log("Creating Test Collection...");
  const { data: col, error: colErr } = await supabase.from('collections').insert([
    { name: 'TEST COLLECTION', slug: 'test-collection', active: true }
  ]).select().single();
  if (colErr) console.error(colErr);
  
  console.log("Creating Test Product...");
  const { data: prod, error: prodErr } = await supabase.from('products').insert([
    { 
      name: 'TEST PRODUCT', 
      slug: 'test-product', 
      price: 1000, 
      category: cat.slug, 
      collection: col.slug, 
      status: 'Published', 
      stock: 10,
      description: 'Test product description',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80']
    }
  ]).select().single();
  if (prodErr) console.error(prodErr);

  console.log("Test data created successfully! You can verify the storefront now.");
  console.log(`Product ID: ${prod.id}`);
  console.log(`Category ID: ${cat.id}`);
  console.log(`Collection ID: ${col.id}`);
});
