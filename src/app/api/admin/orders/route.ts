import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyAdmin } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// GET: List all orders
export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin orders GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PUT: Update order status or payment status
export async function PUT(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, order_status, payment_status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (order_status !== undefined) payload.order_status = order_status;
    if (payment_status !== undefined) payload.payment_status = payment_status;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin orders PUT error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an order completely
export async function DELETE(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    // Deleting an order should cascade delete its order_items if the foreign key is set up correctly (ON DELETE CASCADE)
    // If not, we might need to delete items first, but usually supabase handles cascade if defined.
    // Assuming cascade is ON.
    const { error: itemsError } = await supabaseAdmin.from("order_items").delete().eq("order_id", id);
    if (itemsError) throw itemsError;

    const { data, error } = await supabaseAdmin.from("orders").delete().eq("id", id).select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin orders DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
