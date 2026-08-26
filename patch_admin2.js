const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Update fetchData
content = content.replace(
  /const \[productsRes, categoriesRes, collectionsRes, ordersRes, bannersRes\] =[\s\S]*?await Promise\.all\(\[[\s\S]*?fetch\("\/api\/admin\/products"\),[\s\S]*?fetch\("\/api\/admin\/categories"\),[\s\S]*?fetch\("\/api\/admin\/collections"\),[\s\S]*?fetch\("\/api\/admin\/orders"\),[\s\S]*?fetch\("\/api\/admin\/banners"\),[\s\S]*?\]\);/,
  `const [productsRes, categoriesRes, collectionsRes, ordersRes, bannersRes, reviewsRes] =
        await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/collections"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/banners"),
          fetch("/api/admin/reviews"),
        ]);`
);

content = content.replace(
  /const \[prodsData, catsData, colsData, ordersData, bannersData\] = await Promise\.all\(\[[\s\S]*?productsRes\.json\(\),[\s\S]*?categoriesRes\.json\(\),[\s\S]*?collectionsRes\.json\(\),[\s\S]*?ordersRes\.json\(\),[\s\S]*?bannersRes\.json\(\),[\s\S]*?\]\);/,
  `const [prodsData, catsData, colsData, ordersData, bannersData, revsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        collectionsRes.json(),
        ordersRes.json(),
        bannersRes.json(),
        reviewsRes.json(),
      ]);`
);

content = content.replace(
  /if \(prodsData\.success\) setProducts\(prodsData\.data \|\| \[\]\);/,
  `if (prodsData.success) setProducts(prodsData.data || []);\n      if (revsData.success) setReviews(revsData.data || []);`
);

fs.writeFileSync('src/app/admin/page.tsx', content);
