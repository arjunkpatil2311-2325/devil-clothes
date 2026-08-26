const fs = require('fs');
let content = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

content = content.replace(
  /setIsSubmitting\(true\);/,
  `setIsSubmitting(true);\n    const startTimeMs = Date.now();`
);

content = content.replace(
  /\/\/ Wait for the truck animation to finish \(2\.5s\) before showing success state\s*setTimeout\(\(\) => \{/,
  `// Wait for the truck animation to finish (2.5s) before showing success state
      const elapsed = Date.now() - startTimeMs;
      const delayRemaining = Math.max(0, 2500 - elapsed);
      setTimeout(() => {`
);

content = content.replace(
  /\}, 2500\);/g,
  `}, delayRemaining);`
);

fs.writeFileSync('src/app/checkout/page.tsx', content);
