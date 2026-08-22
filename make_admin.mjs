import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load env vars
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^"|"$/g, '').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function makeAdmin() {
  console.log("Fetching users from auth...");
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error("Error fetching users:", authError);
    return;
  }

  const users = authData.users;
  if (!users || users.length === 0) {
    console.log("No users found in auth.users.");
    return;
  }

  // Sort by created_at descending
  users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const newestUser = users[0];
  console.log(`Found newest user: ${newestUser.email} (ID: ${newestUser.id})`);

  console.log(`Ensuring profile exists for ${newestUser.email} and setting role to 'admin'...`);
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: newestUser.id,
      email: newestUser.email,
      full_name: newestUser.user_metadata?.full_name || 'Admin',
      role: 'admin'
    })
    .select();

  if (profileError) {
    console.error("Error upserting profile:", profileError);
  } else {
    console.log("Success! Profile updated/created:", profileData);
  }
}

makeAdmin();
