import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Fetch expired orders that are still pending
    const { data: expiredOrders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number')
      .eq('payment_status', 'pending')
      .lt('expires_at', new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      return NextResponse.json({ message: 'No expired orders to process.' });
    }

    let processedCount = 0;

    // 2. For each expired order, restore stock and cancel it
    for (const order of expiredOrders) {
      // Fetch items for this order
      const { data: items, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id);

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

      // Mark order as cancelled
      const { error: cancelError } = await supabaseAdmin
        .from('orders')
        .update({ order_status: 'cancelled' })
        .eq('id', order.id);

      if (!cancelError) {
        processedCount++;
      }
    }

    return NextResponse.json({ message: `Successfully expired ${processedCount} orders.` });

  } catch (error: any) {
    console.error("Cron Expire Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
