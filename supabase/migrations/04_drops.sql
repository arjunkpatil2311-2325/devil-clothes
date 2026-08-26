-- DEVIL CLOTHES: Drop System Schema

CREATE TABLE IF NOT EXISTS drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add drop_id to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS drop_id UUID REFERENCES drops(id) ON DELETE SET NULL;

-- Triggers for modtime
CREATE TRIGGER update_drops_modtime
BEFORE UPDATE ON drops
FOR EACH ROW
EXECUTE FUNCTION update_profiles_modtime(); -- Reusing the function from customer auth

-- RLS
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;

-- Public can read active drops
CREATE POLICY "Public can view active drops" 
ON drops FOR SELECT 
USING (is_active = true OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Admins can do everything
CREATE POLICY "Admins can insert drops" ON drops FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can update drops" ON drops FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can delete drops" ON drops FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
