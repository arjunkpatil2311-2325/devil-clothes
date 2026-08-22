import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyAdmin } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// GET: List all collections
export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { data, error } = await supabaseAdmin
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin collections GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

// POST: Create collection
export async function POST(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { name, slug, description, image, active } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Collection name is required" },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newCollection = {
      name,
      slug: finalSlug,
      description: description || null,
      image: image || null,
      active: active !== undefined ? Boolean(active) : true,
    };

    const { data, error } = await supabaseAdmin
      .from("collections")
      .insert([newCollection])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("Admin collections POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create collection" },
      { status: 500 }
    );
  }
}

// PUT: Update collection
export async function PUT(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Collection ID is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.active !== undefined) payload.active = Boolean(updates.active);

    const { data, error } = await supabaseAdmin
      .from("collections")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin collections PUT error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update collection" },
      { status: 500 }
    );
  }
}

// DELETE: Delete collection
export async function DELETE(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Collection ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("collections").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Collection deleted successfully" });
  } catch (err: any) {
    console.error("Admin collections DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete collection" },
      { status: 500 }
    );
  }
}
