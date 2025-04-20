// This script dynamically generates an Open Graph image
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions for OG image (1200x630)
  canvas.width = 1200;
  canvas.height = 630;
  
  // Background
  ctx.fillStyle = '#FF7E33';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Inner card
  ctx.fillStyle = '#FFFFFF';
  ctx.roundRect(50, 50, canvas.width - 100, canvas.height - 100, 20);
  ctx.fill();
  
  // Title
  ctx.font = 'bold 72px Arial, sans-serif';
  ctx.fillStyle = '#FF7E33';
  ctx.textAlign = 'center';
  ctx.fillText('The Digital Diner', canvas.width / 2, 250);
  
  // Subtitle
  ctx.font = '36px Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.fillText('Delicious food, delivered to your door', canvas.width / 2, 350);
  
  // Logo
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 450, 80, 0, Math.PI * 2);
  ctx.fillStyle = '#FF7E33';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 450, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillStyle = '#FF7E33';
  ctx.fillText('DD', canvas.width / 2, 465);
  
  // Convert to image
  const dataUrl = canvas.toDataURL('image/png');
  
  // Create image element
  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = 'The Digital Diner';
  img.style.display = 'block';
  img.style.margin = '0 auto';
  
  // Add to document
  document.body.appendChild(img);
  
  // Also create a download link
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'og-image.png';
  link.textContent = 'Download OG Image';
  link.style.display = 'block';
  link.style.margin = '20px auto';
  link.style.textAlign = 'center';
  
  document.body.appendChild(link);
});

// Polyfill for roundRect if not supported
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  };
}