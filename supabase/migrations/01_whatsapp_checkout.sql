-- 1. Alter Orders Table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Update defaults for existing statuses if we want them to reflect the new WhatsApp flow
ALTER TABLE orders ALTER COLUMN payment_status SET DEFAULT 'pending';
ALTER TABLE orders ALTER COLUMN order_status SET DEFAULT 'awaiting_payment';

-- 2. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage all order items" ON order_items USING (auth.role() = 'authenticated');

-- 3. Atomic Stock RPC
-- Decrements stock for a given product by requested quantity if sufficient stock exists.
-- Returns true if successful, false if insufficient stock.
CREATE OR REPLACE FUNCTION reserve_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Bypasses RLS so the server can safely call it during checkout
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT stock INTO current_stock FROM products WHERE id = p_product_id FOR UPDATE;
  
  IF current_stock >= p_quantity THEN
    UPDATE products SET stock = stock - p_quantity WHERE id = p_product_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- Restores stock for a given product.
CREATE OR REPLACE FUNCTION restore_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products SET stock = stock + p_quantity WHERE id = p_product_id;
END;
$$;
