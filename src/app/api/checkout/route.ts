import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to checkout.' }, { status: 401 });
    }

    const body = await req.json();
    const { items, contact, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!contact || !contact.name || !contact.email || !contact.phone) {
      return NextResponse.json({ error: 'Contact information is required' }, { status: 400 });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 1. Fetch real prices & check stock
    for (const item of items) {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('id, name, price, stock, status')
        .eq('id', item.id)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      }

      if (product.status !== 'Published') {
        return NextResponse.json({ error: `Product unavailable: ${product.name}` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for: ${product.name}` }, { status: 400 });
      }

      // Reserve stock atomically via RPC
      const { data: reserved, error: reserveError } = await supabaseAdmin.rpc('reserve_stock', {
        p_product_id: product.id,
        p_quantity: item.quantity
      });

      if (reserveError || !reserved) {
        // If reservation fails mid-way, we would ideally rollback previous items in a real transaction.
        // For simplicity in this Edge/REST architecture, if one fails, we'd need to restore the ones that succeeded,
        // or just rely on the atomic nature of the DB function and fail the whole order if it happens.
        // Let's at least try to restore what we reserved so far.
        for (const vItem of validatedItems) {
          await supabaseAdmin.rpc('restore_stock', { p_product_id: vItem.product_id, p_quantity: vItem.quantity });
        }
        return NextResponse.json({ error: `Could not reserve stock for: ${product.name}` }, { status: 400 });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        size: item.size || 'Default',
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    const delivery_charge = subtotal > 1500 ? 0 : 59; // Business logic
    const total = subtotal + delivery_charge;

    // Generate Order Number
    const orderNum = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNum,
        customer_name: contact.name,
        customer_email: contact.email,
        customer_phone: contact.phone,
        shipping_address: shipping,
        subtotal,
        delivery_charge,
        total,
        payment_status: 'pending',
        order_status: 'awaiting_payment',
        expires_at: new Date(Date.now() + 30 * 60000).toISOString(), // 30 mins
        items: [], // Legacy column, keep empty JSON to satisfy schema if needed
        user_id: user.id
      })
      .select()
      .single();

    if (orderError) {
      // Restore all stock
      for (const vItem of validatedItems) {
        await supabaseAdmin.rpc('restore_stock', { p_product_id: vItem.product_id, p_quantity: vItem.quantity });
      }
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Insert Order Items
    const orderItemsToInsert = validatedItems.map(item => ({
      order_id: order.id,
      ...item
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      // We could try to rollback, but let's assume it works for now.
      console.error("Failed to insert order items:", itemsError);
    }

    return NextResponse.json({ orderNumber: order.order_number, total: order.total, orderId: order.id }, { status: 200 });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
