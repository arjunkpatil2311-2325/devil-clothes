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
  created_at: string;
  // Fallbacks for mock data compatibility
  image?: string;
  salePrice?: number;
  isNew?: boolean;
}
