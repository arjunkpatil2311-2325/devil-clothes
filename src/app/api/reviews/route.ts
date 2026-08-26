import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, user_id, rating, title, review_body } = body;

    if (!product_id || !user_id || !rating || !review_body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Server-side verification of purchase
    const { data: purchaseData, error: purchaseError } = await supabaseAdmin.rpc("has_purchased_product", {
      p_user_id: user_id,
      p_product_id: product_id
    });

    if (purchaseError) {
      console.error("Error checking purchase status:", purchaseError);
      return NextResponse.json({ error: "Failed to verify purchase status" }, { status: 500 });
    }

    if (!purchaseData) {
      return NextResponse.json({ 
        error: "Reviews are available after purchasing this product." 
      }, { status: 403 });
    }

    // Check if user already reviewed
    const { data: existingReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    if (existingReview) {
      return NextResponse.json({ 
        error: "You have already reviewed this product." 
      }, { status: 409 });
    }

    // Insert the review
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        product_id,
        user_id,
        rating,
        title,
        body: review_body,
        is_verified_purchase: true,
        is_approved: true // Auto-approve per requirements
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting review:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("Error in reviews POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
