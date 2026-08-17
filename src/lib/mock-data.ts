export interface Product {
  id: string; // Acts as slug
  name: string;
  category: "T-SHIRTS" | "HOODIES" | "PANTS" | "ACCESSORIES";
  price: number;
  salePrice?: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
  sizes: string[];
  stock: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const mockCollections: Collection[] = [
  {
    id: "t-shirts",
    name: "T-SHIRTS",
    description: "Premium heavyweight cotton essentials.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "hoodies",
    name: "HOODIES",
    description: "Engineered for the shadows.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "pants",
    name: "PANTS",
    description: "Utility meets luxury silhouettes.",
    image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "accessories",
    name: "ACCESSORIES",
    description: "The ultimate streetwear staples.",
    image: "https://images.unsplash.com/photo-1599643478514-4a11b816a7f5?q=80&w=800&auto=format&fit=crop"
  }
];

export const mockProducts: Product[] = [
  // --- T-SHIRTS ---
  {
    id: "nocturnal-oversized-tee",
    name: "NOCTURNAL OVERSIZED TEE",
    category: "T-SHIRTS",
    price: 1499,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    isFeatured: true,
    description: "Our signature heavyweight oversized tee. Drop shoulders, tight collar, and a boxy fit. Made from 240 GSM premium cotton.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 50
  },
  {
    id: "heavyweight-acid-wash-tee",
    name: "HEAVYWEIGHT ACID WASH TEE",
    category: "T-SHIRTS",
    price: 1799,
    salePrice: 1499,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
    description: "Vintage treated acid wash t-shirt. Each piece has a unique fade. Extremely soft hand-feel with an oversized drape.",
    sizes: ["M", "L", "XL"],
    stock: 12
  },
  {
    id: "fallen-angel-graphic-tee",
    name: "THE FALLEN ANGEL TEE",
    category: "T-SHIRTS",
    price: 1999,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    isFeatured: true,
    description: "High-density screen print on the back featuring the Fallen Angel motif. Subtle branding on the chest. 100% Cotton.",
    sizes: ["S", "M", "L", "XL"],
    stock: 25
  },
  {
    id: "essential-drop-shoulder-tee",
    name: "ESSENTIAL DROP TEE",
    category: "T-SHIRTS",
    price: 1299,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
    description: "The perfect everyday blank. Slightly cropped body with elongated sleeves. Your new daily uniform.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 100
  },
  {
    id: "chaos-syndicate-tee",
    name: "CHAOS SYNDICATE TEE",
    category: "T-SHIRTS",
    price: 1599,
    image: "https://images.unsplash.com/photo-1573331519317-30b24326bb9a?q=80&w=800&auto=format&fit=crop",
    description: "Distressed hems and aggressive typography. Designed for the underground.",
    sizes: ["M", "L", "XL"],
    stock: 8
  },
  {
    id: "minimalist-logo-tee",
    name: "MINIMALIST LOGO TEE",
    category: "T-SHIRTS",
    price: 1199,
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop",
    description: "Clean, sharp, and minimal. Micro-logo embroidered on the center chest.",
    sizes: ["S", "M", "L"],
    stock: 40
  },

  // --- HOODIES ---
  {
    id: "hellfire-heavy-hoodie",
    name: "HELLFIRE HEAVY HOODIE",
    category: "HOODIES",
    price: 3499,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    isFeatured: true,
    description: "450 GSM French Terry Cotton. Double-lined hood. This hoodie stands perfectly on its own without drawstrings.",
    sizes: ["S", "M", "L", "XL"],
    stock: 15
  },
  {
    id: "nocturnal-zip-up",
    name: "NOCTURNAL ZIP-UP",
    category: "HOODIES",
    price: 3299,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=800&auto=format&fit=crop",
    description: "Heavyweight zip-up hoodie featuring a custom two-way metal zipper. Boxy fit with distressed ribbing.",
    sizes: ["M", "L", "XL"],
    stock: 20
  },
  {
    id: "washed-vintage-hoodie",
    name: "WASHED VINTAGE HOODIE",
    category: "HOODIES",
    price: 3999,
    salePrice: 3499,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    description: "Garment dyed and sun-faded for an authentic vintage look. Features subtle distressing on the cuffs and hem.",
    sizes: ["L", "XL", "XXL"],
    stock: 5
  },
  {
    id: "oversized-cropped-hoodie",
    name: "CROPPED RAW-HEM HOODIE",
    category: "HOODIES",
    price: 2999,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    description: "Aggressively cropped body with a raw hem edge and dramatically oversized sleeves.",
    sizes: ["S", "M", "L"],
    stock: 30
  },

  // --- PANTS ---
  {
    id: "void-tactical-cargo",
    name: "VOID TACTICAL CARGO",
    category: "PANTS",
    price: 4299,
    image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    description: "Utility meets luxury. 8 pockets, adjustable ankle toggles, and articulated knees. Made from durable ripstop fabric.",
    sizes: ["28", "30", "32", "34", "36"],
    stock: 45
  },
  {
    id: "wide-leg-parachute",
    name: "WIDE LEG PARACHUTE PANTS",
    category: "PANTS",
    price: 3499,
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    description: "Ultra-wide nylon parachute pants. Elastic waist and adjustable hems allow you to style them your way.",
    sizes: ["S", "M", "L", "XL"],
    stock: 18
  },
  {
    id: "distressed-baggy-denim",
    name: "DISTRESSED BAGGY DENIM",
    category: "PANTS",
    price: 4599,
    salePrice: 3999,
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop",
    description: "Heavy 14oz denim, washed down for a perfect fade. Hand-distressed details and a sweeping baggy silhouette.",
    sizes: ["30", "32", "34"],
    stock: 10
  },

  // --- ACCESSORIES ---
  {
    id: "heavy-chain-necklace",
    name: "HEAVY CUBAN CHAIN",
    category: "ACCESSORIES",
    price: 1499,
    image: "https://images.unsplash.com/photo-1599643478514-4a11b816a7f5?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    description: "12mm Stainless Steel Cuban Link Chain. Will not tarnish or fade. The ultimate streetwear staple.",
    sizes: ["18 inch", "20 inch", "22 inch"],
    stock: 150
  },
  {
    id: "nocturnal-beanie",
    name: "NOCTURNAL BEANIE",
    category: "ACCESSORIES",
    price: 999,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop",
    description: "Chunky knit beanie with folded cuff. Devil Clothes rubber patch logo on the front.",
    sizes: ["One Size"],
    stock: 80
  },
  {
    id: "signature-trucker-hat",
    name: "SIGNATURE TRUCKER",
    category: "ACCESSORIES",
    price: 1299,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    isNew: true,
    description: "Foam front trucker hat with raised puff embroidery. Breathable mesh back with adjustable snap closure.",
    sizes: ["One Size"],
    stock: 60
  }
];

export const mockGallery = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512353087810-2581f4d761c4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop"
];
