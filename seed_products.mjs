import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { resolve } from 'path';

// Parse .env.local manually
const envPath = resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleProducts = [
  {
    name: 'Oversized Graphic Tee - "Urban Decay"',
    slug: 'oversized-graphic-tee-urban-decay',
    description: 'A premium heavyweight cotton oversized tee featuring our signature "Urban Decay" backprint. Perfect for everyday streetwear styling.',
    price: 1299,
    compare_at_price: 1999,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: true,
    is_new: true,
  },
  {
    name: 'Essential Cargo Pants - Olive',
    slug: 'essential-cargo-pants-olive',
    description: 'Relaxed fit cargo pants constructed from durable ripstop fabric. Features adjustable cuffs and multiple utility pockets.',
    price: 2499,
    compare_at_price: 3499,
    images: ['https://images.unsplash.com/photo-1624378439575-d1ead6bb2455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: true,
    is_new: false,
  },
  {
    name: 'Vintage Wash Hoodie - Washed Black',
    slug: 'vintage-wash-hoodie-washed-black',
    description: 'Heavyweight french terry hoodie with a unique vintage wash treatment. Dropped shoulders and a relaxed, boxy fit.',
    price: 2999,
    compare_at_price: 3999,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: false,
    is_new: true,
  },
  {
    name: 'Devil Logo Cap - Black/Red',
    slug: 'devil-logo-cap-black-red',
    description: 'Classic 6-panel structured cap featuring the signature Devil embroidered logo on the front.',
    price: 899,
    compare_at_price: null,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: false,
    is_new: false,
  },
  {
    name: 'Distressed Denim Jacket',
    slug: 'distressed-denim-jacket',
    description: 'Vintage-inspired denim jacket with hand-distressed detailing and custom hardware. A staple layering piece.',
    price: 4999,
    compare_at_price: 5999,
    images: ['https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: true,
    is_new: false,
  },
  {
    name: 'Boxy Fit Knit Sweater - Cream',
    slug: 'boxy-fit-knit-sweater-cream',
    description: 'Ultra-soft chunky knit sweater with a loose, boxy fit. Perfect for layering during colder months.',
    price: 3499,
    compare_at_price: 4499,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: false,
    is_new: true,
  },
  {
    name: 'Tech-Wear Utility Vest',
    slug: 'tech-wear-utility-vest',
    description: 'Tactical utility vest featuring multiple waterproof zip pockets, adjustable straps, and breathable mesh lining.',
    price: 2199,
    compare_at_price: 2799,
    images: ['https://images.unsplash.com/photo-1549439602-43ebca2327af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: false,
    is_new: false,
  },
  {
    name: 'Relaxed Tailored Trousers - Charcoal',
    slug: 'relaxed-tailored-trousers-charcoal',
    description: 'Wide-leg tailored trousers that bridge the gap between formal and streetwear. Features front pleats and a slight crop.',
    price: 2799,
    compare_at_price: 3599,
    images: ['https://images.unsplash.com/photo-1594938298596-eb5fd5f5b50f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: true,
    is_new: true,
  },
  {
    name: 'Signature Tote Bag - Heavy Canvas',
    slug: 'signature-tote-bag-heavy-canvas',
    description: 'Durable 14oz cotton canvas tote bag with reinforced handles and interior zip pocket. Screen printed logo.',
    price: 799,
    compare_at_price: 1199,
    images: ['https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: false,
    is_new: false,
  },
  {
    name: 'Mesh Basketball Shorts - Black',
    slug: 'mesh-basketball-shorts-black',
    description: 'Heavyweight double-layer mesh shorts with contrast piping and an elongated drawstring. Relaxed fit.',
    price: 1499,
    compare_at_price: 1999,
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    is_featured: true,
    is_new: false,
  }
];

async function seed() {
  console.log('Starting DB seeding...');

  // 1. Create a Category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .insert({
      name: 'Showcase Category',
      slug: 'showcase',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    })
    .select()
    .single();

  if (categoryError) {
    console.error('Error creating category:', categoryError);
    return;
  }
  console.log('Created Category:', category.name);

  // 2. Create a Collection
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .insert({
      name: 'Summer Showcase',
      slug: 'summer-showcase',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    })
    .select()
    .single();

  if (collectionError) {
    console.error('Error creating collection:', collectionError);
    return;
  }
  console.log('Created Collection:', collection.name);

  // 3. Insert Products
  const productsToInsert = sampleProducts.map(p => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    original_price: p.compare_at_price,
    images: p.images,
    category: category.name,
    collection: collection.name,
    stock: 100, // Fixed stock directly on product
    status: 'Published',
    featured: p.is_featured,
    bestseller: p.is_new
  }));

  const { data: products, error: productsError } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select();

  if (productsError) {
    console.error('Error creating products:', productsError);
    return;
  }
  console.log(`Created ${products.length} products.`);

  console.log('Seeding complete! ✨');
}

seed();
