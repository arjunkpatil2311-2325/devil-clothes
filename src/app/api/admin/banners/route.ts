import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyAdmin } from "@/utils/supabase/server";
import {
  getSiteBanners,
  invalidateBannerCache,
  BANNER_KEY_TO_FILE,
  SITE_TEXTS_FILE,
} from "@/lib/banners";

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const banners = await getSiteBanners();
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle JSON updates for promotional text and discounts
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { texts } = body;

      if (!texts || typeof texts !== "object") {
        return NextResponse.json(
          { success: false, error: "Invalid texts payload" },
          { status: 400 }
        );
      }

      // Fetch existing texts if any to merge
      let currentTexts: any = {};
      try {
        const { data: existingData } = await supabaseAdmin.storage
          .from("product-images")
          .download(SITE_TEXTS_FILE);
        if (existingData) {
          currentTexts = JSON.parse(await existingData.text());
        }
      } catch (e) {
        // No prior file
      }

      const merged = { ...currentTexts, ...texts };
      const buffer = Buffer.from(JSON.stringify(merged, null, 2), "utf-8");

      const { error } = await supabaseAdmin.storage
        .from("product-images")
        .upload(SITE_TEXTS_FILE, buffer, {
          contentType: "application/json",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      invalidateBannerCache();
      const updated = await getSiteBanners();

      return NextResponse.json({
        success: true,
        message: "Promotional discount & site texts updated successfully",
        data: updated,
      });
    }

    // 2. Handle File Uploads (FormData)
    const formData = await req.formData();
    const bannerKey = formData.get("key") as string;
    const file = formData.get("file") as File | null;

    if (!bannerKey) {
      return NextResponse.json(
        { success: false, error: "Banner key is required" },
        { status: 400 }
      );
    }

    const targetFileName = BANNER_KEY_TO_FILE[bannerKey];
    if (!targetFileName) {
      return NextResponse.json(
        { success: false, error: `Invalid banner key: ${bannerKey}` },
        { status: 400 }
      );
    }

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error } = await supabaseAdmin.storage
        .from("product-images")
        .upload(targetFileName, buffer, {
          contentType: file.type || "image/png",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: pubUrlData } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(targetFileName);

      const publicUrl = `${pubUrlData.publicUrl}?t=${Date.now()}`;
      invalidateBannerCache();

      return NextResponse.json({
        success: true,
        message: `Banner ${bannerKey} updated successfully`,
        url: publicUrl,
      });
    }

    return NextResponse.json(
      { success: false, error: "No image file provided" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Banner API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update banner" },
      { status: 500 }
    );
  }
}
