/* ==========================================================================
   TECHNOVA - PRODUCT DATABASE & DATA HELPERS
   Diploma Student Project JavaScript Data Layer
   ========================================================================== */

// Helper to generate clean SVG placeholder Data URIs for product visuals
function createProductSVG(title, category, color1 = '#3b82f6', color2 = '#1e40af') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="${color2}" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad)" rx="24"/>
      <circle cx="200" cy="170" r="80" fill="white" fill-opacity="0.15"/>
      <path d="M160 170 Q200 130 240 170 T320 170" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>
      <text x="50%" y="270" font-family="'Outfit', sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      <text x="50%" y="300" font-family="'Inter', sans-serif" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle">${category}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Global Products Array
const products = [
  {
    id: 1,
    name: "NovaBuds Pro Wireless Earbuds",
    category: "audio",
    categoryName: "Audio & Headphones",
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.8,
    reviewsCount: 142,
    image: "images/earbuds.png",
    badge: "Sale",
    isFeatured: true,
    isOffer: true,
    stock: 25,
    description: "Premium active noise cancelling wireless earbuds with 32-hour total battery life, spatial audio, and IPX7 water resistance."
  },
  {
    id: 2,
    name: "UltraWatch Series 8 Smartwatch",
    category: "wearables",
    categoryName: "Wearable Tech",
    price: 199.99,
    oldPrice: 249.99,
    rating: 4.9,
    reviewsCount: 98,
    image: "images/smartwatch.png",
    badge: "Hot",
    isFeatured: true,
    isOffer: false,
    stock: 18,
    description: "Advanced health monitoring smartwatch featuring Retina display, ECG monitor, sleep tracking, and cellular connectivity."
  },
  {
    id: 3,
    name: "AeroLap Pro 15 Ultra-Slim Laptop",
    category: "laptops",
    categoryName: "Laptops & Computing",
    price: 1199.00,
    oldPrice: 1399.00,
    rating: 4.7,
    reviewsCount: 64,
    image: "images/laptop.png",
    badge: "New",
    isFeatured: true,
    isOffer: false,
    stock: 10,
    description: "Ultra-slim aluminium laptop powered by 12th Gen processor, 16GB RAM, 512GB NVMe SSD, and 4K OLED display."
  },
  {
    id: 4,
    name: "SoundPulse Portable Bluetooth Speaker",
    category: "audio",
    categoryName: "Audio & Headphones",
    price: 49.99,
    oldPrice: 69.99,
    rating: 4.6,
    reviewsCount: 210,
    image: "images/speaker.png",
    badge: "Sale",
    isFeatured: true,
    isOffer: true,
    stock: 40,
    description: "360-degree deep bass waterproof speaker with 24 hours playtime and built-in party LED lighting."
  },
  {
    id: 5,
    name: "VisionPro 4K HDR Smart TV 55\"",
    category: "electronics",
    categoryName: "Consumer Electronics",
    price: 549.99,
    oldPrice: 699.99,
    rating: 4.8,
    reviewsCount: 85,
    image: createProductSVG("VisionPro 55\" TV", "Consumer Electronics", "#ef4444", "#b91c1c"),
    badge: "Sale",
    isFeatured: false,
    isOffer: true,
    stock: 8,
    description: "Stunning 4K Ultra HD resolution Smart TV with Dolby Vision, voice remote, and built-in streaming apps."
  },
  {
    id: 6,
    name: "ErgoComfort Mechanical Gaming Keyboard",
    category: "accessories",
    categoryName: "Gaming & Accessories",
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.7,
    reviewsCount: 175,
    image: createProductSVG("ErgoComfort RGB", "Gaming & Accessories", "#8b5cf6", "#6d28d9"),
    badge: "Popular",
    isFeatured: true,
    isOffer: false,
    stock: 30,
    description: "Custom RGB backlit mechanical keyboard with hot-swappable switches, tactile feel, and detachable USB-C cable."
  },
  {
    id: 7,
    name: "SwiftCam 4K Vlogging Drone",
    category: "electronics",
    categoryName: "Consumer Electronics",
    price: 349.99,
    oldPrice: 429.99,
    rating: 4.5,
    reviewsCount: 44,
    image: createProductSVG("SwiftCam 4K", "Consumer Electronics", "#06b6d4", "#0e7490"),
    badge: "New",
    isFeatured: true,
    isOffer: false,
    stock: 12,
    description: "Foldable compact drone with 3-axis gimbal 4K video, obstacle avoidance sensors, and 30-min flight time."
  },
  {
    id: 8,
    name: "ChargeMaster 20,000mAh Power Bank",
    category: "accessories",
    categoryName: "Gaming & Accessories",
    price: 34.99,
    oldPrice: 45.00,
    rating: 4.9,
    reviewsCount: 320,
    image: createProductSVG("ChargeMaster 20K", "Gaming & Accessories", "#64748b", "#334155"),
    badge: "Best Seller",
    isFeatured: false,
    isOffer: true,
    stock: 50,
    description: "Fast charging PD 65W power bank capable of charging laptops, phones, and tablets simultaneously."
  }
];

// Product Data Helper Functions
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

function getOfferProducts() {
  return products.filter(p => p.isOffer);
}

function getProductsByCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}
