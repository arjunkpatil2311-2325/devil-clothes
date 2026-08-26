import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, product_id)
      );
      
      ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
      CREATE POLICY "Users can view their own wishlist" 
      ON wishlists FOR SELECT 
      USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert into their own wishlist" ON wishlists;
      CREATE POLICY "Users can insert into their own wishlist" 
      ON wishlists FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can delete from their own wishlist" ON wishlists;
      CREATE POLICY "Users can delete from their own wishlist" 
      ON wishlists FOR DELETE 
      USING (auth.uid() = user_id);
    `
  });
  
  if (error) {
    console.log('Error executing SQL via RPC:', error.message);
  } else {
    console.log('Success:', data);
  }
}
main();
