const fs = require('fs');
let file = fs.readFileSync('src/app/page.tsx', 'utf8');

file = file.replace(/text-\[\#2D3142\]\/70 uppercase block mb-1/g, 'text-[#2D3142]/85 uppercase block mb-1');
file = file.replace('text-[#ADACB5]">\\n                  New Season Drop 2026', 'text-white drop-shadow-sm">\\n                  New Season Drop 2026');
file = file.replace('text-[#D8D5DB]">\\n              Wear Your<br />Attitude', 'text-white drop-shadow-sm">\\n              Wear Your<br />Attitude');
file = file.replace('text-[#ADACB5] max-w-md font-medium mb-8 md:mb-10', 'text-white/95 drop-shadow-sm max-w-md font-medium mb-8 md:mb-10');
file = file.replace('bg-[#2D3142]/80 backdrop-blur-md', 'bg-[#2D3142]/95 backdrop-blur-md');

file = file.replace('text-[#ADACB5] uppercase mb-2', 'text-[#D8D5DB] uppercase mb-2 drop-shadow-sm');
file = file.replace('text-[#ADACB5] max-w-[50ch] mb-6', 'text-white/90 drop-shadow-sm max-w-[50ch] mb-6');
file = file.replace('text-[#D8D5DB] mb-3 leading-none', 'text-white drop-shadow-sm mb-3 leading-none');
file = file.replace('bg-[#D8D5DB] text-[#2D3142] px-8 min-h-[48px]', 'bg-white text-[#2D3142] px-8 min-h-[48px] shadow-md');

fs.writeFileSync('src/app/page.tsx', file);

let productFile = fs.readFileSync('src/components/product/ProductCard.tsx', 'utf8');
productFile = productFile.replace(/text-\[\#2D3142\]\/50 line-through/g, 'text-[#2D3142]/75 line-through');
fs.writeFileSync('src/components/product/ProductCard.tsx', productFile);
