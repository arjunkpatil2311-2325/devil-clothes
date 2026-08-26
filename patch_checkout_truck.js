const fs = require('fs');
let content = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

// Remove the full screen success overlay
content = content.replace(
  /\{\s*isSuccess && \(\s*<div className="fixed inset-0 z-\[100\] bg-\[#1E9540\][\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Import TruckButton
if (!content.includes('TruckButton')) {
  content = content.replace(
    /import \{ LoginGate \} from "@\/components\/ui\/LoginGate";/,
    'import { LoginGate } from "@/components/ui/LoginGate";\nimport TruckButton from "@/components/ui/TruckButton";'
  );
}

// Remove the old button and style block
content = content.replace(
  /<style dangerouslySetInnerHTML=\{\{__html: `[\s\S]*?<\/form>/,
  `<TruckButton isSubmitting={isSubmitting} isSuccess={isSuccess} />\n              </form>`
);

fs.writeFileSync('src/app/checkout/page.tsx', content);
