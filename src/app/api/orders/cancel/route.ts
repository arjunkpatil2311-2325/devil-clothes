import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status, order_status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.order_status === 'cancelled') {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 });
    }

    // Cancel the order
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ order_status: 'cancelled' })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    // Fetch items to restore stock
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId);

    if (!itemsError && items) {
      // Restore stock for each item
      for (const item of items) {
        if (item.product_id) {
          await supabaseAdmin.rpc('restore_stock', {
            p_product_id: item.product_id,
            p_quantity: item.quantity
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Order cancelled successfully' });

  } catch (error: any) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
