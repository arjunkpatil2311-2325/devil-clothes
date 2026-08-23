import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hlifspezepiamytfverv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log("Checking storage buckets...");
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error("Error fetching buckets:", bucketsError);
    return;
  }
  
  const bucketExists = buckets.some(b => b.name === 'product-images');
  if (!bucketExists) {
    console.log("Creating product-images bucket...");
    const { error: createError } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      console.error("Failed to create bucket:", createError);
    } else {
      console.log("Successfully created product-images bucket.");
    }
  } else {
    console.log("product-images bucket already exists.");
  }
}

setupStorage();
