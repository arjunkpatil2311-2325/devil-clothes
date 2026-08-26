const sharp = require('sharp');

async function processImage() {
  const inputPath = 'C:/Users/KD/.gemini/antigravity/brain/2cc85b60-5228-4f9b-b187-34a295ac9e37/.user_uploaded/media_1787474488778.jpg';
  const outputPath = 'C:/Users/KD/Desktop/devil/public/devil-logo.png';
  
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  const radius = Math.min(width, height) / 2;

  // Create an SVG with a circle to use as a mask
  const circleSvg = Buffer.from(
    `<svg width="${width}" height="${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${radius}" fill="white"/>
    </svg>`
  );

  await sharp(inputPath)
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toFile(outputPath);
  
  console.log(`Circular cropped image saved to ${outputPath}`);
}

processImage().catch(console.error);
