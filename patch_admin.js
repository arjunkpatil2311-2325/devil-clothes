const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Update TabType
content = content.replace(
  /type TabType = "dashboard" \| "products" \| "orders" \| "categories" \| "collections" \| "banners";/,
  'type TabType = "dashboard" | "products" | "orders" | "categories" | "collections" | "banners" | "reviews";'
);

// Add reviews state
content = content.replace(
  /const \[collections, setCollections\] = useState<Collection\[\]>\(\[\]\);/,
  'const [collections, setCollections] = useState<Collection[]>([]);\n  const [reviews, setReviews] = useState<any[]>([]);'
);

// Add Reviews to nav items
content = content.replace(
  /{ label: "Collections", shortLabel: "Drops", id: "collections" as TabType, icon: Layers, count: collections\.length },/,
  '{ label: "Collections", shortLabel: "Drops", id: "collections" as TabType, icon: Layers, count: collections.length },\n    { label: "Reviews", shortLabel: "Rev", id: "reviews" as TabType, icon: Star, count: reviews.length },'
);

// Ensure Star is imported
if (!content.includes('Star,')) {
    content = content.replace(
      /import {/, 
      'import { Star,'
    );
}

fs.writeFileSync('src/app/admin/page.tsx', content);
