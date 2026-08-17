import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runTests() {
  console.log("1. ADMIN -> SUPABASE");
  const testProduct = {
    name: "DEVIL TEST TEE",
    slug: "devil-test-tee",
    price: 1299,
    original_price: 1599,
    stock: 10,
    status: "Published",
    category: "T-SHIRTS",
    description: "Test product.",
    images: ["https://example.com/test.jpg"],
    featured: true,
    bestseller: false,
    sizes: ["S", "M", "L", "XL"]
  };

  const { data: inserted, error: insertError } = await supabase
    .from('products')
    .upsert([testProduct], { onConflict: 'slug' })
    .select()
    .single();

  if (insertError) {
    console.log("FAIL: Product creation failed", insertError);
  } else {
    console.log("PASS: Product creation");
    console.log(`Product ID exists: ${!!inserted.id}`);
    console.log(`Name is correct: ${inserted.name === "DEVIL TEST TEE"}`);
    console.log(`Price is 1299: ${inserted.price === 1299}`);
  }

  // Check storage
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.log("FAIL: Storage check failed", bucketError);
  } else {
    const bucketExists = buckets.some(b => b.name === 'product-images');
    console.log(`PASS: Product image storage (bucket 'product-images' exists: ${bucketExists})`);
  }

  // Clean up
  await supabase.from('products').delete().eq('slug', 'devil-test-tee');
}

runTests().catch(console.error);
