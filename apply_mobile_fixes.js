const fs = require('fs');

// 1. TRUST / BENEFIT CARDS
let file = fs.readFileSync('src/app/page.tsx', 'utf8');
file = file.replace('flex animate-marquee-slow gap-3 md:gap-4 pr-3 md:w-max', 'flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 md:gap-4 pr-3 px-3 md:px-0 md:w-max');
// Also need to make sure the inner cards snap.
file = file.replace('className="flex-none w-[180px]', 'className="flex-none w-[180px] snap-start');

// 2. HERO
file = file.replace('h-[90vh] md:h-[95vh]', 'h-[75vh] md:h-[95vh]');
// Change font size on mobile to prevent clipping
file = file.replace('text-[clamp(40px,8vw,76px)]', 'text-[clamp(32px,10vw,76px)]');

// 3. PRODUCT GRID
// Product Grid itself has gap-3 on mobile. That's fine.
let pcFile = fs.readFileSync('src/components/product/ProductCard.tsx', 'utf8');
// Fix spacing/gap consistency, image proportions
pcFile = pcFile.replace('aspect-[3/4]', 'aspect-[4/5]');
// Product title readability
pcFile = pcFile.replace('text-xs md:text-sm font-black', 'text-[11px] md:text-sm font-black leading-tight');
// Price readability
pcFile = pcFile.replace('text-sm md:text-base font-black', 'text-xs md:text-base font-black');
fs.writeFileSync('src/components/product/ProductCard.tsx', pcFile);

// 4. SHOP BY CATEGORY
// Category pills align cleanly, no empty vertical space.
// Remove pb-12 on mobile
file = file.replace('pb-12 md:pb-18', 'pb-8 md:pb-18');
file = file.replace('className="px-4 md:px-8 flex items-center justify-between mb-6"', 'className="px-4 md:px-8 flex items-end justify-between mb-4 md:mb-6"');

// 5. SALE / PROMOTIONAL BANNER
file = file.replace('h-[200px] md:h-[420px]', 'h-[240px] md:h-[420px]'); // Give it a bit more room

// 6. FEATURED COLLECTIONS
// Reduce height of single collection on mobile
file = file.replace('h-[280px] md:h-[440px]', 'h-[320px] md:h-[440px]');
// Collection title readability
file = file.replace('text-3xl md:text-5xl font-black tracking-tight text-white', 'text-2xl md:text-5xl font-black tracking-tight text-white');

// 7. BUILT FOR YOUR STYLE
// Two part editorial card.
file = file.replace('aspect-[3/2]', 'aspect-[4/3]'); // better image impact
file = file.replace('p-6 md:p-12', 'p-5 md:p-12'); // keep text readable

// 8. INSTAGRAM CTA
// Fix padding
file = file.replace('p-6 md:p-12 border', 'p-5 md:p-12 border');
file = file.replace('text-2xl md:text-4xl', 'text-xl md:text-4xl');

// 9. FOOTER
// Tighten vertical spacing.
let footerFile = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
footerFile = footerFile.replace('py-12 md:py-16', 'py-8 md:py-16');
footerFile = footerFile.replace('space-y-12 md:space-y-0', 'space-y-8 md:space-y-0');

// 10. MOBILE BOTTOM NAVIGATION
// Add pb-[80px] to main to prevent overlap.
// Is there a main wrapper in page.tsx? Yes, <main>.
// Actually, it's easier to add pb-24 to Footer.tsx padding so we don't mess up page.tsx wrapper.
footerFile = footerFile.replace('pb-12 md:pb-16', 'pb-24 md:pb-16');

fs.writeFileSync('src/components/layout/Footer.tsx', footerFile);
fs.writeFileSync('src/app/page.tsx', file);
