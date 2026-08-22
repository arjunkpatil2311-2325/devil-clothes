import { supabaseAdmin } from "@/lib/supabase/server";

export interface SiteBanners {
  // 1. Homepage Media & Texts
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  promo_image: string;
  promo_tag: string;
  promo_title: string;
  promo_subtitle: string;
  promo_button_text: string;
  promo_button_link: string;
  story_image: string;
  story_title: string;
  story_text: string;

  // 2. Shop Page
  shop_hero_image: string;

  // 3. Collections Page
  collections_hero_image: string;

  // 4. About Us Page
  about_hero_image: string;
  about_story_1: string;
  about_story_2: string;
  about_story_3: string;

  // 5. Contact Page
  contact_hero_image: string;
}

export const defaultBanners: SiteBanners = {
  // Homepage
  hero_image:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
  hero_title: "Wear Your\nAttitude",
  hero_subtitle: "Engineered for the shadows. Designed for the streets.",
  promo_image:
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
  promo_tag: "Limited Time Offer",
  promo_title: "GET 20% OFF",
  promo_subtitle: "On selected streetwear essentials & seasonal drops. Available while stocks last.",
  promo_button_text: "Shop The Sale",
  promo_button_link: "/shop",
  story_image:
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1200&auto=format&fit=crop",
  story_title: "Built For\nYour Style",
  story_text:
    "Devil Clothes creates premium streetwear pieces designed for everyday wear. We blend luxury aesthetics with underground culture.",

  // Shop Page
  shop_hero_image:
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop",

  // Collections Page
  collections_hero_image:
    "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=2000&auto=format&fit=crop",

  // About Us Page
  about_hero_image:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
  about_story_1:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  about_story_2:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
  about_story_3:
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",

  // Contact Page
  contact_hero_image:
    "https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=2000&auto=format&fit=crop",
};

export const BANNER_KEY_TO_FILE: Record<string, string> = {
  hero_image: "site_banner_hero.png",
  promo_image: "site_banner_promo.png",
  story_image: "site_banner_story.png",
  shop_hero_image: "site_banner_shop.png",
  collections_hero_image: "site_banner_collections.png",
  about_hero_image: "site_banner_about.png",
  about_story_1: "site_banner_about_story_1.png",
  about_story_2: "site_banner_about_story_2.png",
  about_story_3: "site_banner_about_story_3.png",
  contact_hero_image: "site_banner_contact.png",
};

export const SITE_TEXTS_FILE = "site_texts_config.json";

let cachedBanners: SiteBanners | null = null;

export async function getSiteBanners(): Promise<SiteBanners> {
  if (cachedBanners) return cachedBanners;

  try {
    const banners: SiteBanners = { ...defaultBanners };

    const { data: fileList } = await supabaseAdmin.storage
      .from("product-images")
      .list();

    if (fileList && fileList.length > 0) {
      const existingNames = new Set(fileList.map((f) => f.name));

      // 1. Check for custom images
      for (const [key, fileName] of Object.entries(BANNER_KEY_TO_FILE)) {
        if (existingNames.has(fileName)) {
          const { data } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(fileName);
          if (data?.publicUrl) {
            (banners as any)[key] = `${data.publicUrl}?t=${Date.now()}`;
          }
        }
      }

      // 2. Check for customized text configs (promo discount, tags, descriptions)
      if (existingNames.has(SITE_TEXTS_FILE)) {
        try {
          const { data: textData, error: textErr } = await supabaseAdmin.storage
            .from("product-images")
            .download(SITE_TEXTS_FILE);

          if (textData && !textErr) {
            const jsonText = await textData.text();
            const parsed = JSON.parse(jsonText);
            Object.assign(banners, parsed);
          }
        } catch (e) {
          console.warn("Could not parse site_texts_config.json:", e);
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
