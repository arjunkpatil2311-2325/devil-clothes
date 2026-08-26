export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  collection: string | null;
  images: string[];
  stock: number;
  status: string;
  featured: boolean;
  bestseller: boolean;
  drop_id?: string | null;
  average_rating?: number;
  review_count?: number;
  created_at: string;
  // Fallbacks for mock data compatibility
  image?: string;
  salePrice?: number;
  isNew?: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  body: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface Drop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}
