import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSiteBanners, invalidateBannerCache, BANNER_KEY_TO_FILE } from "@/lib/banners";

export async function GET() {
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
  try {
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
    console.error("Banner upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update banner" },
      { status: 500 }
    );
  }
}
