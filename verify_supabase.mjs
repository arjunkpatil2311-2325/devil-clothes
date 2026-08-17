import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hlifspezepiamytfverv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaWZzcGV6ZXBpYW15dGZ2ZXJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk3OTk4MiwiZXhwIjoyMTAyNTU1OTgyfQ.FLVYTQCcYY_DVmt1ZUvAmS_teSHmkMOikDs6F67HlZ8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Verifying Supabase Connection with Service Role...");
  
  // 1. Try to fetch from 'products' table
  const { data: products, error: productsError } = await supabase.from('products').select('*').limit(1);
  if (productsError) {
    console.log("Products table check:", productsError.message);
  } else {
    console.log("Products table exists.");
  }

  // 2. Try to fetch from 'categories' table
  const { data: categories, error: categoriesError } = await supabase.from('categories').select('*').limit(1);
  if (categoriesError) {
    console.log("Categories table check:", categoriesError.message);
  } else {
    console.log("Categories table exists.");
  }
  
  // 3. Try to fetch from 'orders' table
  const { data: orders, error: ordersError } = await supabase.from('orders').select('*').limit(1);
  if (ordersError) {
    console.log("Orders table check:", ordersError.message);
  } else {
    console.log("Orders table exists.");
  }

  // 4. Check storage buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.log("Buckets check error:", bucketsError.message);
  } else {
    console.log("Buckets found:", buckets.map(b => b.name).join(', '));
  }
}

verify();
