const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const inputPath = 'C:/Users/KD/.gemini/antigravity/brain/2cc85b60-5228-4f9b-b187-34a295ac9e37/.user_uploaded/media_1787474042077.jpg';
  const outputPath = 'C:/Users/KD/Desktop/devil/public/devil-logo.jpg';
  
  const metadata = await sharp(inputPath).metadata();
  console.log('Image dimensions:', metadata.width, metadata.height);

  // The circular logo is centered horizontally, and slightly above the vertical center.
  // We can calculate approximate bounds.
  // Assuming the logo is roughly 60% of the screen width.
  const size = Math.floor(metadata.width * 0.7);
  const left = Math.floor((metadata.width - size) / 2);
  const top = Math.floor(metadata.height * 0.32); // approximate offset based on Instagram profile UI

  // Attempt 1: Manual crop
  await sharp(inputPath)
    .extract({ left: left, top: top, width: size, height: size })
    .toFile(outputPath);
  
  console.log(`Cropped image saved to ${outputPath}`);
}

processImage().catch(console.error);
