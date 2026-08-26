const fs = require('fs');
let content = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

// Replace the entire handlePlaceOrder try block to clean it up.
const tryBlockPattern = /try \{\s*const \[res\] = await Promise\.all\([\s\S]*?catch \(err: any\) \{/m;

const newTryBlock = `try {
      const [res] = await Promise.all([
        fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: payloadItems,
            contact,
            shipping: addressDetails,
          }),
        }),
        new Promise(resolve => setTimeout(resolve, 2500)) // Wait for truck animation
      ]);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setIsSuccess(true);
      
      // Play sound immediately when success state hits
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

      // Slight delay before redirecting
      setTimeout(() => {
        clearCart();
        router.push(\`/order/\${data.orderNumber}\`);
      }, 1200);

    } catch (err: any) {`;

content = content.replace(tryBlockPattern, newTryBlock);

fs.writeFileSync('src/app/checkout/page.tsx', content);
