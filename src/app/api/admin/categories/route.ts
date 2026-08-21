import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET: List all categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin categories GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Create category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, image, active } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newCategory = {
      name,
      slug: finalSlug,
      image: image || null,
      active: active !== undefined ? Boolean(active) : true,
    };

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([newCategory])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("Admin categories POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT: Update category
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.active !== undefined) payload.active = Boolean(updates.active);

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin categories PUT error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE: Delete category
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err: any) {
    console.error("Admin categories DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
