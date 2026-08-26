import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyAdmin } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// GET: List all drops
export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { data, error } = await supabaseAdmin
      .from("drops")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin drops GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch drops" },
      { status: 500 }
    );
  }
}

// POST: Create drop
export async function POST(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { name, slug, description, image_url, is_active, featured, start_date, end_date } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "drop name is required" },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newdrop = {
      name,
      slug: finalSlug,
      description: description || null,
      image_url: image_url || null,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      featured: featured !== undefined ? Boolean(featured) : false,
      start_date: start_date || null,
      end_date: end_date || null,
    };

    const { data, error } = await supabaseAdmin
      .from("drops")
      .insert([newdrop])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("Admin drops POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create drop" },
      { status: 500 }
    );
  }
}

// PUT: Update drop
export async function PUT(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "drop ID is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.image_url !== undefined) payload.image_url = updates.image_url;
    if (updates.is_active !== undefined) payload.is_active = Boolean(updates.is_active);
    if (updates.featured !== undefined) payload.featured = Boolean(updates.featured);
    if (updates.start_date !== undefined) payload.start_date = updates.start_date;
    if (updates.end_date !== undefined) payload.end_date = updates.end_date;

    const { data, error } = await supabaseAdmin
      .from("drops")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin drops PUT error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update drop" },
      { status: 500 }
    );
  }
}

// DELETE: Delete drop
export async function DELETE(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "drop ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("drops").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "drop deleted successfully" });
  } catch (err: any) {
    console.error("Admin drops DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete drop" },
      { status: 500 }
    );
  }
}
