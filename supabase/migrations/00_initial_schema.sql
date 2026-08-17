-- DEVIL CLOTHES INITIAL SCHEMA

-- 1. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Collections Table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  collection TEXT,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Published', -- 'Draft', 'Published', 'Archived'
  featured BOOLEAN DEFAULT false,
  bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  total NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  order_status TEXT DEFAULT 'New',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to automatically update 'updated_at' on products
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- RLS POLICIES
-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (status = 'Published');
-- Admin can do everything (Bypassed if using Service Role Key, but here is a rule just in case)
CREATE POLICY "Admins can manage products" ON products USING (auth.role() = 'authenticated');

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage categories" ON categories USING (auth.role() = 'authenticated');

-- Collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections are viewable by everyone" ON collections FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage collections" ON collections USING (auth.role() = 'authenticated');

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage all orders" ON orders USING (auth.role() = 'authenticated');
