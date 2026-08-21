import { supabaseAdmin } from "@/lib/supabase/server";

export interface SiteBanners {
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  promo_image: string;
  promo_tag: string;
  promo_title: string;
  promo_subtitle: string;
  story_image: string;
  story_title: string;
  story_text: string;
  shop_hero_image: string;
  collections_hero_image: string;
  about_hero_image: string;
}

export const defaultBanners: SiteBanners = {
  hero_image:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
  hero_title: "WEAR YOUR\nATTITUDE",
  hero_subtitle: "Engineered for the shadows. Designed for the streets.",
  promo_image:
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop",
  promo_tag: "Limited Time Only",
  promo_title: "GET 50% OFF",
  promo_subtitle: "On selected streetwear essentials & seasonal drops",
  story_image:
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1200&auto=format&fit=crop",
  story_title: "BUILT FOR\nYOUR STYLE",
  story_text:
    "Devil Clothes creates premium streetwear pieces designed for everyday wear. We blend luxury aesthetics with underground culture.",
  shop_hero_image:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
  collections_hero_image:
    "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=2000&auto=format&fit=crop",
  about_hero_image:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
};

// In-memory / cache variable for fast server responses
let cachedBanners: SiteBanners | null = null;

export async function getSiteBanners(): Promise<SiteBanners> {
  if (cachedBanners) return cachedBanners;

  try {
    // Check if customized banner images exist in Supabase storage
    const banners: SiteBanners = { ...defaultBanners };

    const keys = [
      { key: "hero_image", fileName: "site_banner_hero.png" },
      { key: "promo_image", fileName: "site_banner_promo.png" },
      { key: "story_image", fileName: "site_banner_story.png" },
      { key: "shop_hero_image", fileName: "site_banner_shop.png" },
      { key: "collections_hero_image", fileName: "site_banner_collections.png" },
      { key: "about_hero_image", fileName: "site_banner_about.png" },
    ];

    const { data: fileList } = await supabaseAdmin.storage.from("product-images").list();

    if (fileList && fileList.length > 0) {
      const existingNames = new Set(fileList.map((f) => f.name));

      for (const item of keys) {
        if (existingNames.has(item.fileName)) {
          const { data } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(item.fileName);
          if (data?.publicUrl) {
            // Append cache buster timestamp query
            (banners as any)[item.key] = `${data.publicUrl}?t=${Date.now()}`;
          }
        }
      }
    }

    cachedBanners = banners;
    return banners;
  } catch (error) {
    console.error("Error loading site banners:", error);
    return defaultBanners;
  }
}

export function invalidateBannerCache() {
  cachedBanners = null;
}
