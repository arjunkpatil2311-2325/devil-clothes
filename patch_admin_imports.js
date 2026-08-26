const fs = require('fs');
let admin = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
admin = admin.replace(
  /} from "lucide-react";/,
  '  Star,\n  Eye,\n} from "lucide-react";'
);
fs.writeFileSync('src/app/admin/page.tsx', admin);
