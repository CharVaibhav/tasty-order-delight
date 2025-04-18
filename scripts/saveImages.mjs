import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to save image from URL
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    writeFileSync(filename, buffer);
    console.log(`Saved ${filename}`);
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
  }
}

// Create directory if it doesn't exist
const imagesDir = join(__dirname, '../src/assets/images/dishes');
mkdirSync(imagesDir, { recursive: true });

// Image URLs from your provided images
const images = {
  'dal-makhani.jpg': 'https://example.com/dal-makhani.jpg', // Replace with actual URL
  'rasmalai.jpg': 'https://example.com/rasmalai.jpg',
  'gulab-jamun.jpg': 'https://example.com/gulab-jamun.jpg',
  'mango-lassi.jpg': 'https://example.com/mango-lassi.jpg',
  'samosa.jpg': 'https://example.com/samosa.jpg',
  'masala-dosa.jpg': 'https://example.com/masala-dosa.jpg'
};

// Save each image
for (const [filename, url] of Object.entries(images)) {
  const filepath = join(imagesDir, filename);
  await downloadImage(url, filepath);
} 