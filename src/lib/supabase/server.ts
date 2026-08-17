import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This client should ONLY be used in Server Components, Server Actions, or API Routes.
// It has admin privileges and bypasses Row Level Security (RLS).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
