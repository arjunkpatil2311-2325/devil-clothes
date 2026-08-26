const fs = require('fs');
let content = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

// Inside handlePlaceOrder, we currently have:
// const data = await res.json();
// if (!res.ok) { throw new Error(...) }
// setIsSuccess(true);
// ... sound ...
// setTimeout(() => { clearCart(); router.push(...) }, 1200);

// We need to wait for the animation (which takes 2.5s) before setting isSuccess and playing sound.
content = content.replace(
  /setIsSuccess\(true\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?clearCart\(\);[\s\S]*?router\.push\(\`\/order\/\$\{data\.orderNumber\}\`\);[\s\S]*?\}, 1200\);/,
  `// Wait for the truck animation to finish (2.5s) before showing success state
      setTimeout(() => {
        setIsSuccess(true);
        
        // Play sound
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContext();
          const playTone = (freq: number, startTime: number, duration: number) => {
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

        // Navigate after showing success state for a bit
        setTimeout(() => {
          clearCart();
          router.push(\`/order/\${data.orderNumber}\`);
        }, 1500);
      }, 2500);`
);

fs.writeFileSync('src/app/checkout/page.tsx', content);
