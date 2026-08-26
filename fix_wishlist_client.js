const fs = require('fs');
let content = fs.readFileSync('src/context/WishlistContext.tsx', 'utf8');

content = content.replace(
  'import { supabase } from "@/lib/supabase/client";',
  'import { createClient } from "@/utils/supabase/client";'
);

content = content.replace(
  'export function WishlistProvider({ children }: { children: ReactNode }) {',
  'export function WishlistProvider({ children }: { children: ReactNode }) {\n  const supabase = createClient();'
);

fs.writeFileSync('src/context/WishlistContext.tsx', content);
