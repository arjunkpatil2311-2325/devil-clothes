import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyAdmin } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// GET: List all products
export async function GET(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let query = supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin products GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      original_price,
      stock,
      category,
      collection,
      status,
      featured,
      bestseller,
      images,
    } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProduct = {
      name,
      slug: finalSlug,
      description: description || "",
      price: Number(price) || 0,
      original_price: original_price ? Number(original_price) : null,
      stock: Number(stock) || 0,
      category: category || "Uncategorized",
      collection: collection || null,
      status: status || "Draft",
      featured: Boolean(featured),
      bestseller: Boolean(bestseller),
      images: Array.isArray(images) ? images : [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("Admin products POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing product
export async function PUT(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required for update" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.original_price !== undefined)
      payload.original_price = updates.original_price ? Number(updates.original_price) : null;
    if (updates.stock !== undefined) payload.stock = Number(updates.stock);
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.collection !== undefined) payload.collection = updates.collection || null;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.featured !== undefined) payload.featured = Boolean(updates.featured);
    if (updates.bestseller !== undefined) payload.bestseller = Boolean(updates.bestseller);
    if (updates.images !== undefined)
      payload.images = Array.isArray(updates.images) ? updates.images : [];

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Admin products PUT error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Delete or Archive a product
export async function DELETE(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const hardDelete = searchParams.get("hard") === "true";

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (hardDelete) {
      const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Product deleted permanently" });
    } else {
      const { data, error } = await supabaseAdmin
        .from("products")
        .update({ status: "Archived", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Product archived successfully", data });
    }
  } catch (err: any) {
    console.error("Admin products DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete/archive product" },
      { status: 500 }
    );
  }
}
