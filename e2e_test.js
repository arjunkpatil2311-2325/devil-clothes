const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const line = env.split('\n').find(l => l.startsWith(k + '='));
  if (!line) return undefined;
  return line.split('=')[1].trim().replace(/^"|"$/g, '');
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function runE2ETest() {
  const supabaseJs = await import('@supabase/supabase-js');
  const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("--- E2E TEST START ---");

  // 1. Create a dummy product
  console.log("1. Creating dummy product...");
  const { data: product, error: pError } = await supabase
    .from('products')
    .insert([{
      name: "E2E TEST SHIRT",
      description: "Test",
      price: 999,
      stock: 10,
      status: "Published",
      category: "T-SHIRTS"
    }])
    .select()
    .single();

  if (pError || !product) {
    console.error("Failed to create product:", pError);
    return;
  }
  console.log("Product created:", product.id);

  // 2. Call /api/checkout locally (we can't call Next.js API easily without running dev server, so we'll simulate the API logic or start the server)
  // Let's just start the Next.js server on a random port, wait for it, and hit the endpoint using fetch!
  
}

runE2ETest();
