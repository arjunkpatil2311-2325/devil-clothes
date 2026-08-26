const fs = require('fs');
let content = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

// Add the success sound logic inside handlePlaceOrder
content = content.replace(
  /setIsSuccess\(true\);\s*clearCart\(\);\s*router\.push\(\`\/order\/\$\{data\.orderNumber\}\`\);/,
  `setIsSuccess(true);
      
      // Play sound
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const playTone = (freq, startTime, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
          gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + startTime);
          osc.stop(ctx.currentTime + startTime + duration);
        };
        playTone(523.25, 0, 0.15); // C5
        playTone(659.25, 0.1, 0.15); // E5
        playTone(783.99, 0.2, 0.4); // G5
      } catch (e) {}

      setTimeout(() => {
        clearCart();
        router.push(\`/order/\${data.orderNumber}\`);
      }, 2500);`
);

// Check if Check import exists, if not add it.
if (!content.includes('Check,')) {
    content = content.replace(
      /import { ArrowLeft, AlertCircle, ShoppingBag, UserX } from "lucide-react";/,
      'import { ArrowLeft, AlertCircle, ShoppingBag, UserX, Check } from "lucide-react";'
    );
}

// Inject the success animation right after `return (`
const successBlock = `
    {isSuccess && (
      <div className="fixed inset-0 z-[100] bg-[#1E9540] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform animate-bounce">
            <Check className="w-12 h-12 text-[#1E9540] stroke-[3]" />
          </div>
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight uppercase animate-in slide-in-from-bottom-4 duration-500">
          Order Confirmed
        </h2>
        <p className="text-white/80 font-semibold tracking-widest text-xs uppercase mt-2 animate-in slide-in-from-bottom-8 duration-700">
          Preparing your receipt...
        </p>
      </div>
    )}
`;

content = content.replace(
  /return \(\s*<div className="flex flex-col w-full min-h-screen bg-\[#D8D5DB\]">/,
  `return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB]">
${successBlock}`
);

fs.writeFileSync('src/app/checkout/page.tsx', content);
